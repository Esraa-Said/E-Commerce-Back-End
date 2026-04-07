const express = require("express");
const countryControllers = require("../controllers/country-controllers");

const router = express.Router();

router.post("/", countryControllers.createCountry);

router.get("/", countryControllers.getAllCountries);

router.get("/:id", countryControllers.getCountryById);

router.patch("/:id", countryControllers.updateCountry);

router.delete("/:id", countryControllers.deleteCountry);

module.exports = router;