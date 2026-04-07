const Country = require("../models/country-model");
const asyncWrapper = require("../utils/async-wrapper");
const CustomError = require("../utils/custom-error");
const httpStatusText = require("../utils/http-status-text");


const createCountry = asyncWrapper(async (req, res, next) => {
  const country = new Country(req.body);
  await country.save();

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    message: "Country created successfully",
    data: country,
  });
});

const getAllCountries = asyncWrapper(async (req, res, next) => {
  const countries = await Country.find();

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: countries,
  });
});

const getCountryById = asyncWrapper(async (req, res, next) => {
  const country = await Country.findById(req.params.id);

  if (!country) {
    return next(new CustomError("Country not found", 404));
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: country,
  });
});

const updateCountry = asyncWrapper(async (req, res, next) => {
  const country = await Country.findById(req.params.id);

  if (!country) {
    return next(new CustomError("Country not found", 404));
  }

  Object.assign(country, req.body);
  await country.save();

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Country updated successfully",
    data: country,
  });
});

const deleteCountry = asyncWrapper(async (req, res, next) => {
  const country = await Country.findById(req.params.id);

  if (!country) {
    return next(new CustomError("Country not found", 404));
  }

  await country.deleteOne();

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Country deleted successfully",
  });
});

module.exports = {
  createCountry,
  getAllCountries,
  getCountryById,
  updateCountry,
  deleteCountry,
};