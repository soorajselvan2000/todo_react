import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api/tasks/';

export const getTasks = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

// You can later add postTask, deleteTask, etc.
