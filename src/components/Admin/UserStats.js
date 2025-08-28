// src/components/UserStats.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const UserStats = () => {
  const adminToken = useSelector((state) => state.adminAuth.adminToken);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      if (!adminToken) return;
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/admin/usage-stats/", {
          headers: {
            Authorization: `Token ${adminToken}`,
          },
        });
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
  }, [adminToken]);

  if (loading) return <p>Loading statistics...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h3>User Statistics</h3>
      {stats.length > 0 ? (
        <div className="table-responsive mt-3">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
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
                  <td>{user.username}</td>
                  <td>{user.added_tasks}</td>
                  <td>{user.deleted_tasks}</td>
                  <td>{user.completed_tasks}</td>
                  <td>{user.edited_tasks}</td>
                  <td>{user.imported_tasks}</td>
                  <td>{user.exported_tasks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No statistics available.</p>
      )}
    </div>
  );
};

export default UserStats;
