// src/components/Admin/AdminLogin.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { adminLoginSuccess } from "../../store/adminAuthSlice";
import { useNavigate, Link } from "react-router-dom";
import { loginAdmin, setAdminToken } from "../../services/api";
import BackgroundWrapper from "../BackgroundWrapper";

const AdminLogin = () => {
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
      const data = await loginAdmin({ username, password });

      // Save token in Redux and localStorage
      dispatch(adminLoginSuccess(data));
      localStorage.setItem("adminToken", data.token);

      // Set token in API layer
      setAdminToken(data.token);

      // Redirect to admin dashboard
      navigate("/admin/report");
    } catch (err) {
      setError(err.response?.data?.detail || "Admin login failed");
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
              <div className="card-header bg-dark text-white text-center py-4 rounded-top-4">
                <h2 className="mb-0 fw-bold">
                  <i className="bi bi-shield-lock me-2"></i>
                  Admin Login
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
                        <i className="bi bi-person-gear text-dark"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Admin username"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-key-fill text-dark"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control border-start-0"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Admin password"
                      />
                    </div>
                  </div>
                  <button 
                    className="btn btn-dark w-100 py-2 fw-semibold rounded-pill d-flex align-items-center justify-content-center" 
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
                        <i className="bi bi-shield-check me-2"></i>
                        Admin Login
                      </>
                    )}
                  </button>
                </form>
                <div className="text-center mt-4">
                  <p className="mb-0">
                    <Link to="/login" className="text-dark fw-semibold">Back to User Login</Link>
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

export default AdminLogin;

// // src/components/Admin/AdminLogin.js
// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { adminLoginSuccess } from "../../store/adminAuthSlice";
// import { useNavigate } from "react-router-dom";
// import { loginAdmin, setAdminToken } from "../../services/api";

// const AdminLogin = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const data = await loginAdmin({ username, password });

//       // Save token in Redux and localStorage
//       dispatch(adminLoginSuccess(data));
//       localStorage.setItem("adminToken", data.token);

//       // Set token in API layer
//       setAdminToken(data.token);

//       // Redirect to admin dashboard
//       navigate("/admin/report");
//     } catch (err) {
//       setError(err.response?.data?.detail || "Admin login failed");
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2>Admin Login</h2>
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

// export default AdminLogin;
