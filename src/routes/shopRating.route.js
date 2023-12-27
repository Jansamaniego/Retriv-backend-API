import express from 'express';

import { shopRatingController } from '../controllers';

const router = express.Router({ mergeParams: true });

router.get('/', shopRatingController.getShopRatings);

export default router;
