import catchAsync from '../utils/catchAsync';
import { categoryService } from '../services';

export const addCategory = catchAsync(async (req, res) => {
  const { type, statusCode, message, category } =
    await categoryService.createCategory(req.body, req.file);

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message,
    category
  });
});

export const getCategories = catchAsync(async (req, res) => {
  let { page, sort, limit, select } = req.query;

  if (!page) page = 1;
  if (!sort) sort = '';
  if (!limit) limit = 10;
  if (!select) select = '';

  const { type, statusCode, message, categories } =
    await categoryService.queryCategories(req);

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message,
    categories
  });
});

export const getCategory = catchAsync(async (req, res) => {
  const { type, statusCode, message, category } =
    await categoryService.queryCategory(req.params.categoryId);

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message,
    category
  });
});

export const updateCategoryDetails = catchAsync(async (req, res) => {
  const { type, statusCode, message, category } =
    await categoryService.updateCategoryDetails(
      req.params.categoryId,
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
    category
  });
});

export const updateCategoryImage = catchAsync(async (req, res) => {
  const { type, statusCode, message } =
    await categoryService.updateCategoryImage(req.params.categoryId, req.file);

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

export const deleteCategory = catchAsync(async (req, res) => {
  const { type, statusCode, message, category } =
    await categoryService.deleteCategory(req.params.categoryId);

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message,
    category
  });
});
