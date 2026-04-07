const express = require("express");
const ratingControllers = require("../controllers/rating-product-controllers");
const checkDocumentsExistMiddleware = require("../middlewares/check-documents-exist-middleware");
const User = require("../models/user-model");
const Product = require("../models/product-model");

const router = express.Router();

router.post(
  "/",
  checkDocumentsExistMiddleware({ userId: User, productId: Product }),
  ratingControllers.createOrUpdateRating
);

router.get("/", ratingControllers.getAllRatings);

router.get("/:id", ratingControllers.getRatingById);

router.delete("/:id", ratingControllers.deleteRatingById);

module.exports = router;