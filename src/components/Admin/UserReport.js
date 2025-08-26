// src/components/UserReport.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const UserReport = () => {
  const { adminToken } = useSelector((state) => state.admin || {});
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      if (!adminToken) return; // Stop if no token
      try {
        const response = await axios.get("/api/admin/reports/", {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });
        setReports(response.data);
      } catch (err) {
        setError(
          err.response?.data?.detail || "Failed to fetch user reports."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [adminToken]);

  if (loading) return <p>Loading reports...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h3>User Reports</h3>
      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped mt-3">
            <thead className="table-dark">
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Total Todos</th>
                <th>Completed Todos</th>
                <th>Pending Todos</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.user_id}>
                  <td>{report.username}</td>
                  <td>{report.email}</td>
                  <td>{report.total_todos}</td>
                  <td>{report.completed_todos}</td>
                  <td>{report.pending_todos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserReport;
