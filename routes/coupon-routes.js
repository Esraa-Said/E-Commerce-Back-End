const express = require("express");
const couponControllers = require("../controllers/coupon-controllers");

const router = express.Router();

router
  .route("/")
  .get(couponControllers.getAllCoupons)
  .post(couponControllers.createCoupon);

router
  .route("/:id")
  .get(couponControllers.getCouponById)
  .patch(couponControllers.updateCouponById)
  .delete(couponControllers.deleteCouponById);

module.exports = router;