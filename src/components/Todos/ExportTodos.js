// src/components/Todos/ExportTodos.js
import React from "react";

const ExportTodos = ({ todos }) => {
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
    <div className="mb-3">
      <h5>Export Todos:</h5>
      <button className="btn btn-outline-primary btn-sm me-2" onClick={exportJSON}>
        JSON
      </button>
      <button className="btn btn-outline-success btn-sm me-2" onClick={exportCSV}>
        CSV
      </button>
      <button className="btn btn-outline-secondary btn-sm me-2" onClick={exportTXT}>
        TXT
      </button>
      <button className="btn btn-outline-warning btn-sm" onClick={exportSQL}>
        SQL
      </button>
    </div>
  );
};

export default ExportTodos;
