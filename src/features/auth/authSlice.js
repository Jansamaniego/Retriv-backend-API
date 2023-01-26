import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  auth: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
});

export default authSlice.reducer;
