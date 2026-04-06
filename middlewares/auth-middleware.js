const asyncWrapper = require("../utils/async-wrapper");
const jsonwebtoken = require("jsonwebtoken");
const CustomError = require("../utils/custom-error");
const User = require("../models/user-model");


const verifyAuthToken = asyncWrapper(async (req, res, next) => {
  let token = req.headers.authorization;
  
  if (!token || !token.startsWith("Bearer ")) {
    return next(new CustomError("Unauthorized: No token provided", 401));
  }
  token = token.split(" ")[1];

  let decodedToken;
  try {
    decodedToken = jsonwebtoken.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(
        new CustomError("Session expired. Please log in again.", 401),
      );
    }
    if (err.name === "JsonWebTokenError") {
      return next(new CustomError("Invalid token. Please log in again.", 401));
    }
    return next(err);
  }

  const user = await User.findByPk(decodedToken.userId);
  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  req.user = { id: decodedToken.userId, email: decodedToken.email, name: user.name };

  next();
});

module.exports = verifyAuthToken;