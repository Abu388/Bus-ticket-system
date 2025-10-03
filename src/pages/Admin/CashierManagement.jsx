import AdminLayout from "../../layouts/AdminLayout";
import { useState } from "react";
import "./CashierManagement.css";

export default function CashierManagement() {
  const [cashiers, setCashiers] = useState([
    { id: 1, name: "Demo Cashier", ticketsSold: 5, cashBalance: 50 },
    { id: 2, name: "Cashier User", ticketsSold: 3, cashBalance: 30 },
  ]);
  const [newCashierName, setNewCashierName] = useState("");

  // Add new cashier
  const handleAddCashier = () => {
    if (newCashierName.trim() === "") return;
    const newCashier = {
      id: Date.now(),
      name: newCashierName,
      ticketsSold: 0,
      cashBalance: 0,
    };
    setCashiers([...cashiers, newCashier]);
    setNewCashierName("");
  };

  // Remove cashier
  const handleRemoveCashier = (id) => {
    setCashiers(cashiers.filter((c) => c.id !== id));
  };

  // Deposit cashier money to admin
  const handleDeposit = (id) => {
    setCashiers(
      cashiers.map((c) =>
        c.id === id ? { ...c, cashBalance: 0 } : c
      )
    );
    alert("Money deposited to admin account");
  };

  // Increment tickets sold (simulate ticket sale)
  const handleSellTicket = (id, price = 10) => {
    setCashiers(
      cashiers.map((c) =>
        c.id === id
          ? { ...c, ticketsSold: c.ticketsSold + 1, cashBalance: c.cashBalance + price }
          : c
      )
    );
  };

  return (
    <AdminLayout>
      <h1>Cashier Management</h1>

      {/* Add new cashier */}
      <div className="add-cashier">
        <input
          type="text"
          placeholder="New cashier name"
          value={newCashierName}
          onChange={(e) => setNewCashierName(e.target.value)}
        />
        <button onClick={handleAddCashier}>Add Cashier</button>
      </div>

      {/* Cashier list */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Tickets Sold</th>
            <th>Cash Balance ($)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cashiers.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.ticketsSold}</td>
              <td>{c.cashBalance.toFixed(2)}</td>
              <td>
                <button onClick={() => handleSellTicket(c.id)}>Sell Ticket</button>
                <button onClick={() => handleDeposit(c.id)}>Deposit</button>
                <button onClick={() => handleRemoveCashier(c.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}
