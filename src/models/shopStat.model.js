import mongoose from 'mongoose';

const shopStatSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Types.ObjectId,
      ref: 'Shop',
      required: [true, 'A shop stat must belong to a shop']
    },
    yearlySalesTotal: { type: Number, default: 0 },
    yearlyTotalSoldUnits: { type: Number, default: 0 },
    year: Number,
    monthlyData: [
      {
        month: String,
        totalSales: Number,
        totalUnits: Number
      }
    ],
    dailyData: [
      {
        date: String,
        totalSales: Number,
        totalUnits: Number
      }
    ],
    ratingsQuantityPerRatingScore: {
      type: Map,
      of: Number
    }
  },
  { timestamps: true }
);

const ShopStat = mongoose.model('ShopStat', shopStatSchema);

export default ShopStat;
