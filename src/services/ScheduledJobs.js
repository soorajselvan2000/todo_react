import React, { useEffect, useState } from "react";
import axios from "axios";

function ScheduledJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/jobs/") // adjust if using different port
      .then(res => setJobs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mt-4">
      <h3>Scheduled Jobs</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Next Run Time</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job.id}>
              <td>{job.id}</td>
              <td>{job.next_run_time || "Not scheduled"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ScheduledJobs;
