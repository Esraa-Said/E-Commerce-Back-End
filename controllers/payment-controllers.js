const Payment = require("../models/payment-model");
const asyncWrapper = require("../utils/async-wrapper");
const CustomError = require("../utils/custom-error");
const httpStatusText = require("../utils/http-status-text");

const createPayment = asyncWrapper(async (req, res, next) => {
  const { userId, method, amount, transactionId, cardDetails, notes } = req.body;

  const payment = new Payment({
    userId,
    method,
    amount,
    transactionId,
    cardDetails,
    notes,
  });

  await payment.save();

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    message: "Payment created successfully",
    data: payment,
  });
});

const getAllPayments = asyncWrapper(async (req, res, next) => {
  const filter = req.query.userId ? { userId: req.query.userId } : {};
  const payments = await Payment.find(filter).populate("userId", "name email");

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    total: payments.length,
    data: payments,
  });
});

const getPaymentById = asyncWrapper(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id).populate("userId", "name email");

  if (!payment) return next(new CustomError("Payment not found", 404));

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: payment,
  });
});

const updatePaymentById = asyncWrapper(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) return next(new CustomError("Payment not found", 404));

  Object.assign(payment, req.body);

  await payment.save();

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Payment updated successfully",
    data: payment,
  });
});

const deletePaymentById = asyncWrapper(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) return next(new CustomError("Payment not found", 404));

  await payment.deleteOne();

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Payment deleted successfully",
  });
});

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePaymentById,
  deletePaymentById,
};