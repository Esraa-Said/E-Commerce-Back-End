const Category = require("../models/category-model");
const asyncWrapper = require("../utils/async-wrapper");
const CustomError = require("../utils/custom-error");
const httpStatusText = require("../utils/http-status-text");
const slugify = require("slugify");
const removeImage = require("../utils/remove-uploaded-image");

const createCategory = asyncWrapper(async (req, res, next) => {
  const {
    name,
    description,
    parentCategory,
    discountPercentage,
    discountAmount,
  } = req.body;

  if (!req.file) {
    return next(new CustomError("Category image is required", 400));
  }

  // const image = {
  //   url: req.file.path,
  //   publicId: req.file.filename,
  // };
  const category = await Category.create({
    name,
    description,
    parentCategory: parentCategory || null,
    discountPercentage,
    discountAmount,
    image: req.file.filename,
  });

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    message: "Category created successfully",
    data: category,
  });
});

const getAllCategories = asyncWrapper(async (req, res, next) => {
  const { page = 1, limit = 10, active } = req.query;
  const filter = {};

  if (active !== undefined) {
    filter.isActive = active === "true";
  }

  const categories = await Category.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate("parentCategory", "name categorySlug");

  const total = await Category.countDocuments(filter);

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    results: categories.length,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    },
    data: categories,
  });
});

const getCategoryById = asyncWrapper(async (req, res, next) => {
  const category = await Category.findById(req.params.id).populate(
    "parentCategory",
    "name categorySlug",
  );

  if (!category) {
    return next(new CustomError("Category not found", 404));
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: category,
  });
});

const updateCategory = asyncWrapper(async (req, res, next) => {
  let category = await Category.findById(req.params.id);
  if (!category) {
    return next(new CustomError("Category not found", 404));
  }
  const updates = req.body;

  // Update slug if name changed
  if (updates.name) {
    updates.categorySlug = slugify(updates.name, { lower: true });
  }

  if (req.file) {
    await removeImage(category.image);

    updates.image = req.file.filename;
  }
  category = await Category.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).populate("parentCategory", "name categorySlug");

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Category updated successfully",
    data: category,
  });
});

const deleteCategory = asyncWrapper(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return next(new CustomError("Category not found", 404));
  }
  await removeImage(category.image);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Category deleted successfully",
  });
});

const toggleCategoryStatus = asyncWrapper(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new CustomError("Category not found", 404));
  }

  category.isActive = !category.isActive;
  await category.save();

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: `Category is now ${category.isActive ? "active" : "inactive"}`,
    data: category,
  });
});

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
};
