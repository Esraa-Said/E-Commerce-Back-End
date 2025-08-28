const slugify = require("slugify");
const asyncWrapper = require("../middlewares/async-wrapper");
const httpStatusText = require("../utils/http-status-text");
const Product = require("../models/product-model");
const SubCategory = require("../models/subcategory-model");
const CustomError = require("../utils/custom-error");
const pagination = require("../utils/pagination");
const removeImage = require("../utils/remove-uploaded-image");

const createProduct = asyncWrapper(async (req, res, next) => {
  let newProduct = { ...req.body };

  let subCategory = await SubCategory.findById(newProduct.subCategoryId);
  if (!subCategory) {
    return next(new CustomError("Sub Category not found"));
  }
  newProduct.isActive = subCategory.isActive;

  newProduct.image = req.file ? req.file.filename : undefined;

  // Ensure size is an array
  newProduct.size = Array.isArray(newProduct.size) ? newProduct.size : [];

  // If a single size is provided (string), push it
  if (req.body.size && typeof req.body.size === "string") {
    newProduct.size.push(req.body.size);
  }

  const product = await Product.create(newProduct);

  res.status(201).json({ status: httpStatusText.SUCCESS, data: { product } });
});

const getAllProduct = asyncWrapper(async (req, res, next) => {
  let { data, page, limit, totalDocs, totalPages } = await pagination(
    req,
    Product
  );

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    currentPage: page,
    limit,
    totalProducts: totalDocs,
    totalPages,
    data: { products: data },
  });
});



const getProductById = asyncWrapper(async (req, res, next) => {
  const productId = req.params.id;

  let product = await Product.findById(productId, {
    __v: 0,
  }).populate("subCategoryId");

  if (!product) {
    return next(new CustomError("Product not found", 404));
  }

  res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { product } });
});



const updateProductById = asyncWrapper(async (req, res, next) => {
  const productId = req.params.id;
  let updatedData = { ...req.body };
  delete updatedData.image;
  let oldProduct = await Product.findById(productId);
  if (!oldProduct) {
    return next(new CustomError("Product not found", 404));
  }

  if (updatedData.subCategoryId) {
    let subcategory = await SubCategory.findById(updatedData.subCategoryId);
    if (!subcategory) {
      return next(new CustomError("Wrong sub category id, Sub Category not found"));
    }
  }

  if (req.file) {
    await removeImage("product", oldProduct.image);
    updatedData.image = req.file.filename;
  }

  if (updatedData.name) {
    updatedData.productSlug = slugify(updatedData.name, {
      lower: true,
    });
  }

    updatedData.size = Array.isArray(updatedData.size) ? updatedData.size : oldProduct.size;
    if(req.body.size && typeof (req.body.size === "string")){
      updatedData.size.push(req.body.size);
    }
  

  let updatedProduct = await Product.findByIdAndUpdate(
    productId,
    updatedData,

    { new: true, runValidators: true }
  )
    .select({ __v: 0 })
    .populate("subCategoryId", { __v: 0 });

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { product: updatedProduct },
  });
});


const deleteProductById = asyncWrapper(async (req, res, next) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);

  if (!deletedProduct) {
    const error = new CustomError("Product not found", 404);
    return next(error);
  }
  await removeImage("product", deletedProduct.image);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { product: deletedProduct },
  });
});


module.exports = { createProduct, getAllProduct, getProductById, updateProductById , deleteProductById};
