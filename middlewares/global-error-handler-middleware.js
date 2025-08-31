const CustomError = require("../utils/custom-error");
const httpStatusText = require("../utils/http-status-text");
const removeImage = require("../utils/remove-uploaded-image");

const castErrorHandler = (err) => {
  const msg = `Invalid value for ${err.path}: ${err.value}.`;
  return new CustomError(msg, 400);
};

const duplicateKeyErrorHandler = (err) => {
  const name = err.keyValue.name;
  const msg = `The value '${name}' already exists. Please choose another one.`;
  return new CustomError(msg, 400);
};

const validationErrorHandler = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  const errorMessages = errors.join(". ");
  const msg = `Invalid input data ${errorMessages}.`;
  return new CustomError(msg, 400);
};

const devErrors = (res, error) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};

const prodErrors = (res, error) => {
  if (error.isOperationalError) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: httpStatusText.ERROR,
      message: "Something went wrong! Please try again later.",
    });
  }
};

const errorHandler = async (err, req, res, next) => {
  try {
    // one image
    if (req.file?.filename) {
      if (req.baseUrl.includes("category")) {
        await removeImage("category", req.file.filename);
      } else if (req.baseUrl.includes("subcategory")) {
        await removeImage("subcategory", req.file.filename);
      } else if (req.baseUrl.includes("user")) {
        await removeImage("user", req.file.filename);
      } else if (req.baseUrl.includes("about")) {
        await removeImage("about", req.file.filename);
      }
    }

    // product images
    if(req.files?.productImage) {
      await removeImage("product", req.files.productImage);
    }


  } catch (cleanupErr) {
    console.error("Error cleaning up uploaded files:", cleanupErr.message);
  }
  err.statusCode = err.statusCode || 500;
  err.status = err.status || httpStatusText.ERROR;
  err.message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV === "development") {
    devErrors(res, err);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "CastError") {
      err = castErrorHandler(err);
    }
    if (err.name === "ValidationError") {
      err = validationErrorHandler(err);
    }
    if (err.code === 11000) {
      err = duplicateKeyErrorHandler(err);
    }
    prodErrors(res, err);
  }
};

module.exports = errorHandler;
