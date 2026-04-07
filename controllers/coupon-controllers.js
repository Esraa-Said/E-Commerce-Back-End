const Coupon = require("../models/coupon-model");
const asyncWrapper = require("../utils/async-wrapper");
const CustomError = require("../utils/custom-error");
const httpStatusText = require("../utils/http-status-text");

const createCoupon = asyncWrapper(async (req, res, next) => {
  const coupon = new Coupon(req.body);
  await coupon.save();

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    message: "Coupon created successfully",
    data: coupon,
  });
});

const getAllCoupons = asyncWrapper(async (req, res, next) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    totalCoupons: coupons.length,
    data: coupons,
  });
});

const getCouponById = asyncWrapper(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) return next(new CustomError("Coupon not found", 404));

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: coupon,
  });
});

const updateCouponById = asyncWrapper(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) return next(new CustomError("Coupon not found", 404));

  Object.assign(coupon, req.body);
  await coupon.save();

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Coupon updated successfully",
    data: coupon,
  });
});

const deleteCouponById = asyncWrapper(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) return next(new CustomError("Coupon not found", 404));

  await coupon.deleteOne();
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Coupon deleted successfully",
  });
});

module.exports = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCouponById,
  deleteCouponById,
};