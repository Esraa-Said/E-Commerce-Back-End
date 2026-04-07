const Wishlist = require("../models/wishlist-model");
const CustomError = require("../utils/custom-error");
const asyncWrapper = require("../utils/async-wrapper");

const getWishlistByUserId = asyncWrapper(async (req, res, next) => {
  const { userId } = req.params;
  const wishlist = await Wishlist.findOne({ userId }).populate("products", "name price productImages");

  if (!wishlist) {
    return res.status(200).json({
      status: "Success",
      message: "Wishlist is empty",
      data: { products: [] },
    });
  }

  res.status(200).json({
    status: "Success",
    data: wishlist,
  });
});

const addProductsToWishlist = asyncWrapper(async (req, res, next) => {
  const { userId, products } = req.body;

  let wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    wishlist = new Wishlist({ userId, products });
  } else {
    wishlist.products.push(...products);
  }

  await wishlist.save();

  res.status(200).json({
    status: "Success",
    message: "Products added to wishlist",
    data: wishlist,
  });
});

const removeProductFromWishlist = asyncWrapper(async (req, res, next) => {
  const { userId, productId } = req.body;

  const wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) return next(new CustomError("Wishlist not found", 404));

  wishlist.products = wishlist.products.filter(p => p.toString() !== productId);

  await wishlist.save();

  res.status(200).json({
    status: "Success",
    message: "Product removed from wishlist",
    data: wishlist,
  });
});

const clearWishlist = asyncWrapper(async (req, res, next) => {
  const { userId } = req.params;

  const wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) return next(new CustomError("Wishlist not found", 404));

  wishlist.products = [];
  await wishlist.save();

  res.status(200).json({
    status: "Success",
    message: "Wishlist cleared successfully",
    data: wishlist,
  });
});

module.exports = {
  getWishlistByUserId,
  addProductsToWishlist,
  removeProductFromWishlist,
  clearWishlist,
};