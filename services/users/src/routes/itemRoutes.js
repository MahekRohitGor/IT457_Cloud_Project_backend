const router = require("express").Router();
const { decryptMiddleware, encryptedMiddleware } = require("../../middlewares/encdecmiddleware");
const {verifyUser} = require("../../middlewares/verifyUser");
const itemController = require("../controllers/itemController");

router.get("/list-item", verifyUser, decryptMiddleware, encryptedMiddleware(itemController.listItems));

module.exports = router;