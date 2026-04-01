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
    },

    categorySlug: {
      type: String,
      unique: true,
      index: true,
    },

    description: {
      type: String,
      required: [true, "Category description is required"],
      maxlength: [1000, "Description too long"],
      trim: true,
    },

    image: {
      type: String,
      required: [true, "Category image is required"],
    },

    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.categorySlug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);