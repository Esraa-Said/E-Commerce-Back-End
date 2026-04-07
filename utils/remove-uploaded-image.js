const CustomError = require("./custom-error");
const cloudinary = require("../config/cloudinary");

const removeImage = async (publicId) => {
  try {
    // ----------------------
    // Cloudinary image
    // ----------------------
    if (publicId && !Array.isArray(publicId)) {
      await cloudinary.uploader.destroy(publicId);
      return;
    } else if(Array.isArray(publicId)){
      for (const id of publicId) {
        await cloudinary.uploader.destroy(id);
      }
    }
  } catch (err) {
    throw new CustomError(
      `Failed to delete uploaded file: ${err?.message}`,
      500,
    );
  }
};

module.exports = removeImage;
