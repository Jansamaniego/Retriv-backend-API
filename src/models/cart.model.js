import mongoose from 'mongoose';

import toJSON from './plugins';

const cartSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      match: [
        /[\w]+?@[\w]+?\.[a-z]{2,4}/,
        'The value of path {PATH} ({VALUE}) is not a valid email address.'
      ]
    },
    items: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        totalProductQuantity: {
          type: Number,
          required: true
        },
        totalProductPrice: {
          type: Number,
          required: true
        },
        shop: {
          type: mongoose.Types.ObjectId,
          ref: 'Shop',
          required: true
        },
        shopOwner: {
          type: mongoose.Types.ObjectId,
          ref: 'User',
          required: true
        },
        category: {
          type: mongoose.Types.ObjectId,
          ref: 'Category',
          required: true
        }
      }
    ],
    totalPrice: {
      type: Number,
      required: true
    },
    totalQuantity: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

cartSchema.plugin(toJSON);

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
