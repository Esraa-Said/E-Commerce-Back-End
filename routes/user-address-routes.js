const express = require("express");
const userAddressControllers = require("../controllers/user-address-controllers");
const checkDocumentsExistMiddleware = require("../middlewares/check-documents-exist-middleware");
const User = require("../models/user-model");
const Country = require("../models/country-model");

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  checkDocumentsExistMiddleware({ userId: User, countryId: Country }),
  userAddressControllers.createUserAddress
);

router.get("/", userAddressControllers.getUserAddresses);

router.get("/:id", userAddressControllers.getUserAddressById);

router.patch(
  "/:id",
  checkDocumentsExistMiddleware({ countryId: Country }),
  userAddressControllers.updateUserAddress
);

router.delete("/:id", userAddressControllers.deleteUserAddress);

module.exports = router;