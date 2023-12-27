import { productStatService } from '../services';
import catchAsync from '../utils/catchAsync';

export const getProductStatsByYear = catchAsync(async (req, res) => {
  const { type, message, statusCode, productStats } =
    await productStatService.queryProductStatsByYear(
      req.params.shopId,
      req.params.productId,
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
    productStats
  });
});
