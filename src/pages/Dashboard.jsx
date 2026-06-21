import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();
  if(!user) return <Navigate to = "/login" />;
  if(user.role === "candidate") return <Navigate to ="/dashboard/candidate"/>;
  if(user.role === "employer") return <Navigate to ="/dashboard/employer"/>;
  if(user.role === "admin") return <Navigate to ="/dashboard/admin"/>;

  return <Navigate to="/"/>;
}

export default Dashboard;
