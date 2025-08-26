const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      minlength: [3, 'Minimum category name length is 3 characters'],
      maxlength: [100, 'Maximum category name length is 100 characters'],
      unique: true,
      trim: true,
      lowercase: true,
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

module.exports = mongoose.model("Category", categorySchema);
