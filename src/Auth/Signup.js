import React, { useState } from 'react';
import axios from 'axios';

function Signup() {
  const [formData, setFormData] = useState({ username: '', password1: '', password2: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/signup/', formData);
      setMessage('✅ Account created successfully!');
    } catch (error) {
      setMessage('❌ Error: ' + JSON.stringify(error.response.data));
    }
  };

  return (
    <div className="container mt-5 col-md-6">
      <h2 className="mb-4">Signup</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" name="username" placeholder="Username" onChange={handleChange} />
        <input className="form-control mb-2" name="password1" type="password" placeholder="Password" onChange={handleChange} />
        <input className="form-control mb-2" name="password2" type="password" placeholder="Confirm Password" onChange={handleChange} />
        <button className="btn btn-primary">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
