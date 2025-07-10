// src/components/TaskForm.js
import React, { useState } from 'react';

const TaskForm = ({ onAddTask }) => {
  const [text, setText] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text && date) {
      onAddTask({ text, date });
      setText('');
      setDate('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Task name"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
      </div>
      <div className="mb-2">
        <input
          type="date"
          className="form-control"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary w-100">Add Task</button>
    </form>
  );
};

export default TaskForm;
