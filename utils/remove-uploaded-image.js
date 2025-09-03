const fs = require("fs").promises;
const path = require("path");
const CustomError = require("./custom-error");

const removeImage = async (foldername, fileName) => {
  try {
    if (foldername === "product") {
      fileName.forEach(async (file) => {
        let removedFile = path.join(
          __dirname,
          "..",
          "ECommerce-images",
          foldername,
          file.filename ? file.filename : file
        );
        await fs.access(removedFile).catch(() => null);
        await fs.unlink(removedFile).catch(() => null);
      });
    } else {
      let removedFile = path.join(
        __dirname,
        "..",
        "ECommerce-images",
        foldername,
        fileName
      );
      await fs.access(removedFile).catch(() => null);
      await fs.unlink(removedFile).catch(() => null);
    }
  } catch (err) {
    throw new CustomError(
      `Failed to delete uploaded file: ${err?.message}`,
      500
    );
  }
};

module.exports = removeImage;
