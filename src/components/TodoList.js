import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Table, Badge } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [date, setDate] = useState(new Date());
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login'); // Redirect to login if not authenticated
    } else {
      fetchTodos();
    }
    // eslint-disable-next-line
  }, [date]);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/todos/?date=${date.toISOString().split('T')[0]}`, {
        headers: { Authorization: `Token ${token}` },
      });
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { task, date: date.toISOString().split('T')[0] };

    try {
      if (editingId) {
        await axios.put(`http://localhost:8000/api/todos/${editingId}/update/`, data, {
          headers: { Authorization: `Token ${token}` },
        });
        setEditingId(null);
      } else {
        await axios.post(`http://localhost:8000/api/todos/create/`, data, {
          headers: { Authorization: `Token ${token}` },
        });
      }
      setTask('');
      fetchTodos();
    } catch (error) {
      console.error('Error saving todo:', error);
    }
  };

  const handleEdit = (todo) => {
    setTask(todo.task);
    setEditingId(todo.id);
  };

const handleDelete = async (id) => {
  const confirmDelete = window.confirm("🗑️ Are you sure you want to delete this task?");
  if (!confirmDelete) return;

  try {
    await axios.delete(`http://localhost:8000/api/todos/${id}/delete/`, {
      headers: { Authorization: `Token ${token}` },
    });
    fetchTodos();
  } catch (error) {
    console.error('Error deleting todo:', error);
  }
};

  const handleToggleComplete = async (todo) => {
    try {
      await axios.put(`http://localhost:8000/api/todos/${todo.id}/update/`, {
        task: todo.task,
        date: todo.date,
        is_completed: !todo.is_completed,
      }, {
        headers: { Authorization: `Token ${token}` },
      });
      fetchTodos();
    } catch (error) {
      console.error('Error toggling complete:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">My Todo List</h2>

      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group controlId="task">
          <Form.Label>Task</Form.Label>
          <Form.Control
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            required
            placeholder="Enter your task"
          />
        </Form.Group>

        <Form.Group controlId="date" className="mt-3">
          <Form.Label>Date</Form.Label>
          <br />
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            className="form-control"
            dateFormat="yyyy-MM-dd"
          />
        </Form.Group>

        <Button className="mt-3" type="submit" variant="primary">
          {editingId ? 'Update Todo' : 'Add Todo'}
        </Button>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Task</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <tr key={todo.id}>
              <td>{todo.date}</td>
              <td style={{ textDecoration: todo.is_completed ? 'line-through' : 'none' }}>{todo.task}</td>
              <td>
                <Badge bg={todo.is_completed ? 'success' : 'warning'}>
                  {todo.is_completed ? 'Completed' : 'Pending'}
                </Badge>
              </td>
              <td>
                <Button size="sm" onClick={() => handleEdit(todo)} variant="info" className="me-2">
                  Edit
                </Button>
                <Button size="sm" onClick={() => handleToggleComplete(todo)} variant="secondary" className="me-2">
                  {todo.is_completed ? 'Undo' : 'Mark Done'}
                </Button>
                <Button size="sm" onClick={() => handleDelete(todo.id)} variant="danger">
                  Delete
                </Button>
              </td>
            </tr>
          ))}
          {todos.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">No tasks for this date</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default TodoList;
