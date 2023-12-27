import { shopRatingService } from '../services';
import catchAsync from '../utils/catchAsync';

export const getShopRatings = catchAsync(async (req, res) => {
  const { type, message, statusCode, shopRatings } =
    await shopRatingService.queryShopRatings(req.params.shopId);

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message,
    shopRatings
  });
});
