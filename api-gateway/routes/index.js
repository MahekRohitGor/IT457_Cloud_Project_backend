const express = require("express");
const {verifyJWT} = require("../middlewares/auth");
const {verifyAdminJWT} = require("../middlewares/adminAuth");
require("dotenv").config();
const {proxy} = require("../../common/helper");
const validateApiKey = require("../middlewares/apikey");

const router = express.Router();
console.log({
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL,
  ADMIN_SERVICE_URL: process.env.ADMIN_SERVICE_URL,
  PAYMENT_SERVICE_URL: process.env.PAYMENT_SERVICE_URL,
});

router.use(validateApiKey);
router.use('/auth', verifyJWT, proxy(process.env.AUTH_SERVICE_URL));
router.use('/admin', verifyAdminJWT, proxy(process.env.ADMIN_SERVICE_URL));
// router.use('/payments', verifyToken, proxy('/payments', process.env.PAYMENT_SERVICE_URL));

module.exports = router;