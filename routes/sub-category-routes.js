const express = require("express");
const subcategoryControllers = require("../controllers/sub-category-controllers");
const multerUpload = require("../middlewares/multer-upload-middleware");

const router = express.Router();

router.route('/').get(subcategoryControllers.getAllSubCategory).post(multerUpload.single('image'),  subcategoryControllers.createSubCategory);
router.route('/:id').get(subcategoryControllers.getSubCategoryById).delete(subcategoryControllers.deleteSubCategoryById).patch(multerUpload.single('image'),subcategoryControllers.updateSubCategoryById);

module.exports = router;