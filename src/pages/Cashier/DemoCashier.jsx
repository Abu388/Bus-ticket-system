import CashierLayout from "../../layouts/CashierLayout";
import { useState } from "react";
import Button from "../../components/Button"; // Assuming you have a reusable Button
import "./DemoCashier.css"; // New professional CSS file

export default function DemoCashier() {
  // Ticket form state
  const [buyerName, setBuyerName] = useState("");
  const [buyerID, setBuyerID] = useState("");
  const [seatNumber, setSeatNumber] = useState("");
  const [ticketPrice, setTicketPrice] = useState(15.00); // Default price is now float
  const [selectedRoute, setSelectedRoute] = useState("Route A (City to Suburb)");

  // Transactions state
  const [transactions, setTransactions] = useState([]);
  const [cashBalance, setCashBalance] = useState(0.00);

  // Sample Routes
  const routes = [
    { name: "Route A (City to Suburb)", price: 15.00 },
    { name: "Route B (Express Intercity)", price: 35.00 },
    { name: "Route C (Short Hop)", price: 5.50 },
  ];

  // Handle route change and update price
  const handleRouteChange = (e) => {
    const routeName = e.target.value;
    const route = routes.find(r => r.name === routeName);
    setSelectedRoute(routeName);
    setTicketPrice(route ? route.price : 0.00);
  };

  // Handle ticket sale
  const handleSellTicket = () => {
    if (!buyerName || !buyerID || !seatNumber || ticketPrice <= 0) {
      alert("Please ensure all fields are filled and the price is valid.");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      buyerName,
      buyerID,
      seatNumber,
      route: selectedRoute,
      price: ticketPrice,
      time: new Date().toLocaleTimeString(),
    };

    setTransactions([newTransaction, ...transactions]);
    setCashBalance(cashBalance + ticketPrice);

    // Clear form
    setBuyerName("");
    setBuyerID("");
    setSeatNumber("");
    // Keep ticketPrice/Route, as cashier often sells same ticket repeatedly
  };

  // Handle deposit to admin
  const handleDeposit = () => {
    if (cashBalance === 0) {
      alert("Cash balance is zero. Nothing to deposit.");
      return;
    }
    
    if (window.confirm(`Confirm deposit of $${cashBalance.toFixed(2)} to Admin?`)) {
      alert(`Deposit of $${cashBalance.toFixed(2)} successfully recorded.`);
      // In a real app, this would trigger an API call to record the deposit
      setCashBalance(0.00);
    }
  };

  // Summary calculations
  const totalTickets = transactions.length;
  const totalAmount = transactions.reduce((sum, t) => sum + t.price, 0).toFixed(2);

  return (
    <CashierLayout>
      <div className="cashier-dashboard-container">
        <h1>Welcome, Demo Agent 👋</h1>
        <p className="dashboard-intro">Ready to process ticket sales and manage your daily cash flow.</p>

        <div className="main-content-grid">
          
          {/* --- LEFT COLUMN: Sale Form & Summary --- */}
          <div className="sidebar-panel">
            
            {/* 1. Cash Balance & Deposit */}
            <div className="balance-card">
                <h2>CASH DRAWER BALANCE</h2>
                <div className="balance-value">${cashBalance.toFixed(2)}</div>
                <Button 
                    className="deposit-button" 
                    onClick={handleDeposit} 
                    disabled={cashBalance === 0}
                >
                    {cashBalance === 0 ? "No Cash to Deposit" : "🏦 Deposit to Vault"}
                </Button>
            </div>
            
            {/* 2. Sale Form */}
            <div className="panel sales-form-panel">
              <h2>🎟️ New Ticket Sale</h2>
              <div className="form-group">
                <label>Route</label>
                <select value={selectedRoute} onChange={handleRouteChange}>
                  {routes.map((r, index) => (
                    <option key={index} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Buyer Name</label>
                <input type="text" placeholder="e.g., John Doe" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} />
              </div>
              
              <div className="form-group">
                <label>ID / Contact</label>
                <input type="text" placeholder="ID or Phone Number" value={buyerID} onChange={(e) => setBuyerID(e.target.value)} />
              </div>
              
              <div className="form-group">
                <label>Seat Number</label>
                <input type="text" placeholder="e.g., A12" value={seatNumber} onChange={(e) => setSeatNumber(e.target.value)} />
              </div>
              
              <div className="price-display">
                <span>Sale Price:</span>
                <strong>${ticketPrice.toFixed(2)}</strong>
              </div>
              
              <Button className="sell-button" onClick={handleSellTicket}>
                ✅ Complete Sale
              </Button>
            </div>
          </div>

          {/* --- RIGHT COLUMN: Transactions & Summary --- */}
          <div className="main-panel">
             {/* 3. Summary KPI Cards */}
            <div className="kpi-cards">
                <div className="kpi-card total-tickets">
                    <p className="kpi-title">Tickets Sold Today</p>
                    <p className="kpi-value">{totalTickets}</p>
                </div>
                <div className="kpi-card total-amount">
                    <p className="kpi-title">Total Revenue Collected</p>
                    <p className="kpi-value">${totalAmount}</p>
                </div>
            </div>

            {/* 4. Transaction List */}
            <div className="panel transaction-list-panel">
              <h2>🕒 Recent Transactions</h2>
              
              {transactions.length === 0 ? (
                <div className="no-transactions">
                    <p>No sales recorded yet. Start selling!</p>
                </div>
              ) : (
                <div className="transaction-table-wrapper">
                    <table className="transaction-table">
                        <thead>
                            <tr>
                                <th>TIME</th>
                                <th>SEAT</th>
                                <th>ROUTE</th>
                                <th>BUYER NAME</th>
                                <th>PRICE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((t) => (
                                <tr key={t.id}>
                                    <td>{t.time}</td>
                                    <td>{t.seatNumber}</td>
                                    <td>{t.route.split('(')[0]}</td>
                                    <td>{t.buyerName}</td>
                                    <td className="price-col">${t.price.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CashierLayout>
  );
}