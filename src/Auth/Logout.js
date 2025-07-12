// src/Auth/Logout.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Logout = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate("/login"); // if not logged in, redirect
    }
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      await fetch("http://localhost:8000/api/logout/", {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      localStorage.removeItem("token");
      setShowModal(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    navigate("/");
  };

  return (
    <>
      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Confirm Logout</h5>
              </div>

              <div className="modal-body">
                <p>Are you sure you want to logout?</p>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Logout;
