// src/pages/LoginPage.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

const LoginPage = ({ setToken, setUsername, isAuthenticated }) => {
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <LoginForm setToken={setToken} setUsername={setUsername} />;
};

export default LoginPage;
