const mongoose = require("mongoose");

const UserAddressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: [true, "User ID is required"],
  },

  unitNumber: {
    type: String,
    required: [true, "Unit Number is required"],
    trim: true,
  },

  streetNumber: {
    type: String,
    required: [true, "Street Number is required"],
    trim: true,
  },
  addressLine:{
     type: String,
    required: [true, "Address Line is required"],
    trim: true,
  },
  city:{
     type: String,
    required: [true, "City is required"],
    trim: true,
  }
  ,
  region: {
     type: String,
    required: [true, "Region is required"],
    trim: true,
  },
  postalCode: {
    type: String,
    required: [true, "Postal code is required"],
    trim: true,
  }
  ,
  countryId:{
     type: mongoose.Schema.Types.ObjectId,
      ref: "Country", 
      required: [true, "Country is required"],
  }

  isDefault: {
    type: Boolean,
    default: false,
  },
},
{ timestamps: true }
);

UserAddressSchema.pre("save", async function (next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  next();
});

module.exports = mongoose.model("UserAddress", UserAddressSchema);
