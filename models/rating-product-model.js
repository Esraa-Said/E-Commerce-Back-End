const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User Id is required"],
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product Id is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Minimum rating is 1"],
      max: [5, "Maximum rating is 5"],
    },
    comment: {
      type: String,
      maxlength: [500, "Description too long"],
    },
  },
  { timestamps: true }
);

// one rating for one product from one user
ratingSchema.index({ userId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model("Rating", ratingSchema);
