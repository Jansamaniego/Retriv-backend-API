import express from 'express';

import { userController } from '../controllers';

import shopRoute from './shop.route';

import { singleFile } from '../utils/multer';

import restrictedTo from '../middlewares/restrictedTo';

import protect from '../middlewares/protect';

const router = express.Router({ mergeParams: true });

router.use('/:userId/shop', shopRoute);

router.get('/', userController.getUsers);

router.get('/get-me', protect, userController.getMe);

router.get('/:userId', userController.getUser);

router.use(protect);

router.post(
  '/',
  restrictedTo('admin'),
  singleFile('image'),
  userController.createUser
);

router.patch('/update-details', userController.updateUserDetails);

router.patch('/update-default-shop/:shopId', userController.updateDefaultShop);

router.patch('/:userId', userController.updateUserDetailsAdmin);

router.patch(
  '/update-profile-image',
  singleFile('image'),
  userController.updateUserProfileImage
);

router.delete('/me', userController.deleteMyAccount);

router.delete('/:userId', restrictedTo('admin'), userController.deleteUser);

export default router;
