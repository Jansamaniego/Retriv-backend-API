import {
  createUser,
  queryUsers,
  queryUser,
  updateUserDetails,
  updateUserDetailsAdmin,
  deleteUser,
  deleteMyAccount,
  updateUserProfileImage,
  setDefaultShop
} from './user.service';

import {
  signUp,
  signIn,
  signOut,
  refreshAuth,
  changePassword,
  resetPassword,
  verifyEmail,
  googleSignInCallback
} from './auth.service';

import {
  createProduct,
  queryProducts,
  queryProductsByShopId,
  queryProductsByCategoryId,
  queryProduct,
  updateProductDetails,
  updateProductMainImage,
  includeProductImages,
  updateProductImages,
  removeProductImage,
  deleteProduct
} from './product.service';

import {
  createReview,
  queryReviewsByProductId,
  queryReviewByReviewId,
  updateReview,
  deleteReview
} from './review.service';

import {
  createShop,
  queryShops,
  queryShop,
  updateShopDetails,
  updateShopMainImage,
  deleteShop
} from './shop.service';

import {
  createCategory,
  queryCategories,
  queryCategory,
  updateCategoryDetails,
  updateCategoryImage,
  deleteCategory
} from './category.service';

import {
  addToCart,
  incrementProductQuantity,
  decrementProductQuantity,
  queryCart,
  removeItemFromCart,
  deleteCart
} from './cart.service';

import {
  createOrder,
  queryOrders,
  queryOrder,
  updateOrderStatus,
  cancelOrder
} from './order.service';

import {
  generatePaymentIntent,
  confirmPaymentIntent,
  queryPaymentIntents,
  queryPaymentIntent,
  dropPaymentIntent,
  dropPaymentIntents
} from './paymentIntent.service';

import { queryOverallStatsByYear } from './overallStat.service';

import { queryShopStatsByYear } from './shopStat.service';

import { queryProductStatsByYear } from './productStat.service';

import { queryShopRatings } from './shopRating.service';

import { queryProductRatings } from './productRating.service';

const userService = {
  createUser,
  queryUsers,
  queryUser,
  updateUserDetails,
  updateUserDetailsAdmin,
  deleteUser,
  deleteMyAccount,
  updateUserProfileImage,
  setDefaultShop
};

const authService = {
  signUp,
  signIn,
  signOut,
  refreshAuth,
  changePassword,
  resetPassword,
  verifyEmail,
  googleSignInCallback
};

const productService = {
  createProduct,
  queryProducts,
  queryProduct,
  queryProductsByShopId,
  queryProductsByCategoryId,
  updateProductDetails,
  updateProductMainImage,
  includeProductImages,
  updateProductImages,
  removeProductImage,
  deleteProduct
};

const reviewService = {
  createReview,
  queryReviewsByProductId,
  queryReviewByReviewId,
  updateReview,
  deleteReview
};

const shopService = {
  createShop,
  queryShops,
  queryShop,
  updateShopDetails,
  updateShopMainImage,
  deleteShop
};

const categoryService = {
  createCategory,
  queryCategories,
  queryCategory,
  updateCategoryDetails,
  updateCategoryImage,
  deleteCategory
};

const cartService = {
  addToCart,
  incrementProductQuantity,
  decrementProductQuantity,
  queryCart,
  removeItemFromCart,
  deleteCart
};

const orderService = {
  createOrder,
  queryOrders,
  queryOrder,
  updateOrderStatus,
  cancelOrder
};

const paymentIntentService = {
  generatePaymentIntent,
  confirmPaymentIntent,
  queryPaymentIntents,
  queryPaymentIntent,
  dropPaymentIntents,
  dropPaymentIntent
};

const overallStatService = {
  queryOverallStatsByYear
};

const shopStatService = {
  queryShopStatsByYear
};

const productStatService = {
  queryProductStatsByYear
};

const shopRatingService = {
  queryShopRatings
};

const productRatingService = {
  queryProductRatings
};

export {
  userService,
  authService,
  productService,
  reviewService,
  shopService,
  categoryService,
  cartService,
  orderService,
  paymentIntentService,
  overallStatService,
  shopStatService,
  productStatService,
  productRatingService,
  shopRatingService
};
