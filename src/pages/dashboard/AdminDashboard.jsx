import { useEffect, useState } from "react";
import { getStats } from "../../services/adminService";
import { Link } from "react-router-dom";
function AdminDashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
  try {
    const res = await getStats();
    setStats(res.data);
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
  <Link to="/dashboard/admin/users">
    <button>Manage Users</button>
  </Link>

  <Link to="/dashboard/admin/jobs">
    <button>Manage Jobs</button>
  </Link>
</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5,1fr)",
          gap: "20px",
        }}
      >
        <div className="candidate-card">
          <h2>{stats.totalUsers}</h2>
          <p>Total Users</p>
        </div>

        <div className="candidate-card">
          <h2>{stats.totalCandidates}</h2>
          <p>Candidates</p>
        </div>

        <div className="candidate-card">
          <h2>{stats.totalEmployers}</h2>
          <p>Employers</p>
        </div>

        <div className="candidate-card">
          <h2>{stats.totalJobs}</h2>
          <p>Jobs</p>
        </div>

        <div className="candidate-card">
          <h2>{stats.totalApplications}</h2>
          <p>Applications</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;