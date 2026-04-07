const Cart = require("../models/cart-model");
const CustomError = require("../utils/custom-error");
const asyncWrapper = require("../utils/async-wrapper");

const getCartByUserId = asyncWrapper(async (req, res, next) => {
  const { userId } = req.params;
  const cart = await Cart.findOne({ userId }).populate("items.productId", "name price productImages");

  if (!cart) {
    return res.status(200).json({
      status: "Success",
      message: "Cart is empty",
      data: { items: [], totalPrice: 0 },
    });
  }

  res.status(200).json({
    status: "Success",
    data: cart,
  });
});

const addOrUpdateCartItem = asyncWrapper(async (req, res, next) => {
  const { userId, productId, quantity, priceSnapshot } = req.body;

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ productId, quantity, priceSnapshot });
  }

  await cart.save();

  res.status(200).json({
    status: "Success",
    message: "Cart updated successfully",
    data: cart,
  });
});

const removeCartItem = asyncWrapper(async (req, res, next) => {
  const { userId, productId } = req.body;

  const cart = await Cart.findOne({ userId });
  if (!cart) return next(new CustomError("Cart not found", 404));

  cart.items = cart.items.filter(item => item.productId.toString() !== productId);

  await cart.save();

  res.status(200).json({
    status: "Success",
    message: "Item removed from cart",
    data: cart,
  });
});

const clearCart = asyncWrapper(async (req, res, next) => {
  const { userId } = req.params;

  const cart = await Cart.findOne({ userId });
  if (!cart) return next(new CustomError("Cart not found", 404));

  cart.items = [];
  cart.totalPrice = 0;

  await cart.save();

  res.status(200).json({
    status: "Success",
    message: "Cart cleared successfully",
    data: cart,
  });
});

module.exports = {
  getCartByUserId,
  addOrUpdateCartItem,
  removeCartItem,
  clearCart,
};