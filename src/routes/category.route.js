import express from 'express';

import { categoryController } from '../controllers';

import protect from '../middlewares/protect';

import { singleFile } from '../utils/multer';

const router = express.Router();

router.get('/', categoryController.getCategories);

router.get('/:categoryId', categoryController.getCategory);

router.use(protect);

router.post('/', singleFile('image'), categoryController.addCategory);

router.patch('/:categoryId', categoryController.updateCategoryDetails);

router.patch(
  '/:categoryId/image',
  singleFile('image'),
  categoryController.updateCategoryImage
);

router.delete('/:categoryId', categoryController.deleteCategory);

export default router;
