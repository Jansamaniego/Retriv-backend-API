import express from 'express';

import { authController } from '../controllers';

import { singleFile } from '../utils/multer';

import protect from '../middlewares/protect';

const router = express.Router();

router.post('/login', authController.signIn);

router.post('/register', singleFile('image'), authController.signUp);

router.get('/logout', authController.signOut);

router.get('/google/url', authController.googleSignIn);

router.get('/google/callback', authController.googleCallback);

router.post('/tokens', authController.refreshTokens);

router.post('/forgot-password', authController.forgotPassword);

router.post('/reset-password', authController.resetPassword);

router.use(protect);

router.post('/verify-email', authController.verifyEmail);

router.post('/send-verification-email', authController.sendEmailVerification);

router.patch('/change-password', authController.changePassword);

export default router;
