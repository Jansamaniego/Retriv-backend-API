import { productService } from '../services';
import catchAsync from '../utils/catchAsync';

export const addProduct = catchAsync(async (req, res) => {
  const { type, message, statusCode, product } =
    await productService.createProduct(req.user, req.body, req.files);

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message,
    product
  });
});

export const getProducts = catchAsync(async (req, res) => {
  let { page, sort, limit, select } = req.query;

  if (!page) req.query.page = 1;
  if (!sort) req.query.sort = '-1';
  if (!limit) req.query.limit = 30;
  if (!select) req.query.select = '';

  const { type, message, statusCode, products } =
    await productService.queryProducts(req);

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message,
    products
  });
});

export const getProductsByShopId = catchAsync(async (req, res) => {
  const { type, message, statusCode, results } =
    await productService.queryProductsByShopId(
      req.params.shopId,
      req.query.page,
      req.query.limit
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
    results
  });
});

export const getProductsByCategoryId = catchAsync(async (req, res) => {
  const { type, message, statusCode, results } =
    await productService.queryProductsByCategoryId(
      req.params.categoryId,
      req.query.page,
      req.query.limit
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
    results
  });
});

export const getProduct = catchAsync(async (req, res) => {
  const { type, message, statusCode, product } =
    await productService.queryProduct(req.params.shopId, req.params.productId);

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message,
    product
  });
});

export const updateProductDetails = catchAsync(async (req, res) => {
  const { type, message, statusCode, product } =
    await productService.updateProductDetails(
      req.user,
      req.body,
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
    product
  });
});

export const updateProductMainImage = catchAsync(async (req, res) => {
  const { type, message, statusCode } =
    await productService.updateProductMainImage(
      req.user,
      req.file,
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
    message
  });
});

export const addProductImages = catchAsync(async (req, res) => {
  const { type, message, statusCode } =
    await productService.includeProductImages(
      req.user,
      req.files,
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
    message
  });
});

export const updateProductImages = catchAsync(async (req, res) => {
  const { type, message, statusCode } =
    await productService.updateProductImages(
      req.user,
      req.files,
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
    message
  });
});

export const deleteProductImage = catchAsync(async (req, res) => {
  const { type, message, statusCode } = await productService.removeProductImage(
    req.user,
    req.body.image,
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
    message
  });
});

export const deleteProduct = catchAsync(async (req, res) => {
  const { type, message, statusCode, product } =
    await productService.deleteProduct(req.user, req.params.productId);

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message,
    product
  });
});
