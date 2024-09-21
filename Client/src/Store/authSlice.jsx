import { createSlice } from '@reduxjs/toolkit';

// Initial state will try to fetch token and user info from localStorage if available
const initialState = {
  token: localStorage.getItem('access') || null,
  refreshToken: localStorage.getItem('refresh') || null, // Optional: store refresh token
  user: JSON.parse(localStorage.getItem('user')) || null, // Store user info
  isAuthenticated: !!localStorage.getItem('access'), // Determine if user is authenticated based on the token
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to log in the user, store token and user info
    loginInUser: (state, action) => {
      const { tokens, user } = action.payload; // Ensure tokens contains access and refresh tokens
      console.log("action.payload", action.payload);

      localStorage.setItem('access', tokens.access); // Store the access token in localStorage
      if (tokens.refresh) {
        localStorage.setItem('refresh', tokens.refresh); // Store the refresh token (if provided)
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user)); // Store user info in localStorage
      }

      state.token = tokens.access;
      state.refreshToken = tokens.refresh || null;
      state.user = user || null;
      state.isAuthenticated = true;
    },

    // Action to log out the user, remove tokens and user info
    logoutUser: (state) => {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh'); // Remove refresh token if stored
      localStorage.removeItem('user'); // Remove user info
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
      window.location.reload()
    },

    // Optional: action to update user info without logging the user out
    updateUserInfo: (state, action) => {
      const { user } = action.payload;
      localStorage.setItem('user', JSON.stringify(user)); // Update user info in localStorage
      state.user = user;
    },
  },
});

// Export the actions
export const { loginInUser, logoutUser, updateUserInfo } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;
