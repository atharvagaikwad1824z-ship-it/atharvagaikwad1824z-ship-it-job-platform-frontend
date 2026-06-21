import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getApplicationsByJob,
  updateApplicationStatus,
} from "../../services/applicationService";
import "./ApplicantsPage.css";

function ApplicantsPage() {
  const { jobId } = useParams();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await getApplicationsByJob(jobId);
      setApplications(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error("Failed to load applicants ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateApplicationStatus(id, status);
      toast.success(`Application ${status.toUpperCase()} ✅`);
      fetchApplications();
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error("Failed to update status ❌");
    }
  };

  return (
    <div className="applicants-container">
      <h2 className="applicants-title">Job Applicants</h2>
      <p className="applicants-subtitle">
        View candidates who applied for this job.
      </p>

      {loading ? (
        <p>Loading applicants...</p>
      ) : applications.length === 0 ? (
        <p>No applicants found for this job.</p>
      ) : (
        <div className="applicants-table-box">
          <table className="applicants-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Email</th>
                <th>Resume</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((app) => {
                const resumeUrl = app.resume?.startsWith("http") ? app.resume : `http://localhost:5000/${app.resume}`;
              return (
                <tr key={app._id}>
                  <td>{app.candidate?.name || "Unknown"}</td>
                  <td>{app.candidate?.email || "Unknown"}</td>

                  <td>
                    {app.resume ? (
                      <a
                        href={`${resumeUrl}?fl_attachment=false`}
                        target="_blank"
                        rel="noreferrer"
                        className="resume-link"
                      >
                        View Resume
                      </a>
                    ) : (
                      <span className="no-resume">No Resume</span>
                    )}
                  </td>

                  <td>
                    <span className={`status-badge ${app.status}`}>
                      {app.status}
                    </span>
                  </td>

                  <td className="actions">
                    <button
                      className="btn accept"
                      onClick={() => handleStatusChange(app._id, "accepted")}
                      disabled={app.status !== "applied" && app.status !== "reviewed"}
                    >
                      Accept
                    </button>

                    <button
                      className="btn reject"
                      onClick={() => handleStatusChange(app._id, "rejected")}
                      disabled={app.status !== "applied" && app.status !== "reviewed"}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              );})}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ApplicantsPage;
