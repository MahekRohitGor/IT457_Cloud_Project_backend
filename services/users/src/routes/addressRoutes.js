const router = require("express").Router();
const { decryptMiddleware, encryptedMiddleware } = require("../../middlewares/encdecmiddleware");
const {verifyUser} = require("../../middlewares/verifyUser");
const addressController = require("../controllers/addressController");

router.post("/add", verifyUser, decryptMiddleware, encryptedMiddleware(addressController.addAddress));
router.get("/list", verifyUser, decryptMiddleware, encryptedMiddleware(addressController.listAddresses));

module.exports = router;