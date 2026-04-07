const Analysis = require("../models/analysis-model");
const asyncWrapper = require("../utils/async-wrapper");
const CustomError = require("../utils/custom-error");
const mongoose = require("mongoose");

const createAnalysis = asyncWrapper(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let analysis = await Analysis.findOne({ date: today });
  if (analysis) {
    return res.status(200).json({
      status: "success",
      message: "Today's analysis already exists",
      data: analysis,
    });
  }

  analysis = await Analysis.create({ date: today });

  res.status(201).json({
    status: "success",
    message: "Today's analysis created",
    data: analysis,
  });
});

const getAllAnalyses = asyncWrapper(async (req, res) => {
  const filter = {};
  if (req.query.month && req.query.year) {
    const month = parseInt(req.query.month) - 1;
    const year = parseInt(req.query.year);
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
    filter.date = { $gte: start, $lte: end };
  }

  const analyses = await Analysis.find(filter).sort({ date: -1 }).populate("sales.byCategory.categoryId", "name");

  res.status(200).json({
    status: "success",
    results: analyses.length,
    data: analyses,
  });
});

const getAnalysisById = asyncWrapper(async (req, res, next) => {
  const analysis = await Analysis.findById(req.params.id).populate("sales.byCategory.categoryId", "name");
  if (!analysis) return next(new CustomError("Analysis not found", 404));

  res.status(200).json({ status: "success", data: analysis });
});

const updateAnalysisById = asyncWrapper(async (req, res, next) => {
  const analysis = await Analysis.findById(req.params.id);
  if (!analysis) return next(new CustomError("Analysis not found", 404));

  const { users, orders, sales, visitors } = req.body;

  if (users) analysis.users = { ...analysis.users.toObject(), ...users };
  if (orders) analysis.orders = { ...analysis.orders.toObject(), ...orders };
  if (sales) {
    if (sales.byCategory) {
      const existingMap = new Map(analysis.sales.byCategory.map(c => [c.categoryId.toString(), c]));
      sales.byCategory.forEach(c => {
        if (!mongoose.Types.ObjectId.isValid(c.categoryId)) return;
        if (existingMap.has(c.categoryId.toString())) {
          existingMap.get(c.categoryId.toString()).amount = c.amount;
        } else {
          analysis.sales.byCategory.push(c);
        }
      });
    }
    if (sales.totalIncome !== undefined) analysis.sales.totalIncome = sales.totalIncome;
    if (sales.todayIncome !== undefined) analysis.sales.todayIncome = sales.todayIncome;
  }
  if (visitors) analysis.visitors = { ...analysis.visitors.toObject(), ...visitors };

  await analysis.save();

  res.status(200).json({
    status: "success",
    message: "Analysis updated successfully",
    data: analysis,
  });
});

const deleteAnalysisById = asyncWrapper(async (req, res, next) => {
  const analysis = await Analysis.findById(req.params.id);
  if (!analysis) return next(new CustomError("Analysis not found", 404));

  await analysis.deleteOne();

  res.status(200).json({
    status: "success",
    message: "Analysis deleted successfully",
  });
});

module.exports = {
  createAnalysis,
  getAllAnalyses,
  getAnalysisById,
  updateAnalysisById,
  deleteAnalysisById,
};