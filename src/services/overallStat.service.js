import { OverallStat } from '../models';
import catchAsync from '../utils/catchAsync';

export const queryOverallStatsByYear = catchAsync(async (year) => {
  const overallStats = await OverallStat.findOne({ year: year });

  if (!overallStats) {
    return {
      type: 'Error',
      message: 'Overall stats are not found',
      statusCode: 404
    };
  }

  return {
    type: 'Success',
    message: 'Overall stats are successfully found',
    statusCode: 200,
    overallStats
  };
});
