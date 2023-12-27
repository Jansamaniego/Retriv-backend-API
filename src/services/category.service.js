import catchAsync from '../utils/catchAsync';
import apiFeatures from '../utils/apiFeatures';
import dataUri from '../utils/datauri';
import { uploadFile, destroyFile } from '../utils/cloudinary';

import { Category } from '../models';

export const queryCategories = catchAsync(async (req) => {
  const categories = await apiFeatures(req, Category);

  if (!categories || categories.length === 0) {
    return {
      type: 'Error',
      message: 'No categories found',
      statusCode: 404
    };
  }

  return {
    type: 'Success',
    message: 'Categories are found successfully',
    statusCode: 200,
    categories
  };
});

export const queryCategory = catchAsync(async (categoryId) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    return {
      type: 'Error',
      message: 'The category is not found',
      statusCode: 404
    };
  }

  return {
    type: 'Success',
    message: 'Category is found',
    statusCode: 200,
    category
  };
});

export const createCategory = catchAsync(async (body, imageFile) => {
  if (imageFile === undefined || imageFile.length === 0) {
    return {
      type: 'Error',
      message: 'Please select an image',
      statusCode: 400
    };
  }

  const { name, description } = body;

  if (!name || !description) {
    return {
      type: 'Error',
      message: 'Please fill the required fields',
      statusCode: 400
    };
  }

  const folderName = `Categories/${name.trim('').split(' ').join('')}`;

  const image = await uploadFile(dataUri(imageFile).content, folderName, 240);

  const category = await Category.create({
    name,
    description,
    image: image.secure_url,
    imageId: image.public_id
  });

  return {
    type: 'Success',
    message: 'Category is created successfully',
    statusCode: 201,
    category
  };
});

export const updateCategoryDetails = catchAsync(async (categoryId, body) => {
  const { name, description } = body;

  if (!name || !description) {
    return {
      type: 'Error',
      message: 'Please fill the required fields',
      statusCode: 400
    };
  }

  const category = await Category.findByIdAndUpdate(
    categoryId,
    {
      name,
      description
    },
    { new: true, runValidators: true }
  );

  if (!category) {
    return {
      type: 'Error',
      message: 'Category is not found',
      statusCode: 404
    };
  }

  return {
    type: 'Success',
    message: 'Category is updated successfully',
    statusCode: 200,
    category
  };
});

export const updateCategoryImage = catchAsync(async (categoryId, imageFile) => {
  if (imageFile === undefined || imageFile.length === 0) {
    return {
      type: 'Error',
      message: 'Please select an image',
      statusCode: 400
    };
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    return {
      type: 'Error',
      message: 'Category is not found',
      statusCode: 404
    };
  }

  destroyFile(category.imageId);

  const folderName = `Categories/${category.name.trim('').split(' ').join('')}`;

  const image = await uploadFile(dataUri(imageFile).content, folderName, 600);

  await Category.findByIdAndUpdate(categoryId, {
    image: image.secure_url,
    imageId: image.public_id
  });

  return {
    type: 'Success',
    message: 'Category image is updated successfully',
    statusCode: 200
  };
});

export const deleteCategory = catchAsync(async (categoryId) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    return {
      type: 'Error',
      message: 'Category is not found',
      statusCode: 404
    };
  }

  destroyFile(category.imageId);

  await Category.findByIdAndDelete(categoryId);

  return {
    type: 'Success',
    message: 'Category is deleted successfully',
    statusCode: 200,
    category
  };
});
