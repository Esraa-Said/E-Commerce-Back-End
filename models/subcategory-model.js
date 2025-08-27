const mongoose = require("mongoose");
const slugify = require("slugify");

const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Sub Category name is required"],
      minlength: [3, "Minimum Sub category name length is 3 characters"],
      maxlength: [100, "Maximum Sub category name length is 100 characters"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    subCategorySlug: {
      type: String,
      unique: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category Id is required"],
    },
    description: {
      type: String,
      required: [true, "Sub Category description is required"],
      maxlength: [500, "Description too long"],
    },
    image: {
      type: String,
      required: [true, "Sub Category image is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// unique name only inside category
subcategorySchema.index({ name: 1, categoryId: 1 }, { unique: true });

subcategorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.subCategorySlug = slugify(this.name, {
      lower: true,
    });
  }
  next();
});

module.exports = mongoose.model("SubCategory", subcategorySchema);
