const slugify = require("slugify");
const asyncWrapper = require("../middlewares/async-wrapper");
const httpStatusText = require("../utils/http-status-text");
const Product = require("../models/product-model");
const SubCategory = require("../models/subcategory-model");
const CustomError = require("../utils/custom-error");
const pagination = require("../utils/pagination");
const removeImage = require("../utils/remove-uploaded-image");

// helper: parse variants safely
const parseVariants = (variants) => {

  if (typeof variants === "string") {
    try {
      return JSON.parse(variants);
    } catch {

      throw new CustomError("Invalid variants format", 400);
    }
  }
  return variants;
};

// helper: handle uploaded images
const handleImages = (files) =>
  files?.productImage?.map((img) => img.filename) || [];

const createProduct = asyncWrapper(async (req, res, next) => {
  const newProduct = { ...req.body };

  // validate subCategory
  const subCategory = await SubCategory.findById(newProduct.subCategoryId);
  if (!subCategory) {
    return next(new CustomError("Sub Category not found", 404));
  }
  newProduct.isActive = subCategory.isActive;

  // handle images
  newProduct.productImage = handleImages(req.files);

  // handle variants
  newProduct.variants = parseVariants(newProduct.variants);

  const product = await Product.create(newProduct);

  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { product } });
});

const getAllProduct = asyncWrapper(async (req, res) => {
  const { data, page, limit, totalDocs, totalPages } = await pagination(
    req,
    Product, 
    {...req.query},
    "subCategoryId"
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
  const product = await Product.findById(req.params.id, { __v: 0 }).populate(
    "subCategoryId"
  );

  if (!product) {
    return next(new CustomError("Product not found", 404));
  }

  res.status(200).json({ status: httpStatusText.SUCCESS, data: { product } });
});

const updateProductById = asyncWrapper(async (req, res, next) => {
  const productId = req.params.id;
  const updatedData = { ...req.body };
  delete updatedData.productImage; // prevent direct override

  const oldProduct = await Product.findById(productId);
  if (!oldProduct) {
    return next(new CustomError("Product not found", 404));
  }

  if (updatedData.subCategoryId) {
    const subcategory = await SubCategory.findById(updatedData.subCategoryId);
    if (!subcategory) {
      return next(
        new CustomError("Wrong sub category id, Sub Category not found", 400)
      );
    }
  }

  // update images if uploaded
  if (req.files?.productImage?.length) {
    await removeImage("product", oldProduct.productImage);
    updatedData.productImage = handleImages(req.files);
  }


  // update variants
  updatedData.variants = parseVariants(updatedData.variants);
  if (updatedData.variants) {
    updatedData.variants = [
      ...oldProduct.variants,
      ...updatedData.variants,
    ];
  }

  Object.assign(oldProduct, updatedData);
  const updatedProduct = await oldProduct.save();


  await updatedProduct.populate("subCategoryId", { __v: 0 });

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { product: updatedProduct },
  });
});

const deleteProductById = asyncWrapper(async (req, res, next) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);

  if (!deletedProduct) {
    return next(new CustomError("Product not found", 404));
  }

  await removeImage("product", deletedProduct.productImage);

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { product: deletedProduct },
  });
});

module.exports = {
  createProduct,
  getAllProduct,
  getProductById,
  updateProductById,
  deleteProductById,
};
