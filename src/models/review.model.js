import mongoose from 'mongoose';
import ProductRating from './productRating.model';
import ShopRating from './shopRating.model';
import toJSON from './plugins';

const reviewSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
      required: [true, 'A review must belong to a product']
    },
    shop: {
      type: mongoose.Types.ObjectId,
      ref: 'Shop',
      required: [true, 'A product must belong to a shop']
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'A review must belong to a user']
    },
    reviewText: {
      type: String,
      required: [true, 'A review must have a text']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'A review must have a rating']
    }
  },
  { timestamps: true }
);

reviewSchema.plugin(toJSON);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.index({ rating: -1 });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName profileImage profileImageId'
  });
  next();
});

reviewSchema.statics.calcProductRatings = async function (productId) {
  const ratingsQuantityAndAverage = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  const ratingsQuantityPerRatingScore = await this.aggregate([
    {
      $match: { product: productId }
    },
    {
      $group: {
        _id: '$rating',
        ratingsQuantity: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  let formattedRatingsQuantityPerRatingScore;

  if (
    ratingsQuantityPerRatingScore &&
    ratingsQuantityPerRatingScore.length !== 0
  ) {
    formattedRatingsQuantityPerRatingScore =
      ratingsQuantityPerRatingScore.reduce((acc, { _id, ratingsQuantity }) => {
        acc[_id] = ratingsQuantity;
        return acc;
      }, {});
  }

  if (ratingsQuantityAndAverage && ratingsQuantityAndAverage.length !== 0) {
    const productRatings = await ProductRating.findOneAndUpdate(
      { product: productId },
      {
        $set: {
          ratingsQuantity: ratingsQuantityAndAverage[0].nRating,
          ratingsAverage: ratingsQuantityAndAverage[0].avgRating,
          ratingsQuantityPerRatingScore: formattedRatingsQuantityPerRatingScore
        }
      },
      { upsert: true, new: true }
    );
  } else {
    console.log('review model product rating fucked');
  }
};

reviewSchema.statics.calcShopRatings = async function (shopId) {
  const ratingsQuantityAndAverage = await this.aggregate([
    {
      $match: { shop: shopId }
    },
    {
      $group: {
        _id: '$shop',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  const ratingsQuantityPerRatingScore = await this.aggregate([
    {
      $match: { shop: shopId }
    },
    {
      $group: {
        _id: '$rating',
        ratingsQuantity: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  let formattedRatingsQuantityPerRatingScore;

  if (
    ratingsQuantityPerRatingScore &&
    ratingsQuantityPerRatingScore.length !== 0
  ) {
    formattedRatingsQuantityPerRatingScore =
      ratingsQuantityPerRatingScore.reduce((acc, { _id, ratingsQuantity }) => {
        acc[_id] = ratingsQuantity;
        return acc;
      }, {});
  }

  if (ratingsQuantityAndAverage && ratingsQuantityAndAverage.length !== 0) {
    const shopRatings = await ShopRating.findOneAndUpdate(
      { shop: shopId },
      {
        $set: {
          ratingsQuantity: ratingsQuantityAndAverage[0].nRating,
          ratingsAverage: ratingsQuantityAndAverage[0].avgRating,
          ratingsQuantityPerRatingScore: formattedRatingsQuantityPerRatingScore
        }
      },
      { upsert: true, new: true }
    );
  }
};

reviewSchema.pre('save', async function (next) {
  await this.constructor.calcProductRatings(this.product);
  await this.constructor.calcShopRatings(this.shop);
  next();
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
