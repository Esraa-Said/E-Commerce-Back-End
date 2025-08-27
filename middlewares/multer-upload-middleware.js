const multer = require("multer");
const fs = require("fs");
const CustomError = require("../utils/custom-error");

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "ECommerce-images";

    if (req.baseUrl.includes("category")) {
      folder = "ECommerce-images/category";
    } else if (req.baseUrl.includes("subcategory")) {
      folder = "ECommerce-images/subcategory";
    } else if (req.baseUrl.includes("product")) {
      folder = "ECommerce-images/product";
      
    } else if (req.baseUrl.includes("user")) {
      folder = "ECommerce-images/user";
    } else if (req.baseUrl.includes("about")) {
      folder = "ECommerce-images/about";
    }
    if (!fs.existsSync(folder)) {
      // if folder not exists, create it
      fs.mkdirSync(folder, { recursive: true });
    }
    cb(null, folder);
  },

  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    const name = `${file.fieldname}-${Date.now()}.${ext}`;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  const fileType = file.mimetype.split("/")[0];
  if (fileType === "image") {
    return cb(null, true);
  }
  cb(new CustomError("Only image files are allowed!", 400), false);
};

module.exports = multer({ storage: diskStorage, fileFilter });
