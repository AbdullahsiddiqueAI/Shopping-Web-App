// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import drawerReducer from './drawerSlice';
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    drawer: drawerReducer
    
  },
});

export default store;
