// src/components/Todos/UpdateTodo.js
import React, { useState } from "react";

const UpdateTodo = ({ todo, onSave, onCancel }) => {
  const [task, setTask] = useState(todo.task);
  const [date, setDate] = useState(todo.date);

  const handleSave = () => {
    if (!task.trim() || !date) return;
    onSave(todo.id, task, date);
  };

  return (
    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center w-100 gap-2 py-2">
      <input
        type="text"
        className="form-control flex-fill"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Task description"
      />
      <input
        type="date"
        className="form-control"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <div className="d-flex gap-2 mt-2 mt-md-0">
        <button className="btn btn-success btn-sm d-flex align-items-center" onClick={handleSave}>
          <i className="bi bi-check-lg me-1"></i>Save
        </button>
        <button className="btn btn-secondary btn-sm d-flex align-items-center" onClick={onCancel}>
          <i className="bi bi-x-lg me-1"></i>Cancel
        </button>
      </div>
    </div>
  );
};

export default UpdateTodo;



// // src/components/Todos/UpdateTodo.js
// import React, { useState } from "react";

// const UpdateTodo = ({ todo, onSave, onCancel }) => {
//   const [task, setTask] = useState(todo.task);
//   const [date, setDate] = useState(todo.date);

//   const handleSave = () => {
//     if (!task.trim() || !date) return;
//     onSave(todo.id, task, date);
//   };

//   return (
//     <div className="d-flex align-items-center">
//       <input
//         type="text"
//         className="form-control me-2"
//         value={task}
//         onChange={(e) => setTask(e.target.value)}
//       />
//       <input
//         type="date"
//         className="form-control me-2"
//         value={date}
//         onChange={(e) => setDate(e.target.value)}
//       />
//       <button className="btn btn-success btn-sm me-2" onClick={handleSave}>
//         Save
//       </button>
//       <button className="btn btn-secondary btn-sm" onClick={onCancel}>
//         Cancel
//       </button>
//     </div>
//   );
// };

// export default UpdateTodo;
