import "./JobFilters.css";

function JobFilters({ filters, setFilters }) {
  return (
    <aside className="job-filters">
      <h3>Filter Jobs</h3>

      <label>Location</label>
      <input
        type="text"
        placeholder="Location"
        onChange={(e) =>
          setFilters({ ...filters, location: e.target.value })
        }
      />

      <label>Job Type</label>
      <select
        onChange={(e) =>
          setFilters({ ...filters, type: e.target.value })
        }
      >
        <option value="">All</option>
        <option value="full-time">Full Time</option>
        <option value="part-time">Part Time</option>
        <option value="remote">Remote</option>
      </select>
    </aside>
  );
}

export default JobFilters;
