import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({
  children,
  allowedRoles = [],
}) => {
  const { user, loading } = useAuth();

  console.log("Loading:", loading);
  console.log("User:", user);
  console.log("Allowed Roles:", allowedRoles);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log("REDIRECTING: user is null");
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role?.trim())
  ) {
    console.log("REDIRECTING: role failed", user.role);
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;