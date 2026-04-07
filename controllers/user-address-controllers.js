const UserAddress = require("../models/user-address-model");
const asyncWrapper = require("../utils/async-wrapper");
const CustomError = require("../utils/custom-error");
const httpStatusText = require("../utils/http-status-text");


const createUserAddress = asyncWrapper(async (req, res, next) => {
  const address = new UserAddress({
    userId: req.body.userId,
    unitNumber: req.body.unitNumber,
    streetNumber: req.body.streetNumber,
    addressLine: req.body.addressLine,
    city: req.body.city,
    region: req.body.region,
    postalCode: req.body.postalCode,
    countryId: req.body.countryId,
    isDefault: req.body.isDefault || false,
  });

  await address.save();

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    message: "Address created successfully",
    data: address,
  });
});


const getUserAddresses = asyncWrapper(async (req, res, next) => {
  const userId = req.params.userId;
  const addresses = await UserAddress.find({ userId }).populate("countryId", "name countryCode flag");

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: addresses,
  });
});

const getUserAddressById = asyncWrapper(async (req, res, next) => {
  const address = await UserAddress.findById(req.params.id).populate("countryId", "name countryCode flag");

  if (!address) {
    return next(new CustomError("Address not found", 404));
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: address,
  });
});

const updateUserAddress = asyncWrapper(async (req, res, next) => {
  const address = await UserAddress.findById(req.params.id);

  if (!address) {
    return next(new CustomError("Address not found", 404));
  }

  Object.assign(address, req.body);

  await address.save(); 

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Address updated successfully",
    data: address,
  });
});

const deleteUserAddress = asyncWrapper(async (req, res, next) => {
  const address = await UserAddress.findById(req.params.id);

  if (!address) {
    return next(new CustomError("Address not found", 404));
  }

  await address.deleteOne();

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Address deleted successfully",
  });
});

module.exports = {
  createUserAddress,
  getUserAddresses,
  getUserAddressById,
  updateUserAddress,
  deleteUserAddress,
};