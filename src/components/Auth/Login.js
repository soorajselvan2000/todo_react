// src/components/Auth/Login.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser, setUserToken } from "../../services/api";
import { userLoginSuccess } from "../../store/userAuthSlice";
import { useNavigate, Link } from "react-router-dom";
import BackgroundWrapper from "../BackgroundWrapper";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginUser({ username, password });
      dispatch(userLoginSuccess({ token: data.token, user: { username } }));
      setUserToken(data.token);
      navigate("/todos");


      // ✅ Send email a few seconds after login (Activate this code when submission)
    setTimeout(async () => {
      try {
        await fetch("http://127.0.0.1:8000/api/todos/expire/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${data.token}`, // pass the user token
          },
        });
      } catch (err) {
        console.error("Failed to send expired todos email:", err);
      }
    }, 5000); // 5 seconds delay



    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
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
              <div className="card-header bg-primary text-white text-center py-4 rounded-top-4">
                <h2 className="mb-0 fw-bold">
                  <i className="bi bi-person-circle me-2"></i>
                  User Login
                </h2>
              </div>
              <div className="card-body p-4 p-md-5">
                {error && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
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
                        placeholder="Enter your username"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-lock text-primary"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control border-start-0"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>
                  <button 
                    className="btn btn-primary w-100 py-2 fw-semibold rounded-pill d-flex align-items-center justify-content-center" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Logging in...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Login
                      </>
                    )}
                  </button>
                </form>
                <div className="text-center mt-4">
                  <p className="mb-0">
                    Don't have an account? <Link to="/signup" className="text-primary fw-semibold">Sign up here</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackgroundWrapper>
  );
};

export default Login;

// // src/components/Auth/Login.js
// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { loginUser, setUserToken } from "../../services/api";
// import { userLoginSuccess } from "../../store/userAuthSlice";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const data = await loginUser({ username, password });
//       dispatch(userLoginSuccess({ token: data.token, user: { username } }));
//       setUserToken(data.token);
//       navigate("/todos");
//     } catch (err) {
//       setError(err.response?.data?.detail || "Login failed");
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2>User Login</h2>
//       {error && <div className="alert alert-danger">{error}</div>}
//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label>Username:</label>
//           <input
//             type="text"
//             className="form-control"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label>Password:</label>
//           <input
//             type="password"
//             className="form-control"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button className="btn btn-primary" type="submit">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;
