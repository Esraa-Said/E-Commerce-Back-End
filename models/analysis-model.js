const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },

  users: {
    total: { type: Number, default: 0 },
    newToday: { type: Number, default: 0 },
    newThisMonth: { type: Number, default: 0 }
  },

  orders: {
    total: { type: Number, default: 0 },
    pending: { type: Number, default: 0 },
    delivered: { type: Number, default: 0 },
    cancelled: { type: Number, default: 0 }
  },

  sales: {
    totalIncome: { type: Number, default: 0 },
    todayIncome: { type: Number, default: 0 },
    byCategory: [
      {
        category: String,
        amount: { type: Number, default: 0 }
      }
    ]
  },

  visitors: {
    total: { type: Number, default: 0 },
    today: { type: Number, default: 0 },
    week: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model("Analysis", analysisSchema);
