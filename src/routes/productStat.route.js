import express from 'express';

import { productStatController } from '../controllers';

import protect from '../middlewares/protect';

import isShopOwner from '../middlewares/isShopOwner';

const router = express.Router({ mergeParams: true });

router.use(protect);

router.get('/:year', isShopOwner, productStatController.getProductStatsByYear);

export default router;
