import { ProductRating, Shop } from '../models';
import catchAsync from '../utils/catchAsync';

export const queryProductRatings = catchAsync(async (shopId, productId) => {
  const shop = await Shop.findById(shopId);

  if (!shop) {
    return {
      type: 'Error',
      message: 'The shop that this product belonged to no longer exists',
      statusCode: 400
    };
  }

  const productRatings = await ProductRating.findOne({ product: productId });

  if (!productRatings) {
    return {
      type: 'Success',
      message: 'No product ratings found',
      statusCode: 204
    };
  }

  return {
    type: 'Success',
    message: 'Product ratings are successfully found',
    statusCode: 200,
    productRatings
  };
});
