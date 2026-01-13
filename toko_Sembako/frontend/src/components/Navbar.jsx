import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();          
    navigate("/login");
  };

  return (
    <nav className="navbar bg-white px-3 d-flex justify-content-between">
      
      {/* 👤 USER INFO */}
      <div>
        {user ? (
          <strong>
            {user.username} ({user.role})
          </strong>
        ) : (
          <span className="text-muted"></span>
        )}
      </div>

      {/* 🚪 LOGOUT */}
      <button className="btn btn-danger btn-sm" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}