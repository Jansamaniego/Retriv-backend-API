import express from 'express';

import userRoute from './user.route';
import authRoute from './auth.route';
import shopRoute from './shop.route';
import productRoute from './product.route';
import cartRoute from './cart.route';
import orderRoute from './order.route';
import categoryRoute from './category.route';
import reviewRoute from './review.route';
import overallStatRoute from './overallStat.route';
import paymentIntentRoute from './paymentIntent.route';
import testRoute from './test.route';

const router = express.Router();

router.use('/user', userRoute);

router.use('/auth', authRoute);

router.use('/category', categoryRoute);

router.use('/shop', shopRoute);

router.use('/product', productRoute);

router.use('/review', reviewRoute);

router.use('/cart', cartRoute);

router.use('/order', orderRoute);

router.use('/overall-stats', overallStatRoute);

router.use('/payment-intent', paymentIntentRoute);

router.use('/test', testRoute);

export default router;
