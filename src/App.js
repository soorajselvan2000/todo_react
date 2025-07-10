import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [taskText, setTaskText] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [tasks, setTasks] = useState([]);

  const handleAddTask = async () => {
    if (!taskText || !taskDate) return alert('Both fields required!');
    
    try {
      const res = await axios.post('http://localhost:8000/api/create-task/', {
        text: taskText,
        date: taskDate,
        completed: false
      });

      setTasks(prev => [...prev, res.data]);
      setTaskText('');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>📅 React To-Do List</h2>
      <div className="row g-2 mb-3">
        <div className="col-sm-4">
          <input type="date" className="form-control" value={taskDate} onChange={e => setTaskDate(e.target.value)} />
        </div>
        <div className="col-sm-5">
          <input type="text" className="form-control" placeholder="Enter task" value={taskText} onChange={e => setTaskText(e.target.value)} />
        </div>
        <div className="col-sm-3">
          <button className="btn btn-primary w-100" onClick={handleAddTask}>Add Task</button>
        </div>
      </div>

      <ul className="list-group">
        {tasks.map((task, i) => (
          <li key={i} className="list-group-item d-flex justify-content-between">
            <span>
              <strong>{task.text}</strong><br />
              <small className="text-muted">{task.date}</small>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
