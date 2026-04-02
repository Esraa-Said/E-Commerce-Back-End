const mongoose = require("mongoose");

const CountrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Country Name is required"],
      trim: true,
      unique: true,
    },

    countryCode: {
      type: String,
      required: [true, "Country code is required"],
      uppercase: true,
      minlength: 2,
      maxlength: 2,
      trim: true,
      unique: true,
    },

    flag: {
      type: String,
      trim: true,
    },
  },  
  { timestamps: true }
);

module.exports = mongoose.model("Country", CountrySchema);