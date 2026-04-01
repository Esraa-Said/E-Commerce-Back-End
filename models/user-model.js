const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minlength: [3, "Minimum name length is 3"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      minlength: [3, "Minimum name length is 3"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      unique: true,
      validate: [validator.isEmail, "Invalid Email Format"],
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Minimum password length is 8"],
      select: false,
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
        "productAdmin",
        "orderAdmin",
        "customerSupportAdmin",
        "marketingAdmin",
      ],
      default: "customer",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", UserSchema);
