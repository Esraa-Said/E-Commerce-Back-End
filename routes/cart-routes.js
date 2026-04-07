const express = require("express");
const cartControllers = require("../controllers/cart-controllers");
const checkDocumentsExistMiddleware = require("../middlewares/check-documents-exist-middleware");

const User = require("../models/user-model");
const Product = require("../models/product-model");

const router = express.Router();

router.get("/:userId", cartControllers.getCartByUserId);

router.post(
  "/item",
  checkDocumentsExistMiddleware({ userId: User, productId: Product }),
  cartControllers.addOrUpdateCartItem,
);

router.delete(
  "/item",
  checkDocumentsExistMiddleware({ userId: User, productId: Product }),
  cartControllers.removeCartItem,
);

router.delete(
  "/clear/:userId",
  checkDocumentsExistMiddleware({ userId: User }),
  cartControllers.clearCart,
);

module.exports = router;
