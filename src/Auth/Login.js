import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/login/', formData);
      localStorage.setItem('token', res.data.token);
      setMessage('✅ Logged in successfully!');
    } catch (error) {
      setMessage('❌ Invalid credentials');
    }
  };

  return (
    <div className="container mt-5 col-md-6">
      <h2 className="mb-4">Login</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" name="username" placeholder="Username" onChange={handleChange} />
        <input className="form-control mb-2" name="password" type="password" placeholder="Password" onChange={handleChange} />
        <button className="btn btn-success">Login</button>
      </form>
    </div>
  );
}

export default Login;
