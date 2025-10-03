import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Pages
import Home from "../pages/Home";

// Admin Pages
import AdminDashboard from "../pages/Admin/Dashboard";
import CashierManagement from "../pages/Admin/CashierManagement";
import Reports from "../pages/Admin/Reports";

// Cashier Pages
import CashierDashboard from "../pages/Cashier/Dashboard";
import TicketPurchase from "../pages/Cashier/TicketPurchase";
import Deposit from "../pages/Cashier/Deposit";
import DemoCashier from "../pages/Cashier/DemoCashier";

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public / Home page */}
        <Route path="/" element={<Home />} />

        {/* Admin Routes */}
        {user?.role === "admin" && (
          <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/cashiers" element={<CashierManagement />} />
            <Route path="/admin/reports" element={<Reports />} />
          </>
        )}

        {/* Cashier Routes */}
        {user?.role === "cashier" && (
          <>
            <Route path="/cashier" element={<CashierDashboard />} />
            <Route path="/cashier/ticket" element={<TicketPurchase />} />
            <Route path="/cashier/deposit" element={<Deposit />} />
            <Route path="/cashier/demo" element={<DemoCashier />} />
          </>
        )}

        {/* Redirect unknown paths to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
