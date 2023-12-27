import express from 'express';

import protect from '../middlewares/protect';

import { cartController } from '../controllers';

const router = express.Router();

router.use(protect);

router.post('/', cartController.addProductToCart);

router.get('/', cartController.getCart);

router.patch(
  '/increment-product/:productId',
  cartController.increaseProductQuantityByOne
);

router.patch(
  '/decrement-product/:productId',
  cartController.decreaseProductQuantityByOne
);

router.delete('/', cartController.deleteCart);

router.delete('/remove-product/:productId', cartController.removeItemFromCart);

export default router;
