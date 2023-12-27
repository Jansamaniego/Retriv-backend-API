import { ShopStat } from '../models';
import catchAsync from '../utils/catchAsync';

export const queryShopStatsByYear = catchAsync(async (shopId, year) => {
  const shopStats = await ShopStat.findOne({
    $and: [{ year: year }, { shop: shopId }]
  });

  if (!shopStats) {
    return {
      type: 'Error',
      message: 'Shop stats are not found',
      statusCode: 404
    };
  }

  return {
    type: 'Success',
    message: 'Shop stats are successfully found',
    statusCode: 200,
    shopStats
  };
});
