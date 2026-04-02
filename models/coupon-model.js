const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      trim: true,
      uppercase: true,
      minlength: [3, "Coupon code must be at least 3 characters"],
      maxlength: [20, "Coupon code too long"],
    },

    discountPercentage: {
      type: Number,
      min: [0, "Discount % must be >= 0"],
      max: [100, "Discount % cannot exceed 100"],
    },

    discountAmount: {
      type: Number,
      min: [0, "Discount amount must be >= 0"],
    },

    minOrderValue: {
      type: Number,
      default: 0,
      min: [0, "Minimum order value cannot be negative"],
    },

    expiryDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > Date.now();
        },
        message: "Expiry date must be in the future",
      },
      index: true, 
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    totalUsageLimit: {
      type: Number,
      default: 0, 
      min: 0,
    },

    currentUsage: {
      type: Number,
      default: 0,
      min: 0,
    },

    limitPerUser: {
      type: Number,
      default: 0, 
      min: 0,
    },
  },
  { timestamps: true }
);


couponSchema.pre("validate", function (next) {
  if (!this.discountPercentage && !this.discountAmount) {
    return next(
      new Error("You must provide either discountPercentage or discountAmount")
    );
  }

  if (this.discountPercentage && this.discountAmount) {
    return next(
      new Error("You cannot use both discountPercentage and discountAmount together")
    );
  }

  next();
});


couponSchema.pre("save", function (next) {
  if (this.expiryDate <= Date.now()) {
    this.isActive = false;
  }
  next();
});

module.exports = mongoose.model("Coupon", couponSchema);