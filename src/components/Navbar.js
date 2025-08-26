// src/components/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userLogoutSuccess } from "../store/userAuthSlice";
import { adminLogoutSuccess } from "../store/adminAuthSlice";


const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Accessing userAuth and adminAuth separately
  const { isUserAuthenticated } = useSelector((state) => state.userAuth);
  const { isAdminAuthenticated } = useSelector((state) => state.adminAuth);

  const handleUserLogout = () => {
    localStorage.removeItem("userToken"); // ✅ clear token
    dispatch(userLogoutSuccess());
    navigate("/login"); // redirect user to login
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken"); // ✅ clear token
    dispatch(adminLogoutSuccess());
    navigate("/admin/login"); // redirect admin to login
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">Todo App</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          {/* User Navbar */}
          {isUserAuthenticated && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/todos">My Todos</Link>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-sm btn-danger ms-2"
                  onClick={handleUserLogout}
                >
                  Logout
                </button>
              </li>
            </>
          )}

          {/* Admin Navbar */}
          {isAdminAuthenticated && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/usage-stats">User Stats</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/report">User Report</Link>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-sm btn-danger ms-2"
                  onClick={handleAdminLogout}
                >
                  Admin Logout
                </button>
              </li>
            </>
          )}

          {/* If not logged in (neither user nor admin) */}
          {!isUserAuthenticated && !isAdminAuthenticated && (
            <>
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
