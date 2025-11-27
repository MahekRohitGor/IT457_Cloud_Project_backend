const { encryptedMiddleware, decryptMiddleware } = require("../../middlewares/encdecmiddleware");
const {forgotPasswordLimiter} = require("../../middlewares/rateLimiter");

const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.post(
    "/register",
    decryptMiddleware,
    encryptedMiddleware(authController.signup)
);

router.post(
    "/verify-otp",
    decryptMiddleware,
    encryptedMiddleware(authController.verifyOtp)
);

router.post(
    "/login",
    decryptMiddleware,
    encryptedMiddleware(authController.login)
);

router.post(
    "/logout",
    decryptMiddleware,
    encryptedMiddleware(authController.logout)
);

router.post(
    "/forgot-pass",
    forgotPasswordLimiter,
    decryptMiddleware,
    encryptedMiddleware(authController.forgotPassword)
);

router.post(
    "/verify-reset-otp",
    decryptMiddleware,
    encryptedMiddleware(authController.verifyResetOtp)
);


module.exports = router;