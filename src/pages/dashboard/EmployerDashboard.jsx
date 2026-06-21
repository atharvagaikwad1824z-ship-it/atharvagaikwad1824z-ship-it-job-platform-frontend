import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getMyJobs, deleteJob } from "../../services/jobService";
import { getApplicationsByJob } from "../../services/applicationService";
import { useNavigate } from "react-router-dom";
import "./EmployerDashboard.css";

function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [totalApplicants, setTotalApplicants] = useState(0);
  const [pendingApplicants, setPendingApplicants] = useState(0);
  const [shortlistedCount, setShortlistedCount] = useState(0);
  const [averageATS, setAverageATS] = useState(0);

  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const res = await getMyJobs();
      setJobs(res.data);

      let applicantsCount = 0;
      let pendingCount = 0;
      let shortlisted = 0;
      let totalScore = 0;
      let totalApplications = 0;

      for (let job of res.data) {
        const appRes = await getApplicationsByJob(job._id);

        applicantsCount += appRes.data.length;

        const pending = appRes.data.filter(
          (a) =>
            a.status === "applied" ||
            a.status === "shortlisted"
        );

        pendingCount += pending.length;

        appRes.data.forEach((app) => {
          totalScore += app.atsScore || 0;
          totalApplications++;

          if (app.status === "shortlisted") {
            shortlisted++;
          }
        });
      }

      setTotalApplicants(applicantsCount);
      setPendingApplicants(pendingCount);
      setShortlistedCount(shortlisted);

      setAverageATS(
        totalApplications
          ? (totalScore / totalApplications).toFixed(1)
          : 0
      );
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error("Failed to load employer dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await deleteJob(jobId);
      toast.success("Job deleted successfully ✅");
      fetchJobs();
    } catch (err) {
      toast.error("Failed to delete job ❌");
    }
  };

  return (
    <div className="emp-dashboard">
      <h2 className="emp-title">Employer Dashboard</h2>
      <p className="emp-subtitle">
        Manage your job postings and ATS applicants.
      </p>

      {/* Stats */}
      <div className="emp-stats">
        <div className="stat-card">
          <h3>{jobs.length}</h3>
          <p>Jobs Posted</p>
        </div>

        <div className="stat-card">
          <h3>{totalApplicants}</h3>
          <p>Total Applicants</p>
        </div>

        <div className="stat-card">
          <h3>{pendingApplicants}</h3>
          <p>Pending Review</p>
        </div>

        <div className="stat-card">
          <h3>{shortlistedCount}</h3>
          <p>Shortlisted</p>
        </div>

        <div className="stat-card">
          <h3>{averageATS}%</h3>
          <p>Average ATS Score</p>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="emp-table-box">
        <h3 className="table-title">My Posted Jobs</h3>

        {loading ? (
          <p>Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p>No jobs posted yet.</p>
        ) : (
          <table className="emp-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Location</th>
                <th>Type</th>
                <th>Salary</th>
                <th>Applicants</th>
                <th>ATS</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td>{job.title}</td>
                  <td>{job.location}</td>
                  <td>{job.type}</td>
                  <td>{job.salary || "Not Mentioned"}</td>

                  <td>{job.totalApplicants || 0}</td>

                  <td>
                    <button
                      className="btn view"
                      onClick={() =>
                        navigate(
                          `/employer/applications/${job._id}`
                        )
                      }
                    >
                      ATS Dashboard
                    </button>
                  </td>

                  <td className="actions">
                    <button
                      className="btn view"
                      onClick={() =>
                        navigate(
                          `/dashboard/applicants/${job._id}`
                        )
                      }
                    >
                      Applicants
                    </button>

                    <button
                      className="btn edit"
                      onClick={() =>
                        navigate(`/edit-job/${job._id}`)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="btn delete"
                      onClick={() => handleDelete(job._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default EmployerDashboard;