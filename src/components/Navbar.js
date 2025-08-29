// src/components/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userLogoutSuccess } from "../store/userAuthSlice";
import { adminLogoutSuccess } from "../store/adminAuthSlice";
import { setUserToken, setAdminToken } from "../services/api";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Use the actual flag names from your slices
  const isUserAuthenticated = useSelector(
    (state) => state.userAuth?.isAuthenticated
  );
  const isAdminAuthenticated = useSelector(
    (state) => state.adminAuth?.isAdminAuthenticated
  );

  const handleLogout = () => {
    if (isAdminAuthenticated) {
      // Admin logout
      dispatch(adminLogoutSuccess());
      setAdminToken(null);                 // clear axios interceptor token
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminInfo");
      navigate("/admin/login");
      return;
    }
    if (isUserAuthenticated) {
      // User logout
      dispatch(userLogoutSuccess());
      setUserToken(null);                  // clear axios interceptor token
      localStorage.removeItem("userToken");
      localStorage.removeItem("userInfo");
      navigate("/login");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">Todo App</Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">

          {/* ---------------- User Logged In ---------------- */}
          {isUserAuthenticated && !isAdminAuthenticated && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/todos">My Todos</Link>
              </li>
              <li className="nav-item">
                <button className="btn btn-danger btn-sm ms-2" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}

          {/* ---------------- Admin Logged In ---------------- */}
          {isAdminAuthenticated && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/report">User Report</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/usage-stats">Usage Stats</Link>
              </li>
              <li className="nav-item">
                <button className="btn btn-danger btn-sm ms-2" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}

          {/* ---------------- No one logged in ---------------- */}
          {!isUserAuthenticated && !isAdminAuthenticated && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/signup">Signup</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">User Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/login">Admin Login</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
