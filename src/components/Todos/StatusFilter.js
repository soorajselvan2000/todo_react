// src/components/StatusFilter.js
import React from "react";

const StatusFilter = ({ setFilterStatus }) => {
  const filters = [
    { key: "all", label: "All", icon: "bi-list-ul" },
    { key: "completed", label: "Completed", icon: "bi-check-circle" },
    { key: "pending", label: "Pending", icon: "bi-clock" }
  ];

  return (
    <div className="btn-group w-100 shadow-sm" role="group">
      {filters.map(filter => (
        <button
          key={filter.key}
          type="button"
          className="btn btn-outline-primary d-flex align-items-center"
          onClick={() => setFilterStatus(filter.key)}
        >
          <i className={`${filter.icon} me-1`}></i>
          <span className="d-none d-md-inline">{filter.label}</span>
        </button>
      ))}
    </div>
  );
};

export default StatusFilter;


// // src/components/StatusFilter.js
// import React from "react";

// const StatusFilter = ({ setFilterStatus }) => {
//   return (
//     <div className="mb-3">
//       <span className="me-2">Filter:</span>
//       <button
//         className="btn btn-outline-primary btn-sm me-1"
//         onClick={() => setFilterStatus("all")}
//       >
//         All
//       </button>
//       <button
//         className="btn btn-outline-success btn-sm me-1"
//         onClick={() => setFilterStatus("completed")}
//       >
//         Completed
//       </button>
//       <button
//         className="btn btn-outline-warning btn-sm"
//         onClick={() => setFilterStatus("pending")}
//       >
//         Pending
//       </button>
//     </div>
//   );
// };

// export default StatusFilter;
