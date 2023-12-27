import mongoose from 'mongoose';

const shopRatingSchema = mongoose.Schema(
  {
    shop: mongoose.Types.ObjectId,
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    ratingsQuantityPerRatingScore: {
      type: Map,
      of: Number,
      default: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
      }
    }
  },
  { timestamps: true }
);

const ShopRating = mongoose.model('ShopRating', shopRatingSchema);

export default ShopRating;
