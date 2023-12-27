import catchAsync from '../utils/catchAsync';

import { cartService } from '../services';

export const addProductToCart = catchAsync(async (req, res) => {
  const { type, statusCode, message, cart } = await cartService.addToCart(
    req.user.email,
    req.body.productId,
    Number(req.body.quantity)
  );

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message,
    cart
  });
});

export const increaseProductQuantityByOne = catchAsync(async (req, res) => {
  const { type, statusCode, message, cart } =
    await cartService.incrementProductQuantity(
      req.user.email,
      req.params.productId
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
    cart
  });
});

export const decreaseProductQuantityByOne = catchAsync(async (req, res) => {
  const { type, statusCode, message, cart } =
    await cartService.decrementProductQuantity(
      req.user.email,
      req.params.productId
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
    cart
  });
});

export const getCart = catchAsync(async (req, res) => {
  const { type, statusCode, message, cart } = await cartService.queryCart(
    req.user.email
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
    cart
  });
});

export const removeItemFromCart = catchAsync(async (req, res) => {
  const { type, statusCode, message, cart } =
    await cartService.removeItemFromCart(
      req.user.email,
      req.params.productId,
      req.body.cartItemIndex
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
    cart
  });
});

export const deleteCart = catchAsync(async (req, res) => {
  const { type, statusCode, message, cart } = await cartService.deleteCart(
    req.user.email
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
    cart
  });
});
