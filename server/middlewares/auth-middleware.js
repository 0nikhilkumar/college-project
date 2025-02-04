const tokenService = require('../services/token-service');

module.exports = async function (req, res, next) {
    try {
        const { accessToken } = req.cookies;
        console.log(accessToken);
        if (!accessToken) {
            throw new Error("No access token found");
        }
        const userData = await tokenService.verifyAccessToken(accessToken);
        if (!userData) {
            throw new Error("Invalid access token");
        }
        req.user = userData;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ message: 'Invalid token' });
    }
};
