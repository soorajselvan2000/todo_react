// src/components/Todos/ImportTodos.js
import React, { useState } from "react";
import axios from "axios";

const ImportTodos = ({ onImportSuccess }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    if (!file) {
      setMessage("Please select a CSV file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("userToken"); // stored at login
      const response = await axios.post(
        "http://127.0.0.1:8000/api/todos/import/",
        formData,
        {
          headers: {
            Authorization: `Token ${token}`, // ✅ use DRF Token auth
            // ❌ Don’t set Content-Type manually, axios does it
          },
        }
      );
      setMessage(response.data.message);
      if (onImportSuccess) onImportSuccess(); // refresh list in TodoList
    } catch (error) {
      console.error(error.response || error.message);
      setMessage("Error importing file");
    }
  };

  return (
    <div className="my-3">
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button className="btn btn-info btn-sm ms-2" onClick={handleImport}>
        Import CSV
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ImportTodos;
