import React, { useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

const App = () => {
  const [tasks, setTasks] = useState([]);

  const handleAddTask = (newTask) => {
    setTasks([...tasks, { ...newTask, completed: false }]);
  };

  const handleComplete = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  const handleDelete = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  const handleEdit = (index) => {
    const newText = prompt("Edit task", tasks[index].text);
    if (newText) {
      const updated = [...tasks];
      updated[index].text = newText;
      setTasks(updated);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">React ToDo List</h2>
      <TaskForm onAddTask={handleAddTask} />
      <TaskList tasks={tasks} onComplete={handleComplete} onDelete={handleDelete} onEdit={handleEdit} />
    </div>
  );
};

export default App;
