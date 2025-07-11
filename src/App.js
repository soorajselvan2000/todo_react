// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import LogoutButton from './components/LogoutButton';

function App() {
  // Initial state from localStorage
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [username, setUsername] = useState(localStorage.getItem('username') || null);

  const isAuthenticated = !!token;

  // Save to localStorage on login
  const handleLogin = (newToken, newUsername) => {
    setToken(newToken);
    setUsername(newUsername);
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', newUsername);
  };

  // Clear everything on logout
  const handleLogout = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  };

  return (
    <div className="App">
      <Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />

      {isAuthenticated && (
        <h2 style={{ textAlign: 'center', marginTop: '20px' }}>
          👋 Welcome, <span style={{ color: '#007bff' }}>{username}</span>!
        </h2>
      )}

      <Routes>
        <Route
          path="/signup"
          element={<SignupPage isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="/login"
          element={
            <LoginPage
              setToken={(t) => handleLogin(t, username)}
              setUsername={(u) => handleLogin(token, u)}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route
          path="/"
          element={
            <LogoutButton
              setToken={setToken}
              setUsername={setUsername}
              username={username}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
