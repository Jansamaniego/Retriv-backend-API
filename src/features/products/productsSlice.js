import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action) => {},
    fetchProducts: (state, action) => {},
    updateProduct: (state, action) => {},
    removeProduct: (state, action) => {},
  },
});

export default productsSlice.reducer;
