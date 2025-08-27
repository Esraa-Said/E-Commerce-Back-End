const slugify = require("slugify");
const asyncWrapper = require("../middlewares/async-wrapper");
const SubCategory = require("../models/subcategory-model");
const httpStatusText = require("../utils/http-status-text");
const pagination = require("../utils/pagination");
const CustomError = require("../utils/custom-error");
const Category = require("../models/category-model");
const removeImage = require("../utils/remove-uploaded-image");

const createSubCategory = asyncWrapper(async (req, res, next) => {
  let newSubCategory = { ...req.body };

  let category = await Category.findById(newSubCategory.categoryId);
  if (!category) {
    return next(new CustomError("Wrong category id, Category not found"));
  }

  newSubCategory.isActive = category.isActive; 

  newSubCategory.subCategorySlug = slugify(newSubCategory.name, {
    lower: true,
  });

  newSubCategory.image = req.file ? req.file.filename : undefined;

  const subcategory = await SubCategory.create({ ...newSubCategory });

  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { subcategory } });
});

const getAllSubCategory = asyncWrapper(async (req, res, next) => {
  let { data, page, limit, totalDocs, totalPages } = await pagination(
    req,
    SubCategory
  );
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    currentPage: page,
    limit,
    totalCategories: totalDocs,
    totalPages,
    data: { subcategories: data },
  });
});

const getSubCategoryById = asyncWrapper(async (req, res, next) => {
  const subcategoryId = req.params.id;

  let subcategory = await SubCategory.findById(subcategoryId, {
    __v: 0,
  }).populate("categoryId");

  if (!subcategory) {
    return next(new CustomError("Sub Category not found", 404));
  }

  res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { subcategory } });
});

const updateSubCategoryById = asyncWrapper(async (req, res, next) => {
  const subcategoryId = req.params.id;
  let updatedData = { ...req.body };
  delete updatedData.image;
  let oldSubCategory = await SubCategory.findById(subcategoryId);
  if (!oldSubCategory) {
    return next(new CustomError("Sub Category not found", 404));
  }

  if (updatedData.categoryId) {
    let category = await Category.findById(updatedData.categoryId);
    if (!category) {
      return next(new CustomError("Wrong category id, Category not found"));
    }
  }

  if (req.file) {
    await removeImage("subcategory", oldSubCategory.image);
    updatedData.image = req.file.filename;
  }

  if (updatedData.name) {
    updatedData.subCategorySlug = slugify(updatedData.name, {
      lower: true,
    });
  }
  let updatedSubCategory = await SubCategory.findByIdAndUpdate(
    subcategoryId,
    { ...updatedData },

    { new: true, runValidators: true }
  )
    .select({ __v: 0 })
    .populate("categoryId", { __v: 0 });

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { subcategory: updatedSubCategory },
  });
});

const deleteSubCategoryById = asyncWrapper(async (req, res, next) => {
  const deletedSubCategory = await SubCategory.findByIdAndDelete(req.params.id);

  if (!deletedSubCategory) {
    const error = new CustomError("Sub Category not found", 404);
    return next(error);
  }
  await removeImage("subcategory", deletedSubCategory.image);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { subcategory: deletedSubCategory },
  });
});

module.exports = {
  createSubCategory,
  getAllSubCategory,
  getSubCategoryById,
  updateSubCategoryById,
  deleteSubCategoryById,
};
