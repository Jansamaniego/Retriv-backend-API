import { Review, Product } from '../models';
import catchAsync from '../utils/catchAsync';
import apiFeatures from '../utils/apiFeatures';

export const createReview = catchAsync(
  async (userId, body, productId, shopId) => {
    const { reviewText, rating } = body;

    if (!reviewText) {
      return {
        type: 'Error',
        message: 'A review must have a review text',
        statusCode: 400
      };
    }

    if (!rating) {
      return {
        type: 'Error',
        message: 'A review must have a rating',
        statusCode: 400
      };
    }

    if (rating < 1) {
      return {
        type: 'Error',
        message: 'ratingLessThanOne',
        statusCode: 400
      };
    }

    const hasUserReviewedTheProduct = await Review.find({ userId, productId });

    if (hasUserReviewedTheProduct && hasUserReviewedTheProduct.length !== 0) {
      return {
        type: 'Error',
        message: 'User has already reviewed the product',
        statusCode: 400
      };
    }

    const review = await Review.create({
      user: userId,
      product: productId,
      shop: shopId,
      rating,
      reviewText
    });

    if (!review) {
      return {
        type: 'Error',
        message: 'Creating the review has failed',
        statusCode: 400
      };
    }

    return {
      type: 'Success',
      message: 'Review created successfully',
      statusCode: 201,
      review
    };
  }
);

export const queryReviewsByProductId = catchAsync(async (req) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    return { type: 'Error', message: 'No product found', statusCode: 404 };
  }

  let reviews = await apiFeatures(req, Review);

  if (reviews.results.length === 0) {
    return {
      type: 'Success',
      message: 'No reviews found',
      statusCode: 204
    };
  }

  reviews.results = reviews.results.filter(
    (review) => review.product.toString() === req.params.productId.toString()
  );

  return {
    type: 'Successs',
    message: 'Reviews for the product are found successfully',
    statusCode: 200,
    reviews
  };
});

export const queryReviewByReviewId = catchAsync(async (reviewId) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    return { type: 'Error', message: 'Review is not found', statusCode: 404 };
  }

  return {
    type: 'Success',
    message: 'Review is found sucessfully',
    statusCode: 200,
    review
  };
});

export const updateReview = catchAsync(
  async (body, userId, productId, reviewId) => {
    const { reviewText, rating } = body;

    if (!reviewText) {
      return {
        type: 'Error',
        message: 'A review must have a review text',
        statusCode: 400
      };
    }

    if (!rating) {
      return {
        type: 'Error',
        message: 'A review must have a rating',
        statusCode: 400
      };
    }

    const product = await Product.findById(productId);

    if (!product) {
      return {
        type: 'Error',
        message: 'Product is not found',
        statusCode: 404
      };
    }

    const review = await Review.findById(reviewId);

    if (review.user.id !== userId) {
      return {
        type: 'Error',
        message: 'The review does not belong to the user',
        statusCode: 401
      };
    }

    if (rating < 1) {
      return {
        type: 'Error',
        message: 'ratingLessThanOne',
        statusCode: 400
      };
    }

    const result = await Review.findByIdAndUpdate(
      reviewId,
      {
        rating,
        reviewText
      },
      {
        new: true,
        runValidators: true
      }
    );

    return {
      type: 'Success',
      message: 'Review is updated successfully',
      statusCode: 200,
      result
    };
  }
);

export const deleteReview = catchAsync(async (userId, productId, reviewId) => {
  const product = await Product.findById(productId);

  if (!product) {
    return {
      type: 'Error',
      message: 'Product is not found',
      statusCode: 404
    };
  }

  const review = await Review.findById(reviewId);

  if (!review) {
    return {
      type: 'Error',
      message: 'Review is not found',
      statusCode: 404
    };
  }

  if (review.user.id !== userId) {
    return {
      type: 'Error',
      message: 'Review does not belong to the user',
      statusCode: 401
    };
  }

  await Review.findByIdAndDelete(reviewId);

  return {
    type: 'Success',
    message: 'Review is deleted successfully',
    statusCode: 200
  };
});
