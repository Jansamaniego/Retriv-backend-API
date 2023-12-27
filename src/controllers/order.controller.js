import catchAsync from '../utils/catchAsync';

import { orderService } from '../services';

export const createOrder = catchAsync(async (req, res) => {
  const { type, message, statusCode, order } = await orderService.createOrder(
    req.user,
    req.body
  );

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message,
    order
  });
});

export const updateOrderStatus = catchAsync(async (req, res) => {
  const { type, message, statusCode } = await orderService.updateOrderStatus(
    req.body.status,
    req.params.orderId
  );

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message
  });
});

export const getOrders = catchAsync(async (req, res) => {
  let { page, sort, limit, select } = req.query;

  if (!page) page = 1;
  if (!sort) sort = '';
  if (!limit) limit = 10;
  if (!select) select = '';

  const { type, message, statusCode, orders } = await orderService.queryOrders(
    req
  );

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message,
    orders
  });
});

export const getOrder = catchAsync(async (req, res) => {
  const { type, message, statusCode, order } = await orderService.queryOrder(
    req.params.orderId
  );

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message,
    order
  });
});

export const cancelOrder = catchAsync(async (req, res) => {
  const { type, message, statusCode, order } = await orderService.cancelOrder(
    req.params.orderId
  );

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message,
    order
  });
});
