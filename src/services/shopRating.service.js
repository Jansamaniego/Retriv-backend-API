import { ShopRating } from '../models';
import catchAsync from '../utils/catchAsync';

export const queryShopRatings = catchAsync(async (shopId) => {
  const shopRatings = await ShopRating.findOne({ shop: shopId });

  return {
    type: 'Success',
    message: 'Shop ratings are successfully found',
    statusCode: 200,
    shopRatings
  };
});
