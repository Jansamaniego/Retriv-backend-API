import mongoose from 'mongoose';

const productRatingSchema = mongoose.Schema(
  {
    product: mongoose.Types.ObjectId,
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
      of: Number
    }
  },
  { timestamps: true }
);

const ProductRating = mongoose.model('ProductRating', productRatingSchema);

export default ProductRating;
