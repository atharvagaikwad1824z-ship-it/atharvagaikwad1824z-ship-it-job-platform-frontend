import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getJobById, getAllJobs } from "../services/jobService";
import { checkIfApplied } from "../services/applicationService";
import { useAuth } from "../context/AuthContext";
import "./JobDetails.css";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [applied, setApplied] = useState(false);
  const [appliedStatus, setAppliedStatus] = useState("");

  const fetchJob = async () => {
    try {
      setLoading(true);

      const res = await getJobById(id);
      setJob(res.data);

      const allJobsRes = await getAllJobs();
      const similar = allJobsRes.data.filter(
        (j) =>
          j._id !== id &&
          (j.category === res.data.category || j.location === res.data.location)
      );

      setSimilarJobs(similar.slice(0, 4));
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error("Failed to load job details ❌");
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliedStatus = async () => {
    try {
      if (user && user.role === "candidate") {
        const res = await checkIfApplied(id);

        if (res.data.applied) {
          setApplied(true);
          setAppliedStatus(res.data.status);
        } else {
          setApplied(false);
          setAppliedStatus("");
        }
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchJob();
    fetchAppliedStatus();
  }, [id]);

  const handleApply = () => {
    if (!user) {
      toast.info("Please login to apply");
      navigate("/login");
      return;
    }

    if (user.role !== "candidate") {
      toast.error("Only candidates can apply for jobs ❌");
      return;
    }

    if (applied) {
      toast.info("You already applied for this job.");
      return;
    }

    navigate(`/apply/${job._id}`);
  };

  const handleMessageEmployer = () => {
    if (!user) {
      toast.info("Login to message employer");
      navigate("/login");
      return;
    }

    navigate(`/messages?employerId=${job.employer?._id}`);
  };

  if (loading) return <p style={{ padding: "2rem" }}>Loading job details...</p>;
  if (!job) return <p style={{ padding: "2rem" }}>Job not found.</p>;

  return (
    <div className="jobdetails-page">
      {/* Job Header */}
      <div className="jobdetails-header">
        <div className="jobdetails-header-left">
          <img
            className="jobdetails-logo"
            src={
              job.employer?.companyLogo ||
              "https://cdn-icons-png.flaticon.com/512/5968/5968705.png"
            }
            alt="Company Logo"
          />

          <div>
            <h2>
              {job.title}{" "}
              {applied && (
                <span className="applied-badge">
                  Applied ({appliedStatus})
                </span>
              )}
            </h2>

            <p className="jobdetails-company">
              {job.companyName || job.employer?.name || "Company"}
            </p>

            <div className="jobdetails-tags">
              <span>📍 {job.location}</span>
              <span>💼 {job.type || "full-time"}</span>
              <span>💰 {job.salary || "Not Mentioned"}</span>
              <span>📅 {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="jobdetails-header-right">
          <button
            className="apply-btn"
            onClick={handleApply}
            disabled={applied}
          >
            {applied ? "Already Applied" : "Apply Now"}
          </button>

          <button className="msg-btn" onClick={handleMessageEmployer}>
            Message Employer
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="jobdetails-layout">
        {/* Left Side */}
        <div className="jobdetails-left">
          <div className="jobdetails-section">
            <h3>Job Description</h3>
            <p>{job.description}</p>
          </div>

          <div className="jobdetails-section">
            <h3>Requirements</h3>
            <p>{job.requirements || "Not specified by employer."}</p>
          </div>

          <div className="jobdetails-section">
            <h3>Similar Jobs</h3>

            {similarJobs.length === 0 ? (
              <p>No similar jobs found.</p>
            ) : (
              <div className="similar-jobs">
                {similarJobs.map((j) => (
                  <Link
                    to={`/jobs/${j._id}`}
                    key={j._id}
                    className="similar-card"
                  >
                    <h4>{j.title}</h4>
                    <p>{j.location}</p>
                    <span>{j.type || "full-time"}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side Sticky */}
        <div className="jobdetails-right">
          <div className="company-box">
            <h3>Company Profile</h3>

            <div className="company-info">
              <img
                src={
                  job.employer?.companyLogo ||
                  "https://cdn-icons-png.flaticon.com/512/5968/5968705.png"
                }
                alt="Company Logo"
              />

              <div>
                <h4>{job.companyName || job.employer?.name}</h4>
                <p>{job.employer?.email}</p>
              </div>
            </div>

            <button
              className="apply-btn full"
              onClick={handleApply}
              disabled={applied}
            >
              {applied ? "Already Applied" : "Apply Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
