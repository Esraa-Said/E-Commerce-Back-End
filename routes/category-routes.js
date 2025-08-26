const express = require("express");
const categoryControllers = require("../controllers/category-controllers");
const multerUpload = require("../middlewares/multer-upload-middleware");

const router = express.Router();

router.route('/').get(categoryControllers.getAllCategory).post(multerUpload.single('image'),  categoryControllers.createCategory);
router.route('/:id').get(categoryControllers.getCategoryById).delete(categoryControllers.deleteCategoryById).patch(multerUpload.single('image'),categoryControllers.updateCategoryById);

module.exports = router;