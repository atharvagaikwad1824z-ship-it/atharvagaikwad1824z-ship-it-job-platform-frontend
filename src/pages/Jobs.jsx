import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllJobs } from "../services/jobService";
import { getUserApplications } from "../services/applicationService";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Jobs.css";

function Jobs() {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Applied jobs list
  const [appliedJobIds, setAppliedJobIds] = useState([]);

  // Filters
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("latest");

  // Pagination
  const [page, setPage] = useState(1);
  const jobsPerPage = 5;

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await getAllJobs();
      setJobs(res.data);
      setFilteredJobs(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error("Failed to fetch jobs ❌");
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      if (user?.role === "candidate") {
        const res = await getUserApplications();
        const appliedIds = res.data.map((app) => app.job?._id);
        setAppliedJobIds(appliedIds);
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchAppliedJobs();
  }, []);

  useEffect(() => {
    let updated = [...jobs];

    if (search) {
      updated = updated.filter((job) =>
        job.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (location) {
      updated = updated.filter((job) =>
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (type) {
      updated = updated.filter((job) =>
        job.type?.toLowerCase().includes(type.toLowerCase())
      );
    }

    if (category) {
      updated = updated.filter((job) =>
        job.category?.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (sort === "latest") {
      updated.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (sort === "oldest") {
      updated.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setFilteredJobs(updated);
    setPage(1);
  }, [search, location, type, category, sort, jobs]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (page - 1) * jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

  return (
    <div className="jobs-template">
      <div className="jobs-topbar">
        <h2>Find Jobs</h2>
        <p>Explore latest job opportunities and apply easily.</p>
      </div>

      <div className="jobs-layout">
        {/* Sidebar */}
        <aside className="jobs-sidebar">
          <h3>Filters</h3>

          <label>Search</label>
          <input
            type="text"
            placeholder="Job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <label>Location</label>
          <input
            type="text"
            placeholder="City..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <label>Category</label>
          <input
            type="text"
            placeholder="IT, Design..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <label>Job Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="remote">Remote</option>
            <option value="internship">Internship</option>
          </select>

          <button
            className="clear-btn"
            onClick={() => {
              setSearch("");
              setLocation("");
              setCategory("");
              setType("");
              setSort("latest");
            }}
          >
            Clear Filters
          </button>
        </aside>

        {/* Jobs List */}
        <main className="jobs-main">
          <div className="jobs-header">
            <h3>
              Showing <span>{filteredJobs.length}</span> Jobs
            </h3>

            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>

          {/* Skeleton */}
          {loading ? (
            <div className="skeleton-list">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="job-skeleton"></div>
              ))}
            </div>
          ) : currentJobs.length === 0 ? (
            <p>No jobs found.</p>
          ) : (
            currentJobs.map((job) => {
              const isApplied = appliedJobIds.includes(job._id);

              return (
                <div key={job._id} className="job-template-card">
                  <div className="job-left">
                    <img
                      src={
                        job.employer?.companyLogo ||
                        "https://cdn-icons-png.flaticon.com/512/5968/5968705.png"
                      }
                      alt="logo"
                      className="job-template-logo"
                    />
                  </div>

                  <div className="job-middle">
                    <div className="job-title-row">
                      <h3>{job.title}</h3>

                      {isApplied && (
                        <span className="applied-tag">Applied</span>
                      )}
                    </div>

                    <p className="job-company">
                      {job.companyName || job.employer?.name || "Company"}
                    </p>

                    <div className="job-tags">
                      <span>📍 {job.location}</span>
                      <span>💼 {job.type || "full-time"}</span>
                      <span>💰 {job.salary || "Not mentioned"}</span>
                    </div>
                  </div>

                  <div className="job-right">
                    <button className="save-btn">♡</button>

                    <Link to={`/jobs/${job._id}`} className="details-btn">
                      Details
                    </Link>

                    {/* Apply button hidden if already applied */}
                    {user?.role === "candidate" && (
                      <Link
                        to={isApplied ? "#" : `/apply/${job._id}`}
                        className={`apply-card-btn ${isApplied ? "disabled" : ""
                          }`}
                        onClick={(e) => {
                          if (isApplied) e.preventDefault();
                        }}
                      >
                        {isApplied ? "Applied" : "Apply"}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Prev
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Jobs;
