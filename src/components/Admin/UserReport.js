// src/components/UserReport.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // <-- Import useNavigate
import axios from "axios";
import BackgroundWrapper from "../BackgroundWrapper";

const UserReport = () => {
  const navigate = useNavigate(); // <-- initialize navigate
  const adminToken = useSelector((state) => state.adminAuth.adminToken);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Redirect to admin login if not logged in
    if (!adminToken) {
      navigate("/admin/login");
      return;
    }

    const fetchReports = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/admin/report/",
          {
            headers: {
              Authorization: `Token ${adminToken}`, // DRF expects Token
            },
          }
        );
        setReports(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to fetch user reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [adminToken, navigate]);

  if (loading)
    return (
      <BackgroundWrapper>
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading reports...</p>
        </div>
      </BackgroundWrapper>
    );

  if (error)
    return (
      <BackgroundWrapper>
        <div className="container py-5">
          <div className="alert alert-danger text-center">
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
              <div className="card-header bg-primary text-white py-3 rounded-top-4">
                <h3 className="mb-0 d-flex align-items-center">
                  <i className="bi bi-bar-chart me-2"></i>User Reports
                </h3>
              </div>
              <div className="card-body p-4">
                {reports.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-inbox display-4 text-muted"></i>
                    <p className="mt-3 text-muted">No reports found.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>User</th>
                          <th>Total Todos</th>
                          <th>Completed</th>
                          <th>Pending</th>
                          <th>Completion Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.map((report) => {
                          const completionRate =
                            report.total_tasks > 0
                              ? Math.round(
                                  (report.completed_tasks / report.total_tasks) * 100
                                )
                              : 0;
                          return (
                            <tr key={report.id}>
                              <td>{report.username}</td>
                              <td>
                                <span className="badge bg-primary rounded-pill">
                                  {report.total_tasks}
                                </span>
                              </td>
                              <td>
                                <span className="badge bg-success rounded-pill">
                                  {report.completed_tasks}
                                </span>
                              </td>
                              <td>
                                <span className="badge bg-warning rounded-pill">
                                  {report.pending_tasks}
                                </span>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div
                                    className="progress flex-grow-1 me-2"
                                    style={{ height: "8px" }}
                                  >
                                    <div
                                      className="progress-bar bg-success"
                                      role="progressbar"
                                      style={{ width: `${completionRate}%` }}
                                      aria-valuenow={completionRate}
                                      aria-valuemin="0"
                                      aria-valuemax="100"
                                    ></div>
                                  </div>
                                  <small className="fw-semibold">{completionRate}%</small>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
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

export default UserReport;
