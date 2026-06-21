import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUserApplications } from "../../services/applicationService";
import "./CandidateDashboard.css";

function CandidateDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await getUserApplications();
      setApplications(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error("Failed to load your applications ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="cand-dashboard">
      <h2 className="cand-title">Candidate Dashboard</h2>
      <p className="cand-subtitle">Track your job applications easily.</p>

      {/* Stats */}
      <div className="cand-stats">
        <div className="stat-card">
          <h3>{applications.length}</h3>
          <p>Jobs Applied</p>
        </div>

        <div className="stat-card">
          <h3>
            {applications.filter((a) => a.status === "accepted").length}
          </h3>
          <p>Accepted</p>
        </div>

        <div className="stat-card">
          <h3>
            {applications.filter((a) => a.status === "rejected").length}
          </h3>
          <p>Rejected</p>
        </div>
      </div>

      {/* Applications Table */}
      <div className="cand-table-box">
        <h3 className="table-title">My Applications</h3>

        {loading ? (
          <p>Loading applications...</p>
        ) : applications.length === 0 ? (
          <p>You have not applied for any jobs yet.</p>
        ) : (
          <table className="cand-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Location</th>
                <th>Status</th>
                <th>Resume</th>
                <th>Applied Date</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((app) =>{ 
              const resumeUrl = app.resume?.startsWith("http")? app.resume: `http://localhost:5000/${app.resume}`;
              return (
                <tr key={app._id}>
                  <td>{app.job?.title || "Job Removed"}</td>
                  <td>{app.job?.location || "N/A"}</td>

                  <td>
                    <span className={`status-badge ${app.status}`}>
                      {app.status}
                    </span>
                  </td>

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
                    {app.createdAt
                      ? new Date(app.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              );})}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default CandidateDashboard;
