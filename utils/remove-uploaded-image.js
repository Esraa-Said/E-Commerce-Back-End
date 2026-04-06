
const CustomError = require("./custom-error");
const cloudinary = require("../config/cloudinary"); 

const removeImage = async (publicId) => {
  try {
    // ----------------------
    // Cloudinary image
    // ----------------------
    if (publicId ) {
      
      
      await cloudinary.uploader.destroy(publicId);
      return;
    }

   
  } catch (err) {
    throw new CustomError(
      `Failed to delete uploaded file: ${err?.message}`,
      500
    );
  }
};

module.exports = removeImage;