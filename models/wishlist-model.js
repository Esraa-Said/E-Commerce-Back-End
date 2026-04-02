const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
      unique: true,
      index: true,
    },

    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product id is required"],
      },
    ],
  },
  { timestamps: true }
);


wishlistSchema.path("products").validate(function (arr) {
  return arr.length > 0;
}, "Wishlist must have at least one product");


wishlistSchema.pre("save", function (next) {
  if (!this.products.length) return next();

  const uniqueProducts = [...new Set(this.products.map(id => id.toString()))];
  this.products = uniqueProducts;

  next();
});


wishlistSchema.index(
  { userId: 1, products: 1 },
  { unique: true, sparse: true }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);