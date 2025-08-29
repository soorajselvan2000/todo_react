// src/components/UserStats.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // <-- Import useNavigate
import axios from "axios";
import BackgroundWrapper from "../BackgroundWrapper";

const UserStats = () => {
  const navigate = useNavigate(); // <-- initialize navigate
  const adminToken = useSelector((state) => state.adminAuth.adminToken);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Redirect to admin login if not logged in
    if (!adminToken) {
      navigate("/admin/login");
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/admin/usage-stats/",
          {
            headers: {
              Authorization: `Token ${adminToken}`,
            },
          }
        );
        setStats(response.data);
      } catch (err) {
        setError(
          err.response?.data?.detail || "Failed to fetch user statistics."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [adminToken, navigate]);

  if (loading)
    return (
      <BackgroundWrapper>
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading statistics...</p>
        </div>
      </BackgroundWrapper>
    );

  if (error)
    return (
      <BackgroundWrapper>
        <div className="container py-5">
          <div className="alert alert-danger text-center" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        </div>
      </BackgroundWrapper>
    );

  return (
    <BackgroundWrapper>
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-header bg-info text-white py-3 rounded-top-4">
                <h3 className="mb-0 d-flex align-items-center">
                  <i className="bi bi-graph-up me-2"></i>
                  User Statistics
                </h3>
              </div>
              <div className="card-body p-4">
                {stats.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-inbox display-4 text-muted"></i>
                    <p className="mt-3 text-muted">No statistics available.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Username</th>
                          <th>Added</th>
                          <th>Deleted</th>
                          <th>Completed</th>
                          <th>Edited</th>
                          <th>Imported</th>
                          <th>Exported</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.map((user) => (
                          <tr key={user.username}>
                            <td className="fw-medium">{user.username}</td>
                            <td>
                              <span className="badge bg-success rounded-pill">
                                {user.added_tasks}
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-danger rounded-pill">
                                {user.deleted_tasks}
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-primary rounded-pill">
                                {user.completed_tasks}
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-warning rounded-pill">
                                {user.edited_tasks}
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-info rounded-pill">
                                {user.imported_tasks}
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-dark rounded-pill">
                                {user.exported_tasks}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackgroundWrapper>
  );
};

export default UserStats;
