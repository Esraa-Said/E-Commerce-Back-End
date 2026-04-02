const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now,
      unique: true, 
      index: true
    },

    users: {
      total: { type: Number, default: 0, min: 0 },
      newToday: { type: Number, default: 0, min: 0 },
      newThisMonth: { type: Number, default: 0, min: 0 },
    },

    orders: {
      total: { type: Number, default: 0, min: 0 },
      pending: { type: Number, default: 0, min: 0 },
      delivered: { type: Number, default: 0, min: 0 },
      cancelled: { type: Number, default: 0, min: 0 },
    },

    sales: {
      totalIncome: { type: Number, default: 0, min: 0 },
      todayIncome: { type: Number, default: 0, min: 0 },
      byCategory: [
        {
          categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
          },
          amount: { type: Number, default: 0, min: 0 },
        },
      ],
    },

    visitors: {
      total: { type: Number, default: 0, min: 0 },
      today: { type: Number, default: 0, min: 0 },
      week: { type: Number, default: 0, min: 0 },
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Analysis", analysisSchema);