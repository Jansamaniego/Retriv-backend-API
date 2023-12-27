import mongoose from 'mongoose';
import slugify from 'slugify';
import toJSON from './plugins';
import { User, Product } from '../models';

const shopSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A shop must have a name']
    },
    address: {
      type: String,
      required: [true, 'A shop must have an address']
    },
    phone: {
      type: Number,
      required: [true, 'A shop must have a phone number']
    },
    slug: String,
    shopImage: {
      type: String,
      required: [true, 'A shop must have an image']
    },
    shopImageId: {
      type: String
    },
    description: {
      type: String,
      required: [true, 'A shop must have a description']
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'A shop must have an owner']
    },
    dateCreated: Date,
    productsQuantity: { type: Number, default: 0 },
    totalUnitsSold: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

shopSchema.plugin(toJSON);

shopSchema.index({ name: 1 }, { unique: true });
shopSchema.index({ avgProductRating: -1 });

shopSchema.virtual('products', {
  ref: 'Product',
  foreignField: 'shop',
  localField: '_id'
});

shopSchema.pre('save', async function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.dateCreated = Date.now();
  next();
});

shopSchema.post('save', async function () {
  // await this.constructor.addShopsToUser(this.owner);
  // await this.constructor.setDefaultShopAndRole(this.owner);
});

shopSchema.pre(/^find/, async function (next) {
  this.populate({
    path: 'owner',
    select: 'username firstName lastName email profileImage'
  });
  next();
});

shopSchema.pre('findOneAndDelete', async function (next) {
  const shopProducts = await Product.find({ shop: this.getQuery()._id });

  shopProducts.forEach(async (shopProduct) => {
    await Product.findOneAndDelete({ _id: shopProduct._id });
  });

  next();
});

const Shop = mongoose.model('Shop', shopSchema);

export default Shop;
