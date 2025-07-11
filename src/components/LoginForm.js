import React, { useState } from 'react';
import axios from 'axios';
import './Form.css'; // shared styling

const LoginForm = ({ setToken, setUsername }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/auth/login', form);
      setToken(res.data.token);
      setUsername(form.username);
      setMessage('Login successful!');
    } catch (err) {
      setMessage('Login failed');
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <form className="form-container" onSubmit={handleLogin}>
      <h2>Login</h2>
      <input name="username" placeholder="Username" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Login</button>
      <p className="message">{message}</p>
    </form>
  );
};

export default LoginForm;
