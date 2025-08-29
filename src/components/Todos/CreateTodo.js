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
    <div className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Enter new task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        disabled={maxReached}
      />
      <input
        type="date"
        className="form-control"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        disabled={maxReached}
      />
      <button
        className="btn btn-primary"
        onClick={handleSubmit}
        disabled={maxReached}
      >
        {maxReached ? "Limit reached" : "Add"}
      </button>
    </div>
  );
};

export default CreateTodo;
