const express = require("express");
const productControllers = require("../controllers/product-controllers");
const multerUpload = require("../middlewares/cloudinary-upload-middleware");
const checkDocumentsExistMiddleware = require("../middlewares/check-documents-exist-middleware");
const Category = require("../models/category-model");

const router = express.Router();

router.post(
  "/",
  multerUpload.fields([{ name: "productImages", maxCount: 10 }]),
  checkDocumentsExistMiddleware({ categoryId: Category }),
  productControllers.createProduct,
);

router.get("/", productControllers.getAllProducts);

router.get("/:id", productControllers.getProductById);

router.patch(
  "/:id",
  multerUpload.fields([{ name: "productImages", maxCount: 10 }]),
  checkDocumentsExistMiddleware({ categoryId: Category }),
  productControllers.updateProductById,
);

router.delete("/:id", productControllers.deleteProductById);

module.exports = router;
