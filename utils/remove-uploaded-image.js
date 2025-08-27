const fs = require("fs").promises;
const path = require("path");
const CustomError = require("./custom-error");

const removeImage = async (foldername, fileName) => {
  try {
    const filePath = path.join(
      __dirname,
      "..",
      "ECommerce-images",
      foldername,
      fileName
    );

    await fs.access(filePath).catch(() => null);

    await fs.unlink(filePath).catch(() => null);
  } catch (err) {
    throw new CustomError(
      `Failed to delete uploaded file: ${err?.message}`,
      500
    );
  }
};

module.exports = removeImage;
