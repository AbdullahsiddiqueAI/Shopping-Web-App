import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("access") || null,
  refreshToken: localStorage.getItem("refresh") || null,
  user: JSON.parse(localStorage.getItem("user")) || null,
  isAuthenticated: !!localStorage.getItem("access"),
  isAdmin:false
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginInUser: (state, action) => {
      const { tokens, user } = action.payload;
      console.log("action.payload", user?.is_superuser );
      if(tokens){

        localStorage.setItem("access", tokens.access);
        if (tokens.refresh) {
          localStorage.setItem("refresh", tokens.refresh);
          state.refreshToken = tokens.refresh || null;
        }
        state.token = tokens.access;
      }
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
      
      state.user = user || null;
      state.isAuthenticated = true;
      state.isAdmin = user?.is_superuser || false;
      // localStorage.setItem("isAdmin", JSON.stringify(state.isAdmin));

    },

    logoutUser: (state) => {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");
      // localStorage.removeItem("isAdmin");
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      window.location.reload();
    },

    updateUserInfo: (state, action) => {
      const { user } = action.payload;
      localStorage.setItem("user", JSON.stringify(user));
      state.user = user;
    },
  },
});

export const { loginInUser, logoutUser, updateUserInfo } = authSlice.actions;

export default authSlice.reducer;
