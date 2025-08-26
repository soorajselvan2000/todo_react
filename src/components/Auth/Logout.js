// src/components/Auth/Logout.js
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserToken, setAdminToken } from "../../services/api";
import { userLogoutSuccess } from "../../store/userAuthSlice";
import { adminLogoutSuccess } from "../../store/adminAuthSlice";

const Logout = ({ isAdmin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (isAdmin) {
      // Clear admin token
      dispatch(adminLogoutSuccess());
      setAdminToken(null);
      localStorage.removeItem("adminToken");
      navigate("/admin/login");
    } else {
      // Clear user token
      dispatch(userLogoutSuccess());
      setUserToken(null);
      localStorage.removeItem("userToken");
      navigate("/login");
    }
  };

  return (
    <button className="btn btn-danger" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Logout;
