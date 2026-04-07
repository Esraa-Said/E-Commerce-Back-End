const Notification = require("../models/notification-model");
const asyncWrapper = require("../utils/async-wrapper");
const CustomError = require("../utils/custom-error");
const mongoose = require("mongoose");

const createNotification = asyncWrapper(async (req, res, next) => {
  const { userId, title, message, type, order, product, category } = req.body;

  if (!userId || !title || !message) {
    return next(new CustomError("userId, title and message are required", 400));
  }

  const notification = new Notification({
    userId,
    title,
    message,
    type: type || "system",
    order,
    product,
    category,
  });

  await notification.save();

  res.status(201).json({
    status: "success",
    message: "Notification created successfully",
    data: notification,
  });
});

const getAllNotifications = asyncWrapper(async (req, res) => {
  const filter = {};
  if (req.query.userId && mongoose.Types.ObjectId.isValid(req.query.userId)) {
    filter.userId = req.query.userId;
  }
  if (req.query.type) filter.type = req.query.type;

  const notifications = await Notification.find(filter)
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: notifications.length,
    data: notifications,
  });
});

const getNotificationById = asyncWrapper(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) return next(new CustomError("Notification not found", 404));

  res.status(200).json({
    status: "success",
    data: notification,
  });
});

const updateNotificationById = asyncWrapper(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) return next(new CustomError("Notification not found", 404));

  Object.assign(notification, req.body);
  await notification.save();

  res.status(200).json({
    status: "success",
    message: "Notification updated successfully",
    data: notification,
  });
});

const deleteNotificationById = asyncWrapper(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) return next(new CustomError("Notification not found", 404));

  await notification.deleteOne();

  res.status(200).json({
    status: "success",
    message: "Notification deleted successfully",
  });
});

module.exports = {
  createNotification,
  getAllNotifications,
  getNotificationById,
  updateNotificationById,
  deleteNotificationById,
};