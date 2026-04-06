const express = require("express");
const authControllers = require("../controllers/auth-controllers");
const authMiddleware = require("../middlewares/auth-middleware");

const router = express.Router();



router.post('/register', authControllers.register);
router.get('/verify-user/:code', authControllers.verifyAccount);
router.post('/login', authControllers.login);
router.post('/resend-verification-code', authControllers.resendVerification);
router.post('/forget-password-mail', authControllers.forgetPasswordEmail);
// redirect in front
router.get('/reset-password-mail',authMiddleware, authControllers.sendResetPasswordEmail);
router.post('/change-password/:code', authControllers.resetPassword);

module.exports = router;