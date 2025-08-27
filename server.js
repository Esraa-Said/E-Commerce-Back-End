const express = require("express");
const path = require("path");
const CustomError = require("./utils/custom-error");
const connectDB = require("./config/db");
const categoryRouter = require("./routes/category-routes");
const subcategoryRouter = require("./routes/sub-category-routes");
const globalErrorHandler = require("./middlewares/global-error-handler-middleware");

const app = express();
require("dotenv").config();

connectDB();

// Routers
app.use("/category", categoryRouter);
app.use("/subcategory", subcategoryRouter);



// view images
// category + subcategory
app.use('/ECommerceImages/category', express.static(path.join(__dirname, 'ECommerce-images', 'category')));
app.use('/ECommerceImages/subcategory', express.static(path.join(__dirname, 'ECommerce-images', 'subcategory')));

// Unknown Route
app.all(/.*/,(req, res, next) => {
  const error = new CustomError(
    `Can't find ${req.originalUrl} on the server`,
    404
  );
  next(error);
});

// Global Error Middleware handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
