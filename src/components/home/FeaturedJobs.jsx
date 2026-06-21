import { Link } from "react-router-dom";
import "./FeaturedJobs.css";

function FeaturedJobs({ jobs, loading }) {
  return (
    <section className="featured-jobs">
      <div className="section-header">
        <h2>Featured Jobs</h2>
        <Link to="/jobs" className="view-all">
          View All Jobs →
        </Link>
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading jobs...</p>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <div key={job._id} className="job-card">
              <h3>{job.title}</h3>
              <p className="company">{job.companyName || "Company"}</p>
              <p className="location">{job.location}</p>

              <Link to={`/jobs/${job._id}`} className="details-btn">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default FeaturedJobs;
