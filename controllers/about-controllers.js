const asyncWrapper = require("../middlewares/async-wrapper");
const About = require("../models/about-model");
const CustomError = require("../utils/custom-error");
const httpStatusText = require("../utils/http-status-text");
const pagination = require("../utils/pagination");
const removeImage = require("../utils/remove-uploaded-image");

function normalizeValues(inputValues, oldValues = []) {
  if (!inputValues) return oldValues;
  if (Array.isArray(inputValues)) return inputValues;
  if (typeof inputValues === "string") return [...oldValues, inputValues];
  return oldValues;
}

const createAbout = asyncWrapper(async (req, res, next) => {
  let newAbout = { ...req.body };

  newAbout.image = req.file ? req.file.filename : "default-about.png";

  newAbout.values = normalizeValues(req.body.values, []);

  const isActiveCount = await About.countDocuments({isActive: true});
  if (!isActiveCount) newAbout.isActive = true;
  const about = await About.create(newAbout);

  res.status(201).json({ status: httpStatusText.SUCCESS, data: { about } });
});

const getAllAbout = asyncWrapper(async (req, res, next) => {
  let { data, page, limit, totalDocs, totalPages } = await pagination(
    req,
    About
  );
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    currentPage: page,
    limit,
    totalAbout: totalDocs,
    totalPages,
    data: { about: data },
  });
});

const getAboutById = asyncWrapper(async (req, res, next) => {
  const aboutId = req.params.id;
  const about = await About.findById(aboutId);
  if (!about) {
    return next(new CustomError("About not found", 404));
  }
  res.status(200).json({ status: httpStatusText.SUCCESS, data: { about } });
});

const updateAboutById = asyncWrapper(async (req, res, next) => {
  const aboutId = req.params.id;
  let updatedData = req.body;
  const oldAbout = await About.findById(aboutId);
  if (!oldAbout) {
    return next(new CustomError("About not found", 404));
  }

  if (req.file) {
    await removeImage("about", oldAbout.image);
    updatedData.image = req.file.filename;
  }

  updatedData.values = normalizeValues(req.body.values, oldAbout.values);

  if (updatedData.isActive) {
    await About.updateMany({ isActive: true }, { $set: { isActive: false } });
  }

  if(!updatedData.isActive && oldAbout.isActive){
    await About.updateOne({ isActive: false }, { $set: { isActive: true } });
  }

  const updatedAbout = await About.findByIdAndUpdate(aboutId, updatedData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { about: updatedAbout },
  });
});

const deleteAboutById = asyncWrapper(async (req, res, next) => {
  const aboutId = req.params.id;
  const deletedAbout = await About.findByIdAndDelete(aboutId);
  if (!deletedAbout) {
    return next(new CustomError("About not found", 404));
  }
  if (deletedAbout.isActive) {
    await About.updateOne({ isActive: false }, { $set: { isActive: true } });
  }
  if (deletedAbout.image !== "default-about.png") {
    await removeImage("about", deletedAbout.image);
  }
  res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { deletedAbout } });
});

module.exports = {
  createAbout,
  getAllAbout,
  getAboutById,
  updateAboutById,
  deleteAboutById,
};
