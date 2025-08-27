const Category = require("../models/category-model");
const CustomError = require("../utils/custom-error");
const asyncWrapper = require("../middlewares/async-wrapper");
const httpStatusText = require("../utils/http-status-text");
const pagination = require("../utils/pagination");
const slugify = require("slugify");
const removeImage = require("../utils/remove-uploaded-image");
const SubCategory = require("../models/subcategory-model");

const createCategory = asyncWrapper(async (req, res, next) => {
  let newCategory = { ...req.body };

  newCategory.image = req.file ? req.file.filename : undefined;

  const category = await Category.create(newCategory);

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
  const categoryId = req.params.id;
  let oldCategory = await Category.findById(categoryId);
  if (!oldCategory) {
    const error = new CustomError("Category not found", 404);
    return next(error);
  }
  if (req.file) {
    await removeImage("category", oldCategory.image);
    updatedData.image = req.file.filename;
  }

  if (updatedData.name) {
    updatedData.categorySlug = slugify(updatedData.name, { lower: true });
  }

  if (
    updatedData.isActive !== undefined &&
    updatedData.isActive !== oldCategory.isActive
  ) {
    await SubCategory.updateMany(
      { categoryId },
      { $set: { isActive: updatedData.isActive } }
    );
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.id,
    updatedData ,
    { new: true, runValidators: true }
  );

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
  await removeImage("category", deletedCategory.image);

  await SubCategory.deleteMany({ categoryId: req.params.id });

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
