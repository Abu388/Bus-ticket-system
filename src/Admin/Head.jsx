import React, { useState } from 'react';

// --- MOCK DATA (Simulating a complete API response) ---

// Data for Management Tables
const initialBuses = [
  { id: 1, name: "Selam Bus 01", plateNumber: "ET A12345", operator: "Selam Bus", capacity: 45, status: "Active", model: "Scania", maintenanceNext: "2023-12-01" },
  { id: 2, name: "Zemen Bus 05", plateNumber: "ET B67890", operator: "Zemen Bus", capacity: 50, status: "Maintenance", model: "Volvo", maintenanceNext: "2023-11-15" },
  { id: 3, name: "Sky Bus 11", plateNumber: "ET C11223", operator: "Sky Bus", capacity: 48, status: "Active", model: "Mercedes", maintenanceNext: "2023-12-15" },
  { id: 4, name: "Golden Bus 02", plateNumber: "ET D44556", operator: "Golden Bus", capacity: 45, status: "Inactive", model: "Isuzu", maintenanceNext: "2023-11-20" },
];

const initialDrivers = [
  { id: 201, name: "Tesfaye Alemu", license: "ET-D123456", expiry: "2024-06-30", assignedBus: "Selam Bus 01", status: "Active", performance: "Excellent" },
  { id: 202, name: "Mulugeta Bekele", license: "ET-D789012", expiry: "2025-03-15", assignedBus: "Zemen Bus 05", status: "On Leave", performance: "Good" },
  { id: 203, name: "Sara Yohannes", license: "ET-D345678", expiry: "2024-09-20", assignedBus: "Sky Bus 11", status: "Active", performance: "Excellent" },
  { id: 204, name: "Dawit Nigussie", license: "ET-D901234", expiry: "2025-01-10", assignedBus: null, status: "Available", performance: "Satisfactory" },
];

const initialUsers = [
  { id: 101, name: "Abebe Kebede", email: "abebe@example.com", role: "Passenger", status: "Active" },
  { id: 102, name: "Hana Girma", email: "hana.g@example.com", role: "Ticketing Officer", status: "Active" },
  { id: 103, name: "John Doe", email: "j.doe@example.com", role: "Passenger", status: "Suspended" },
  { id: 104, name: "Admin User", email: "admin@bus.com", role: "Admin", status: "Active" },
  { id: 105, name: "Cashier One", email: "cashier1@bus.com", role: "Cashier", status: "Active" },
];

const initialBookings = [
  { id: 'BK-1123', passenger: 'Abebe Kebede', route: 'Addis Ababa -> Gondar', status: 'Confirmed', date: '2023-10-28', seat: 'A12', cashier: null },
  { id: 'BK-1124', passenger: 'John Doe', route: 'Addis Ababa -> Bahir Dar', status: 'Pending Payment', date: '2023-10-28', seat: 'B5', cashier: 'Cashier One' },
  { id: 'BK-1125', passenger: 'Lensa Tadesse', route: 'Addis Ababa -> Hawassa', status: 'Cancelled', date: '2023-10-27', seat: 'C20', cashier: null },
  { id: 'BK-1126', passenger: 'Michael Asfaw', route: 'Addis Ababa -> Mekelle', status: 'Confirmed', date: '2023-10-29', seat: 'D8', cashier: 'Cashier One' },
];

const initialCashiers = [
  { id: 301, name: "Cashier One", ticketsSold: 15, totalHandled: 45000, shiftStart: "2023-10-28 08:00", shiftEnd: "2023-10-28 18:00", loginHistory: ["2023-10-28 07:55"] },
  { id: 302, name: "Cashier Two", ticketsSold: 12, totalHandled: 36000, shiftStart: "2023-10-28 09:00", shiftEnd: "2023-10-28 17:00", loginHistory: ["2023-10-28 08:45"] },
];

const initialRoutes = [
  { id: 1, name: "Addis Ababa -> Gondar", status: "Active", buses: 3 },
  { id: 2, name: "Addis Ababa -> Bahir Dar", status: "Active", buses: 2 },
  { id: 3, name: "Addis Ababa -> Hawassa", status: "Inactive", buses: 1 },
];

// Data for Analytics Charts
const revenueData = [
  { month: "Jan", revenue: 125000 }, { month: "Feb", revenue: 145000 }, { month: "Mar", revenue: 132000 },
  { month: "Apr", revenue: 158000 }, { month: "May", revenue: 172000 }, { month: "Jun", revenue: 195000 },
];

const bookingTrendsData = [
  { day: "Mon", bookings: 25 }, { day: "Tue", bookings: 30 }, { day: "Wed", bookings: 28 },
  { day: "Thu", bookings: 35 }, { day: "Fri", bookings: 40 }, { day: "Sat", bookings: 20 }, { day: "Sun", bookings: 15 },
];

const routePerformanceData = [
  { route: "Addis -> Gondar", performance: 95 }, { route: "Addis -> Bahir Dar", performance: 88 },
  { route: "Addis -> Hawassa", performance: 92 }, { route: "Addis -> Mekelle", performance: 90 },
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
    item || { name: '', plateNumber: '', operator: '', capacity: '', status: 'Active', model: '', maintenanceNext: '' }
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
      <input name="model" placeholder="Model" value={formData.model} onChange={handleChange} required />
      <input name="capacity" type="number" placeholder="Capacity" value={formData.capacity} onChange={handleChange} required />
      <input name="maintenanceNext" type="date" placeholder="Next Maintenance" value={formData.maintenanceNext} onChange={handleChange} />
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

// Driver Form Component
const DriverForm = ({ item, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(
    item || { name: '', license: '', expiry: '', assignedBus: '', status: 'Active', performance: 'Good' }
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
      <input name="name" placeholder="Driver Name" value={formData.name} onChange={handleChange} required />
      <input name="license" placeholder="License Number" value={formData.license} onChange={handleChange} required />
      <input name="expiry" type="date" placeholder="License Expiry" value={formData.expiry} onChange={handleChange} required />
      <input name="assignedBus" placeholder="Assigned Bus" value={formData.assignedBus} onChange={handleChange} />
      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="Active">Active</option>
        <option value="On Leave">On Leave</option>
        <option value="Available">Available</option>
      </select>
      <select name="performance" value={formData.performance} onChange={handleChange}>
        <option value="Excellent">Excellent</option>
        <option value="Good">Good</option>
        <option value="Satisfactory">Satisfactory</option>
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
        <option value="Cashier">Cashier</option>
        <option value="Driver">Driver</option>
        <option value="Inspector">Inspector</option>
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

// Seat Layout Preview Component
const SeatLayout = ({ capacity }) => {
  const seats = Array.from({ length: capacity }, (_, i) => i + 1);
  return (
    <div className="seat-layout">
      {seats.map(seat => <div key={seat} className="seat available">S{seat}</div>)}
    </div>
  );
};

function ComprehensiveAdminDashboard() {
  // State for interactive data (would be fetched from an API)
  const [buses, setBuses] = useState(initialBuses);
  const [drivers, setDrivers] = useState(initialDrivers);
  const [users, setUsers] = useState(initialUsers);
  const [bookings, setBookings] = useState(initialBookings);
  const [cashiers, setCashiers] = useState(initialCashiers);
  const [routes, setRoutes] = useState(initialRoutes);

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [formType, setFormType] = useState('');
  const [formMode, setFormMode] = useState('add');
  const [selectedItem, setSelectedItem] = useState(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState('');
  const [confirmItemId, setConfirmItemId] = useState(null);
  const [confirmCurrentStatus, setConfirmCurrentStatus] = useState('');

  // Separate modal states for different views
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBusModal, setShowBusModal] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);

  // Filters for bookings
  const [bookingFilter, setBookingFilter] = useState({ date: '', route: '', status: '' });

  // Computed values for overview
  const totalBuses = buses.length;
  const activeBuses = buses.filter(b => b.status === 'Active').length;
  const totalDrivers = drivers.length;
  const activeDrivers = drivers.filter(d => d.status === 'Active').length;
  const totalBookingsToday = bookings.filter(b => b.date === '2023-10-28').length; // Mock today
  const totalBookingsWeekly = 150; // Mock
  const totalBookingsMonthly = 600; // Mock
  const totalRevenue = 500000; // Mock
  const activeRoutes = routes.filter(r => r.status === 'Active').length;

  // System alerts
  const alerts = [
    { type: 'warning', message: 'Bus Zemen Bus 05 is overdue for maintenance.' },
    { type: 'error', message: 'Driver license for Sara Yohannes expires in 30 days.' },
    { type: 'info', message: 'New booking peak detected on weekends.' },
  ];

  // Filtered bookings
  const filteredBookings = bookings.filter(booking => {
    return (!bookingFilter.date || booking.date === bookingFilter.date) &&
           (!bookingFilter.route || booking.route.includes(bookingFilter.route)) &&
           (!bookingFilter.status || booking.status === bookingFilter.status);
  });

  // --- ACTION HANDLERS ---
  const openFormModal = (type, mode = 'add', item = null) => {
    setFormType(type);
    setFormMode(mode);
    setSelectedItem(item);
    setShowFormModal(true);
  };

  const handleAdd = (type) => openFormModal(type, 'add');
  const handleEdit = (type, id) => {
    const item = type === 'bus' ? buses.find((b) => b.id === id) :
                 type === 'driver' ? drivers.find((d) => d.id === id) :
                 users.find((u) => u.id === id);
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
    setShowBookingModal(true);
  };
  const handleViewBusSeats = (bus) => {
    setSelectedBus(bus);
    setShowBusModal(true);
  };

  const handleFormSubmit = (formData) => {
    if (formMode === 'add') {
      if (formType === 'bus') {
        const newBus = { ...formData, id: Math.max(...buses.map((b) => b.id)) + 1 };
        setBuses((prev) => [...prev, newBus]);
      } else if (formType === 'driver') {
        const newDriver = { ...formData, id: Math.max(...drivers.map((d) => d.id)) + 1 };
        setDrivers((prev) => [...prev, newDriver]);
      } else if (formType === 'user') {
        const newUser = { ...formData, id: Math.max(...users.map((u) => u.id)) + 1 };
        setUsers((prev) => [...prev, newUser]);
      }
    } else {
      if (formType === 'bus') {
        setBuses((prev) => prev.map((b) => (b.id === selectedItem.id ? formData : b)));
      } else if (formType === 'driver') {
        setDrivers((prev) => prev.map((d) => (d.id === selectedItem.id ? formData : d)));
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
      } else if (type === 'driver') {
        setDrivers((prev) => prev.filter((d) => d.id !== confirmItemId));
      } else if (type === 'user') {
        setUsers((prev) => prev.filter((u) => u.id !== confirmItemId));
      }
    } else if (confirmAction.match(/^toggle/i)) {
      const newStatus =
        type === 'bus'
          ? confirmCurrentStatus === 'Active'
            ? 'Maintenance'
            : 'Active'
          : type === 'driver'
          ? confirmCurrentStatus === 'Active'
            ? 'On Leave'
            : 'Active'
          : confirmCurrentStatus === 'Active'
          ? 'Suspended'
          : 'Active';
      if (type === 'bus') {
        setBuses((prev) =>
          prev.map((b) => (b.id === confirmItemId ? { ...b, status: newStatus } : b))
        );
      } else if (type === 'driver') {
        setDrivers((prev) =>
          prev.map((d) => (d.id === confirmItemId ? { ...d, status: newStatus } : d))
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
      case 'deleteDriver':
        return 'Are you sure you want to delete this driver? This action cannot be undone.';
      case 'deleteUser':
        return 'Are you sure you want to delete this user? This action cannot be undone.';
      case 'toggleBus':
        return `Are you sure you want to ${
          confirmCurrentStatus === 'Active' ? 'set to maintenance' : 'set to active'
        } this bus?`;
      case 'toggleDriver':
        return `Are you sure you want to ${
          confirmCurrentStatus === 'Active' ? 'set on leave' : 'set to active'
        } this driver?`;
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

  // Generate Ticket Mock
  const generateTicket = (booking) => {
    console.log(`Generating printable ticket for ${booking.id}`);
    // In real app, would generate PDF
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Control Panel</h1>

      {/* 🧭 Dashboard Overview */}
      <div className="dashboard-overview">
        <h2>System Overview</h2>
        <div className="overview-grid">
          <div className="overview-card">
            <h3>🚌 Total Buses</h3>
            <p className="overview-value">{totalBuses}</p>
            <p className="overview-sub">{activeBuses} Active</p>
          </div>
          <div className="overview-card">
            <h3>👨‍💼 Total Drivers</h3>
            <p className="overview-value">{totalDrivers}</p>
            <p className="overview-sub">{activeDrivers} Active</p>
          </div>
          <div className="overview-card">
            <h3>🎫 Total Bookings</h3>
            <p className="overview-value">Today: {totalBookingsToday}</p>
            <p className="overview-sub">Weekly: {totalBookingsWeekly} | Monthly: {totalBookingsMonthly}</p>
          </div>
          <div className="overview-card">
            <h3>💰 Total Revenue</h3>
            <p className="overview-value">ETB {totalRevenue.toLocaleString()}</p>
            <p className="overview-sub">+12% MoM</p>
          </div>
          <div className="overview-card">
            <h3>📍 Active Routes</h3>
            <p className="overview-value">{activeRoutes}</p>
            <p className="overview-sub">Out of {routes.length}</p>
          </div>
        </div>

        {/* System Alerts */}
        <div className="alerts-section">
          <h3>⚙️ System Notifications</h3>
          <div className="alerts-list">
            {alerts.map((alert, index) => (
              <div key={index} className={`alert alert-${alert.type}`}>
                {alert.message}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 📊 Reports & Analytics Dashboard */}
      <div className="charts-section">
        <h2>Performance Analytics</h2>
        <div className="charts-grid">
          {/* Revenue Trend (Line-like Bar) */}
          <div className="chart-container">
            <h3>Revenue Trends</h3>
            <div className="line-chart">
              {revenueData.map((item, index) => (
                <div key={index} className="line-point">
                  <div className="line-label">{item.month}</div>
                  <div className="line-bar" style={{ height: `${(item.revenue / 200000) * 100}%` }}></div>
                  <div className="line-value">ETB {item.revenue.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Booking Trends */}
          <div className="chart-container">
            <h3>Weekly Bookings</h3>
            <div className="bar-chart">
              {bookingTrendsData.map((item, index) => (
                <div key={index} className="bar-item">
                  <div className="bar-label">{item.day}</div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ height: `${(item.bookings / 50) * 100}%` }}
                    ></div>
                  </div>
                  <div className="bar-value">{item.bookings}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Route Performance */}
          <div className="chart-container">
            <h3>Route Performance</h3>
            <div className="doughnut-chart">
              {routePerformanceData.map((item, index) => {
                const color = `hsl(${index * 90}, 70%, 50%)`;
                return (
                  <div key={index} className="doughnut-segment">
                    <span className="color-indicator" style={{ backgroundColor: color }}></span>
                    <span className="doughnut-label">{item.route}: {item.performance}%</span>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Existing Charts */}
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

      {/* 💰 Cashier Summary */}
      <div className="management-section">
        <div className="section-header">
          <h2>Cashier Summary</h2>
          <button className="btn-secondary">Export Report</button>
        </div>
        <div className="summary-grid">
          <div className="summary-card">
            <h3>✅ Total Tickets Sold</h3>
            <p className="summary-value">127</p>
          </div>
          <div className="summary-card">
            <h3>💵 Total Cash Collected</h3>
            <p className="summary-value">ETB 382,500</p>
          </div>
          <div className="summary-card">
            <h3>💰 Total Revenue</h3>
            <p className="summary-value">ETB 500,000</p>
          </div>
        </div>
      </div>

      {/* 📅 Cashier Activity Log */}
      <div className="management-section">
        <div className="section-header">
          <h2>Cashier Activity Log</h2>
        </div>
        <div className="data-cards">
          {cashiers.map((cashier) => (
            <div key={cashier.id} className="data-card">
              <div className="card-header">
                <h4>{cashier.name}</h4>
              </div>
              <div className="card-body">
                <p><strong>Tickets Sold:</strong> {cashier.ticketsSold}</p>
                <p><strong>Total Handled:</strong> ETB {cashier.totalHandled.toLocaleString()}</p>
                <p><strong>Shift:</strong> {cashier.shiftStart} - {cashier.shiftEnd}</p>
                <p><strong>Recent Logins:</strong> {cashier.loginHistory.slice(-2).join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🚍 Bus Management */}
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
                <p><strong>Plate Number:</strong> {bus.plateNumber}</p>
                <p><strong>Operator:</strong> {bus.operator}</p>
                <p><strong>Model:</strong> {bus.model}</p>
                <p><strong>Capacity:</strong> {bus.capacity}</p>
                <p><strong>Next Maintenance:</strong> {bus.maintenanceNext}</p>
              </div>
              <div className="card-actions">
                <button className="btn-icon" title="View Seat Layout" onClick={() => handleViewBusSeats(bus)}>
                  🪑
                </button>
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

      {/* 👨‍✈️ Driver Management */}
      <div className="management-section">
        <div className="section-header">
          <h2>Driver Management</h2>
          <button className="btn-primary" onClick={() => handleAdd('driver')}>
            + Register New Driver
          </button>
        </div>
        <div className="data-cards">
          {drivers.map((driver) => (
            <div key={driver.id} className="data-card">
              <div className="card-header">
                <h4>{driver.name}</h4>
                <span className={`status-badge status-${driver.status.toLowerCase().replace(' ', '-')}`}>
                  {driver.status}
                </span>
              </div>
              <div className="card-body">
                <p><strong>License:</strong> {driver.license}</p>
                <p><strong>Expiry:</strong> {driver.expiry}</p>
                <p><strong>Assigned Bus:</strong> {driver.assignedBus || 'None'}</p>
                <p><strong>Performance:</strong> {driver.performance}</p>
              </div>
              <div className="card-actions">
                <button
                  className="btn-icon"
                  title="Edit"
                  onClick={() => handleEdit('driver', driver.id)}
                >
                  ✏️
                </button>
                <button
                  className="btn-icon"
                  title={
                    driver.status === 'Active' ? 'Set On Leave' : 'Set to Active'
                  }
                  onClick={() => handleToggleStatus('driver', driver.id, driver.status)}
                >
                  {driver.status === 'Active' ? '🚫' : '✅'}
                </button>
                <button
                  className="btn-icon btn-danger"
                  title="Delete"
                  onClick={() => handleDelete('driver', driver.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🧑‍💼 User & Role Management */}
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
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
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
                <button
                  className="btn-icon btn-danger"
                  title="Delete"
                  onClick={() => handleDelete('user', user.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🎟 Booking Management */}
      <div className="management-section">
        <div className="section-header">
          <h2>Booking Management</h2>
          <div className="filters">
            <input type="date" placeholder="Date" value={bookingFilter.date} onChange={(e) => setBookingFilter({...bookingFilter, date: e.target.value})} />
            <input type="text" placeholder="Route" value={bookingFilter.route} onChange={(e) => setBookingFilter({...bookingFilter, route: e.target.value})} />
            <select value={bookingFilter.status} onChange={(e) => setBookingFilter({...bookingFilter, status: e.target.value})}>
              <option value="">All Status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending Payment">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <button className="btn-secondary">View All Bookings</button>
        </div>
        <div className="data-cards">
          {filteredBookings.map((booking) => (
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
                <p><strong>Passenger:</strong> {booking.passenger}</p>
                <p><strong>Route:</strong> {booking.route}</p>
                <p><strong>Date:</strong> {booking.date}</p>
                <p><strong>Seat:</strong> {booking.seat}</p>
                <p><strong>Cashier:</strong> {booking.cashier || 'N/A'}</p>
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
                  className="btn-icon"
                  title="Generate Ticket"
                  onClick={() => generateTicket(booking)}
                >
                  🎫
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
        ) : formType === 'driver' ? (
          <DriverForm
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
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setSelectedBooking(null);
        }}
        title="Booking Details"
      >
        {selectedBooking && (
          <div>
            <p><strong>Passenger:</strong> {selectedBooking.passenger}</p>
            <p><strong>Route:</strong> {selectedBooking.route}</p>
            <p><strong>Date:</strong> {selectedBooking.date}</p>
            <p><strong>Seat:</strong> {selectedBooking.seat}</p>
            <p><strong>Status:</strong>{' '}
              <span
                className={`status-badge status-${selectedBooking.status
                  .replace(' ', '-')
                  .toLowerCase()}`}
              >
                {selectedBooking.status}
              </span>
            </p>
            <p><strong>Cashier:</strong> {selectedBooking.cashier || 'N/A'}</p>
            <button className="btn-primary" onClick={() => generateTicket(selectedBooking)}>Generate Ticket</button>
          </div>
        )}
      </Modal>

      {/* Seat Layout Modal */}
      <Modal
        isOpen={showBusModal}
        onClose={() => {
          setShowBusModal(false);
          setSelectedBus(null);
        }}
        title={`Seat Layout for ${selectedBus?.name || 'Bus'}`}
      >
        {selectedBus && <SeatLayout capacity={selectedBus.capacity || 45} />}
      </Modal>

      <style>{`
        /* --- GLOBAL & LAYOUT --- */
        .admin-dashboard { max-width: 1400px; margin: 0 auto; padding: 30px 20px; font-family: 'Inter', sans-serif; background: #f8fafc; color: #334155; }
        h1 { text-align: center; font-size: 2.2rem; font-weight: 700; margin-bottom: 30px; color: #1e293b; }
        h2 { font-size: 1.5rem; margin: 0 0 20px 0; color: #1e293b; }

        /* --- DASHBOARD OVERVIEW --- */
        .dashboard-overview { margin-bottom: 40px; }
        .overview-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 20px; }
        .overview-card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 10px rgba(0,0,0,0.05); text-align: center; }
        .overview-card h3 { font-size: 0.9rem; margin-bottom: 10px; color: #64748b; }
        .overview-value { font-size: 1.8rem; font-weight: 700; color: #3b82f6; margin: 0; }
        .overview-sub { font-size: 0.85rem; color: #475569; margin-top: 5px; }

        .alerts-section { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .alerts-list { display: flex; flex-direction: column; gap: 10px; }
        .alert { padding: 10px; border-radius: 6px; font-size: 0.9rem; }
        .alert-warning { background: #fef9c3; color: #854d0e; border-left: 4px solid #f59e0b; }
        .alert-error { background: #fee2e2; color: #991b1b; border-left: 4px solid #ef4444; }
        .alert-info { background: #dbeafe; color: #1e40af; border-left: 4px solid #3b82f6; }

        /* --- SUMMARY GRID --- */
        .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 20px; }
        .summary-card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 10px rgba(0,0,0,0.05); text-align: center; }
        .summary-card h3 { font-size: 1rem; margin-bottom: 10px; color: #64748b; font-weight: 500;}
        .summary-value { font-size: 2rem; font-weight: 700; color: #3b82f6; margin: 0; }

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

        /* Line Chart */
        .line-chart { display: flex; align-items: flex-end; height: 200px; gap: 15px; padding-top: 20px; }
        .line-point { display: flex; flex-direction: column; align-items: center; flex: 1; }
        .line-bar { width: 30px; background: #3b82f6; border-radius: 0 0 4px 4px; position: relative; }
        .line-label, .line-value { font-size: 0.8rem; margin-top: 8px; text-align: center; color: #64748b; }

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
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px; }
        .filters { display: flex; gap: 10px; flex-wrap: wrap; }
        .filters input, .filters select { padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; }
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
        .status-maintenance, .status-pending-payment, .status-on-leave { background-color: #fef9c3; color: #854d0e; }
        .status-inactive, .status-suspended, .status-cancelled, .status-available { background-color: #fee2e2; color: #991b1b; }
        
        .actions { display: flex; gap: 8px; }
        .btn-icon { background: none; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px; cursor: pointer; font-size: 1rem; line-height: 1; transition: background-color 0.2s, border-color 0.2s; }
        .btn-icon:hover { background-color: #e2e8f0; border-color: #94a3b8; }
        .btn-danger:hover { background-color: #fee2e2; border-color: #ef4444; }
        
        /* --- SEAT LAYOUT --- */
        .seat-layout { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; max-width: 400px; }
        .seat { width: 40px; height: 40px; background: #e2e8f0; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; }
        .seat.available { background: #dcfce7; color: #166534; }

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