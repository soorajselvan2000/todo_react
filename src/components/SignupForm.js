// src/components/SignupForm.js
import React, { useState } from 'react';
import axios from 'axios';
import './Form.css';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const [form, setForm] = useState({
    username: '',
    password1: '',
    password2: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // ✅ initialize navigator

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/auth/signup', form);
      setMessage('✅ Signup successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login'); // ✅ redirect to login after success
      }, 1500);
    } catch (err) {
      setMessage('❌ Signup failed');
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSignup}>
      <h2>Sign Up</h2>
      <input
        name="username"
        placeholder="Username"
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password1"
        placeholder="Password"
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password2"
        placeholder="Confirm Password"
        onChange={handleChange}
        required
      />
      <button type="submit">Register</button>
      <p className="message">{message}</p>
    </form>
  );
};

export default SignupForm;
