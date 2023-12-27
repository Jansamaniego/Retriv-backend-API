import mongoose from 'mongoose';

import { Review, Shop } from '../models';

import slugify from 'slugify';

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A product must have a name'],
      trim: true
    },
    slug: String,
    price: {
      type: Number,
      required: [true, 'A product must have a price']
    },
    mainImage: {
      type: String,
      required: [true, 'A product must have an image']
    },
    mainImageId: String,
    images: {
      type: [String],
      required: [true, 'A product must have sub images']
    },
    imagesIds: [String],
    description: {
      type: String,
      required: [true, 'A product must have a description']
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
      required: [true, 'A product must have a category']
    },
    shop: {
      type: mongoose.Types.ObjectId,
      ref: 'Shop',
      required: [true, 'A product must belong to a shop']
    },
    shopOwner: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'A product must belong to a user']
    },
    quantityInStock: {
      type: Number,
      required: [true, 'Please input the number of units currently in stock']
    },
    quantitySold: {
      type: Number,
      default: 0
    }
  },
  {
    timeStamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

productSchema.index({ name: 1 }, { unique: true });
productSchema.index({ price: 1, ratingsAverage: -1 });
productSchema.index({ slug: 1 });

productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id'
});

productSchema.virtual('isOutOfStock').get(function () {
  return !this.quantityInStock;
});


productSchema.pre('save', async function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

productSchema.pre('findOneAndDelete', async function (next) {
  await Review.deleteMany({ product: this.getQuery()._id });
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;
