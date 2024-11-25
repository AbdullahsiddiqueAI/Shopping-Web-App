
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalQuantity: 0,
    totalPrice: 0,
  },
  reducers: {
    setCartData(state, action) {
      state.items = action.payload;
      state.totalQuantity = action.payload.reduce((acc, item) => acc + item.quantity, 0);
      state.totalPrice = action.payload.reduce((acc, item) => acc + item.price * item.quantity, 0);
    },
    addToCart(state, action) {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        existingItem.totalPrice += action.payload.price * action.payload.quantity;
      } else {
        state.items.push({
          id: action.payload.id,
          name: action.payload.name,
          price: action.payload.price,
          productPic: action.payload.productPic,
          quantity: action.payload.quantity,
          totalPrice: action.payload.price * action.payload.quantity,
        });
      }
      state.totalQuantity += action.payload.quantity;
      state.totalPrice += action.payload.price * action.payload.quantity;
    },
    updateCart(state, action) {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        state.totalQuantity += action.payload.newQuantity - existingItem.quantity;
        state.totalPrice += (action.payload.price * action.payload.newQuantity) - existingItem.totalPrice;
        existingItem.quantity = action.payload.newQuantity;
        existingItem.totalPrice = action.payload.price * action.payload.newQuantity;
      }
    },
    removeFromCart(state, action) {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalPrice -= existingItem.totalPrice;
        state.items = state.items.filter(item => item.id !== action.payload.id);
      }
    }
  },
});

export const { setCartData, addToCart, updateCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
