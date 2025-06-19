// Rudux/feature/brandSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedBrandId: null,
};

const brandSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {
    setSelectedBrandId: (state, action) => {
      state.selectedBrandId = action.payload;
    },
  },
});

export const { setSelectedBrandId } = brandSlice.actions;
export default brandSlice.reducer;
