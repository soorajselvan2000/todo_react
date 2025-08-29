// src/services/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

// ================== TOKEN HANDLERS ==================
let userToken = null;
let adminToken = null;

export const setUserToken = (token) => {
  userToken = token;
};

export const setAdminToken = (token) => {
  adminToken = token;
};

// Create axios instances
const userApi = axios.create({ baseURL: API_BASE_URL });
const adminApi = axios.create({ baseURL: API_BASE_URL });

// Attach tokens automatically
// userApi.interceptors.request.use((config) => {
//   if (userToken) {
//     config.headers.Authorization = `Token ${userToken}`;
//   }
//   return config;
// });

userApi.interceptors.request.use((config) => {
  if (userToken) {
    config.headers.Authorization = `Token ${userToken}`;
  }
  console.log("Request headers:", config.headers); // Debug line
  return config;
});

adminApi.interceptors.request.use((config) => {
  if (adminToken) {
    config.headers.Authorization = `Token ${adminToken}`;
  }
  return config;
});

// ================== USER AUTH ==================
export const signupUser = async (userData) => {
  const res = await axios.post(`${API_BASE_URL}/signup/`, userData);
  return res.data;
};

export const loginUser = async (userData) => {
  const res = await axios.post(`${API_BASE_URL}/user/login/`, userData);
  return res.data;
};

export const logoutUser = async () => {
  const res = await userApi.post(`/logout/`);
  return res.data;
};

// ================== USER TODOS ==================
export const createTodo = async (todoData) => {
  const res = await userApi.post(`/todos/create/`, todoData);
  return res.data;
};

export const updateTodo = async (id, todoData) => {
  const res = await userApi.put(`/todos/${id}/update/`, todoData);
  return res.data;
};

export const deleteTodo = async (id) => {
  const res = await userApi.delete(`/todos/${id}/delete/`);
  return res.data;
};

// Get todos by status
export const getTodosStatus = async () => {
  const res = await userApi.get(`/todos/status/`);
  return res.data;
};

// Search todos by date
export const getTodosByDate = async (date) => {
  const res = await userApi.get(`/todos/`, { params: { date } });
  return res.data;
};

// ================== USER EXPORT ==================
export const exportTodos = async (format) => {
  const res = await userApi.get(`/todos/export/?format=${format}`, {
    responseType: "blob", // important for file download
  });
  return res.data;
};

export const exportTodosLog = async () => {
  const res = await userApi.post(`/todos/export/log/`);
  return res.data;
};


// ================== ADMIN ==================
export const loginAdmin = async (adminData) => {
  const res = await axios.post(`${API_BASE_URL}/admin/login/`, adminData);
  return res.data;
};

// Get all users report (optionally by date)
export const fetchUserReport = async (date = null) => {
  const res = await adminApi.get(`/admin/report/`, {
    params: date ? { date } : {},
  });
  return res.data;
};
