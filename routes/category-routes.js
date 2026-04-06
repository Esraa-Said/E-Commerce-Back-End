const express = require("express");
const categoryControllers = require("../controllers/category-controllers");
const multerUpload = require("../middlewares/cloudinary-upload-middleware");

const router = express.Router();

router
  .route("/")
  .get(categoryControllers.getAllCategories)
  .post(
    multerUpload.single("image"),
    categoryControllers.createCategory
  );

router
  .route("/:id")
  .get(categoryControllers.getCategoryById)
  .patch(
    multerUpload.single("image"),
    categoryControllers.updateCategory
  )
  .delete(categoryControllers.deleteCategory);

router
  .route("/:id/toggle-status")
  .patch(categoryControllers.toggleCategoryStatus);

module.exports = router;