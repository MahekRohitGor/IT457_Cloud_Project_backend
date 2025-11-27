const rateLimit = require("express-rate-limit");

const forgotPasswordLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  message: {
    code: 429,
    message: "Too many requests for OTP. Try again later."
  }
});

module.exports = {forgotPasswordLimiter};