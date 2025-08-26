const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
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
    emailVerified: {
      type: Boolean,
      default: false,
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

UserSchema.pre("save", function () {
  if (this.role === "admin") this.wishlist = undefined;
  next();
});

module.exports = mongoose.model("User", UserSchema);
