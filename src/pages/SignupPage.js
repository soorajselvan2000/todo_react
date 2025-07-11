import React from 'react';
import { Navigate } from 'react-router-dom';
import SignupForm from '../components/SignupForm';

const SignupPage = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <SignupForm />;
};

export default SignupPage;
