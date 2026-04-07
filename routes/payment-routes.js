const express = require("express");
const paymentControllers = require("../controllers/payment-controllers");
const checkDocumentsExistMiddleware = require("../middlewares/check-documents-exist-middleware");
const User = require("../models/user-model");

const router = express.Router();

router.post(
  "/",
  checkDocumentsExistMiddleware({ userId: User }),
  paymentControllers.createPayment
);

router.get("/", paymentControllers.getAllPayments);

router.get("/:id", paymentControllers.getPaymentById);

router.patch("/:id", paymentControllers.updatePaymentById);

router.delete("/:id", paymentControllers.deletePaymentById);

module.exports = router;