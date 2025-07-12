import React from 'react';
import { Dropdown } from 'react-bootstrap';

const StatusFilter = ({ selectedStatus, onStatusChange }) => {
  return (
    <Dropdown className="mb-3">
      <Dropdown.Toggle variant="info" id="dropdown-basic">
        {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)} Tasks
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={() => onStatusChange('all')}>All</Dropdown.Item>
        <Dropdown.Item onClick={() => onStatusChange('completed')}>Completed</Dropdown.Item>
        <Dropdown.Item onClick={() => onStatusChange('pending')}>Pending</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default StatusFilter;
