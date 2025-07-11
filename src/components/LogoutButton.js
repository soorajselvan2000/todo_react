// LogoutButton.js
import React from 'react';
import axios from 'axios';

const LogoutButton = ({ setToken, setUsername, username }) => {
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/api/auth/logout/', {}, {
        withCredentials: true
      });
    } catch (err) {
      console.warn("Logout request failed (but continuing)", err);
    }

    // ✅ Always clear data after attempt
    setToken(null);
    setUsername(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Welcome, <span style={{ color: '#007bff' }}>{username}</span>!</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default LogoutButton;
