const router = require("express").Router();
const activateController = require("./controllers/activate-controller.js");
const authController = require("./controllers/auth-controller.js");
const authMiddleware = require("./middlewares/auth-middleware.js");
const roomsController = require("./controllers/rooms-controller.js");


router.route("/api/send-otp").post(authController.sendOTP);
router.route("/api/verify-otp").post(authController.verifyOtp);
router.route('/api/activate').post(authMiddleware, activateController.activate);
router.route('/api/refresh').get(authController.refresh);
router.route('/api/logout').post(authMiddleware, authController.logout);
router.route('/api/rooms').post(authMiddleware, roomsController.create);
router.route('/api/rooms').get(authMiddleware, roomsController.index);
router.route('/api/rooms/:roomId').get(authMiddleware, roomsController.show);

module.exports = router;