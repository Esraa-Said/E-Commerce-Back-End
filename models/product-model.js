const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [500, "Description too long"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Invalid Price"],
    },
 
    brand: {
      type: String,
      default: "Generic",
    },
    stock: {
      type: Number,
      required: [true, "Product quantity is required"],
      min: [0, "Invalid Quantity"],
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
    },

    size: {
      type: [String],
    },
    subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },

    isActive: {
      type: Boolean,
      default: true, // admin can deactivate instead of deleting
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
