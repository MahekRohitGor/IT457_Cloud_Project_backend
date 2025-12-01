const router = require("express").Router();
const { decryptMiddleware, encryptedMiddleware } = require("../../middlewares/encdecmiddleware");
const {verifyUser} = require("../../middlewares/verifyUser");
const orderController = require("../controllers/orderController");

router.post("/place", verifyUser, decryptMiddleware, encryptedMiddleware(orderController.placeOrder));

module.exports = router;