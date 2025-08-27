const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      minlength: [3, "Minimum category name length is 3 characters"],
      maxlength: [100, "Maximum category name length is 100 characters"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    categorySlug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Category description is required'],
      maxlength: [500, "Description too long"],
    },
    image: {
      type: String,
      required: [true, "Category image is required"],
    },
    isActive:{
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);



module.exports = mongoose.model("Category", categorySchema);
