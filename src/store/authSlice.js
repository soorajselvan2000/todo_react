// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   isUserAuthenticated: false,
//   userToken: null,
//   isAdminAuthenticated: false,
//   adminToken: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     // User Auth
//     userLoginSuccess: (state, action) => {
//       state.isUserAuthenticated = true;
//       state.userToken = action.payload;
//     },
//     userLogoutSuccess: (state) => {
//       state.isUserAuthenticated = false;
//       state.userToken = null;
//     },

//     // Admin Auth
//     adminLoginSuccess: (state, action) => {
//       state.isAdminAuthenticated = true;
//       state.adminToken = action.payload;
//     },
//     adminLogoutSuccess: (state) => {
//       state.isAdminAuthenticated = false;
//       state.adminToken = null;
//     },
//   },
// });

// export const {
//   userLoginSuccess,
//   userLogoutSuccess,
//   adminLoginSuccess,
//   adminLogoutSuccess,
// } = authSlice.actions;

// export default authSlice.reducer;
