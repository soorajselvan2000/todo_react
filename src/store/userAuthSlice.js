// src/redux/userAuthSlice.js
import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("userToken");
const user = JSON.parse(localStorage.getItem("userInfo"));

const initialState = {
  isAuthenticated: !!token,
  token: token || null,
  user: user || null,
};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    userLoginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      localStorage.setItem("userToken", action.payload.token);
      localStorage.setItem("userInfo", JSON.stringify(action.payload.user));
    },
    userLogoutSuccess: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("userToken");
      localStorage.removeItem("userInfo");
    },
  },
});

export const { userLoginSuccess, userLogoutSuccess } = userAuthSlice.actions;
export default userAuthSlice.reducer;
