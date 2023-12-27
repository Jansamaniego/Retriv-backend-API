import { shopStatService } from '../services';
import catchAsync from '../utils/catchAsync';

export const getShopStatsByYear = catchAsync(async (req, res) => {
  const { type, message, statusCode, shopStats } =
    await shopStatService.queryShopStatsByYear(
      req.params.shopId,
      req.params.year
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
    shopStats
  });
});
