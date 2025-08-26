const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const CustomError = require("../utils/custom-error");

const cloudUpload = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "E-Commerce";

    if (req.baseUrl.includes("category")) {
      folder = "E-Commerce/category";
    } else if (req.baseUrl.includes("product")) {
      folder = "E-Commerce/product";
    } else if (req.baseUrl.includes("user")) {
      folder = "E-Commerce/user";
    } else if (req.baseUrl.includes("about")) {
      folder = "E-Commerce/about";
    }

    return {
      folder,
      format: file.mimetype.split("/")[1],
      public_id: file.fieldname + "-" + Date.now(),
    };
  },
});

module.exports = upload;
