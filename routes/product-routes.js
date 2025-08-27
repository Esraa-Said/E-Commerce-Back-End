const express = require("express");
const productControllers = require("../controllers/product-controllers");
const multerUpload = require("../middlewares/multer-upload-middleware");

const router = express.Router();

router.route('/').get(productControllers.getAllProduct).post(multerUpload.single('image'),  productControllers.createProduct);
router.route('/:id').get(productControllers.getProductById).delete(productControllers.deleteProductById).patch(multerUpload.single('image'),productControllers.updateProductById);

module.exports = router;