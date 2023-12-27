import express from 'express';

import productRoute from './product.route';

import shopStatRoute from './shopStat.route';

import shopRatingRoute from './shopRating.route';

import { shopController } from '../controllers';

import { singleFile } from '../utils/multer';

import protect from '../middlewares/protect';

import isShopOwner from '../middlewares/isShopOwner';

const router = express.Router({ mergeParams: true });

router.use('/:shopId/product', productRoute);

router.use('/:shopId/shop-stats', shopStatRoute);

router.use('/:shopId/shop-ratings', shopRatingRoute);

router.get('/', shopController.getShops);

router.get('/:shopId', shopController.getShopById);

router.use(protect);

router.post('/', singleFile('image'), shopController.addShop);

router.patch('/:shopId', isShopOwner, shopController.updateShopDetails);

router.patch(
  '/:shopId/shop-image',
  isShopOwner,
  singleFile('image'),
  shopController.updateShopImage
);

router.delete('/:shopId', isShopOwner, shopController.deleteShop);

export default router;
