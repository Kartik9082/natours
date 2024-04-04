const AppError = require("../utils/appError");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  //1) Create a error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password update. Please use /updateMyPassword",
        400,
      ),
    );
  }
  //2) Filtered Out unwanted fields names that are not allowed to be updated
  const filterBody = filterObj(req.body, "name", "email");

  //2) update the document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: {
      user: null,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "500 Internal Server Error",
    message: "This route is not yet Defined",
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: "500 Internal Server Error",
    message: "This route is not yet Defined",
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "500 Internal Server Error",
    message: "This route is not yet Defined",
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "500 Internal Server Error",
    message: "This route is not yet Defined",
  });
};
