import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h5>ADMIN TOKO</h5>
      </div>

      <ul className="sidebar-menu">
        <li className={isActive("/dashboard") ? "active" : ""}>
          <Link to="/dashboard">Dashboard</Link>
        </li>

        <li className={isActive("/products") ? "active" : ""}>
          <Link to="/products">Products</Link>
        </li>

        <li className={isActive("/suppliers") ? "active" : ""}>
          <Link to="/suppliers">Suppliers</Link>
        </li>

        <li className={isActive("/customers") ? "active" : ""}>
          <Link to="/customers">Customers</Link>
        </li>

        <li className={isActive("/purchases") ? "active" : ""}>
          <Link to="/purchases">Purchases</Link>
        </li>

        <li className={isActive("/transactions") ? "active" : ""}>
          <Link to="/transactions">Transactions</Link>
        </li>
      </ul>

      {user?.role === "admin" && (
        <div className="sidebar-footer">
          <Link
            to="/users"
            className={`settings-link ${isActive("/users") ? "active" : ""}`}
          >
            <span className="settings-icon">⚙️</span>
            <span>Pengaturan</span>
          </Link>
        </div>
      )}
    </div>
  );
}