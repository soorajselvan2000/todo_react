// src/components/Todos/CreateTodo.js
import React, { useState } from "react";

const CreateTodo = ({ onCreate, maxReached }) => {
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = () => {
    if (!task.trim() || !date) return;
    onCreate(task, date);
    setTask("");
    setDate("");
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h6 className="card-title text-muted mb-3">
          <i className="bi bi-plus-circle me-1"></i>
          ADD NEW TASK
        </h6>
        <div className="row g-2">
          <div className="col-12 col-md-5">
            <input
              type="text"
              className="form-control"
              placeholder="What needs to be done?"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              disabled={maxReached}
            />
          </div>
          <div className="col-12 col-md-4">
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={maxReached}
            />
          </div>
          <div className="col-12 col-md-3">
            <button
              className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
              onClick={handleSubmit}
              disabled={maxReached}
            >
              <i className="bi bi-plus-circle me-2"></i>
              {maxReached ? "Limit reached" : "Add Task"}
            </button>
          </div>
        </div>
        {maxReached && (
          <div className="mt-2 text-warning small">
            <i className="bi bi-exclamation-triangle me-1"></i>
            You've reached the maximum number of tasks for your plan.
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTodo;


// // src/components/Todos/CreateTodo.js
// import React, { useState } from "react";

// const CreateTodo = ({ onCreate, maxReached }) => {
//   const [task, setTask] = useState("");
//   const [date, setDate] = useState("");

//   const handleSubmit = () => {
//     if (!task.trim() || !date) return;
//     onCreate(task, date);
//     setTask("");
//     setDate("");
//   };

//   return (
//     <div className="input-group mb-3">
//       <input
//         type="text"
//         className="form-control"
//         placeholder="Enter new task"
//         value={task}
//         onChange={(e) => setTask(e.target.value)}
//         disabled={maxReached}
//       />
//       <input
//         type="date"
//         className="form-control"
//         value={date}
//         onChange={(e) => setDate(e.target.value)}
//         disabled={maxReached}
//       />
//       <button
//         className="btn btn-primary"
//         onClick={handleSubmit}
//         disabled={maxReached}
//       >
//         {maxReached ? "Limit reached" : "Add"}
//       </button>
//     </div>
//   );
// };

// export default CreateTodo;
