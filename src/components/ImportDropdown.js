import React, { useRef } from 'react';
import { Dropdown, Button } from 'react-bootstrap';
import axios from 'axios';

const ImportDropdown = ({ onImportSuccess }) => {
  const fileInputRef = useRef();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:8000/api/import/', formData, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('✅ Todos imported successfully');
      onImportSuccess(); // refresh list
    } catch (error) {
      alert('❌ Import failed');
      console.error(error);
    }
  };

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-import">
          📥 Import Todos
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => fileInputRef.current.click()}>
            Upload File (CSV, JSON, TXT, SQL)
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".csv,.json,.txt,.sql"
        onChange={handleFileUpload}
      />
    </>
  );
};

export default ImportDropdown;
