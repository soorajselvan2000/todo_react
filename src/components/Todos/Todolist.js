// src/components/Todos/TodoList.js
import React, { useEffect, useState } from "react";
import CreateTodo from "./CreateTodo";
import {
  createTodo,
  updateTodo,
  deleteTodo,
  getTodosStatus,
  getTodosByDate,
} from "../../services/api";
import StatusFilter from "../Todos/StatusFilter";
import UpdateTodo from "./UpdateTodo";
import ExportTodos from "./ExportTodos";
import ImportTodos from "./ImportTodos";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  // const [newTask, setNewTask] = useState("");
  // const [newDate, setNewDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const todoLimit = isPremium ? 10 : 5;

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 3;

  // Fetch all todos
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const data = await getTodosStatus();
      setTodos(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Create new todo
  // const handleCreate = async () => 
  // {
  //   if (!newTask.trim() || !newDate) return;

  //   try {
  //     const created = await createTodo({
  //       task: newTask,
  //       date: newDate,
  //       is_completed: false,
  //     });

  //     setTodos([created, ...todos]);
  //     setNewTask("");
  //     setNewDate("");
  //     setCurrentPage(1); // reset to first page

  //     setToastMessage("Todo created successfully!");
  //     setShowToast(true);
  //     setTimeout(() => setShowToast(false), 3000);
  //   } catch (err) {
  //     setError(err.response?.data?.detail || "Failed to create todo");
  //     setToastMessage("Failed to create todo!");
  //     setShowToast(true);
  //     setTimeout(() => setShowToast(false), 3000);
  //   }
  // };

  // Toggle complete/undo
  const handleToggleComplete = async (todo) => {
    try {
      const updatedStatus = !todo.is_completed;
      await updateTodo(todo.id, {
        task: todo.task,
        date: todo.date,
        is_completed: updatedStatus,
      });
      setTodos(
        todos.map((t) =>
          t.id === todo.id ? { ...t, is_completed: updatedStatus } : t
        )
      );
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update todo status");
    }
  };

  // Delete todo
  const confirmDelete = (todo) => {
    setTodoToDelete(todo);
  };

  const handleDeleteConfirmed = async () => {
    if (!todoToDelete) return;
    try {
      await deleteTodo(todoToDelete.id);
      setTodos(todos.filter((t) => t.id !== todoToDelete.id));
      setTodoToDelete(null);

      setToastMessage("Todo deleted successfully!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete todo");
    }
  };

  // Search todos by date
  const handleSearchByDate = async () => {
    if (!searchDate) return fetchTodos();
    setLoading(true);
    try {
      const data = await getTodosByDate(searchDate);
      setTodos(data);
      setCurrentPage(1);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch todos by date");
    } finally {
      setLoading(false);
    }
  };

  // Edit handlers
  const startEdit = (id) => setEditingId(id);
  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (id, task, date) => {
    try {
      await updateTodo(id, { task, date });
      setTodos(
        todos.map((t) =>
          t.id === id ? { ...t, task: task, date: date } : t
        )
      );
      cancelEdit();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to edit todo");
    }
  };

  // Filter todos
  const filteredTodos = todos.filter((todo) => {
    if (filterStatus === "completed") return todo.is_completed;
    if (filterStatus === "pending") return !todo.is_completed;
    return true;
  });

  // ✅ Pagination logic
  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = filteredTodos.slice(indexOfFirstTodo, indexOfLastTodo);
  const totalPages = Math.ceil(filteredTodos.length / todosPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="container mt-5">
      <h2>My Todos</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* <CreateTodo onCreate={async (task, date) => {
        try {
          const created = await createTodo({
            task,
            date,
            is_completed: false,
          });

          setTodos([created, ...todos]);
          setCurrentPage(1);

          setToastMessage("Todo created successfully!");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        } catch (err) {
          setError(err.response?.data?.detail || "Failed to create todo");
          setToastMessage("Failed to create todo!");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
      }} /> */}
      <CreateTodo
        onCreate={async (task, date) => {
          try {
            if (todos.length >= todoLimit) {
              setToastMessage(`You have reached your ${isPremium ? 'premium' : 'free'} plan limit (${todoLimit} todos)!`);
              setShowToast(true);
              setTimeout(() => setShowToast(false), 4000);
              return;
            }

            const created = await createTodo({ task, date, is_completed: false });
            setTodos([created, ...todos]);
            setCurrentPage(1);

            setToastMessage("Todo created successfully!");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
          } catch (err) {
            const errorMsg = err.response?.data?.error || "Failed to create todo";
            setToastMessage(errorMsg);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
          }
        }}
      />



      {/* Search by date */}
      <div className="input-group mb-3">
        <input
          type="date"
          className="form-control"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        <button className="btn btn-secondary" onClick={handleSearchByDate}>
          Search
        </button>
      </div>

      {/* Import / Export */}
      <ExportTodos todos={todos} />
      <ImportTodos onImportSuccess={fetchTodos} />

      {/* Status filter */}
      <StatusFilter setFilterStatus={setFilterStatus} />

      <div className="mb-3 text-end">
        {!isPremium && (
          <button
            className="btn btn-warning"
            onClick={() => {
              setIsPremium(true);
              setToastMessage("Upgraded to premium! Your limit is now 10 todos.");
              setShowToast(true);
              setTimeout(() => setShowToast(false), 4000);
            }}
          >
            Go Premium
          </button>
        )}
      </div>


      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <ul className="list-group">
            {currentTodos.map((todo) => (
              <li
                key={todo.id}
                className={`list-group-item d-flex justify-content-between align-items-center ${
                  todo.is_completed ? "list-group-item-success" : ""
                }`}
              >
                {editingId === todo.id ? (
                  <UpdateTodo
                    todo={todo}
                    onSave={saveEdit}
                    onCancel={cancelEdit}
                  />
                ) : (
                  <>
                    <span
                      style={{
                        textDecoration: todo.is_completed ? "line-through" : "",
                        cursor: "pointer",
                      }}
                    >
                      {todo.task} ({todo.date})
                      {todo.is_imported && (
                        <span className="badge bg-warning text-dark ms-2">
                          Imported
                        </span>
                      )}
                    </span>
                    <div>
                      <button
                        className={`btn btn-${
                          todo.is_completed ? "secondary" : "success"
                        } btn-sm me-2`}
                        onClick={() => handleToggleComplete(todo)}
                      >
                        {todo.is_completed ? "Undo" : "Complete"}
                      </button>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => startEdit(todo.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => confirmDelete(todo)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>

          {/* ✅ Pagination controls */}
          {totalPages > 1 && (
            <nav className="mt-3">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => goToPage(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                  <li
                    key={i + 1}
                    className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                  >
                    <button className="page-link" onClick={() => goToPage(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => goToPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {todoToDelete && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header bg-danger text-white rounded-top-4">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setTodoToDelete(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete{" "}
                  <strong>{todoToDelete.task}</strong>?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setTodoToDelete(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleDeleteConfirmed}>
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showToast && (
        <div
          className="toast show position-fixed bottom-0 end-0 m-3"
          role="alert"
          style={{ zIndex: 1050 }}
        >
          <div className="toast-header bg-success text-white">
            <strong className="me-auto">Success</strong>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => setShowToast(false)}
            ></button>
          </div>
          <div className="toast-body">{toastMessage}</div>
        </div>
      )}
    </div>
  );
};

export default TodoList;
