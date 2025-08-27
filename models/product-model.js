const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      minlength: [3, "Minimum product name length is 3 characters"],
      maxlength: [100, "Maximum product name length is 100 characters"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    productSlug: {
      type: String,
      unique: true,
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
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: [true, "Sub Category is required"],
    },

    isActive: {
      type: Boolean,
      default: true, // admin can deactivate instead of deleting
    },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.productSlug = slugify(this.name, {
      lower: true,
    });
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
