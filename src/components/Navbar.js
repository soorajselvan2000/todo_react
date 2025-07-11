// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isAuthenticated, handleLogout }) => {
  return (
    <nav className="navbar">
      <div className="nav-brand">📝 To-Do App</div>
      <ul className="nav-links">
        {!isAuthenticated ? (
          <>
            <li><Link to="/signup">Signup</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        ) : (
          <li><button onClick={handleLogout}>Logout</button></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
