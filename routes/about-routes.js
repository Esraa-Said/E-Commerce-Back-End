const express = require("express");
const aboutControllers = require("../controllers/about-controllers");
const multerUpload = require("../middlewares/multer-upload-middleware");

const router = express.Router();

router.route('/').get(aboutControllers.getAllAbout).post(multerUpload.single('image'),  aboutControllers.createAbout);
router.route('/:id').get(aboutControllers.getAboutById).delete(aboutControllers.deleteAboutById).patch(multerUpload.single('image'),aboutControllers.updateAboutById);

module.exports = router;