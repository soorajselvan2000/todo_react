// src/components/Todos/ExportTodos.js
import React, { useState } from "react";
import { useDropdown } from "../../hooks/useDropdown";

const ExportTodos = ({ todos }) => {
  const { isOpen, toggleDropdown, dropdownRef } = useDropdown();
  const [exporting, setExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState("");

  if (!todos || todos.length === 0) return null; // Don't show if no todos

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = (format) => {
    setExporting(true);
    setExportMessage(`Exporting as ${format.toUpperCase()}...`);
    
    // Simulate a short delay for better UX
    setTimeout(() => {
      try {
        switch (format) {
          case "json":
            exportJSON();
            break;
          case "csv":
            exportCSV();
            break;
          case "txt":
            exportTXT();
            break;
          case "sql":
            exportSQL();
            break;
          default:
            break;
        }
        
        setExportMessage(`Exported successfully as ${format.toUpperCase()}!`);
        setTimeout(() => {
          setExportMessage("");
          toggleDropdown();
        }, 1500);
      } catch (error) {
        setExportMessage("Export failed");
        setTimeout(() => setExportMessage(""), 3000);
      } finally {
        setExporting(false);
      }
    }, 800);
  };

  const exportJSON = () => {
    const content = JSON.stringify(todos, null, 2);
    downloadFile(content, "todos.json", "application/json");
  };

  const exportCSV = () => {
    const headers = Object.keys(todos[0]);
    const csvRows = [
      headers.join(","), // header row
      ...todos.map((todo) =>
        headers.map((h) => `"${todo[h] != null ? todo[h] : ""}"`).join(",")
      ),
    ];
    const csvContent = csvRows.join("\n");
    downloadFile(csvContent, "todos.csv", "text/csv;charset=utf-8;");
  };

  const exportTXT = () => {
    const content = todos
      .map(
        (todo) =>
          `Task: ${todo.task}, Date: ${todo.date}, Completed: ${todo.is_completed}`
      )
      .join("\n");
    downloadFile(content, "todos.txt", "text/plain");
  };

  const exportSQL = () => {
    const content = todos
      .map(
        (todo) =>
          `INSERT INTO todos (id, task, date, is_completed, username) VALUES (${todo.id}, '${todo.task.replace(
            /'/g,
            "''"
          )}', '${todo.date}', ${todo.is_completed ? 1 : 0}, '${todo.username}');`
      )
      .join("\n");
    downloadFile(content, "todos.sql", "text/sql");
  };

  return (
    <div className="position-relative" ref={dropdownRef}>
      <button
        className="btn btn-outline-success dropdown-toggle d-flex align-items-center"
        onClick={toggleDropdown}
        disabled={exporting}
        aria-expanded={isOpen}
      >
        {exporting ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
            Exporting...
          </>
        ) : (
          <>
            <i className="bi bi-download me-2"></i>
            Export Todos
          </>
        )}
      </button>
      
      {isOpen && (
        <div className="dropdown-menu show shadow-lg border-0 rounded-3 p-2" style={{minWidth: '200px'}}>
          <h6 className="dropdown-header text-primary fw-bold">
            <i className="bi bi-file-earmark-arrow-down me-2"></i>
            Export Format
          </h6>
          
          <button 
            className="dropdown-item d-flex align-items-center py-2"
            onClick={() => handleExport("json")}
          >
            <i className="bi bi-filetype-json text-warning me-2"></i>
            JSON
          </button>
          
          <button 
            className="dropdown-item d-flex align-items-center py-2"
            onClick={() => handleExport("csv")}
          >
            <i className="bi bi-filetype-csv text-success me-2"></i>
            CSV
          </button>
          
          <button 
            className="dropdown-item d-flex align-items-center py-2"
            onClick={() => handleExport("txt")}
          >
            <i className="bi bi-filetype-txt text-secondary me-2"></i>
            Text File
          </button>
          
          <button 
            className="dropdown-item d-flex align-items-center py-2"
            onClick={() => handleExport("sql")}
          >
            <i className="bi bi-database text-primary me-2"></i>
            SQL
          </button>
        </div>
      )}
      
      {exportMessage && (
        <div className="toast show position-fixed bottom-0 start-50 translate-middle-x mb-3">
          <div className={`toast-header ${exportMessage.includes('failed') ? 'bg-danger' : 'bg-success'} text-white`}>
            <strong className="me-auto">
              {exportMessage.includes('failed') ? 'Error' : 'Success'}
            </strong>
            <button 
              type="button" 
              className="btn-close btn-close-white"
              onClick={() => setExportMessage("")}
            ></button>
          </div>
          <div className="toast-body">
            {exportMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportTodos;

// // src/components/Todos/ExportTodos.js
// import React from "react";

// const ExportTodos = ({ todos }) => {
//   if (!todos || todos.length === 0) return null; // Don't show if no todos

//   const downloadFile = (content, filename, type) => {
//     const blob = new Blob([content], { type });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = filename;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const exportJSON = () => {
//     const content = JSON.stringify(todos, null, 2);
//     downloadFile(content, "todos.json", "application/json");
//   };

//   const exportCSV = () => {
//     const headers = Object.keys(todos[0]);
//     const csvRows = [
//       headers.join(","), // header row
//       ...todos.map((todo) =>
//         headers.map((h) => `"${todo[h] != null ? todo[h] : ""}"`).join(",")
//       ),
//     ];
//     const csvContent = csvRows.join("\n");
//     downloadFile(csvContent, "todos.csv", "text/csv;charset=utf-8;");
//   };

//   const exportTXT = () => {
//     const content = todos
//       .map(
//         (todo) =>
//           `Task: ${todo.task}, Date: ${todo.date}, Completed: ${todo.is_completed}`
//       )
//       .join("\n");
//     downloadFile(content, "todos.txt", "text/plain");
//   };

//   const exportSQL = () => {
//     const content = todos
//       .map(
//         (todo) =>
//           `INSERT INTO todos (id, task, date, is_completed, username) VALUES (${todo.id}, '${todo.task.replace(
//             /'/g,
//             "''"
//           )}', '${todo.date}', ${todo.is_completed ? 1 : 0}, '${todo.username}');`
//       )
//       .join("\n");
//     downloadFile(content, "todos.sql", "text/sql");
//   };

//   return (
//     <div className="mb-3">
//       <h5>Export Todos:</h5>
//       <button className="btn btn-outline-primary btn-sm me-2" onClick={exportJSON}>
//         JSON
//       </button>
//       <button className="btn btn-outline-success btn-sm me-2" onClick={exportCSV}>
//         CSV
//       </button>
//       <button className="btn btn-outline-secondary btn-sm me-2" onClick={exportTXT}>
//         TXT
//       </button>
//       <button className="btn btn-outline-warning btn-sm" onClick={exportSQL}>
//         SQL
//       </button>
//     </div>
//   );
// };

// export default ExportTodos;
