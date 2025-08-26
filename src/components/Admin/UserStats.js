// src/components/UserStats.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const UserStats = () => {
  const { adminToken } = useSelector((state) => state.admin || {});
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      if (!adminToken) return;
      try {
        const response = await axios.get("/api/admin/stats/", {
          headers: {
            Authorization: `Bearer ${adminToken}`,
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
      {stats ? (
        <div className="row mt-3">
          <div className="col-md-3">
            <div className="card text-bg-primary mb-3">
              <div className="card-body">
                <h5 className="card-title">Total Users</h5>
                <p className="card-text fs-4">{stats.total_users}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-bg-success mb-3">
              <div className="card-body">
                <h5 className="card-title">Total Todos</h5>
                <p className="card-text fs-4">{stats.total_todos}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-bg-warning mb-3">
              <div className="card-body">
                <h5 className="card-title">Completed Todos</h5>
                <p className="card-text fs-4">{stats.completed_todos}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-bg-danger mb-3">
              <div className="card-body">
                <h5 className="card-title">Pending Todos</h5>
                <p className="card-text fs-4">{stats.pending_todos}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>No statistics available.</p>
      )}
    </div>
  );
};

export default UserStats;
