import express from 'express';

import { orderController } from '../controllers';

import protect from '../middlewares/protect';

import restrictedTo from '../middlewares/restrictedTo';

const router = express.Router();

router.use(protect);

router.get('/', orderController.getOrders);

router.get('/:orderId', orderController.getOrder);

router.post('/', orderController.createOrder);

router.patch(
  '/:orderId',
  restrictedTo('admin'),
  orderController.updateOrderStatus
);

router.delete('/:orderId', orderController.cancelOrder);

export default router;
