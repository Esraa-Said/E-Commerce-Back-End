const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    method: {
      type: String,
      enum: ["cash", "creditCard", "paypal", "wallet"],
      required: [true, "Payment method is required"],
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be positive"],
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    cardDetails: {
      cardNumber: { type: String },
      cardHolder: { type: String },
      expiryDate: { type: String },
    },
    notes: { type: String },
  },
  { timestamps: true },
);

paymentSchema.pre("save", async function (next) {
  if (this.isModified("cardDetails.cardNumber") && this.cardDetails.cardNumber)
    this.cardDetails.cardNumber = await bcrypt.hash(
      this.cardDetails.cardNumber,
      10,
    );
  next();
});

module.exports = mongoose.model("Payment", paymentSchema);
