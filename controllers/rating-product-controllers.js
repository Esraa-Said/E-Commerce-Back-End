const Rating = require("../models/rating-product-model");
const asyncWrapper = require("../utils/async-wrapper");
const CustomError = require("../utils/custom-error");
const mongoose = require("mongoose");

const createOrUpdateRating = asyncWrapper(async (req, res, next) => {
  const { userId, productId, rating, comment } = req.body;

  if (!userId || !productId || !rating) {
    return next(new CustomError("userId, productId, and rating are required", 400));
  }

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
    return next(new CustomError("Invalid userId or productId", 400));
  }

  let existingRating = await Rating.findOne({ userId, productId });

  if (existingRating) {
    existingRating.rating = rating;
    existingRating.comment = comment;
    await existingRating.save();
    return res.status(200).json({
      status: "success",
      message: "Rating updated successfully",
      data: existingRating,
    });
  }

  const newRating = new Rating({ userId, productId, rating, comment });
  await newRating.save();

  res.status(201).json({
    status: "success",
    message: "Rating created successfully",
    data: newRating,
  });
});

const getAllRatings = asyncWrapper(async (req, res) => {
  const filter = {};
  if (req.query.userId && mongoose.Types.ObjectId.isValid(req.query.userId)) filter.userId = req.query.userId;
  if (req.query.productId && mongoose.Types.ObjectId.isValid(req.query.productId)) filter.productId = req.query.productId;

  const ratings = await Rating.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: ratings.length,
    data: ratings,
  });
});

const getRatingById = asyncWrapper(async (req, res, next) => {
  const rating = await Rating.findById(req.params.id);
  if (!rating) return next(new CustomError("Rating not found", 404));

  res.status(200).json({
    status: "success",
    data: rating,
  });
});

const deleteRatingById = asyncWrapper(async (req, res, next) => {
  const rating = await Rating.findById(req.params.id);
  if (!rating) return next(new CustomError("Rating not found", 404));

  await rating.deleteOne();

  res.status(200).json({
    status: "success",
    message: "Rating deleted successfully",
  });
});

module.exports = {
  createOrUpdateRating,
  getAllRatings,
  getRatingById,
  deleteRatingById,
};