const mongoose = require("mongoose");

const supportTicketSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      maxlength: [100, "Subject too long"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      maxlength: [500, "Message too long"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["open", "inProgress", "closed"],
      default: "open",
      index: true,
    },
    assignedToId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    closedAt: { type: Date }, 
    replies: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        message: { type: String, required: true, maxlength: 500 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    internalNotes: [
      { type: String } 
    ],
  },
  { timestamps: true }
);

supportTicketSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "closed" && !this.closedAt) {
    this.closedAt = new Date();
  }
  next();
});

supportTicketSchema.index({ customerId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model("SupportTicket", supportTicketSchema);