const mongoose = require("mongoose");
const slugify = require("slugify");

const {
  PRODUCT_GENDERS,
  PRODUCT_COLORS,
  PRODUCT_SIZES,
} = require("../utils/productConstants");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      minlength: [3, "Minimum product name length is 3"],
      maxlength: [50, "Maximum product name length is 50"],
      unique: true,
      trim: true,
    },

    productSlug: {
      type: String,
      unique: true,
      index: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [2000, "Description too long"],
    },

    sold: {
      type: Number,
      default: 0,
    },

    productImages: {
      type: [String],
      validate: {
        validator: (imgs) => Array.isArray(imgs) && imgs.length > 0,
        message: "Product must have at least one image",
      },
    },

    gender: {
      type: String,
      enum: PRODUCT_GENDERS,
      default: "unisex",
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [1, "Invalid price"],
    },

    variants: {
      type: [
        {
          color: {
            type: String,
            enum: PRODUCT_COLORS,
            required: [true, "Variant color is required"],
          },
          size: {
            type: String,
            enum: PRODUCT_SIZES,
            required: [true, "Variant size is required"],
          },
          stock: {
            type: Number,
            min: 0,
            required: [true, "Stock is required"],
          },
          sku: {
            type: String,
            unique: true,
            sparse: true,
          },
        },
      ],
      validate: [
        {
          validator: (arr) => arr.length > 0,
          message: "Product must have at least one variant",
        },
        {
          validator: function (arr) {
            const unique = new Set(arr.map((v) => `${v.color}-${v.size}`));
            return unique.size === arr.length;
          },
          message: "Variant color + size must be unique",
        },
      ],
    },

    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    quantity: {
      type: Number,
      default: 0,
    },

    availability: {
      type: String,
      enum: ["in-stock", "out-of-stock"],
      default: "out-of-stock",
    },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (this.variants?.length) {
    this.quantity = this.variants.reduce((sum, v) => sum + v.stock, 0);
    this.availability = this.quantity > 0 ? "in-stock" : "out-of-stock";
  }

  if (this.isModified("name")) {
    this.productSlug = slugify(this.name, { lower: true });
  }

  next();
});

module.exports = mongoose.model("Product", productSchema);