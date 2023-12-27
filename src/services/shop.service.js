import { Shop, ShopRating, User } from '../models';
import apiFeatures from '../utils/apiFeatures';
import catchAsync from '../utils/catchAsync';
import { destroyFile, uploadFile } from '../utils/cloudinary';
import dataUri from '../utils/datauri';

export const createShop = catchAsync(async (userId, body, shopImage) => {
  if (shopImage === undefined || shopImage.length === 0) {
    return { type: 'Error', message: 'Please select images', statusCode: 400 };
  }

  const { name, address, description, phone } = body;

  if (!name || !address || !description || !phone) {
    return {
      type: 'Error',
      message: 'Please fill the required fields',
      statusCode: 400
    };
  }

  const folderName = `Shops/${name.trim().split(' ').join('')}`;

  const image = await uploadFile(dataUri(shopImage).content, folderName, 600);

  const shop = await Shop.create({
    name,
    address,
    phone,
    description,
    owner: userId,
    shopImage: image.secure_url,
    shopImageId: image.public_id
  });

  await ShopRating.create({
    shop: shop._id
  });

  const user = await User.findById(userId);

  const stats = await Shop.aggregate([
    {
      $match: { owner: userId }
    },
    {
      $group: { _id: '$owner', shopIds: { $push: '$_id' } }
    }
  ]);

  if (stats && stats.length !== 0) {
    user.shops = stats[0].shopIds;
  } else {
    user.shops = [];
  }

  if (user.role !== 'admin') {
    if (user.shops.length === 1) {
      user.defaultShop = user.shops[0];
      user.role = 'seller';
    }
  }

  user.save();

  return {
    type: 'Success',
    message: 'Shop is created successfully',
    statusCode: 201,
    shop
  };
});

export const queryShops = catchAsync(async (req) => {
  const shops = await apiFeatures(req, Shop);

  if (!shops) {
    return { type: 'Error', message: 'No shops are found', statusCode: 404 };
  }

  return {
    type: 'Success',
    message: 'Shops are found successfully',
    statusCode: 200,
    shops
  };
});

export const queryShop = catchAsync(async (shopId) => {
  const shop = await Shop.findById(shopId);

  if (!shop) {
    return {
      type: 'Error',
      message: 'shop is not found',
      statusCode: 404
    };
  }

  return {
    type: 'Success',
    message: 'Shop is found successfully',
    statusCode: 200,
    shop
  };
});

export const updateShopDetails = catchAsync(async (body, shopId) => {
  const { name, address, description, phone } = body;

  if (!name || !address || !description || !phone) {
    return {
      type: 'Error',
      message: 'Please fill the required fields',
      statusCode: 400
    };
  }

  const shop = await Shop.findById(shopId);

  if (!shop) {
    return {
      type: 'Error',
      message: 'Shop is not found',
      statusCode: 404
    };
  }

  const result = await Shop.findByIdAndUpdate(
    shopId,
    {
      name,
      description,
      address,
      phone
    },
    {
      new: true,
      runValidators: true
    }
  );

  return {
    type: 'Success',
    message: 'Shop is updated successfully',
    statusCode: 200,
    result
  };
});

export const updateShopMainImage = catchAsync(async (shopId, shopImage) => {
  const shop = await Shop.findById(shopId);

  if (!shop) {
    return {
      type: 'Error',
      message: 'Shop is not found',
      statusCode: 404
    };
  }

  destroyFile(shop.shopImageId);

  const folderName = `shop/${shop.name.trim().split(' ').join('')}`;

  const image = await uploadFile(dataUri(shopImage).content, folderName, 600);

  const shopBody = {
    shopImage: image.secure_url,
    shopImageId: image.public_id
  };

  await Shop.findByIdAndUpdate(shopId, shopBody, {
    new: true,
    runValidators: true
  });

  return {
    type: 'Success',
    message: 'Shop image is updated successfully',
    statusCode: 200
  };
});

export const deleteShop = catchAsync(async (userId, shopId) => {
  const shop = Shop.findById(shopId);

  if (!shop) {
    return {
      type: 'Error',
      message: 'Shop is not found',
      statusCode: 404
    };
  }

  const result = await Shop.findByIdAndDelete(shopId);

  const user = await User.findById(result.owner);

  const stats = await Shop.aggregate([
    {
      $match: { owner: userId }
    },
    {
      $group: { _id: '$owner', shopIds: { $push: '$_id' } }
    }
  ]);

  if (stats && stats.length !== 0) {
    user.shops = stats[0].shopIds;
  } else {
    user.shops = [];
  }

  if (user.role !== 'admin') {
    if (user.shops.length === 0) {
      user.defaultShop = null;
      user.role = 'user';
    } else if (user.shops.length >= 1) {
      if (user.defaultShop === shopId) {
        user.defaultShop = user.shops[0];
      }
    }
  }

  user.save();

  return {
    type: 'Success',
    message: 'Shop is deleted successfully',
    statusCode: 200
  };
});
