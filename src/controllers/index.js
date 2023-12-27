import {
  createUser,
  getUsers,
  getUser,
  updateUserDetails,
  updateUserDetailsAdmin,
  updateUserProfileImage,
  deleteUser,
  deleteMyAccount,
  getMe,
  updateDefaultShop
} from './user.controller';

import {
  signUp,
  signIn,
  signOut,
  refreshTokens,
  forgotPassword,
  resetPassword,
  changePassword,
  sendEmailVerification,
  verifyEmail,
  googleSignIn,
  googleCallback
} from './auth.controller';

import {
  addProduct,
  getProducts,
  getProductsByShopId,
  getProductsByCategoryId,
  getProduct,
  updateProductDetails,
  updateProductMainImage,
  addProductImages,
  updateProductImages,
  deleteProductImage,
  deleteProduct
} from './product.controller';

import {
  addReview,
  getReviewsByProductId,
  getReviewByReviewId,
  updateReview,
  deleteReview
} from './review.controller';

import {
  addShop,
  getShops,
  getShopById,
  updateShopDetails,
  updateShopImage,
  deleteShop
} from './shop.controller';

import {
  addCategory,
  getCategories,
  getCategory,
  updateCategoryDetails,
  updateCategoryImage,
  deleteCategory
} from './category.controller';

import {
  addProductToCart,
  increaseProductQuantityByOne,
  decreaseProductQuantityByOne,
  getCart,
  removeItemFromCart,
  deleteCart
} from './cart.controller';

import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder
} from './order.controller';

import {
  createPaymentIntent,
  confirmPayment,
  getPaymentIntents,
  getPaymentIntent,
  cancelPaymentIntents,
  cancelPaymentIntent
} from './paymentIntent.controller';

import { getOverallStatsByYear } from './overallStat.controller';

import { getShopStatsByYear } from './shopStat.controller';

import { getProductStatsByYear } from './productStat.controller';

import { getShopRatings } from './shopRating.controller';

import { getProductRatings } from './productRating.controller';

const userController = {
  createUser,
  getUsers,
  getUser,
  updateUserDetails,
  updateUserDetailsAdmin,
  updateUserProfileImage,
  deleteUser,
  deleteMyAccount,
  getMe,
  updateDefaultShop
};

const authController = {
  signUp,
  signIn,
  signOut,
  refreshTokens,
  forgotPassword,
  resetPassword,
  changePassword,
  sendEmailVerification,
  verifyEmail,
  googleSignIn,
  googleCallback
};

const productController = {
  addProduct,
  getProducts,
  getProductsByShopId,
  getProductsByCategoryId,
  getProduct,
  updateProductDetails,
  updateProductMainImage,
  addProductImages,
  updateProductImages,
  deleteProductImage,
  deleteProduct
};

const reviewController = {
  addReview,
  getReviewsByProductId,
  getReviewByReviewId,
  updateReview,
  deleteReview
};

const shopController = {
  addShop,
  getShops,
  getShopById,
  updateShopDetails,
  updateShopImage,
  deleteShop
};

const categoryController = {
  addCategory,
  getCategories,
  getCategory,
  updateCategoryDetails,
  updateCategoryImage,
  deleteCategory
};

const cartController = {
  addProductToCart,
  increaseProductQuantityByOne,
  decreaseProductQuantityByOne,
  getCart,
  removeItemFromCart,
  deleteCart
};

const orderController = {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder
};

const paymentIntentController = {
  createPaymentIntent,
  confirmPayment,
  getPaymentIntents,
  getPaymentIntent,
  cancelPaymentIntents,
  cancelPaymentIntent
};

const overallStatController = {
  getOverallStatsByYear
};

const shopStatController = {
  getShopStatsByYear
};

const productStatController = {
  getProductStatsByYear
};

const shopRatingController = {
  getShopRatings
};

const productRatingController = {
  getProductRatings
};

export {
  userController,
  authController,
  productController,
  reviewController,
  shopController,
  categoryController,
  cartController,
  orderController,
  paymentIntentController,
  overallStatController,
  shopStatController,
  productStatController,
  shopRatingController,
  productRatingController
};
