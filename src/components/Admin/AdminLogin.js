// src/components/Admin/AdminLogin.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { adminLoginSuccess } from "../../store/adminAuthSlice";
import { useNavigate } from "react-router-dom";
import { loginAdmin, setAdminToken } from "../../services/api";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginAdmin({ username, password });

      // Save token in Redux and localStorage
      dispatch(adminLoginSuccess(data));
      localStorage.setItem("adminToken", data.token);

      // Set token in API layer
      setAdminToken(data.token);

      // Redirect to admin dashboard
      navigate("/admin/report");
    } catch (err) {
      setError(err.response?.data?.detail || "Admin login failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Admin Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Username:</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
