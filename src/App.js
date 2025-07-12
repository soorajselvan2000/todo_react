import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Signup from './Auth/Signup';
import Login from './Auth/Login';
import Logout from './Auth/Logout';
import TodoList from './components/TodoList'

function App() {
  const token = localStorage.getItem('token');
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={token ? <TodoList /> : <Navigate to="/login" replace />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </>
  );
}

export default App;
