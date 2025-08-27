const { default: slugify } = require("slugify");
const asyncWrapper = require("../middlewares/async-wrapper");
const httpStatusText = require("../utils/http-status-text");
const Product = require("../models/product-model");

const createProduct = asyncWrapper(async (req, res, next) => {
  let newProduct = { ...req.body };
  newProduct.image = req.file ? req.file.filename : undefined;
  newProduct.productSlug = slugify(newProduct.name, { lower: true });

  const product = await Product.create({...newProduct});

  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { product } });
});

