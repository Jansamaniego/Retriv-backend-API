import express from 'express';

import reviewRoute from './review.route';

import productStatRoute from './productStat.route';

import productRatingRoute from './productRating.route';

import { productController } from '../controllers';

import { anyMulter, singleFile } from '../utils/multer';

import protect from '../middlewares/protect';

import isShopOwner from '../middlewares/isShopOwner';
import getLoggedInUser from '../middlewares/getLoggedInUser';

const router = express.Router({ mergeParams: true });

router.use('/:productId/review', reviewRoute);

router.use('/:productId/product-stats', productStatRoute);

router.use('/:productId/product-ratings', productRatingRoute);

router.get('/all', productController.getProductsByShopId);

router.get('/', getLoggedInUser, productController.getProducts);

router.get('/:productId', productController.getProduct);

router.use(protect);

router.post('/', isShopOwner, anyMulter(), productController.addProduct);

router.patch(
  '/:productId',
  isShopOwner,
  productController.updateProductDetails
);

router.patch(
  '/:productId/main-image',
  isShopOwner,
  singleFile('image'),
  productController.updateProductMainImage
);

router.patch(
  '/:productId/add-images',
  isShopOwner,
  anyMulter(),
  productController.addProductImages
);

router.patch(
  '/:productId/images',
  isShopOwner,
  anyMulter(),
  productController.updateProductImages
);

router.delete(
  '/:productId/images',
  isShopOwner,
  productController.deleteProductImage
);

router.delete('/:productId', isShopOwner, productController.deleteProduct);

export default router;
