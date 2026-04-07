const express = require("express");
const notificationControllers = require("../controllers/notification-controllers");
const checkDocumentsExistMiddleware = require("../middlewares/check-documents-exist-middleware");
const User = require("../models/user-model");
const Order = require("../models/order-model");
const Product = require("../models/product-model");
const Category = require("../models/category-model");

const router = express.Router();

router.post(
  "/",
  checkDocumentsExistMiddleware(
    { userId: User, order: Order, product: Product, category: Category }  ),
  notificationControllers.createNotification
);

router.get("/", notificationControllers.getAllNotifications);

router.get("/:id", notificationControllers.getNotificationById);

router.patch("/:id", notificationControllers.updateNotificationById);

router.delete("/:id", notificationControllers.deleteNotificationById);

module.exports = router;