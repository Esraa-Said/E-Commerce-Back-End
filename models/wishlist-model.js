const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, 'User id is required'],
      unique: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, 'Product id is required'],
      },
    ],
  },
  { timestamps: true }
);
 

module.exports = mongoose.model("Wishlist", wishlistSchema);
