const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  console.log(message);
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  // const value = err.keyValue.name;
  if (
    err.keyValue.name
      ? (value = err.keyValue.name)
      : (value = err.keyValue.price)
  ) {
    // console.log(err);
    const message = `Duplicate field value: (${value}). please use another value`;
    return new AppError(message, 400);
  }
  //   console.log(err);

  // const message = `Duplicate field value: (${value}). please use another value`;

  // return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  console.log(errors);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  return new AppError("Invalid token. please log in again!", 401);
};

const handleJWTExpiredError = () => {
  return new AppError("Token has expired. please log in again!", 401);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // OPerational, trusted Error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // 1) Log error
    console.error("ERROR 💥", err);
    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went Wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log('Recieved ->', err);
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    // console.log('Sending error to prod', error);
    sendErrorProd(error, res);
  }
};
