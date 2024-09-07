import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import drawerReducer from './drawerSlice';
import authReducer from './authSlice'; // Correctly importing the authSlice reducer

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    drawer: drawerReducer,
    auth: authReducer, // Correct reference to the reducer
  },
});

export default store;
