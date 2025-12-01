const router = require("express").Router();
const { decryptMiddleware, encryptedMiddleware } = require("../../middlewares/encdecmiddleware");
const {verifyUser} = require("../../middlewares/verifyUser");
const cartController = require("../controllers/cartController");

router.post("/add", verifyUser, decryptMiddleware, encryptedMiddleware(cartController.addToCart));
router.get("/list", verifyUser, decryptMiddleware, encryptedMiddleware(cartController.getCart));


module.exports = router;