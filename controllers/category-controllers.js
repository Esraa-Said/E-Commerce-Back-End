const Category = require("../models/category-model");
const CustomError = require("../utils/custom-error");
const asyncWrapper = require("../middlewares/async-wrapper");
const httpStatusText = require("../utils/http-status-text");
const pagination = require("../utils/pagination");
const slugify = require("slugify");

const createCategory = asyncWrapper(async (req, res, next) => {
  let createdCategory = { ...req.body };
  createdCategory.categorySlug = slugify(createdCategory.name, { lower: true });

  createdCategory.image = req.file ? req.file.filename : null;

  const category = await Category.create({...createdCategory});

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: { category },
  });
});

const getAllCategory = asyncWrapper(async (req, res, next) => {
  const { data, page, limit, totalDocs, totalPages } = await pagination(
    req,
    Category
  );

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    currentPage: page,
    limit,
    totalCategories: totalDocs,
    totalPages,
    data: { categories: data },
  });
});

const getCategoryById = asyncWrapper(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    const error = new CustomError("Category not found", 404);
    return next(error);
  }

  res.status(200).json({ status: httpStatusText.SUCCESS, data: { category } });
});

const updateCategoryById = asyncWrapper(async (req, res, next) => {
  let updatedData = { ...req.body };
  delete updatedData.image;
  if (req.file) updatedData.image = req.file.filename;
  if (updatedData.name) {
    updatedData.categorySlug = slugify(updatedData.name, { lower: true });
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.id,
    {...updatedData},
    { new: true, runValidators: true }
  );
  if (!updatedCategory) {
    const error = new CustomError("Category not found", 404);
    return next(error);
  }
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { category: updatedCategory },
  });
});

const deleteCategoryById = asyncWrapper(async (req, res, next) => {
  const deletedCategory = await Category.findByIdAndDelete(req.params.id);
  if (!deletedCategory) {
    const error = new CustomError("Category not found", 404);
    return next(error);
  }
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { category: deletedCategory },
  });
});

module.exports = {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
