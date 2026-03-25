const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "First name is required"],
      minlength: [3, "Minimum name length is 3"],
      trim: true,
    },
    lastname: {
      type: String,
      required: [true, "Last name is required"],
      minlength: [3, "Minimum name length is 3"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "User email is required"],
      unique: true,
      validate: [validator.isEmail, "Invalid Email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Minimum password length is 8"],
    },
    phone: {
      type: String,
      match: [/^[0-9]{10,15}$/, "Phone number must be 10–15 digits"],
    },
    role: {
      type: String,
      enum: [
        "customer",
        "superAdmin",
        "productManager",
        "orderManager",
        "customerSupport",
        "marketingAdmin",
      ],
      default: "customer",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", UserSchema);
