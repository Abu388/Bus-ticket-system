import AdminLayout from "../../layouts/AdminLayout";
import { useData } from "../../context/DataContext";
import Button from "../../components/Button";
import "./Reports.css"; // Import the new CSS file

export default function Reports() {
  const { tickets, deposits, cashiers } = useData(); // Assuming cashiers data is available

  // --- Calculated Metrics ---
  const totalRevenue = tickets.reduce((sum, t) => sum + Number(t.price || 0), 0);
  const totalDeposits = deposits.reduce((sum, d) => sum + Number(d.amount || 0), 0);
  const avgTicketPrice = tickets.length > 0 ? (totalRevenue / tickets.length).toFixed(2) : '0.00';
  const totalCommission = (totalRevenue * 0.05).toFixed(2); // Example: 5% of revenue goes to commission/fees
  const netProfit = (totalRevenue - totalCommission).toFixed(2);

  return (
    <AdminLayout>
      <div className="reports-container">
        <header className="reports-header">
          <h1>📈 Comprehensive System Reports</h1>
          <div className="report-controls">
            <Button className="control-btn filter-btn">
              Date Filter (Placeholder)
            </Button>
            <Button className="control-btn export-btn">
              Download Report (.CSV)
            </Button>
          </div>
        </header>

        {/* --- 1. Sales & Operations Metrics --- */}
        <section className="reports-section sales-metrics">
          <h2>Sales and Operational Summary</h2>
          <div className="metric-grid">
            
            <div className="metric-card">
              <span className="metric-icon">💵</span>
              <p className="metric-title">Total Revenue Generated</p>
              <p className="metric-value">${totalRevenue.toFixed(2)}</p>
            </div>

            <div className="metric-card">
              <span className="metric-icon">🎫</span>
              <p className="metric-title">Tickets Volume</p>
              <p className="metric-value">{tickets.length}</p>
            </div>

            <div className="metric-card">
              <span className="metric-icon">💰</span>
              <p className="metric-title">Average Ticket Price</p>
              <p className="metric-value">${avgTicketPrice}</p>
            </div>
            
            <div className="metric-card">
              <span className="metric-icon">👤</span>
              <p className="metric-title">Active Agents</p>
              <p className="metric-value">{cashiers.length}</p>
            </div>
          </div>
        </section>

        {/* --- 2. Financial Summary & Deposits --- */}
        <section className="reports-section financial-summary">
          <h2>Financial Breakdown</h2>
          <div className="financial-breakdown-grid">
            <div className="financial-card net-profit-card">
              <h3>Net System Profit</h3>
              <p className="summary-value">${netProfit}</p>
            </div>
            
            <div className="financial-card deposits-card">
              <h3>Total Cash Deposits</h3>
              <p className="summary-value">${totalDeposits.toFixed(2)}</p>
              <span className="summary-detail">({deposits.length} recorded transfers)</span>
            </div>

            <div className="financial-card commission-card">
              <h3>Total Fees/Commission</h3>
              <p className="summary-value">${totalCommission}</p>
              <span className="summary-detail">Estimated system fees (5%)</span>
            </div>
          </div>
        </section>

        {/* --- 3. Visualizations Placeholder --- */}
        <section className="reports-section chart-section">
          <h2>Revenue Trend (Placeholder)</h2>
          <div className="chart-placeholder">
            <p>A beautiful sales trend chart would go here.</p>
            <p className="chart-note">Integrate a library like Chart.js or Recharts to display data visually.</p>
          </div>
        </section>
        
      </div>
    </AdminLayout>
  );
}