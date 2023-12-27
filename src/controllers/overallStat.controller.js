import catchAsync from '../utils/catchAsync';
import { overallStatService } from '../services';

export const getOverallStatsByYear = catchAsync(async (req, res) => {
  const { type, message, statusCode, overallStats } =
    await overallStatService.queryOverallStatsByYear(req.params.year);

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message,
    overallStats
  });
});
