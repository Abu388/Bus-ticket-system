import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ role }) {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      {/* Home Icon */}
      <Link to="/" className="home-icon">
        🏠
      </Link>

      <div className="navbar-brand">Bus Admin System</div>

      <div className="navbar-links">
        {role === "admin" && (
          <>
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin/cashiers">Cashiers</Link>
            <Link to="/admin/reports">Reports</Link>
          </>
        )}
        {role === "cashier" && (
          <>
            <Link to="/cashier">Dashboard</Link>
            <Link to="/cashier/ticket">Sell Ticket</Link>
            <Link to="/cashier/deposit">Deposit</Link>
            <Link to="/cashier/demo">Demo Cashier</Link>
          </>
        )}
      </div>

      <div className="navbar-user">Hello, {user.name}</div>
    </nav>
  );
}
