// src/components/TaskList.js
import React from 'react';

const TaskList = ({ tasks, onComplete, onDelete, onEdit }) => {
  return (
    <ul className="list-group">
      {tasks.map((task, index) => (
        <li
          key={index}
          className={`list-group-item d-flex justify-content-between align-items-center ${task.completed ? 'text-decoration-line-through' : ''}`}
        >
          <div>
            <strong>{task.text}</strong><br />
            <small className="text-muted">{task.date}</small>
          </div>
          <div>
            <button className="btn btn-sm btn-success me-1" onClick={() => onComplete(index)}>✔</button>
            <button className="btn btn-sm btn-primary me-1" onClick={() => onEdit(index)}>Edit</button>
            <button className="btn btn-sm btn-danger" onClick={() => onDelete(index)}>🗑️</button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
