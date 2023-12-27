import mongoose from 'mongoose';

import toJSON from './plugins/index';
import Product from './product.model';

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    imageId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// categorySchema.plugin(toJSON);

categorySchema.index({ name: 1, image: 1 }, { unique: true });

categorySchema.pre('findOneAndDelete', async function (next) {
  const categoryProducts = await Product.find({
    category: this.getQuery()._id
  });

  categoryProducts.forEach(async (categoryProduct) => {
    await Product.findOneAndUpdate(
      { _id: categoryProduct._id },
      { $set: { category: '64df6a203bb08b6c3f1d7a8f' } }
    );
  });

  next();
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
