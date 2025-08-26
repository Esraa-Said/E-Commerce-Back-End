const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Sub Category name is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Category Id is required"],
    },
    description: {
      type: String,
      maxlength: [500, "Description too long"],
    },
    image: {
      type: String,
      required: [true, "Category image is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubCategory", subcategorySchema);
