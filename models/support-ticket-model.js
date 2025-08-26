const mongoose = require("mongoose");

const supportTicketSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    },
    assignedToId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupportTicket", supportTicketSchema);
