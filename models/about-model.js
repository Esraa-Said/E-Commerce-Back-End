const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'], 
  },
  description: {
    type: String,
    required: [true, 'Description is required'], 
  },
  mission: {
    type: String, 
  },
  vision: {
    type: String, 
  },
  values: [
    {
      type: String, 
    },
  ],
  image: {
    type: String, 
    default: "default-about.png",
  },
  

}, {timestamps: true});

module.exports = mongoose.model("About", aboutSchema);
