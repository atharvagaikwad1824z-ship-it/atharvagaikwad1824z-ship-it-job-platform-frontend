// src/pages/dashboard/AdminJobs.jsx

import { useEffect, useState } from "react";
import {
  getJobs,
  deleteJob,
} from "../../services/adminService";

function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await getJobs();

      console.log("JOBS:", res.data);

      setJobs(res.data);
    } catch (error) {
      console.error("JOB API ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    try {
      await deleteJob(id);

      setJobs((prev) =>
        prev.filter((job) => job._id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete job");
    }
  };

  if (loading) {
    return <h2>Loading Jobs...</h2>;
  }

  return (
    <div className="container">
      <h1>Manage Jobs</h1>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            <th>Title</th>
            <th>Company</th>
            <th>Location</th>
            <th>Salary</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <tr key={job._id}>
                <td>{job.title}</td>

                <td>
                  {job.companyName ||
                    job.employer?.companyName ||
                    "N/A"}
                </td>

                <td>{job.location}</td>

                <td>
                  {job.salary || "Not Specified"}
                </td>

                <td>
                  <button
                    onClick={() =>
                      handleDelete(job._id)
                    }
                    style={{
                      background: "red",
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      cursor: "pointer",
                      borderRadius: "5px",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">
                No jobs found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminJobs;