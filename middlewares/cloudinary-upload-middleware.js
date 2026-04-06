const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

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
    } 

    return {
      folder,
      format: file.mimetype.split("/")[1],
      public_id: file.fieldname + "-" + Date.now(),
    };
  },
});

const upload = multer({ storage: cloudUpload });
module.exports = upload;