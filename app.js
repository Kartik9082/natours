const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const app = express();

// if (process.env.NODE_ENV === 'development') {
// }

app.use(morgan("dev"));
app.use(express.json());

app.use((req, res, next) => {
  console.log("Hello From the Middleware");

  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: '404 not found',
  //   message: `can't find${req.originalUrl} on the server`,
  // });

  // const err = new Error(`can't find${req.originalUrl} on the server`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`can't find${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
