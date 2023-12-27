import AppError from '../utils/appError';

import { Shop } from '../models';

const isShopOwner = async (req, res, next) => {
  if (req.params.shopId) {
    const currentShop = req.user.shops.find(
      (shopId) => shopId.toString() === req.params.shopId
    );

    if (currentShop === undefined || currentShop.length === 0) {
      req.user.currentShop = undefined;
      return next(
        new AppError('Shop does not belong to the current user', 403)
      );
    }

    req.user.currentShop = await Shop.findById(currentShop);
    next();
  }
};

export default isShopOwner;
