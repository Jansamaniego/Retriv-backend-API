import { reviewService } from '../services';
import catchAsync from '../utils/catchAsync';

export const addReview = catchAsync(async (req, res) => {
  const { type, message, statusCode, review } =
    await reviewService.createReview(
      req.user.id,
      req.body,
      req.params.productId,
      req.params.shopId
    );
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message,
    review
  });
});

export const getReviewsByProductId = catchAsync(async (req, res) => {
  const { type, statusCode, message, reviews } =
    await reviewService.queryReviewsByProductId(req);

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message,
    reviews
  });
});

export const getReviewByReviewId = catchAsync(async (req, res) => {
  const { type, message, statusCode, review } =
    await reviewService.queryReviewByReviewId(req.params.reviewId);

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message,
    review
  });
});

export const updateReview = catchAsync(async (req, res) => {
  const { type, statusCode, message, review } =
    await reviewService.updateReview(
      req.body,
      req.user.id,
      req.params.productId,
      req.params.reviewId
    );

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message,
    review
  });
});

export const deleteReview = catchAsync(async (req, res) => {
  const { type, statusCode, message, review } =
    await reviewService.deleteReview(
      req.user.id,
      req.params.productId,
      req.params.reviewId
    );

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message,
    review
  });
});
