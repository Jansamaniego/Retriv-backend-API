import STRIPE_SDK from 'stripe';
import moment from 'moment';

import catchAsync from '../utils/catchAsync';
import apiFeatures from '../utils/apiFeatures';

import config from '../config/config';

import { Order, Cart, Product } from '../models';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export const createOrder = catchAsync(async (user, body) => {
  const { shippingAddress, paymentMethod, phone, paymentIntent } = body;
  const { address, country, postalCode } = shippingAddress;

  if (!address || !postalCode || !country || !paymentMethod || !phone) {
    return {
      type: 'Error',
      message: 'Please fill the required fields',
      statusCode: 400
    };
  }

  const cart = await Cart.findOne({ email: user.email });
  if (!cart || cart.items.length === 0) {
    return {
      type: 'Error',
      message: 'Cart is not found',
      statusCode: 404
    };
  }

  if (paymentMethod === 'cash') {
    const order = await Order.create({
      products: cart.items,
      user: user.id,
      totalPrice: cart.totalPrice,
      totalQuantity: cart.totalQuantity,
      shippingAddress,
      paymentMethod,
      phone
    });

    for (const item of cart.items) {
      const { product, totalProductQuantity } = item;
      
      const fetchedProduct = await Product.findById(product);

      const quantitySold = fetchedProduct.quantitySold + totalProductQuantity;

      const quantityInStock =
        fetchedProduct.quantityInStock - totalProductQuantity;

      await Product.findByIdAndUpdate(product, {
        quantitySold,
        quantityInStock
      });
    }

    await Cart.findByIdAndDelete(cart._id);

    return {
      type: 'Success',
      message: 'Order is created successfully',
      statusCode: 201,
      order
    };
  }

  const order = await Order.create({
    products: cart.items,
    user: user._id,
    totalPrice: cart.totalPrice,
    totalQuantity: cart.totalQuantity,
    isPaid: true,
    paidAt: moment(),
    shippingAddress,
    paymentMethod,
    paymentIntent,
    phone
  });

  for (const item of cart.items) {
    const id = item.product;
    const { totalProductQuantity } = item;
    const product = await Product.findById(id);
    const sold = product.quantitySold + totalProductQuantity;
    const quantityInStock = product.quantityInStock - totalProductQuantity;
    await Product.findByIdAndUpdate(id, { sold, quantityInStock });
  }

  await Cart.findByIdAndDelete(cart._id);

  await user.save();

  return {
    type: 'Success',
    message: 'successfulOrderCreate',
    statusCode: 201,
    order
  };
});

export const updateOrderStatus = catchAsync(async (status, id) => {
  if (!status) {
    return {
      type: 'Error',
      message: 'Please fill the required fields',
      statusCode: 400
    };
  }

  if (
    ![
      'Not Processed',
      'Processing',
      'Shipped',
      'Out for Delivery',
      'Delivered',
      'Cancelled'
    ].includes(status)
  ) {
    return {
      type: 'Error',
      message: 'Status is not valid',
      statusCode: 400
    };
  }

  const order = await Order.findById(id);

  if (!order) {
    return {
      type: 'Error',
      message: 'Order is not found',
      statusCode: 404
    };
  }

  if (status === 'Cancelled') {
    for (const item of order.products) {
      const product = await Product.findById(item.product);

      if (!product) {
        return {
          type: 'Error',
          message: 'noProductFound',
          statusCode: 404
        };
      }

      await Product.findByIdAndUpdate(item.product, {
        quantityInStock: product.quantityInStock + item.totalProductQuantity,
        quantitySold: product.quantitySold - item.totalProductQuantity
      });
    }

    await Order.findByIdAndDelete(id);

    return {
      type: 'Success',
      message: 'Order is cancelled successfully',
      statusCode: 200
    };
  }

  order.status = status;

  await order.save();

  return {
    type: 'Success',
    message: 'Order status is updated successfully',
    statusCode: 200
  };
});

export const queryOrders = catchAsync(async (req) => {
  const orders = await apiFeatures(req, Order, 'user');

  if (!orders) {
    return {
      type: 'Error',
      message: 'Orders are not found',
      statusCode: 404
    };
  }

  return {
    type: 'Success',
    message: 'Orders are found',
    statusCode: 200,
    orders
  };
});

export const queryOrder = catchAsync(async (id) => {
  const order = await Order.findById(id).populate('user');

  if (!order) {
    return {
      type: 'Error',
      message: 'Order is not found',
      statusCode: 404
    };
  }

  return {
    type: 'Success',
    message: 'Order is found',
    statusCode: 200,
    order
  };
});

export const cancelOrder = catchAsync(async (id) => {
  const order = await Order.findById(id);

  if (!order) {
    return {
      type: 'Error',
      message: 'Order is not found',
      statusCode: 404
    };
  }

  for (const item of order.products) {
    const product = await Product.findById(item.product);
    if (!product) {
      return {
        type: 'Error',
        message: 'Product is not found',
        statusCode: 404
      };
    }

    await Product.findByIdAndUpdate(product._id, {
      quantitySold: product.quantitySold - item.totalProductQuantity,
      quantityInStock: product.quantityInStock + item.totalProductQuantity
    });
  }

  const deletedOrder = await Order.findByIdAndDelete(id);

  return {
    type: 'Success',
    message: 'Order is cancelled successfully',
    statusCode: 200,
    deletedOrder
  };
});
