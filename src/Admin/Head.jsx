import React, { useState } from 'react';

// --- MOCK DATA (Simulating a complete API response) ---

// Data for Management Tables
const initialBuses = [
  { id: 1, name: "Selam Bus 01", plateNumber: "ET A12345", operator: "Selam Bus", capacity: 45, status: "Active" },
  { id: 2, name: "Zemen Bus 05", plateNumber: "ET B67890", operator: "Zemen Bus", capacity: 50, status: "Maintenance" },
  { id: 3, name: "Sky Bus 11", plateNumber: "ET C11223", operator: "Sky Bus", capacity: 48, status: "Active" },
  { id: 4, name: "Golden Bus 02", plateNumber: "ET D44556", operator: "Golden Bus", capacity: 45, status: "Inactive" },
];

const initialUsers = [
  { id: 101, name: "Abebe Kebede", email: "abebe@example.com", role: "Passenger", status: "Active" },
  { id: 102, name: "Hana Girma", email: "hana.g@example.com", role: "Ticketing Officer", status: "Active" },
  { id: 103, name: "John Doe", email: "j.doe@example.com", role: "Passenger", status: "Suspended" },
  { id: 104, name: "Admin User", email: "admin@bus.com", role: "Admin", status: "Active" },
];

const initialBookings = [
    { id: 'BK-1123', passenger: 'Abebe Kebede', route: 'Addis Ababa -> Gondar', status: 'Confirmed', date: '2023-10-28' },
    { id: 'BK-1124', passenger: 'John Doe', route: 'Addis Ababa -> Bahir Dar', status: 'Pending Payment', date: '2023-10-28' },
    { id: 'BK-1125', passenger: 'Lensa Tadesse', route: 'Addis Ababa -> Hawassa', status: 'Cancelled', date: '2023-10-27' },
];

// Data for Analytics Charts
const revenueData = [
  { month: "Jan", revenue: 125000 }, { month: "Feb", revenue: 145000 }, { month: "Mar", revenue: 132000 },
  { month: "Apr", revenue: 158000 }, { month: "May", revenue: 172000 }, { month: "Jun", revenue: 195000 },
];

const tripData = [
  { name: "Selam Bus", trips: 120 }, { name: "Zemen Bus", trips: 90 },
  { name: "Sky Bus", trips: 60 }, { name: "Golden Bus", trips: 110 }, { name: "Liyu Bus", trips: 95 },
];

const passengerTypeData = [
  { type: "Business", count: 45 }, { type: "Student", count: 30 }, { type: "Tourist", count: 25 },
];

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

// Bus Form Component
const BusForm = ({ item, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(
    item || { name: '', plateNumber: '', operator: '', capacity: '', status: 'Active' }
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Bus Name" value={formData.name} onChange={handleChange} required />
      <input name="plateNumber" placeholder="Plate Number" value={formData.plateNumber} onChange={handleChange} required />
      <input name="operator" placeholder="Operator" value={formData.operator} onChange={handleChange} required />
      <input name="capacity" type="number" placeholder="Capacity" value={formData.capacity} onChange={handleChange} required />
      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="Active">Active</option>
        <option value="Maintenance">Maintenance</option>
        <option value="Inactive">Inactive</option>
      </select>
      <div className="modal-actions">
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-submit">Save</button>
      </div>
    </form>
  );
};

// User Form Component
const UserForm = ({ item, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(
    item || { name: '', email: '', role: 'Passenger', status: 'Active' }
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="User Name" value={formData.name} onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <select name="role" value={formData.role} onChange={handleChange}>
        <option value="Passenger">Passenger</option>
        <option value="Ticketing Officer">Ticketing Officer</option>
        <option value="Admin">Admin</option>
      </select>
      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="Active">Active</option>
        <option value="Suspended">Suspended</option>
      </select>
      <div className="modal-actions">
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-submit">Save</button>
      </div>
    </form>
  );
};

function ComprehensiveAdminDashboard() {
  // State for interactive data (would be fetched from an API)
  const [buses, setBuses] = useState(initialBuses);
  const [users, setUsers] = useState(initialUsers);
  const [bookings, setBookings] = useState(initialBookings);

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [formType, setFormType] = useState('');
  const [formMode, setFormMode] = useState('add');
  const [selectedItem, setSelectedItem] = useState(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState('');
  const [confirmItemId, setConfirmItemId] = useState(null);
  const [confirmCurrentStatus, setConfirmCurrentStatus] = useState('');

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // --- ACTION HANDLERS ---
  const openFormModal = (type, mode = 'add', item = null) => {
    setFormType(type);
    setFormMode(mode);
    setSelectedItem(item);
    setShowFormModal(true);
  };

  const handleAdd = (type) => openFormModal(type, 'add');
  const handleEdit = (type, id) => {
    const item = type === 'bus' ? buses.find((b) => b.id === id) : users.find((u) => u.id === id);
    openFormModal(type, 'edit', item);
  };

  const openConfirmModal = (action, id, currentStatus = '') => {
    setConfirmAction(action);
    setConfirmItemId(id);
    setConfirmCurrentStatus(currentStatus);
    setShowConfirmModal(true);
  };

  const handleDelete = (type, id) => openConfirmModal(`delete${type.charAt(0).toUpperCase() + type.slice(1)}`, id);
  const handleToggleStatus = (type, id, status) => openConfirmModal(`toggle${type.charAt(0).toUpperCase() + type.slice(1)}`, id, status);
  const handleResetPassword = (id) => openConfirmModal('resetPassword', id);
  const handleCancelBooking = (id) => openConfirmModal('cancelBooking', id);
  const handleView = (booking) => {
    setSelectedBooking(booking);
    setShowViewModal(true);
  };

  const handleFormSubmit = (formData) => {
    if (formMode === 'add') {
      if (formType === 'bus') {
        const newBus = { ...formData, id: Math.max(...buses.map((b) => b.id)) + 1 };
        setBuses((prev) => [...prev, newBus]);
      } else if (formType === 'user') {
        const newUser = { ...formData, id: Math.max(...users.map((u) => u.id)) + 1 };
        setUsers((prev) => [...prev, newUser]);
      }
    } else {
      if (formType === 'bus') {
        setBuses((prev) => prev.map((b) => (b.id === selectedItem.id ? formData : b)));
      } else if (formType === 'user') {
        setUsers((prev) => prev.map((u) => (u.id === selectedItem.id ? formData : u)));
      }
    }
    setShowFormModal(false);
  };

  const handleConfirm = () => {
    const type = confirmAction.replace(/^(delete|toggle)/i, '').toLowerCase();
    if (confirmAction.match(/^delete/i)) {
      if (type === 'bus') {
        setBuses((prev) => prev.filter((b) => b.id !== confirmItemId));
      } else if (type === 'user') {
        setUsers((prev) => prev.filter((u) => u.id !== confirmItemId));
      }
    } else if (confirmAction.match(/^toggle/i)) {
      const newStatus =
        type === 'bus'
          ? confirmCurrentStatus === 'Active'
            ? 'Maintenance'
            : 'Active'
          : confirmCurrentStatus === 'Active'
          ? 'Suspended'
          : 'Active';
      if (type === 'bus') {
        setBuses((prev) =>
          prev.map((b) => (b.id === confirmItemId ? { ...b, status: newStatus } : b))
        );
      } else if (type === 'user') {
        setUsers((prev) =>
          prev.map((u) => (u.id === confirmItemId ? { ...u, status: newStatus } : u))
        );
      }
    } else if (confirmAction === 'cancelBooking') {
      setBookings((prev) =>
        prev.map((bk) => (bk.id === confirmItemId ? { ...bk, status: 'Cancelled' } : bk))
      );
    } else if (confirmAction === 'resetPassword') {
      // Mock: Send email
      console.log(`Password reset email sent for user ${confirmItemId}`);
    }
    setShowConfirmModal(false);
  };

  // Dynamic confirm message
  const getConfirmMessage = () => {
    switch (confirmAction) {
      case 'deleteBus':
        return 'Are you sure you want to delete this bus? This action cannot be undone.';
      case 'deleteUser':
        return 'Are you sure you want to delete this user? This action cannot be undone.';
      case 'toggleBus':
        return `Are you sure you want to ${
          confirmCurrentStatus === 'Active' ? 'set to maintenance' : 'set to active'
        } this bus?`;
      case 'toggleUser':
        return `Are you sure you want to ${
          confirmCurrentStatus === 'Active' ? 'suspend' : 'reactivate'
        } this user?`;
      case 'cancelBooking':
        return 'Are you sure you want to cancel this booking?';
      case 'resetPassword':
        return 'Send password reset email to this user?';
      default:
        return 'Confirm this action?';
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Control Panel</h1>

      {/* 🧭 Operational Widgets */}
      <div className="dashboard-summary">
        <div className="summary-card">
          <h3>🚦 Live Bookings</h3>
          <p className="summary-value">34</p>
          <p className="summary-change">2 new in the last hour</p>
        </div>
        <div className="summary-card">
          <h3>💰 Daily Revenue</h3>
          <p className="summary-value">ETB 124,500</p>
          <p className="summary-change">+15% from yesterday</p>
        </div>
        <div className="summary-card">
          <h3>🧾 Pending Refunds</h3>
          <p className="summary-value">8</p>
          <p className="summary-change">Awaiting your approval</p>
        </div>
        <div className="summary-card">
          <h3>🚌 Active Buses</h3>
          <p className="summary-value">42 / 55</p>
          <p className="summary-change">76% of fleet is on-route</p>
        </div>
      </div>

      {/* 📊 Reports & Analytics Dashboard */}
      <div className="charts-section">
        <h2>Performance Analytics</h2>
        <div className="charts-grid">
          {/* Revenue Chart */}
          <div className="chart-container">
            <h3>Monthly Revenue</h3>
            <div className="bar-chart">
              {revenueData.map((item, index) => (
                <div key={index} className="bar-item">
                  <div className="bar-label">{item.month}</div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ height: `${(item.revenue / 200000) * 100}%` }}
                    ></div>
                  </div>
                  <div className="bar-value">ETB {item.revenue.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Trip Distribution Chart */}
          <div className="chart-container">
            <h3>Trips by Operator</h3>
            <div className="doughnut-chart">
              {tripData.map((item, index) => {
                const totalTrips = tripData.reduce((sum, current) => sum + current.trips, 0);
                const percentage = (item.trips / totalTrips) * 100;
                const color = `hsl(${index * 70}, 70%, 50%)`;
                return (
                  <div key={index} className="doughnut-segment">
                    <span
                      className="color-indicator"
                      style={{ backgroundColor: color }}
                    ></span>
                    <span className="doughnut-label">
                      {item.name}: {item.trips} trips ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Passenger Type Chart */}
          <div className="chart-container">
            <h3>Passenger Distribution</h3>
            {passengerTypeData.map((item, index) => {
              const color = `hsl(${index * 120 + 30}, 70%, 50%)`;
              return (
                <div key={index} className="pie-item">
                  <span className="pie-label">{item.type}</span>
                  <div className="pie-track">
                    <div
                      className="pie-fill"
                      style={{ width: `${item.count}%`, backgroundColor: color }}
                    ></div>
                  </div>
                  <span className="pie-value">{item.count}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 🚍 Bus & Route Management Cards */}
      <div className="management-section">
        <div className="section-header">
          <h2>Bus Fleet Management</h2>
          <button className="btn-primary" onClick={() => handleAdd('bus')}>
            + Add New Bus
          </button>
        </div>
        <div className="data-cards">
          {buses.map((bus) => (
            <div key={bus.id} className="data-card">
              <div className="card-header">
                <h4>{bus.name}</h4>
                <span className={`status-badge status-${bus.status.toLowerCase()}`}>
                  {bus.status}
                </span>
              </div>
              <div className="card-body">
                <p>
                  <strong>Plate Number:</strong> {bus.plateNumber}
                </p>
                <p>
                  <strong>Operator:</strong> {bus.operator}
                </p>
                <p>
                  <strong>Capacity:</strong> {bus.capacity}
                </p>
              </div>
              <div className="card-actions">
                <button
                  className="btn-icon"
                  title="Edit"
                  onClick={() => handleEdit('bus', bus.id)}
                >
                  ✏️
                </button>
                <button
                  className="btn-icon"
                  title={
                    bus.status === 'Active' ? 'Block for Maintenance' : 'Set to Active'
                  }
                  onClick={() => handleToggleStatus('bus', bus.id, bus.status)}
                >
                  {bus.status === 'Active' ? '🛑' : '✅'}
                </button>
                <button
                  className="btn-icon btn-danger"
                  title="Delete"
                  onClick={() => handleDelete('bus', bus.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🧑‍💼 User & Role Management Cards */}
      <div className="management-section">
        <div className="section-header">
          <h2>User & Role Management</h2>
          <button className="btn-primary" onClick={() => handleAdd('user')}>
            + Create New User
          </button>
        </div>
        <div className="data-cards">
          {users.map((user) => (
            <div key={user.id} className="data-card">
              <div className="card-header">
                <h4>{user.name}</h4>
                <span className={`status-badge status-${user.status.toLowerCase()}`}>
                  {user.status}
                </span>
              </div>
              <div className="card-body">
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Role:</strong> {user.role}
                </p>
              </div>
              <div className="card-actions">
                <button
                  className="btn-icon"
                  title="Edit"
                  onClick={() => handleEdit('user', user.id)}
                >
                  ✏️
                </button>
                <button
                  className="btn-icon"
                  title={user.status === 'Active' ? 'Suspend User' : 'Reactivate User'}
                  onClick={() => handleToggleStatus('user', user.id, user.status)}
                >
                  {user.status === 'Active' ? '🚫' : '✅'}
                </button>
                <button
                  className="btn-icon"
                  title="Reset Password"
                  onClick={() => handleResetPassword(user.id)}
                >
                  🔑
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🎟 Booking Management Cards */}
      <div className="management-section">
        <div className="section-header">
          <h2>Recent Bookings</h2>
          <button className="btn-secondary">View All Bookings</button>
        </div>
        <div className="data-cards">
          {bookings.map((booking) => (
            <div key={booking.id} className="data-card">
              <div className="card-header">
                <h4>{booking.id}</h4>
                <span
                  className={`status-badge status-${booking.status
                    .replace(' ', '-')
                    .toLowerCase()}`}
                >
                  {booking.status}
                </span>
              </div>
              <div className="card-body">
                <p>
                  <strong>Passenger:</strong> {booking.passenger}
                </p>
                <p>
                  <strong>Route:</strong> {booking.route}
                </p>
                <p>
                  <strong>Date:</strong> {booking.date}
                </p>
              </div>
              <div className="card-actions">
                <button
                  className="btn-icon"
                  title="View Details"
                  onClick={() => handleView(booking)}
                >
                  👁️
                </button>
                <button
                  className="btn-icon btn-danger"
                  title="Cancel Booking"
                  onClick={() => handleCancelBooking(booking.id)}
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title={
          formMode === 'add'
            ? `Add New ${formType.charAt(0).toUpperCase() + formType.slice(1)}`
            : `Edit ${formType.charAt(0).toUpperCase() + formType.slice(1)}`
        }
      >
        {formType === 'bus' ? (
          <BusForm
            item={selectedItem}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowFormModal(false)}
          />
        ) : (
          <UserForm
            item={selectedItem}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowFormModal(false)}
          />
        )}
      </Modal>

      {/* Confirm Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Action"
      >
        <p>{getConfirmMessage()}</p>
        <div className="modal-actions">
          <button onClick={() => setShowConfirmModal(false)}>Cancel</button>
          <button className="btn-danger" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </Modal>

      {/* View Booking Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Booking Details"
      >
        {selectedBooking && (
          <div>
            <p>
              <strong>Passenger:</strong> {selectedBooking.passenger}
            </p>
            <p>
              <strong>Route:</strong> {selectedBooking.route}
            </p>
            <p>
              <strong>Date:</strong> {selectedBooking.date}
            </p>
            <p>
              <strong>Status:</strong>{' '}
              <span
                className={`status-badge status-${selectedBooking.status
                  .replace(' ', '-')
                  .toLowerCase()}`}
              >
                {selectedBooking.status}
              </span>
            </p>
          </div>
        )}
      </Modal>

      <style>{`
        /* --- GLOBAL & LAYOUT --- */
        .admin-dashboard { max-width: 1400px; margin: 0 auto; padding: 30px 20px; font-family: 'Inter', sans-serif; background: #f8fafc; color: #334155; }
        h1 { text-align: center; font-size: 2.2rem; font-weight: 700; margin-bottom: 30px; color: #1e293b; }
        h2 { font-size: 1.5rem; margin: 0; color: #1e293b; }

        /* --- DASHBOARD WIDGETS --- */
        .dashboard-summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 40px; }
        .summary-card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .summary-card h3 { font-size: 1rem; margin-bottom: 10px; color: #64748b; font-weight: 500;}
        .summary-value { font-size: 2rem; font-weight: 700; color: #3b82f6; margin: 0; }
        .summary-change { font-size: 0.85rem; color: #475569; margin-top: 5px; }
        
        /* --- ANALYTICS CHARTS --- */
        .charts-section { margin-bottom: 40px; }
        .charts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; }
        .chart-container { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .chart-container h3 { font-size: 1.2rem; margin-bottom: 15px; color: #334155; }

        /* Bar Chart */
        .bar-chart { display: flex; align-items: flex-end; height: 200px; gap: 15px; padding-top: 20px; }
        .bar-item { display: flex; flex-direction: column; align-items: center; flex: 1; }
        .bar-track { height: 150px; width: 30px; background: #e2e8f0; border-radius: 4px 4px 0 0; position: relative; overflow: hidden; }
        .bar-fill { position: absolute; bottom: 0; width: 100%; background: #3b82f6; transition: height 0.5s ease; }
        .bar-label, .bar-value { font-size: 0.8rem; margin-top: 8px; text-align: center; color: #64748b; }
        
        /* Doughnut & Pie Charts (Simplified for clarity) */
        .doughnut-chart { display: flex; flex-direction: column; gap: 12px; margin-top: 15px; }
        .doughnut-segment { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; }
        .pie-item { display: grid; grid-template-columns: 80px 1fr 40px; align-items: center; gap: 10px; margin-bottom: 8px; }
        .color-indicator { width: 12px; height: 12px; border-radius: 50%; display: inline-block; flex-shrink: 0;}
        .pie-track { width: 100%; height: 12px; background: #e2e8f0; border-radius: 6px; overflow: hidden; }
        .pie-fill { height: 100%; border-radius: 6px; transition: width 0.5s ease; }
        .pie-label, .doughnut-label, .pie-value { font-size: 0.9rem; color: #475569; }
        
        /* --- MANAGEMENT CARDS & BUTTONS --- */
        .management-section { margin-bottom: 40px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .btn-primary { background-color: #3b82f6; color: white; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background-color 0.2s; }
        .btn-primary:hover { background-color: #2563eb; }
        .btn-secondary { background-color: #e2e8f0; color: #334155; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background-color 0.2s; }
        .btn-secondary:hover { background-color: #cbd5e1; }

        .data-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem; }
        .data-card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-left: 4px solid #3b82f6; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .card-header h4 { margin: 0; color: #1e293b; }
        .card-body p { margin: 0.5rem 0; color: #64748b; }
        .card-actions { display: flex; gap: 0.5rem; margin-top: 1rem; justify-content: flex-end; }

        .status-badge { padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; text-transform: capitalize; }
        .status-active, .status-confirmed { background-color: #dcfce7; color: #166534; }
        .status-maintenance, .status-pending-payment { background-color: #fef9c3; color: #854d0e; }
        .status-inactive, .status-suspended, .status-cancelled { background-color: #fee2e2; color: #991b1b; }
        
        .actions { display: flex; gap: 8px; }
        .btn-icon { background: none; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px; cursor: pointer; font-size: 1rem; line-height: 1; transition: background-color 0.2s, border-color 0.2s; }
        .btn-icon:hover { background-color: #e2e8f0; border-color: #94a3b8; }
        .btn-danger:hover { background-color: #fee2e2; border-color: #ef4444; }
        
        /* --- MODALS --- */
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: white; border-radius: 12px; width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-bottom: 1px solid #e2e8f0; }
        .modal-header h3 { margin: 0; }
        .modal-header button { background: none; border: none; font-size: 1.5rem; cursor: pointer; }
        .modal-body { padding: 1.5rem; }
        form { display: flex; flex-direction: column; gap: 1rem; }
        input, select { padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 6px; }
        .btn-submit { background: #3b82f6; color: white; border: none; padding: 0.75rem; border-radius: 6px; cursor: pointer; }
        .modal-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem; }
        .modal-actions button { padding: 0.75rem 1.5rem; border: 1px solid #cbd5e1; background: white; border-radius: 6px; cursor: pointer; }
        .modal-actions .btn-danger { background: #ef4444; color: white; border-color: #ef4444; }
        .modal-actions .btn-danger:hover { background: #dc2626; }
      `}</style>
    </div>
  );
}

export default ComprehensiveAdminDashboard;