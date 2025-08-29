// src/components/Auth/Signup.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../../services/api";
import BackgroundWrapper from "../BackgroundWrapper";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (password1 !== password2) {
      setError("Passwords do not match");
      setLoading(false);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundWrapper>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-header bg-success text-white text-center py-4 rounded-top-4">
                <h2 className="mb-0 fw-bold">
                  <i className="bi bi-person-plus me-2"></i>
                  Create Account
                </h2>
              </div>
              <div className="card-body p-4 p-md-5">
                <form onSubmit={handleSignup}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Username</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-person text-primary"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Choose a username"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-envelope text-primary"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control border-start-0"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-lock text-primary"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control border-start-0"
                        value={password1}
                        onChange={(e) => setPassword1(e.target.value)}
                        required
                        placeholder="Create a password"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Confirm Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-lock-fill text-primary"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control border-start-0"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        required
                        placeholder="Confirm your password"
                      />
                    </div>
                  </div>
                  {error && (
                    <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="alert alert-success d-flex align-items-center mb-3" role="alert">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      {success}
                    </div>
                  )}
                  <button 
                    type="submit" 
                    className="btn btn-success w-100 py-2 fw-semibold rounded-pill d-flex align-items-center justify-content-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-plus me-2"></i>
                        Sign Up
                      </>
                    )}
                  </button>
                </form>
                <div className="text-center mt-4">
                  <p className="mb-0">
                    Already have an account? <Link to="/login" className="text-success fw-semibold">Login here</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackgroundWrapper>
  );
}

export default Signup;

// // src/components/Auth/Signup.js
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { signupUser } from "../../services/api";

// function Signup() {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password1, setPassword1] = useState("");
//   const [password2, setPassword2] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const navigate = useNavigate();

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (password1 !== password2) {
//       setError("Passwords do not match");
//       return;
//     }

//     try {
//       await signupUser({ username, email, password1, password2 });
//       setSuccess("Account created successfully! Redirecting to login...");
//       setTimeout(() => navigate("/login"), 2000);
//     } catch (err) {
//       setError(
//         err.response?.data?.username?.[0] ||
//         err.response?.data?.password1?.[0] ||
//         err.response?.data?.email?.[0] ||
//         "Signup failed"
//       );
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2>Signup</h2>
//       <form onSubmit={handleSignup}>
//         <div className="mb-3">
//           <label>Username</label>
//           <input
//             type="text"
//             className="form-control"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />
//           <label>Email</label>
//           <input
//             type="email"
//             className="form-control"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />  
//         </div>
//         <div className="mb-3">
//           <label>Password</label>
//           <input
//             type="password"
//             className="form-control"
//             value={password1}
//             onChange={(e) => setPassword1(e.target.value)}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label>Confirm Password</label>
//           <input
//             type="password"
//             className="form-control"
//             value={password2}
//             onChange={(e) => setPassword2(e.target.value)}
//             required
//           />
//         </div>
//         {error && <p className="text-danger">{error}</p>}
//         {success && <p className="text-success">{success}</p>}
//         <button type="submit" className="btn btn-success">Signup</button>
//       </form>
//     </div>
//   );
// }

// export default Signup;
