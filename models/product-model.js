const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      minlength: [3, "Minimum product name length is 3 characters"],
      maxlength: [20, "Maximum product name length is 20 characters"],
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

    brand: {
      type: String,
      default: "Generic",
    },

    productImage: {
      type: [String],

      validate: {
        validator: function (imgs) {
          return Array.isArray(imgs) && imgs.length;
        },
        message: "Product must have at least one image",
      },
    },

    variants: {
      type: [
        {
          color: {
            type: String,
            enum: [
              "red",
              "blue",
              "green",
              "black",
              "white",
              "yellow",
              "purple",
              "orange",
              "gray",
              "brown",
              "pink",
              "beige",
            ],
            required: [true, "Product Color is required"],
          },
          size: {
            type: String,
            enum: [
              "XS",
              "S",
              "M",
              "L",
              "XL",
              "XXL",
              "36",
              "37",
              "38",
              "39",
              "40",
              "41",
            ],
            required: [true, "Product Size is required"],
          },
          price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Invalid Price"],
          },
          stock: {
            type: Number,
            required: [true, "Product quantity is required"],
            min: [0, "Invalid Quantity"],
          },
        },
      ],
      validate: [
        {
          validator: function (arr) {
            return Array.isArray(arr) && arr.length > 0;
          },
          message: "Product must have at least one variant",
        },
        {
          validator: function (arr) {
            const unique = new Set(arr.map((a) => `${a.size}-${a.color}`));
            return unique.size === arr.length;
          },
          message: "Variants must be unique (color + size should not repeat)",
        },
      ],
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
    quantity: {
      type: Number,
      default: 0,
      min: [0, "Invalid quantity"],
    },

    stock:{
      type: String,
      enum: ['in-stock' , 'out-of-stock'],
      default: 'out-of-stock',
      min: [0, "Invalid stock"],
    }
  },

  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (this.variants && this.variants.length) {
    this.quantity = this.variants.reduce((sum, v) => sum + (v.stock || 0), 0)
    this.stock = this.quantity ? 'in-stock' : 'out-of-stock';
  }
  if (this.isModified("name")) {
    this.productSlug = slugify(this.name, {
      lower: true,
    });
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
