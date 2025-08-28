import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../../services/api";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password1 !== password2) {
      setError("Passwords do not match");
      return;
    }

    try {
      await signupUser({ username, email, password1, password2 });
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.username?.[0] ||
        err.response?.data?.password1?.[0] ||
        err.response?.data?.email?.[0] ||
        "Signup failed"
      );
    }
  };

  return (
    <div className="container mt-5">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <div className="mb-3">
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />  
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Confirm Password</label>
          <input
            type="password"
            className="form-control"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-danger">{error}</p>}
        {success && <p className="text-success">{success}</p>}
        <button type="submit" className="btn btn-success">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
