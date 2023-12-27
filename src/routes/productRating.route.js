import express from 'express';

import { productRatingController } from '../controllers';

const router = express.Router({ mergeParams: true });

router.get('/', productRatingController.getProductRatings);

export default router;
