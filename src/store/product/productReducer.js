import { PRODUCT_ACTION_TYPES } from './productTypes';

const INITIAL_STATE = {
  products: [],
  isLoading: false,
  error: null,
};

export const productsReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case PRODUCT_ACTION_TYPES.SET_PRODUCTS:
      return { ...state, products: payload };
    case PRODUCT_ACTION_TYPES.FETCH_PRODUCTS_START:
      return { ...state, isLoading: true };
    case PRODUCT_ACTION_TYPES.FETCH_PRODUCTS_SUCCESS:
      return { ...state, isLoading: false, products: payload };
    case PRODUCT_ACTION_TYPES.FETCH_PRODUCTS_FAILURE:
      return { ...state, isLoading: false, error: payload };
    default:
      return state;
  }
};
