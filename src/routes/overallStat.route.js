import express from 'express';

import { overallStatController } from '../controllers';

import protect from '../middlewares/protect';

import restrictedTo from '../middlewares/restrictedTo';

const router = express.Router();

router.use(protect);

router.get(
  '/:year',
  restrictedTo('admin'),
  overallStatController.getOverallStatsByYear
);

export default router;
