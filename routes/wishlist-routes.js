const express = require("express");
const wishlistControllers = require("../controllers/wishlist-controllers");
const checkDocumentsExistMiddleware = require("../middlewares/check-documents-exist-middleware");

const User = require("../models/user-model");
const Product = require("../models/product-model");

const router = express.Router();

router.get("/:userId", wishlistControllers.getWishlistByUserId);

router.post(
  "/item",
  checkDocumentsExistMiddleware({ userId: User, products: Product }, { optional: true }),
  wishlistControllers.addProductsToWishlist
);

router.delete(
  "/item",
  checkDocumentsExistMiddleware({ userId: User, productId: Product }, { optional: true }),
  wishlistControllers.removeProductFromWishlist
);

router.delete("/clear/:userId", checkDocumentsExistMiddleware({ userId: User }), wishlistControllers.clearWishlist);

module.exports = router;