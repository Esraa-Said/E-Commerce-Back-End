const Order = require("../models/order-model");
const asyncWrapper = require("../utils/async-wrapper");
const CustomError = require("../utils/custom-error");
const httpStatusText = require("../utils/http-status-text");

const createOrder = asyncWrapper(async (req, res, next) => {
  const { userId, products, totalPrice, shippingAddressId, paymentId, couponId, notes } = req.body;

  const order = new Order({
    userId,
    products,
    totalPrice,
    shippingAddressId,
    paymentId,
    couponId,
    notes,
  });

  await order.save();

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    message: "Order created successfully",
    data: order,
  });
});


const getAllOrders = asyncWrapper(async (req, res, next) => {
  const filter = req.query.userId ? { userId: req.query.userId } : {};
  const orders = await Order.find(filter)
    .populate("userId", "name email")
    .populate("shippingAddressId")
    .populate("paymentId")
    .populate("products.productId", "name price");

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    total: orders.length,
    data: orders,
  });
});

const getOrderById = asyncWrapper(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("userId", "name email")
    .populate("shippingAddressId")
    .populate("paymentId")
    .populate("products.productId", "name price");

  if (!order) return next(new CustomError("Order not found", 404));

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: order,
  });
});

const updateOrderById = asyncWrapper(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new CustomError("Order not found", 404));

  Object.assign(order, req.body);

  await order.save();

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Order updated successfully",
    data: order,
  });
});

const deleteOrderById = asyncWrapper(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new CustomError("Order not found", 404));

  await order.deleteOne();

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Order deleted successfully",
  });
});

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
};