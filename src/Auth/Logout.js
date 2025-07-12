import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Logout() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.post(
          'http://localhost:8000/api/logout/',
          {},
          {
            headers: {
              Authorization: `Token ${localStorage.getItem('token')}`,
            },
          }
        );
        localStorage.removeItem('token');
        setMessage('✅ Logged out successfully!');
      } catch (error) {
        setMessage('❌ Logout failed.');
      }
    };
    logout();
  }, []);

  return (
    <div className="container mt-5 col-md-6">
      <h2 className="mb-4">Logout</h2>
      <div className="alert alert-info">{message}</div>
    </div>
  );
}

export default Logout;
