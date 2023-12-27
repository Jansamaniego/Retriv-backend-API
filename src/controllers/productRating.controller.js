import { productRatingService } from '../services';
import catchAsync from '../utils/catchAsync';

export const getProductRatings = catchAsync(async (req, res) => {
  const { type, message, statusCode, productRatings } =
    await productRatingService.queryProductRatings(
      req.params.shopId,
      req.params.productId
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
    productRatings
  });
});
