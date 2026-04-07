const express = require("express");
const CustomError = require("./utils/custom-error");
const connectDB = require("./config/db");
const authRouter = require("./routes/auth-routes");
const categoryRouter = require("./routes/category-routes");
const productRouter = require("./routes/product-routes");
const countryRouter = require("./routes/country-routes");
const userAddressRouter = require("./routes/user-address-routes");
const paymentRouter = require("./routes/payment-routes");
const cors = require("cors");
require("dotenv").config();
const globalErrorHandler = require("./middlewares/global-error-handler-middleware");

const app = express();

app.use(express.json());


app.use(cors({origin: process.env.CLIENT_URL}));




connectDB();

// Routers
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/auth", authRouter);
app.use("/user-address", userAddressRouter);
app.use("/country", countryRouter);
app.use("/payment", paymentRouter);



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
