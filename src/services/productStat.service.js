import { ProductStat, Shop } from '../models';
import catchAsync from '../utils/catchAsync';

export const queryProductStatsByYear = catchAsync(
  async (shopId, productId, year) => {
    const shop = await Shop.findById(shopId);

    if (!shop) {
      return {
        type: 'Error',
        message: 'The shop that this product belonged to no longer exists',
        statusCode: 400
      };
    }

    const productStats = await ProductStat.findOne({
      $and: [{ year: year }, { product: productId }]
    });

    if (!productStats) {
      return {
        type: 'Error',
        message: 'Product stats are not found',
        statusCode: 404
      };
    }

    return {
      type: 'Success',
      message: 'Product stats are successfully found',
      statusCode: 200,
      productStats
    };
  }
);
