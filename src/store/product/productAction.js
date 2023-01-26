import { PRODUCT_ACTION_TYPES } from './productTypes';
import { createAction } from '../../utils/createAction/createAction';
import { getProducts } from '../../utils/firebase/firebase';

const addProductHelper = (products, productToAdd) => {
  const existingProduct = products.find(
    (product) => product.id === productToAdd.id
  );

  if (existingProduct) {
    const newProducts = products.map((product) =>
      product.id === productToAdd.id
        ? { ...product, quantity: product.quantity + 1 }
        : product
    );
    return newProducts;
  }

  return [...products, { ...productToAdd, quantity: 1 }];
};

const removeProductHelper = (products, productToRemove) => {
  const existingProduct = products.find(
    (product) => product.id === productToRemove.id
  );

  if (existingProduct.quantity !== 1) {
    return [
      ...products,
      { ...existingProduct, quantity: existingProduct.quantity - 1 },
    ];
  }

  const newProducts = products.filter(
    (product) => product.id === productToRemove.id
  );

  return newProducts;
};

const editProductHelper = (products, productToEdit, newValues) => {
  const newProducts = products.map((product) =>
    product.id === productToEdit.id
      ? { ...productToEdit, ...newValues }
      : product
  );

  return newProducts;
};

const clearProductHelper = (products, productToClear) =>
  products.filter((product) => product.id === productToClear.id);

export const addProduct = (products, productToAdd) => {
  const newProducts = addProductHelper(products, productToAdd);
  createAction(PRODUCT_ACTION_TYPES.SET_PRODUCTS, newProducts);
};

export const removeProduct = (products, productIdToRemove) => {
  const newProducts = removeProductHelper(products, productIdToRemove);
  createAction(PRODUCT_ACTION_TYPES.SET_PRODUCTS, newProducts);
};

export const editProduct = (products, productToEdit) => {
  const newProducts = editProductHelper(products, productToEdit);
  createAction(PRODUCT_ACTION_TYPES.SET_PRODUCTS, newProducts);
};

export const clearProduct = (products, productToClear) => {
  const newProducts = clearProductHelper(products, productToClear);
  createAction(PRODUCT_ACTION_TYPES.SET_PRODUCTS, newProducts);
};

const fetchProductsStart = () => {
  createAction(PRODUCT_ACTION_TYPES.FETCH_PRODUCTS_START);
};

const fetchProductsSuccess = (products) => {
  createAction(PRODUCT_ACTION_TYPES.FETCH_PRODUCTS_SUCCESS, products);
};

const fetchProductsFailure = (error) => {
  createAction(PRODUCT_ACTION_TYPES.FETCH_PRODUCTS_FAILURE, error);
};

export const fetchProductsAsync = () => {
  return async (dispatch) => {
    dispatch(fetchProductsStart());
    try {
      const products = await getProducts();
      dispatch(fetchProductsSuccess(products));
    } catch (error) {
      dispatch(fetchProductsFailure(error.message));
    }
  };
};
