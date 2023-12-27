import { Category, Product, Shop } from '../models';
import catchAsync from '../utils/catchAsync';
import { destroyFile, uploadFile } from '../utils/cloudinary';
import dataUri from '../utils/datauri';
import apiFeatures from '../utils/apiFeatures';
import mongoose from 'mongoose';

export const createProduct = catchAsync(async (user, body, imageFiles) => {
  const { name, price, description, quantityInStock, category } = body;

  let { quantitySold } = body;

  if (!quantitySold) quantitySold = 0;

  const { currentShop, id } = user;

  const mainImage = imageFiles.filter(
    (image) => image.fieldname === 'mainImage'
  );
  const images = imageFiles.filter((image) => image.fieldname === 'images');

  if (
    !name ||
    !price ||
    !description ||
    mainImage.length === 0 ||
    images.length === 0
  ) {
    return {
      type: 'Error',
      message: 'Please fill the required fields',
      statusCode: 400
    };
  }

  const folderName = `Products/${currentShop.name
    .trim()
    .split(' ')
    .join('')}/${name.trim().split(' ').join('')}`;

  const imagesPromises = images.map((image) =>
    uploadFile(dataUri(image).content, folderName)
  );

  const imagesResult = await Promise.all(imagesPromises);

  const imageResult = await uploadFile(
    dataUri(mainImage[0]).content,
    folderName
  );

  const imagesLink = [];
  const imagesIds = [];

  imagesResult.forEach((image) => {
    imagesLink.push(image.secure_url);
    imagesIds.push(image.public_id);
  });

  const product = await Product.create({
    mainImage: imageResult.secure_url,
    mainImageId: imageResult.public_id,
    images: imagesLink,
    imagesIds,
    name,
    description,
    price: Number(price),
    shop: currentShop.id,
    shopOwner: id,
    quantityInStock: Number(quantityInStock),
    quantitySold: Number(quantitySold),
    category: category.replaceAll('"', '')
  });

  await product.save();

  await Shop.findOneAndUpdate(
    { _id: currentShop._id },
    { productsQuantity: currentShop.productsQuantity + 1 },
    { new: true }
  );

  return {
    type: 'Success',
    message: 'Product is successfully created',
    statusCode: 201,
    product
  };
});

export const queryProducts = catchAsync(async (req) => {
  const products = await apiFeatures(req, Product);

  if (!products && products.length === 0) {
    return {
      type: 'Error',
      message: 'No products found',
      statusCode: 404
    };
  }

  return {
    type: 'Success',
    message: 'Products are found successfully',
    statusCode: 200,
    products
  };
});

export const queryProductsByShopId = catchAsync(
  async (shopId, pageParam, limitParam) => {
    let results = {};

    const page = pageParam * 1 || 1;
    const limit = limitParam * 1 || 30;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const shop = await Shop.findById(shopId);

    if (!shop) {
      return {
        type: 'Error',
        message: 'The shop that this product belonged to no longer exists',
        statusCode: 400
      };
    }

    const products = await Product.find({ shop: shopId });

    results.results = products.slice(startIndex, endIndex);

    results.totalPages = Math.ceil(products.length / limit);

    if (!products) {
      return {
        type: 'Error',
        message: `Products for shop with shop id: ${shopId} are not found`,
        statusCode: 404
      };
    }

    return {
      type: 'Success',
      message: `Products for shop with shop id: ${shopId} are successfully found`,
      statusCode: 200,
      results
    };
  }
);

export const queryProductsByCategoryId = catchAsync(
  async (categoryId, pageParam, limitParam) => {
    const page = pageParam * 1 || 1;
    const limit = limitParam * 1 || 30;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const category = await Category.findById(categoryId);

    if (!category) {
      return {
        type: 'Error',
        message: 'The category that this product belongs to does not exist',
        statusCode: 400
      };
    }

    const products = await Product.find({ category: categoryId });

    results.results = products.slice(startIndex, endIndex);

    results.totalPages = Math.ceil(products.length / limit);

    if (!products) {
      return {
        type: 'Error',
        message: `Products for shop with shop id: ${shopId} are not found`,
        statusCode: 404
      };
    }

    return {
      type: 'Success',
      message: `Products for shop with shop id: ${shopId} are successfully found`,
      statusCode: 200,
      results
    };
  }
);

export const queryProduct = catchAsync(async (shopId, productId) => {
  const shop = await Shop.findById(shopId);

  if (!shop) {
    return {
      type: 'Error',
      message: 'The shop that this product belonged to no longer exists',
      statusCode: 400
    };
  }

  const product = await Product.findById(productId);

  if (!product) {
    return {
      type: 'Error',
      message: `No product found`,
      statusCode: 404
    };
  }

  return {
    type: 'Success',
    message: 'Product found',
    statusCode: 200,
    product
  };
});

export const updateProductDetails = catchAsync(
  async (user, body, productId) => {
    const { name, price, description, quantityInStock } = body;

    const { currentShop } = user;

    let { quantitySold } = body;

    if (!quantitySold) quantitySold = 0;

    if (!name || !price || !description || !quantityInStock) {
      return {
        type: 'Error',
        message: 'Please fill the required fields',
        statusCode: 400
      };
    }

    const product = await Product.findById(productId);

    if (!product) {
      return {
        type: 'Error',
        message: 'Product is not found',
        statusCode: 404
      };
    }
    if (currentShop._id.toString() !== product.shop.toString()) {
      return {
        type: 'Error',
        message: 'The product does not belong to the current shop',
        statusCode: 403
      };
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, body, {
      new: true,
      runValidators: true
    });

    return {
      type: 'Success',
      message: 'Product was successfully updated',
      statusCode: 200,
      updatedProduct
    };
  }
);

export const updateProductMainImage = catchAsync(
  async (user, productMainImage, productId) => {
    const product = await Product.findById(productId);

    if (!product) {
      return {
        type: 'Error',
        message: 'Product is not found',
        statusCode: 404
      };
    }

    const { currentShop } = user;

    const { mainImageId, name, shop } = product;

    if (currentShop._id.toString() !== shop.toString()) {
      return {
        type: 'Error',
        message: 'The product does not belong to the current shop',
        statusCode: 403
      };
    }

    destroyFile(mainImageId);

    const folderName = `shop/${currentShop.name
      .trim()
      .split(' ')
      .join('')}/product/${name.trim().split(' ').join('')}`;

    const image = await uploadFile(
      dataUri(productMainImage).content,
      folderName,
      600
    );

    const productBody = {
      mainImage: image.secure_url,
      mainImageId: image.public_id
    };

    await Product.findByIdAndUpdate(productId, productBody, {
      new: true,
      runValidators: true
    });

    return {
      type: 'Sucess',
      message: 'Main image is successfully updated',
      statusCode: 200
    };
  }
);

export const updateProductImages = catchAsync(
  async (user, imageFiles, productId) => {
    if (imageFiles.length === 0) {
      return {
        type: 'Error',
        message: 'Please select images',
        statusCode: 400
      };
    }

    const { currentShop } = user;

    const product = await Product.findById(productId);

    if (!product) {
      return {
        type: 'Error',
        message: 'The product is not found',
        statusCode: 404
      };
    }

    if (currentShop._id.toString() !== product.shop.toString()) {
      return {
        type: 'Error',
        message: 'The product does not belong to the user',
        statusCode: 403
      };
    }

    const images = imageFiles.filter((image) => image.fieldname === 'images');

    const folderName = `shop/${currentShop.name
      .trim()
      .split(' ')
      .join('')}/product/${product.name.trim().split(' ').join('')}`;

    const imagesLinks = [];
    const imagesIds = [];

    const productImagesIds = product.imagesIds;

    productImagesIds.forEach((imageId) => {
      destroyFile(imageId);
    });

    const imagesPromises = images.map((image) =>
      uploadFile(dataUri(image).content, folderName, 600)
    );

    const imagesResult = await Promise.all(imagesPromises);

    imagesResult.forEach((image) => {
      imagesLinks.push(image.secure_url);
      imagesIds.push(image.public_id);
    });

    const productBody = {
      images: imagesLinks,
      imagesIds
    };

    await Product.findByIdAndUpdate(productId, productBody, {
      new: true,
      runValidators: true
    });

    return {
      type: 'Success',
      message: 'Sub images are sucessfully updated',
      statusCode: 200
    };
  }
);

export const includeProductImages = catchAsync(
  async (user, imageFiles, productId) => {
    if (imageFiles.length === 0) {
      return {
        type: 'Error',
        message: 'Please select images',
        statusCode: 400
      };
    }

    const { currentShop } = user;

    const product = await Product.findById(productId);

    if (!product) {
      return {
        type: 'Error',
        message: 'The product is not found',
        statusCode: 404
      };
    }

    if (currentShop._id.toString() !== product.shop.toString()) {
      return {
        type: 'Error',
        message: 'The product does not belong to the user',
        statusCode: 403
      };
    }

    const images = imageFiles.filter((image) => image.fieldname === 'images');

    if (images.length + product.images.length > 5) {
      return {
        type: 'Error',
        message: 'Sub images count limit of 5 is exceeded',
        statusCode: 400
      };
    }

    const folderName = `shop/${currentShop.name
      .trim()
      .split(' ')
      .join('')}/product/${product.name.trim().split(' ').join('')}`;

    const imagesLinks = [];
    const imagesIds = [];

    const imagesPromises = images.map((image) =>
      uploadFile(dataUri(image).content, folderName, 600)
    );

    const imagesResult = await Promise.all(imagesPromises);

    imagesResult.forEach((image) => {
      imagesLinks.push(image.secure_url);
      imagesIds.push(image.public_id);
    });

    const productBody = {
      images: [...imagesLinks, ...product.images],
      imagesIds: [...imagesIds, ...product.imagesIds]
    };

    await Product.findByIdAndUpdate(productId, productBody, {
      new: true,
      runValidators: true
    });

    return {
      type: 'Success',
      message: 'Sub image/s are sucessfully added',
      statusCode: 200
    };
  }
);

export const removeProductImage = catchAsync(
  async (user, imageToDelete, productId) => {
    const product = await Product.findById(productId);

    if (!product) {
      return {
        type: 'Error',
        message: `The product is not found`,
        statusCode: 404
      };
    }

    const { currentShop } = user;

    if (currentShop._id.toString() !== product.shop.toString()) {
      return {
        type: 'Error',
        message: 'The product does not belong to the current shop',
        statusCode: 403
      };
    }

    const { images, imagesIds } = product;

    const indexFound = images.findIndex((image) => image === imageToDelete);

    const [deletedImage] = images.splice(indexFound, 1);
    const [deletedImagesId] = imagesIds.splice(indexFound, 1);

    destroyFile(deletedImagesId);

    const productBody = {
      images,
      imagesIds
    };

    await Product.findByIdAndUpdate(productId, productBody, {
      new: true,
      runValidators: true
    });

    return {
      type: 'Success',
      message: 'Product image is successfully deleted',
      statusCode: 200
    };
  }
);

export const deleteProduct = catchAsync(async (user, productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    return {
      type: 'Error',
      message: `The product is not found`,
      statusCode: 404
    };
  }

  const { currentShop } = user;

  if (currentShop._id.toString() !== product.shop.toString()) {
    return {
      type: 'Error',
      message: 'The product does not belong to the current shop',
      statusCode: 403
    };
  }

  const { mainImage, mainImageId, images, imagesIds } = product;

  if (mainImage) {
    destroyFile(mainImageId);
  }

  if (images.length !== 0) {
    imagesIds.forEach((imageId) => {
      destroyFile(imageId);
    });
  }

  const deletedProduct = await Product.findByIdAndDelete(productId);

  if (!deletedProduct) {
    return {
      type: 'Error',
      message: 'Product deletion is unsuccessful',
      statusCode: 400
    };
  }

  const editedShop = await Shop.findOneAndUpdate(
    { _id: currentShop._id },
    { productsQuantity: currentShop.productsQuantity - 1 },
    { new: true }
  );

  return {
    type: 'Success',
    message: 'Product is successfully deleted',
    statusCode: 200
  };
});
