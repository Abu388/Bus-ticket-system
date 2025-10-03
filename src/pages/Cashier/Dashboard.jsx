import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CashierLayout from "../../layouts/CashierLayout";
import "./Dashboard.css";

export default function CashierDashboard() {
  const navigate = useNavigate();

  // Default cashier list (can be updated by Admin later)
  const [cashiers] = useState([
    { id: 1, name: "Cashier 1" },
    { id: 2, name: "Demo Cashier" },
  ]);

  return (
    <CashierLayout>
      <h1>Cashier Dashboard</h1>
      <p>Select a cashier to login:</p>
      <div className="cashier-buttons">
        {cashiers.map((cashier) => (
          <button
            key={cashier.id}
            onClick={() =>
              navigate(cashier.name === "Demo Cashier" ? "/cashier/demo" : "/cashier")
            }
          >
            {cashier.name}
          </button>
        ))}
      </div>
    </CashierLayout>
  );
}
