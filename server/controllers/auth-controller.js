const hashService = require("../services/hash-service.js");
const otpService = require("../services/otp-service.js");
const userService = require("../services/user-service.js");
const tokenService = require("../services/token-service.js");
const UserDto = require("../dtos/user-dto.js")

class AuthController{
    async sendOTP(req, res){
        const { phone } = req.body;
        if (!phone) {
          res.status(400).json({ message: "Phone field is required" });
        }
        const otp = await otpService.generateOtp();

        // Hash

        const ttl = 1000*60*2; // 2min valid
        const expires = Date.now() + ttl;
        const data = `${phone}.${otp}.${expires}`
        const hash = hashService.hashOtp(data);

        // send otp
        try {
          await otpService.sendBySms(phone, otp);
          res.json({
            hash: `${hash}.${expires}`,
            phone,
            otp
          })
        } catch (error) {
          console.log(error);
          res.status(500).json({message: 'message sending fail'})
        }
    }

    async verifyOtp(req, res){
      const {otp, phone, hash} = req.body;
      if(!otp || !phone || !hash){
        res.status(400).json({message: "All fields are required!"});
      }

      const [hashedOtp, expires] = hash.split('.');
      if(Date.now() > +expires){
        res.status(400).json({message: "Otp expired!"})
      }

      const data = `${phone}.${otp}.${expires}`;

      const isValid = otpService.verifyOtp(hashedOtp, data);
      if(!isValid){
        res.status(400).json({message: "Invalid OTP"});
      }

      let user;
      // let accessToken;
      // let refreshToken;

      try {
        user = await userService.findUser({phone});
        if(!user){
          user = await userService.createUser({phone});
        }
      } catch (error) {
        console.log(err);
        res.status(500).json({message: 'Db error'})
      }

      const { accessToken, refreshToken } = tokenService.generateTokens({
        _id: user._id,
        activated: false,
      });

      const userDto = new UserDto(user);

      await tokenService.storeRefreshToken(refreshToken, user._id);

      res
        .cookie("accessToken", accessToken, {
          maxAge: 1000 * 60 * 60 * 24 * 30,
          httpOnly: true,
        })
        .cookie("refreshToken", refreshToken, {
          maxAge: 1000 * 60 * 60 * 24 * 30,
          httpOnly: true,
        })
        .json({ user: userDto, auth: true });
    }

    async refresh(req, res){
      const { refreshToken: refreshTokenFromCookie } = req.cookies;

      let userData;
      try {
        userData = await tokenService.verifyRefreshToken(refreshTokenFromCookie);
      } catch (error) {
        return res.status(401).json({message: "Invalid token"})
      }

      try {
        const token = await tokenService.findRefreshToken(
          userData._id,
          refreshTokenFromCookie
        );
        if(!token){
          return res.status(401).json({ message: "Invalid token" });
        }
      } catch (error) {
        return res.status(500).json({ message: "Internal error" });
      }

      const user = await userService.findUser({_id: userData._id})
      if(!user){
        return res.status(404).json({ message: "No user" });
      }

      const { refreshToken, accessToken } = tokenService.generateTokens({
        _id: userData._id,
      });

      try {
        await tokenService.updateRefreshToken(userData._id, refreshToken);
      } catch (error) {
        return res.status(500).json({ message: "Internal error" });
      }

      const userDto = new UserDto(user);

      res
        .cookie("accessToken", accessToken, {
          maxAge: 1000 * 60 * 60 * 24 * 30,
          httpOnly: true,
        })
        .cookie("refreshToken", refreshToken, {
          maxAge: 1000 * 60 * 60 * 24 * 30,
          httpOnly: true,
        })
        .json({ user: userDto, auth: true });

    }

    async logout(req, res){
      const { refreshToken } = req.cookies;
      await tokenService.removeToken(refreshToken);
      res
        .clearCookie("refreshToken")
        .clearCookie("accessToken")
        .json({ user: null, auth: false });
    }

}

module.exports = new AuthController();
