import { combineReducers } from 'redux';
import { productsReducer } from './product/productReducer';

import { userReducer } from './user/userReducer';

export const rootReducer = combineReducers({
  user: userReducer,
  products: productsReducer,
});
