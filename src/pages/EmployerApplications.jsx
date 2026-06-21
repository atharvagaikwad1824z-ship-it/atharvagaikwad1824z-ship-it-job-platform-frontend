import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getApplicationsByJob,
  updateApplicationStatus
} from "../services/applicationService";

function EmployerApplications() {

  const { jobId } = useParams();

  const [applications, setApplications] =
    useState([]);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {

    const res =
      await getApplicationsByJob(jobId);

    const sorted =
      res.data.sort(
        (a, b) =>
          b.atsScore - a.atsScore
      );

    setApplications(sorted);
  };

  const handleStatus = async (
    id,
    status
  ) => {

    await updateApplicationStatus(id, status);

    loadApplications();
  };
const shortlistedCount = applications.filter(
  (app) => app.status === "shortlisted"
).length;

const averageATS = applications.length
  ? (
      applications.reduce(
        (sum, app) => sum + (app.atsScore || 0),
        0
      ) / applications.length
    ).toFixed(1)
  : 0;
  return (
    <div>

      <h2>
        ATS Applications
      </h2>
      <div
  style={{
    display: "flex",
    gap: "20px",
    marginBottom: "20px"
  }}
>
  <div className="candidate-card">
    <h3>{applications.length}</h3>
    <p>Total Applicants</p>
  </div>

  <div className="candidate-card">
    <h3>{shortlistedCount}</h3>
    <p>Shortlisted</p>
  </div>

  <div className="candidate-card">
    <h3>{averageATS}%</h3>
    <p>Average ATS</p>
  </div>
</div>

      {applications.map((app, index) => (

        <div
          key={app._id}
          className="candidate-card"
        >
     <h3>
  #{index + 1} {app.candidate?.name}
</h3>

<p>
  {app.candidate?.email}
</p>

          <div
  style={{
    background:
      app.atsScore >= 80
        ? "green"
        : app.atsScore >= 60
        ? "blue"
        : app.atsScore >= 40
        ? "orange"
        : "red",
    color: "white",
    padding: "8px",
    borderRadius: "8px",
    display: "inline-block"
  }}
>
  ATS Score: {app.atsScore}%
</div>

          <p>
            Status:
            {app.status}
          </p>

          <p>
            Matched:
            {app.matchedSkills.join(", ")}
          </p>

          <p>
            Missing:
            {app.missingSkills.join(", ")}
          </p>

          <p>
  <strong>Resume Summary:</strong>
</p>

<p>
  {app.resumeSummary || "No summary available"}
</p>

          <a
            href={app.resume}
            target="_blank"
            rel="noreferrer"
          >
            View Resume
          </a>

          <br /><br />

          <select
  value={app.status}
  onChange={(e) =>
    handleStatus(
      app._id,
      e.target.value
    )
  }
>
  <option value="applied">
    Applied
  </option>

  <option value="shortlisted">
    Shortlisted
  </option>

  <option value="interview">
    Interview
  </option>

  <option value="selected">
    Selected
  </option>

  <option value="rejected">
    Rejected
  </option>
</select>

        </div>

      ))}

    </div>
  );
}

export default EmployerApplications;