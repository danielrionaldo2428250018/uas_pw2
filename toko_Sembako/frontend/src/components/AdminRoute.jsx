import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  // belum login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // bukan admin
  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
