import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchQuery: '',  // Holds the search query
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;  // Update search query in state
    },
    clearSearchQuery: (state) => {
      state.searchQuery = '';  // Clear the search query
    },
  },
});

export const { setSearchQuery, clearSearchQuery } = searchSlice.actions;

export default searchSlice.reducer;
