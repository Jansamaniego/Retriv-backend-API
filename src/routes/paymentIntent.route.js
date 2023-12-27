import express from 'express';

import { paymentIntentController } from '../controllers';

import protect from '../middlewares/protect';

import restrictedTo from '../middlewares/restrictedTo';

const router = express.Router();

router.use(protect);

router.get(
  '/',
  restrictedTo('admin'),
  paymentIntentController.getPaymentIntents
);

router.get('/:paymentIntentId', paymentIntentController.getPaymentIntent);

router.post('/', paymentIntentController.createPaymentIntent);

router.post('/:paymentIntentId', paymentIntentController.confirmPayment);

router.patch(
  '/cancel-all-payments',
  paymentIntentController.cancelPaymentIntents
);

router.patch('/:paymentIntentId', paymentIntentController.cancelPaymentIntent);

export default router;
