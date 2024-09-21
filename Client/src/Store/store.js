import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import drawerReducer from './drawerSlice';
import authReducer from './authSlice'; // Correctly importing the authSlice reducer
import cartReducer from './cartSlice';
import searchReducer from './searchSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    drawer: drawerReducer,
    auth: authReducer, // Correct reference to the reducer
    cart:cartReducer,
    search: searchReducer, // Correct reference to the reducer
  },
});

export default store;
