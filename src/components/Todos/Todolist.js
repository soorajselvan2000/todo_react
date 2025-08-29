// src/components/Todos/TodoList.js
import React, { useEffect, useState } from "react";
import CreateTodo from "./CreateTodo";
import ExportTodos from "./ExportTodos";
import { useNavigate } from "react-router-dom";
import {
  createTodo,
  updateTodo,
  deleteTodo,
  getTodosStatus,
  getTodosByDate,
} from "../../services/api";
import StatusFilter from "./StatusFilter";
import UpdateTodo from "./UpdateTodo";
import ImportTodos from "./ImportTodos";
import BackgroundWrapper from "../BackgroundWrapper";

const TodoList = () => {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 5;

    // Check login status on component mount
  useEffect(() => {
    const token = localStorage.getItem("token"); // <-- token should be stored on login
    if (!token) {
      navigate("/login"); // <-- redirect to login if not logged in
      return;
    }

    // Check if user is premium
    const premiumStatus = localStorage.getItem("isPremium") === "true";
    setIsPremium(premiumStatus);

    // Fetch todos
    fetchTodos();
  }, [navigate]);

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
    // Check if user is premium (this would typically come from an API)
    const premiumStatus = localStorage.getItem("isPremium") === "true";
    setIsPremium(premiumStatus);
  }, []);

  // Create new todo
  const handleCreate = async (task, date) => {
    if (!task.trim() || !date) return;

    const maxTodos = isPremium ? 10 : 5;
    if (todos.length >= maxTodos) {
      setToastMessage(`You've reached the maximum of ${maxTodos} todos. Upgrade to premium for more!`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    try {
      const created = await createTodo({ task, date, is_completed: false });
      setTodos([created, ...todos]);
      setCurrentPage(1);
      setToastMessage("Todo created successfully!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create todo");
      setToastMessage(err.response?.data?.error || "Failed to create todo!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

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
  const confirmDelete = (todo) => setTodoToDelete(todo);

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
        todos.map((t) => (t.id === id ? { ...t, task, date } : t))
      );
      cancelEdit();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to edit todo");
    }
  };

  // Upgrade to premium
  const handleUpgradeToPremium = () => {
    setIsPremium(true);
    localStorage.setItem("isPremium", "true");
    setShowPremiumModal(false);
    setToastMessage("Congratulations! You've upgraded to Premium!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Filter todos
  const filteredTodos = todos.filter((todo) => {
    if (filterStatus === "completed") return todo.is_completed;
    if (filterStatus === "pending") return !todo.is_completed;
    return true;
  });

  // Pagination logic
  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = filteredTodos.slice(indexOfFirstTodo, indexOfLastTodo);
  const totalPages = Math.ceil(filteredTodos.length / todosPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <BackgroundWrapper>
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8">
            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
              <div>
                <h2 className="mb-0 fw-bold text-primary">
                  <i className="bi bi-check2-circle me-2"></i>
                  My Todos
                </h2>
                <p className="text-muted mb-0">
                  {isPremium ? "Premium User" : "Free Plan"} • {todos.length}/{isPremium ? 10 : 5} tasks
                </p>
              </div>
              
              {!isPremium && (
                <button 
                  className="btn btn-warning d-flex align-items-center"
                  onClick={() => setShowPremiumModal(true)}
                >
                  <i className="bi bi-star-fill me-2"></i>
                  Upgrade to Premium
                </button>
              )}
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* Create Todo */}
            <CreateTodo onCreate={handleCreate} maxReached={todos.length >= (isPremium ? 10 : 5)} />

            {/* Search and Filter Section */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h6 className="card-title text-muted mb-3">
                  <i className="bi bi-funnel me-1"></i>
                  FILTER & SEARCH
                </h6>
                
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-calendar text-primary"></i>
                      </span>
                      <input
                        type="date"
                        className="form-control border-start-0"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                      />
                      <button 
                        className="btn btn-primary d-flex align-items-center"
                        onClick={handleSearchByDate}
                      >
                        <i className="bi bi-search me-1"></i> Search
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-12 col-md-6">
                    <StatusFilter setFilterStatus={setFilterStatus} />
                  </div>
                </div>
                
                {/* Import / Export */}
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center mt-3 gap-2">
                  <ExportTodos todos={todos} />
                  <ImportTodos onImportSuccess={fetchTodos} />
                </div>
              </div>
            </div>

            {/* Todo List */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading todos...</p>
              </div>
            ) : (
              <>
                {filteredTodos.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-check2-circle display-4 text-muted"></i>
                    <p className="mt-3 text-muted">No todos found. Add a new task or change your filters.</p>
                  </div>
                ) : (
                  <>
                    <ul className="list-group mb-4 shadow-sm">
                      {currentTodos.map((todo) => (
                        <li
                          key={todo.id}
                          className={`list-group-item list-group-item-action ${todo.is_completed ? 'bg-light' : ''}`}
                        >
                          {editingId === todo.id ? (
                            <UpdateTodo
                              todo={todo}
                              onSave={saveEdit}
                              onCancel={cancelEdit}
                            />
                          ) : (
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center py-2 gap-2">
                              <div className="d-flex align-items-center flex-grow-1">
                                <div 
                                  className={`form-check me-3 ${todo.is_completed ? 'text-decoration-line-through text-muted' : ''}`}
                                  style={{minWidth: 0}}
                                >
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={todo.is_completed}
                                    onChange={() => handleToggleComplete(todo)}
                                    id={`checkbox-${todo.id}`}
                                  />
                                  <label 
                                    className="form-check-label" 
                                    htmlFor={`checkbox-${todo.id}`}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <span className="fw-medium">{todo.task}</span>
                                    <small className="text-muted ms-2">{todo.date}</small>
                                    {todo.is_imported && (
                                      <span className="badge bg-warning text-dark ms-2">
                                        <i className="bi bi-cloud-arrow-down-fill me-1"></i>Imported
                                      </span>
                                    )}
                                  </label>
                                </div>
                              </div>
                              <div className="btn-group btn-group-sm">
                                <button
                                  className={`btn ${todo.is_completed ? 'btn-outline-secondary' : 'btn-outline-success'}`}
                                  onClick={() => handleToggleComplete(todo)}
                                  title={todo.is_completed ? "Undo" : "Complete"}
                                >
                                  <i className={`bi ${todo.is_completed ? 'bi-arrow-counterclockwise' : 'bi-check-lg'}`}></i>
                                </button>
                                <button
                                  className="btn btn-outline-warning"
                                  onClick={() => startEdit(todo.id)}
                                  title="Edit"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-outline-danger"
                                  onClick={() => confirmDelete(todo)}
                                  title="Delete"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>

                    {/* Pagination controls */}
                    {totalPages > 1 && (
                      <nav className="d-flex justify-content-center">
                        <ul className="pagination shadow-sm">
                          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                            <button
                              className="page-link"
                              onClick={() => goToPage(currentPage - 1)}
                            >
                              <i className="bi bi-chevron-left"></i>
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
                              <i className="bi bi-chevron-right"></i>
                            </button>
                          </li>
                        </ul>
                      </nav>
                    )}
                  </>
                )}
              </>
            )}

            {/* Delete Confirmation Modal */}
            {todoToDelete && (
              <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content rounded-4 shadow">
                    <div className="modal-header border-0 pb-0">
                      <h5 className="modal-title text-danger">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        Confirm Delete
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setTodoToDelete(null)}
                      ></button>
                    </div>
                    <div className="modal-body py-4">
                      <p>
                        Are you sure you want to delete <strong>"{todoToDelete.task}"</strong>?
                      </p>
                      <p className="text-muted small mb-0">This action cannot be undone.</p>
                    </div>
                    <div className="modal-footer border-0">
                      <button
                        className="btn btn-secondary rounded-pill px-4"
                        onClick={() => setTodoToDelete(null)}
                      >
                        Cancel
                      </button>
                      <button 
                        className="btn btn-danger rounded-pill px-4 d-flex align-items-center"
                        onClick={handleDeleteConfirmed}
                      >
                        <i className="bi bi-trash me-2"></i>Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Premium Upgrade Modal */}
            {showPremiumModal && (
              <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content rounded-4 shadow">
                    <div className="modal-header border-0 pb-0 bg-warning text-dark rounded-top-4">
                      <h5 className="modal-title">
                        <i className="bi bi-star-fill me-2"></i>
                        Upgrade to Premium
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowPremiumModal(false)}
                      ></button>
                    </div>
                    <div className="modal-body py-4">
                      <h6 className="mb-3">Unlock Premium Features:</h6>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex align-items-center border-0">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          Create up to 10 todos (instead of 5)
                        </li>
                        <li className="list-group-item d-flex align-items-center border-0">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          Priority support
                        </li>
                        <li className="list-group-item d-flex align-items-center border-0">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          Advanced export options
                        </li>
                      </ul>
                      <div className="mt-4 p-3 bg-light rounded">
                        <h5 className="text-center mb-0">Only $4.99/month</h5>
                      </div>
                    </div>
                    <div className="modal-footer border-0">
                      <button
                        className="btn btn-secondary rounded-pill px-4"
                        onClick={() => setShowPremiumModal(false)}
                      >
                        Maybe Later
                      </button>
                      <button 
                        className="btn btn-warning rounded-pill px-4 d-flex align-items-center"
                        onClick={handleUpgradeToPremium}
                      >
                        <i className="bi bi-credit-card me-2"></i>Upgrade Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Success Toast */}
            {showToast && (
              <div
                className="toast show position-fixed top-0 end-0 m-3"
                role="alert"
                style={{ zIndex: 1060 }}
              >
                <div className="toast-header bg-success text-white">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  <strong className="me-auto">Success</strong>
                  <small>Just now</small>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowToast(false)}
                  ></button>
                </div>
                <div className="toast-body bg-light">{toastMessage}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </BackgroundWrapper>
  );
};

export default TodoList;






// // src/components/Todos/TodoList.js
// import React, { useEffect, useState } from "react";
// import CreateTodo from "./CreateTodo";
// import {
//   createTodo,
//   updateTodo,
//   deleteTodo,
//   getTodosStatus,
//   getTodosByDate,
//   exportTodos,
// } from "../../services/api";
// import StatusFilter from "./StatusFilter";
// import UpdateTodo from "./UpdateTodo";
// import ImportTodos from "./ImportTodos";

// const TodoList = () => {
//   const [todos, setTodos] = useState([]);
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [todoToDelete, setTodoToDelete] = useState(null);
//   const [showToast, setShowToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [searchDate, setSearchDate] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [editingId, setEditingId] = useState(null);

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const todosPerPage = 3;

//   // Fetch all todos
//   const fetchTodos = async () => {
//     setLoading(true);
//     try {
//       const data = await getTodosStatus();
//       setTodos(data);
//     } catch (err) {
//       setError(err.response?.data?.detail || "Failed to fetch todos");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTodos();
//   }, []);

//   // Create new todo
//   const handleCreate = async (task, date) => {
//     if (!task.trim() || !date) return;

//     try {
//       const created = await createTodo({ task, date, is_completed: false });
//       setTodos([created, ...todos]);
//       setCurrentPage(1);
//       setToastMessage("Todo created successfully!");
//       setShowToast(true);
//       setTimeout(() => setShowToast(false), 3000);
//     } catch (err) {
//       setError(err.response?.data?.detail || "Failed to create todo");
//       setToastMessage(err.response?.data?.error || "Failed to create todo!");
//       setShowToast(true);
//       setTimeout(() => setShowToast(false), 3000);
//     }
//   };

//   // Toggle complete/undo
//   const handleToggleComplete = async (todo) => {
//     try {
//       const updatedStatus = !todo.is_completed;
//       await updateTodo(todo.id, {
//         task: todo.task,
//         date: todo.date,
//         is_completed: updatedStatus,
//       });
//       setTodos(
//         todos.map((t) =>
//           t.id === todo.id ? { ...t, is_completed: updatedStatus } : t
//         )
//       );
//     } catch (err) {
//       setError(err.response?.data?.detail || "Failed to update todo status");
//     }
//   };

//   // Delete todo
//   const confirmDelete = (todo) => setTodoToDelete(todo);

//   const handleDeleteConfirmed = async () => {
//     if (!todoToDelete) return;
//     try {
//       await deleteTodo(todoToDelete.id);
//       setTodos(todos.filter((t) => t.id !== todoToDelete.id));
//       setTodoToDelete(null);
//       setToastMessage("Todo deleted successfully!");
//       setShowToast(true);
//       setTimeout(() => setShowToast(false), 3000);
//     } catch (err) {
//       setError(err.response?.data?.detail || "Failed to delete todo");
//     }
//   };

//   // Search todos by date
//   const handleSearchByDate = async () => {
//     if (!searchDate) return fetchTodos();
//     setLoading(true);
//     try {
//       const data = await getTodosByDate(searchDate);
//       setTodos(data);
//       setCurrentPage(1);
//     } catch (err) {
//       setError(err.response?.data?.detail || "Failed to fetch todos by date");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Edit handlers
//   const startEdit = (id) => setEditingId(id);
//   const cancelEdit = () => setEditingId(null);

//   const saveEdit = async (id, task, date) => {
//     try {
//       await updateTodo(id, { task, date });
//       setTodos(
//         todos.map((t) => (t.id === id ? { ...t, task, date } : t))
//       );
//       cancelEdit();
//     } catch (err) {
//       setError(err.response?.data?.detail || "Failed to edit todo");
//     }
//   };

//   // Filter todos
//   const filteredTodos = todos.filter((todo) => {
//     if (filterStatus === "completed") return todo.is_completed;
//     if (filterStatus === "pending") return !todo.is_completed;
//     return true;
//   });

//   // Pagination logic
//   const indexOfLastTodo = currentPage * todosPerPage;
//   const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
//   const currentTodos = filteredTodos.slice(indexOfFirstTodo, indexOfLastTodo);
//   const totalPages = Math.ceil(filteredTodos.length / todosPerPage);

//   const goToPage = (page) => {
//     if (page >= 1 && page <= totalPages) setCurrentPage(page);
//   };

//   return (
//     <div className="container mt-5">
//       <h2>My Todos</h2>
//       {error && <div className="alert alert-danger">{error}</div>}

//       <CreateTodo onCreate={handleCreate} />

//       {/* Search by date */}
//       <div className="input-group mb-3">
//         <input
//           type="date"
//           className="form-control"
//           value={searchDate}
//           onChange={(e) => setSearchDate(e.target.value)}
//         />
//         <button className="btn btn-secondary" onClick={handleSearchByDate}>
//           Search
//         </button>
//       </div>

//       {/* Import / Export */}
//       <div className="d-flex align-items-center mb-3">
//         {/* Export Dropdown */}
//         <div className="dropdown me-3">
//           <button
//             className="btn btn-success dropdown-toggle"
//             type="button"
//             id="exportDropdown"
//             data-bs-toggle="dropdown"
//             aria-expanded="false"
//           >
//             Export Todos
//           </button>
//           <ul className="dropdown-menu" aria-labelledby="exportDropdown">
//             <li>
//               <button className="dropdown-item" onClick={() => exportTodos("csv")}>
//                 Export as CSV
//               </button>
//             </li>
//             <li>
//               <button className="dropdown-item" onClick={() => exportTodos("json")}>
//                 Export as JSON
//               </button>
//             </li>
//             <li>
//               <button className="dropdown-item" onClick={() => exportTodos("txt")}>
//                 Export as TXT
//               </button>
//             </li>
//             <li>
//               <button className="dropdown-item" onClick={() => exportTodos("pdf")}>
//                 Export as PDF
//               </button>
//             </li>
//             <li>
//               <button className="dropdown-item" onClick={() => exportTodos("sql")}>
//                 Export as SQL
//               </button>
//             </li>
//           </ul>
//         </div>

//         <ImportTodos onImportSuccess={fetchTodos} />
//       </div>

//       {/* Status filter */}
//       <StatusFilter setFilterStatus={setFilterStatus} />

//       {loading ? (
//         <div>Loading...</div>
//       ) : (
//         <>
//           <ul className="list-group">
//             {currentTodos.map((todo) => (
//               <li
//                 key={todo.id}
//                 className={`list-group-item d-flex justify-content-between align-items-center ${
//                   todo.is_completed ? "list-group-item-success" : ""
//                 }`}
//               >
//                 {editingId === todo.id ? (
//                   <UpdateTodo
//                     todo={todo}
//                     onSave={saveEdit}
//                     onCancel={cancelEdit}
//                   />
//                 ) : (
//                   <>
//                     <span
//                       style={{
//                         textDecoration: todo.is_completed ? "line-through" : "",
//                         cursor: "pointer",
//                       }}
//                     >
//                       {todo.task} ({todo.date})
//                       {todo.is_imported && (
//                         <span className="badge bg-warning text-dark ms-2">
//                           Imported
//                         </span>
//                       )}
//                     </span>
//                     <div>
//                       <button
//                         className={`btn btn-${
//                           todo.is_completed ? "secondary" : "success"
//                         } btn-sm me-2`}
//                         onClick={() => handleToggleComplete(todo)}
//                       >
//                         {todo.is_completed ? "Undo" : "Complete"}
//                       </button>
//                       <button
//                         className="btn btn-warning btn-sm me-2"
//                         onClick={() => startEdit(todo.id)}
//                       >
//                         Edit
//                       </button>
//                       <button
//                         className="btn btn-danger btn-sm"
//                         onClick={() => confirmDelete(todo)}
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </li>
//             ))}
//           </ul>

//           {/* Pagination controls */}
//           {totalPages > 1 && (
//             <nav className="mt-3">
//               <ul className="pagination justify-content-center">
//                 <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//                   <button
//                     className="page-link"
//                     onClick={() => goToPage(currentPage - 1)}
//                   >
//                     Previous
//                   </button>
//                 </li>
//                 {[...Array(totalPages)].map((_, i) => (
//                   <li
//                     key={i + 1}
//                     className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
//                   >
//                     <button className="page-link" onClick={() => goToPage(i + 1)}>
//                       {i + 1}
//                     </button>
//                   </li>
//                 ))}
//                 <li
//                   className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
//                 >
//                   <button
//                     className="page-link"
//                     onClick={() => goToPage(currentPage + 1)}
//                   >
//                     Next
//                   </button>
//                 </li>
//               </ul>
//             </nav>
//           )}
//         </>
//       )}

//       {/* Delete Confirmation Modal */}
//       {todoToDelete && (
//         <div
//           className="modal fade show"
//           style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
//         >
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content rounded-4 shadow">
//               <div className="modal-header bg-danger text-white rounded-top-4">
//                 <h5 className="modal-title">Confirm Delete</h5>
//                 <button
//                   type="button"
//                   className="btn-close btn-close-white"
//                   onClick={() => setTodoToDelete(null)}
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <p>
//                   Are you sure you want to delete <strong>{todoToDelete.task}</strong>?
//                 </p>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   className="btn btn-secondary"
//                   onClick={() => setTodoToDelete(null)}
//                 >
//                   Cancel
//                 </button>
//                 <button className="btn btn-danger" onClick={handleDeleteConfirmed}>
//                   Yes, Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Success Toast */}
//       {showToast && (
//         <div
//           className="toast show position-fixed bottom-0 end-0 m-3"
//           role="alert"
//           style={{ zIndex: 1050 }}
//         >
//           <div className="toast-header bg-success text-white">
//             <strong className="me-auto">Success</strong>
//             <button
//               type="button"
//               className="btn-close btn-close-white"
//               onClick={() => setShowToast(false)}
//             ></button>
//           </div>
//           <div className="toast-body">{toastMessage}</div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TodoList;

