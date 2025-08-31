const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    mission: {
      type: String,
    },
    vision: {
      type: String,
    },
    values: [String],
    image: {
      type: String,
      default: "default-about.png",
    },
    isActive:{
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("About", aboutSchema);
