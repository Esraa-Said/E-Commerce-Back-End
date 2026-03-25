const mongoose = require("mongoose");

const CountrySchema = new mongoose.Schema({

    name: {
        type: String,
       required: [true, "Country Name is required"],
       trim: true
    },

    // icon: {
    //     type: 
    // }

    countryCode: {
  type: String,
  required: [true, "Country code is required"],
  uppercase: true, 
  minlength: 2,
  maxlength: 2,
  trim: true,
 
}
})

module.exports = mongoose.model("Country", CountrySchema);
