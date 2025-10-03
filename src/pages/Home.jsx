import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
// Note: We'll use a new CSS file for better design
import "./Home.css"; // Ensure your CSS filename matches

export default function Home() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  return (
    <div className="home-wrapper">
      <div className="home-card">
        {/* Professional Header Area */}
        <h1 className="home-title">Bus Ticketing Management System (BTMS)</h1>
        <p className="home-tagline">
          Securely manage routes, sales, and reservations.
        </p>

        <div className="role-selection-area">
          <p className="selection-prompt">Please select your operational role to continue:</p>
          
          <div className="home-buttons">
            {/* Admin Role */}
            <Button
              className="role-button admin-button"
              onClick={() => {
                setUser({ role: "admin", name: "System Admin" });
                navigate("/admin");
              }}
            >
              <span className="icon">⚙️</span>
              <span className="label">Administrator Portal</span>
            </Button>

            {/* Cashier Role (Now the second and final option) */}
            <Button
              className="role-button cashier-button"
              onClick={() => {
                setUser({ role: "cashier", name: "Default Cashier" });
                navigate("/cashier");
              }}
            >
              <span className="icon">🎫</span>
              <span className="label">Cashier/Agent Access</span>
            </Button>

          </div>
        </div>
        
        <p className="footer-note">Ensure you are using an authorized terminal.</p>
      </div>
    </div>
  );
}