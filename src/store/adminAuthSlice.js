// src/redux/adminAuthSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adminToken: localStorage.getItem("adminToken") || null,
  isAdminAuthenticated: !!localStorage.getItem("adminToken"),
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    adminLoginSuccess: (state, action) => {
      state.adminToken = action.payload.token;
      state.isAdminAuthenticated = true;
      localStorage.setItem("adminToken", action.payload.token);
    },
    adminLogoutSuccess: (state) => {
      state.adminToken = null;
      state.isAdminAuthenticated = false;
      localStorage.removeItem("adminToken");
    },
  },
});

export const { adminLoginSuccess, adminLogoutSuccess } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
