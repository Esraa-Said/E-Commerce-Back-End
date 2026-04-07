const Product = require("../models/product-model");
const asyncWrapper = require("../utils/async-wrapper");
const CustomError = require("../utils/custom-error");
const httpStatusText = require("../utils/http-status-text");
const pagination = require("../utils/pagination");
const removeImage = require("../utils/remove-uploaded-image");


// parse variants safely
const parseVariants = (variants) => {
  if (!variants) return [];
  if (typeof variants === "string") {
    try {
      return JSON.parse(variants);
    } catch {
      throw new CustomError("Invalid variants JSON format", 400);
    }
  }
  return variants;
};

// extract uploaded images
const extractImages = (files) =>
  files?.productImages?.map((img) => img.filename) || [];


const createProduct = asyncWrapper(async (req, res, next) => {
  if (!req.files?.productImages?.length) {
    return next(new CustomError("Product images are required", 400));
  }

  const product = new Product({
    ...req.body,
    variants: parseVariants(req.body.variants),
    productImages: extractImages(req.files),
  });

  await product.save();

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    message: "Product created successfully",
    data: product,
  });
});


const getAllProducts = asyncWrapper(async (req, res, next) => {
  const { data, page, limit, totalDocs, totalPages } = await pagination(
    req,
    Product,
    req.query,
    "categoryId"
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
  const product = await Product.findById(req.params.id).populate(
    "categoryId",
    "name categorySlug"
  );

  if (!product) {
    return next(new CustomError("Product not found", 404));
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { product },
  });
});


const updateProductById = asyncWrapper(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new CustomError("Product not found", 404));
  }

  Object.assign(product, req.body);

  if (req.body.variants) {
    product.variants = parseVariants(req.body.variants);
  }

  if (req.files?.productImages?.length) {
    await removeImage(product.productImages); 
    product.productImages = extractImages(req.files); 
  }

  await product.save();

  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Product updated successfully",
    data: product,
  });
});


const deleteProductById = asyncWrapper(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new CustomError("Product not found", 404));
  }

  await removeImage(product.productImages);

  await product.deleteOne();

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Product deleted successfully",
  });
});

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};