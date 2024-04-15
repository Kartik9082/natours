const AppError = require("./../utils/appError");
const Review = require("./../models/reviewModel");
const catchAsync = require("./../utils/catchAsync");

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const review = await Review.find();

  res.status(200).json({
    status: "success",
    results: review.length,
    data: {
      review,
    },
  });
});

exports.createReview = async (req, res, next) => {
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      review: newReview,
    },
  });
};