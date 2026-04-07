const express = require("express");
const categoryControllers = require("../controllers/category-controllers");
const multerUpload = require("../middlewares/cloudinary-upload-middleware");
const Category = require("../models/category-model");
const checkDocumentsExistMiddleware = require("../middlewares/check-documents-exist-middleware");

const router = express.Router();

router
  .route("/")
  .get(categoryControllers.getAllCategories)
  .post(
    multerUpload.single("image"),
    checkDocumentsExistMiddleware({ parentCategory: Category }),
    categoryControllers.createCategory,
  );

router
  .route("/:id")
  .get(categoryControllers.getCategoryById)
  .patch(
    multerUpload.single("image"),
    checkDocumentsExistMiddleware({ parentCategory: Category }),

    categoryControllers.updateCategory,
  )
  .delete(categoryControllers.deleteCategory);

router
  .route("/:id/toggle-status")
  .patch(categoryControllers.toggleCategoryStatus);

module.exports = router;
