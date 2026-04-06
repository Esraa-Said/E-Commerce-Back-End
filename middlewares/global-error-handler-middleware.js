const CustomError = require("../utils/custom-error");
const httpStatusText = require("../utils/http-status-text");
const removeImage = require("../utils/remove-uploaded-image");

// -------------------------
// 1) Mongoose Error Handlers
// -------------------------
const castErrorHandler = (err) =>
  new CustomError(`Invalid value for ${err.path}: ${err.value}`, 400);

const duplicateKeyErrorHandler = (err) =>
  new CustomError(
    `'${Object.values(err.keyValue)[0]}' already exists.`,
    400
  );

const validationErrorHandler = (err) => {
  const message = Object.values(err.errors)
    .map((e) => e.message)
    .join(". ");
  return new CustomError(`Invalid input: ${message}`, 400);
};

// -------------------------
// 2) Dev & Prod Responses
// -------------------------
const sendDevError = (res, err) => {
  const statusCode = Number(err.statusCode) || 500;
  const status = err.status || httpStatusText.ERROR;

  res.status(statusCode).json({
    status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendProdError = (res, err) => {
  const statusCode = Number(err.statusCode) || 500;
  const status = err.status || httpStatusText.ERROR;

  // Operational errors
  if (err.isOperationalError) {
    return res.status(statusCode).json({
      status,
      message: err.message,
    });
  }

  // Unknown or programming errors
  return res.status(500).json({
    status: httpStatusText.ERROR,
    message: "Something went wrong!",
  });
};

// -------------------------
// 3) Clean Uploaded Images
// -------------------------
const cleanupUploadedFiles = async (req) => {
  // Single file
  if (req.file?.filename) {
    await removeImage(req.file.filename);
  }

  // Multiple files
  if (req.files) {
    for (const key of Object.keys(req.files)) {
      for (const file of req.files[key]) {
        await removeImage(file.filename);
      }
    }
  }
};

// -------------------------
// 4) Global Error Handler
// -------------------------
const errorHandler = async (err, req, res, next) => {
  err.statusCode = Number(err.statusCode) || 500;
  err.status = err.status || httpStatusText.ERROR;

  // Cleanup any uploaded images (Cloudinary)
  try {
    await cleanupUploadedFiles(req);
  } catch (cleanupErr) {
    console.error("Cleanup error:", cleanupErr.message);
  }

  // Transform mongoose errors ONLY in production
  if (process.env.NODE_ENV === "production") {
    if (err.name === "CastError") err = castErrorHandler(err);
    if (err.name === "ValidationError") err = validationErrorHandler(err);
    if (err.code === 11000) err = duplicateKeyErrorHandler(err);
  }

  // Respond based on mode
  if (process.env.NODE_ENV === "development") {
    return sendDevError(res, err);
  }

  sendProdError(res, err);
};

module.exports = errorHandler;