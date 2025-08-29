// src/components/Todos/ImportTodos.js
import React, { useState } from "react";
import axios from "axios";

const ImportTodos = ({ onImportSuccess }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleImport = async () => {
    if (!file) {
      setMessage("Please select a CSV file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const token = localStorage.getItem("userToken");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/todos/import/",
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setMessage(response.data.message);
      if (onImportSuccess) onImportSuccess();
    } catch (error) {
      console.error(error.response || error.message);
      setMessage("Error importing file. Please make sure it's a valid CSV.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2">
      <div>
        <label htmlFor="fileInput" className="btn btn-outline-info mb-0 d-flex align-items-center">
          <i className="bi bi-upload me-2"></i>Choose File
        </label>
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange} 
          className="d-none" 
          id="fileInput"
        />
      </div>
      
      <button 
        className="btn btn-info d-flex align-items-center" 
        onClick={handleImport}
        disabled={loading || !file}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
            Importing...
          </>
        ) : (
          <>
            <i className="bi bi-cloud-arrow-up-fill me-2"></i>Import
          </>
        )}
      </button>
      
      {file && (
        <small className="text-muted ms-2">
          Selected: {file.name}
        </small>
      )}
      
      {message && (
        <div className={`alert alert-sm mt-2 mb-0 ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default ImportTodos;



// // src/components/Todos/ImportTodos.js
// import React, { useState } from "react";
// import axios from "axios";

// const ImportTodos = ({ onImportSuccess }) => {
//   const [file, setFile] = useState(null);
//   const [message, setMessage] = useState("");

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleImport = async () => {
//     if (!file) {
//       setMessage("Please select a CSV file first.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const token = localStorage.getItem("userToken"); // stored at login
//       const response = await axios.post(
//         "http://127.0.0.1:8000/api/todos/import/",
//         formData,
//         {
//           headers: {
//             Authorization: `Token ${token}`, // ✅ use DRF Token auth
//             // ❌ Don’t set Content-Type manually, axios does it
//           },
//         }
//       );
//       setMessage(response.data.message);
//       if (onImportSuccess) onImportSuccess(); // refresh list in TodoList
//     } catch (error) {
//       console.error(error.response || error.message);
//       setMessage("Error importing file");
//     }
//   };

//   return (
//     <div className="my-3">
//       <input type="file" accept=".csv" onChange={handleFileChange} />
//       <button className="btn btn-info btn-sm ms-2" onClick={handleImport}>
//         Import CSV
//       </button>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default ImportTodos;
