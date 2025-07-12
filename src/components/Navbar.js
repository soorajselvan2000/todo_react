import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const token = localStorage.getItem('token');

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">Todo App</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          {token && (
            <li className="nav-item">
              <Link className="nav-link" to="/">TodoList</Link>
            </li>
          )}
        </ul>
        <ul className="navbar-nav ms-auto">
          {!token ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/signup">Signup</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link className="nav-link" to="/logout">Logout</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
