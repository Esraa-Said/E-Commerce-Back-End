const fs = require("fs").promises;
const path = require("path");
const CustomError = require("./custom-error");

const removeImage = async (collectionName, fileName) => {
  try {
    await fs.unlink(
      path.join(__dirname, "..", "ECommerce", collectionName, fileName)
    );
  } catch (unlinkErr) {
    throw new CustomError(
      `Failed to delete uploaded file: ${unlinkErr?.message}`,
      500
    );
  }
};

module.exports = removeImage;
