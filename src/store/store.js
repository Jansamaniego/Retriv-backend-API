import { configureStore } from '@reduxjs/toolkit';
import { compose, applyMiddleware, createStore } from 'redux';
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import { userReducer } from './user/userReducer';
import { productsReducer } from './product/productReducer';
import { rootReducer } from './rootReducer';

const middleWares = [
  process.env.NODE_ENV === 'development' && logger,
  thunk,
].filter(Boolean);

const composeEnhancer = compose;
// (process.env.NODE_ENV !== 'production' &&
//   window &&
//   window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
// compose;

// const persistConfig = {
//   key: 'root',
//   storage,
//   blacklist: ['user'],
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

const composedEnhancers = composeEnhancer(applyMiddleware(...middleWares));

// export const store = createStore(rootReducer, undefined, composedEnhancers);

// export const persistor = persistStore(store);

export const store = configureStore({
  reducer: {
    user: userReducer,
    products: productsReducer,
  },
});
