const express = require("express");
const {verifyJWT} = require("../middlewares/auth");
require("dotenv").config();
const {proxy} = require("../../common/helper");
const validateApiKey = require("../middlewares/apikey");

const router = express.Router();
console.log({
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL,
  USER_SERVICE_URL: process.env.USER_SERVICE_URL,
  PAYMENT_SERVICE_URL: process.env.PAYMENT_SERVICE_URL,
});

router.use(validateApiKey);
router.use('/auth', verifyJWT, proxy(process.env.AUTH_SERVICE_URL));
// router.use('/users', verifyToken, proxy('/users', process.env.USER_SERVICE_URL));
// router.use('/payments', verifyToken, proxy('/payments', process.env.PAYMENT_SERVICE_URL));

module.exports = router;