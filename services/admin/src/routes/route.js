const router = require("express").Router();
const adminController = require("../controllers/adminController");
const { encryptedMiddleware, decryptMiddleware } = require("../../middlewares/encdecmiddleware");


router.post("/login", decryptMiddleware, encryptedMiddleware(adminController.loginAdmin));
router.post("/logout", decryptMiddleware, encryptedMiddleware(adminController.logoutAdmin));

router.post("/add-category", decryptMiddleware, encryptedMiddleware(adminController.add_category));
router.get("/list-category", decryptMiddleware, encryptedMiddleware(adminController.getCategories));
router.delete("/delete-category", decryptMiddleware, encryptedMiddleware(adminController.deleteCategory));
router.put("/update-category", decryptMiddleware, encryptedMiddleware(adminController.updateCategory));

module.exports = router;