const express = require("express");
const orderControllers = require("../controllers/order-controllers");
const checkDocumentsExistMiddleware = require("../middlewares/check-documents-exist-middleware");
const User = require("../models/user-model");
const UserAddress = require("../models/user-address-model");
const Payment = require("../models/payment-model");
const Product = require("../models/product-model");
const Coupon = require("../models/coupon-model");

const router = express.Router();

router.post(
  "/",
  checkDocumentsExistMiddleware({
    userId: User,
    shippingAddressId: UserAddress,
    paymentId: Payment,
    couponId: Coupon,
    "products.productId": Product,
  }),
  orderControllers.createOrder,
);

router.get("/", orderControllers.getAllOrders);

router.get("/:id", orderControllers.getOrderById);

router.patch(
  "/:id",
  checkDocumentsExistMiddleware({
    userId: User,
    shippingAddressId: UserAddress,
    paymentId: Payment,
    couponId: Coupon,
    "products.productId": Product,
  }),
  orderControllers.updateOrderById,
);

router.delete("/:id", orderControllers.deleteOrderById);

module.exports = router;
