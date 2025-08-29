import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { userLoginSuccess } from "./store/userAuthSlice";

import Navbar from "./components/Navbar";
import Signup from "./components/Auth/Signup";
import Login from "./components/Auth/Login";
import Logout from "./components/Auth/Logout";
import AdminLogin from "./components/Admin/AdminLogin";
import UserReport from "./components/Admin/UserReport";
import UserStats from "./components/Admin/UserStats";
import TodoList from "./components/Todos/Todolist";
import { adminLoginSuccess } from "./store/adminAuthSlice";

function App() {
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const token = localStorage.getItem("userToken");
  //   const user = JSON.parse(localStorage.getItem("userInfo"));
  //   if (token && user) {
  //     dispatch(userLoginSuccess({ token, user }));
  //   }
  // }, [dispatch]);

  useEffect(() => {
  const token = localStorage.getItem("userToken");
  const user = JSON.parse(localStorage.getItem("userInfo"));
  if (token && user) dispatch(userLoginSuccess({ token, user }));

  const adminToken = localStorage.getItem("adminToken");
  const admin = JSON.parse(localStorage.getItem("adminInfo"));
  if (adminToken) dispatch(adminLoginSuccess({ token: adminToken, admin }));
}, [dispatch]);

  return (
    <Router>
      <Navbar /> {/* Navbar always visible */}
      <Routes>
        <Route path="/" element={<Login />} />  {/* default route */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/todos" element={<TodoList />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/report" element={<UserReport />} />
        <Route path="/admin/usage-stats" element={<UserStats />} />
      </Routes>
    </Router>
  );
}

export default App;
