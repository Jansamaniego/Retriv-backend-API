import { createSelector } from 'reselect';

const selectProductReducer = (state) => state.products;

export const selectProducts = createSelector(
  [selectProductReducer],
  (state) => state.products
);
