// src/components/UserReport.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const UserReport = () => {
  const adminToken = useSelector((state) => state.adminAuth.adminToken);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      if (!adminToken) return; // Stop if no token
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/admin/report/", {
          headers: {
            Authorization: `Token ${adminToken}`, // ✅ DRF expects Token, not Bearer
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
                <th>Total Todos</th>
                <th>Completed Todos</th>
                <th>Pending Todos</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>{report.username}</td>
                  <td>{report.total_tasks}</td>
                  <td>{report.completed_tasks}</td>
                  <td>{report.pending_tasks}</td>
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
