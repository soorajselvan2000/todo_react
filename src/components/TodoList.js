import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Form,
  Table,
  Badge,
  Toast,
  ToastContainer,
  Modal,
  Dropdown,
  DropdownButton,
  InputGroup
} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import StatusFilter from './StatusFilter';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ImportDropdown from './ImportDropdown';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [date, setDate] = useState(new Date());
  const [editingId, setEditingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const token = localStorage.getItem('token');

  const fetchTodos = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/todos/status/?status=${statusFilter}`,
        { headers: { Authorization: `Token ${token}` } }
      );
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [statusFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { task, date: date.toISOString().split('T')[0] };

    try {
      if (editingId) {
        await axios.put(`http://localhost:8000/api/todos/${editingId}/update/`, data, {
          headers: { Authorization: `Token ${token}` },
        });
        setEditingId(null);
        showToastMessage('✅ Todo updated');
      } else {
        await axios.post(`http://localhost:8000/api/todos/create/`, data, {
          headers: { Authorization: `Token ${token}` },
        });
        showToastMessage('✅ Todo added');
      }
      setTask('');
      fetchTodos();
    } catch (error) {
      console.error('Error saving todo:', error);
    }
  };

  const handleEdit = (todo) => {
    setTask(todo.task);
    setDate(new Date(todo.date));
    setEditingId(todo.id);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/todos/${todoToDelete}/delete/`, {
        headers: { Authorization: `Token ${token}` },
      });
      fetchTodos();
      showToastMessage('🗑️ Todo deleted');
    } catch (error) {
      console.error('Error deleting todo:', error);
    } finally {
      setShowModal(false);
      setTodoToDelete(null);
    }
  };

  const openDeleteModal = (id) => {
    setTodoToDelete(id);
    setShowModal(true);
  };

  const handleToggleComplete = async (todo) => {
    try {
      await axios.put(
        `http://localhost:8000/api/todos/${todo.id}/update/`,
        {
          task: todo.task,
          date: todo.date,
          is_completed: !todo.is_completed,
        },
        { headers: { Authorization: `Token ${token}` } }
      );
      fetchTodos();
    } catch (error) {
      console.error('Error toggling complete:', error);
    }
  };

  const showToastMessage = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const filteredTodos = todos.filter(todo =>
    todo.task.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportAsJson = () => {
    const blob = new Blob([JSON.stringify(filteredTodos, null, 2)], { type: 'application/json' });
    downloadBlob(blob, 'todos.json');
  };

  const exportAsText = () => {
    const text = filteredTodos.map(todo => `${todo.date} - ${todo.task} - ${todo.is_completed ? 'Completed' : 'Pending'}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    downloadBlob(blob, 'todos.txt');
  };

  const exportAsCSV = () => {
    const csv = 'Date,Task,Status\n' +
      filteredTodos.map(todo => `${todo.date},"${todo.task}",${todo.is_completed ? 'Completed' : 'Pending'}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    downloadBlob(blob, 'todos.csv');
  };

  const exportAsPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Date', 'Task', 'Status']],
      body: filteredTodos.map(todo => [todo.date, todo.task, todo.is_completed ? 'Completed' : 'Pending'])
    });
    doc.save('todos.pdf');
  };

  const exportAsSQL = () => {
    const sqlStatements = filteredTodos.map(todo =>
      `INSERT INTO todos (date, task, is_completed) VALUES ('${todo.date}', '${todo.task.replace(/'/g, "''")}', ${todo.is_completed});`
    ).join('\n');
    const blob = new Blob([sqlStatements], { type: 'text/sql' });
    downloadBlob(blob, 'todos.sql');
  };

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">My Todo List</h2>

      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Control
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          required
          placeholder="Enter your task"
          className="mb-3"
        />

        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          className="form-control mb-3"
          dateFormat="yyyy-MM-dd"
          placeholderText="Pick a date"
        />

        <Button type="submit" variant="primary">
          {editingId ? 'Update Todo' : 'Add Todo'}
        </Button>
      </Form>

      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Search todos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <DropdownButton variant="secondary" title="Export" id="export-dropdown">
          <Dropdown.Item onClick={exportAsJson}>Export as JSON</Dropdown.Item>
          <Dropdown.Item onClick={exportAsCSV}>Export as CSV</Dropdown.Item>
          <Dropdown.Item onClick={exportAsText}>Export as Text</Dropdown.Item>
          <Dropdown.Item onClick={exportAsSQL}>Export as SQL</Dropdown.Item>
        </DropdownButton>
      </InputGroup>

      <ImportDropdown onImportSuccess={fetchTodos} />

      <StatusFilter selectedStatus={statusFilter} onStatusChange={setStatusFilter} />

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Date</th>
            <th>Task</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTodos.map((todo) => (
            <tr key={todo.id}>
              <td>{todo.date}</td>
              <td style={{ textDecoration: todo.is_completed ? 'line-through' : 'none' }}>
                {todo.task}
              </td>
              <td>
                <Badge bg={todo.is_completed ? 'success' : 'warning'}>
                  {todo.is_completed ? 'Completed' : 'Pending'}
                </Badge>
              </td>
              <td>
                <Button size="sm" onClick={() => handleEdit(todo)} variant="info" className="me-2">
                  Edit
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleToggleComplete(todo)}
                  variant="secondary"
                  className="me-2"
                >
                  {todo.is_completed ? 'Undo' : 'Mark Done'}
                </Button>
                <Button size="sm" onClick={() => openDeleteModal(todo.id)} variant="danger">
                  Delete
                </Button>
              </td>
            </tr>
          ))}
          {filteredTodos.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">
                No tasks found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Toast Notification */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast bg="dark" onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#6f42c1' }}>
          <Modal.Title className="text-white">Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TodoList;
