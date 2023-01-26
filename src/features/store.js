import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import productsReducer from './products/productsSlice';
import commentsReducer from './comments/commentsSlice';
import cartReducer from './cart/cartSlice';
import { createLogger } from 'redux-logger';

const logger = createLogger();

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    comments: commentsReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
