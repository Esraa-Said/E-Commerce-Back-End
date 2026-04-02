const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
      unique: true,
      index: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product id is required"],
        },

        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },

        priceSnapshot: {
          type: Number,
          required: [true, "Price at the time of adding to cart is required"],
        },
      },
    ],

    totalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

cartSchema.path("items").validate(function (arr) {
  return arr.length > 0;
}, "Cart cannot be empty");

cartSchema.pre("save", function (next) {
  if (!this.items.length) return next();

  const map = new Map();

  this.items.forEach((item) => {
    const id = item.productId.toString();

    if (map.has(id)) {
      map.get(id).quantity += item.quantity;
    } else {
      map.set(id, item);
    }
  });

  this.items = Array.from(map.values());

  this.totalPrice = this.items.reduce(
    (sum, item) => sum + item.quantity * item.priceSnapshot,
    0,
  );

  next();
});

module.exports = mongoose.model("Cart", cartSchema);
