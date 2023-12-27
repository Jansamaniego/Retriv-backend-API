import express from 'express';

import { reviewController } from '../controllers';

import protect from '../middlewares/protect';

const router = express.Router({ mergeParams: true });

router.get('/', reviewController.getReviewsByProductId);

router.get('/:reviewId', reviewController.getReviewByReviewId);


router.use(protect);

router.post('/', reviewController.addReview);

router.patch('/:reviewId', reviewController.updateReview);

router.delete('/:reviewId', reviewController.deleteReview);

export default router;
