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
    <div className="d-flex align-items-center">
      <input
        type="text"
        className="form-control me-2"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <input
        type="date"
        className="form-control me-2"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button className="btn btn-success btn-sm me-2" onClick={handleSave}>
        Save
      </button>
      <button className="btn btn-secondary btn-sm" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
};

export default UpdateTodo;
