import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { getJobById } from "../services/jobService";
import api from "../services/api";
import "./ApplyJob.css";

function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "candidate") {
      toast.error("Only candidates can apply");
      navigate("/");
      return;
    }

    fetchJob();
    checkApplication();
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await getJobById(id);
      setJob(res.data);
    } catch (err) {
      toast.error("Failed to load job");
    }
  };

  const checkApplication = async () => {
    try {
      const res = await api.get(`/application/check/${id}`);

      if (res.data.applied) {
        setAlreadyApplied(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume) {
      toast.error("Please upload resume");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("jobId", id);
      formData.append("resume", resume);

      const res = await api.post(
        "/application",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      toast.success(
        `Application Submitted! ATS Score: ${res.data.application.atsScore}%`
      );

      navigate("/dashboard/candidate");

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Application failed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!job) {
    return (
      <p style={{ padding: "2rem" }}>
        Loading...
      </p>
    );
  }

  return (
    <div className="apply-page">
      <div className="apply-card">

        <h2>Apply for Job</h2>

        {job.atsEnabled && (
          <div className="ats-badge">
            ✅ ATS Enabled
          </div>
        )}

        <div className="apply-job-info">
          <h3>{job.title}</h3>

          <p>
            {job.companyName ||
              job.employer?.name}
            {" • "}
            {job.location}
          </p>

          <p>
            Experience:
            {" "}
            {job.experience}
          </p>

          <p>
            Salary:
            {" "}
            {job.salary}
          </p>
        </div>

        {/* ATS Requirements */}

        {job.requiredSkills?.length > 0 && (
          <div className="ats-section">
            <h4>
              Required Skills
            </h4>

            <div className="skills-container">
              {job.requiredSkills.map(
                (skill, index) => (
                  <span
                    key={index}
                    className="skill-tag"
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        <div className="ats-info">
          <p>
            ATS Passing Score:
            <strong>
              {" "}
              {job.passingScore || 60}%
            </strong>
          </p>

          <p>
            Upload a PDF resume
            containing these skills for
            a higher ATS score.
          </p>
        </div>

        {alreadyApplied ? (
          <div className="already-applied">
            <h3>
              You have already applied
              for this job.
            </h3>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="apply-form"
          >
            <label>
              Upload Resume (PDF)
            </label>

            <input
              type="file"
              accept=".pdf"
              onChange={(e) =>
                setResume(
                  e.target.files[0]
                )
              }
            />

            {resume && (
              <div className="resume-preview">
                <p>
                  📄
                  <strong>
                    {" "}
                    {resume.name}
                  </strong>
                </p>

                <p>
                  Size:
                  {" "}
                  {(
                    resume.size /
                    1024 /
                    1024
                  ).toFixed(2)}
                  {" "}MB
                </p>

                <a
                  href={URL.createObjectURL(
                    resume
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  Preview Resume
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Processing ATS..."
                : "Apply Now"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ApplyJob;