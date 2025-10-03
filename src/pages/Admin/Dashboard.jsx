import AdminLayout from "../../layouts/AdminLayout";
import { useData } from "../../context/DataContext";
import "./Dashboard.css"; // Import the new CSS file

export default function Dashboard() {
  const { tickets, deposits } = useData();

  // --- Calculated Metrics ---
  const totalRevenue = tickets.reduce((sum, t) => sum + Number(t.price || 0), 0).toFixed(2);
  const totalDeposits = deposits.reduce((sum, d) => sum + Number(d.amount || 0), 0).toFixed(2);
  const avgTicketPrice = tickets.length > 0 ? (totalRevenue / tickets.length).toFixed(2) : 0;
  
  // Placeholder for recent activities (e.g., last 5 transactions/deposits)
  // Assuming 'deposits' is an array of objects with a 'timestamp' or 'id'
  const recentDeposits = deposits
    .slice() // Create a shallow copy
    .sort((a, b) => b.id - a.id) // Sort descending by ID (assuming higher ID is newer)
    .slice(0, 5); // Take the top 5

  return (
    <AdminLayout>
      <div className="dashboard-container">
        <h1>📊 System Overview Dashboard</h1>
        
        {/* --- KPI Cards Section --- */}
        <div className="kpi-cards">
          
          <div className="card revenue-card">
            <span className="card-icon">💵</span>
            <p className="card-title">Total Revenue</p>
            <p className="card-value">${totalRevenue}</p>
            <span className="card-footer">From {tickets.length} tickets</span>
          </div>

          <div className="card tickets-card">
            <span className="card-icon">🎫</span>
            <p className="card-title">Tickets Sold</p>
            <p className="card-value">{tickets.length}</p>
            <span className="card-footer">Avg. Price: ${avgTicketPrice}</span>
          </div>

          <div className="card deposits-card">
            <span className="card-icon">🏦</span>
            <p className="card-title">Cashier Deposits</p>
            <p className="card-value">${totalDeposits}</p>
            <span className="card-footer">From {deposits.length} transfers</span>
          </div>
          
        </div>
        
        {/* --- Recent Activity Section --- */}
        <div className="recent-activity-section">
          <h2>Recent Cashier Activity</h2>
          
          <ul className="activity-list">
            {recentDeposits.length === 0 ? (
                <li className="no-activity">No recent deposits to show.</li>
            ) : (
                recentDeposits.map(d => (
                    <li key={d.id} className="activity-item">
                        <span className="activity-label">Deposit:</span>
                        <span className="activity-amount">${Number(d.amount).toFixed(2)}</span>
                        <span className="activity-details">by {d.cashierName || 'Unknown Agent'}</span>
                        <span className="activity-time">{new Date(d.id).toLocaleTimeString()}</span>
                    </li>
                ))
            )}
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}