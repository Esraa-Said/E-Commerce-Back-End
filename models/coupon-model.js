const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      trim: true,
      uppercase: true
    },
    discountPercentage: {
      type: Number,
      min: [0, "Discount % must be >= 0"],
      max: [100, "Discount % cannot exceed 100"]
    },
    discountAmount: {
      type: Number,
      min: [0, "Discount amount must be >= 0"]
    },
    expiryDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > Date.now();
        },
        message: "Expiry date must be in the future"
      }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
