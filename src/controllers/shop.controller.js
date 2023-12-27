import { shopService } from '../services';
import catchAsync from '../utils/catchAsync';

export const addShop = catchAsync(async (req, res) => {
  const { type, statusCode, message, shop } = await shopService.createShop(
    req.user._id,
    req.body,
    req.file
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
    shop
  });
});

export const getShops = catchAsync(async (req, res) => {
  let { page, sort, limit, select } = req.query;

  if (!page) page = 1;
  if (!sort) sort = '';
  if (!limit) limit = 10;
  if (!select) select = '';

  const { type, statusCode, message, shops } = await shopService.queryShops(
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
    shops
  });
});

export const getShopById = catchAsync(async (req, res) => {
  const { type, statusCode, message, shop } = await shopService.queryShop(
    req.params.shopId
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
    shop
  });
});

export const updateShopDetails = catchAsync(async (req, res) => {
  const { type, statusCode, message, shop } =
    await shopService.updateShopDetails(req.body, req.params.shopId);

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message,
    shop
  });
});

export const updateShopImage = catchAsync(async (req, res) => {
  const { type, statusCode, message } = await shopService.updateShopMainImage(
    req.params.shopId,
    req.file
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

export const deleteShop = catchAsync(async (req, res) => {
  const { type, statusCode, message, shop } = await shopService.deleteShop(
    req.user.id,
    req.params.shopId
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
    shop
  });
});
