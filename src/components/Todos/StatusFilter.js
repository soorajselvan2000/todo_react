// src/components/StatusFilter.js
import React from "react";

const StatusFilter = ({ setFilterStatus }) => {
  return (
    <div className="mb-3">
      <span className="me-2">Filter:</span>
      <button
        className="btn btn-outline-primary btn-sm me-1"
        onClick={() => setFilterStatus("all")}
      >
        All
      </button>
      <button
        className="btn btn-outline-success btn-sm me-1"
        onClick={() => setFilterStatus("completed")}
      >
        Completed
      </button>
      <button
        className="btn btn-outline-warning btn-sm"
        onClick={() => setFilterStatus("pending")}
      >
        Pending
      </button>
    </div>
  );
};

export default StatusFilter;
