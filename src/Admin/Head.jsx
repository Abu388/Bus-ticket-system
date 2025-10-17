import React, { useState } from 'react';
import { Bus, User, Ticket, MapPin, AlertCircle, Clock, Eye, Edit, Trash2, CheckCircle, XCircle, AlertTriangle, DollarSign, Users, Calendar, FileText, MessageCircle, Phone, Settings, Activity, BarChart3, TrendingUp, Download } from 'lucide-react';

// Shadcn UI Components (assuming standard installation)
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';


// --- MOCK DATA (Updated dates to 2025-10-15 context) ---

// Data for Management Tables
const initialBuses = [
  { id: 1, name: "Selam Bus 01", plateNumber: "ET A12345", operator: "Selam Bus", capacity: 45, status: "Active", model: "Scania", maintenanceNext: "2025-12-01" },
  { id: 2, name: "Zemen Bus 05", plateNumber: "ET B67890", operator: "Zemen Bus", capacity: 50, status: "Maintenance", model: "Volvo", maintenanceNext: "2025-11-15" },
  { id: 3, name: "Sky Bus 11", plateNumber: "ET C11223", operator: "Sky Bus", capacity: 48, status: "Active", model: "Mercedes", maintenanceNext: "2025-12-15" },
  { id: 4, name: "Golden Bus 02", plateNumber: "ET D44556", operator: "Golden Bus", capacity: 45, status: "Inactive", model: "Isuzu", maintenanceNext: "2025-11-20" },
];

const initialDrivers = [
  { id: 201, name: "Tesfaye Alemu", license: "ET-D123456", expiry: "2026-06-30", assignedBus: "Selam Bus 01", status: "Active", performance: "Excellent" },
  { id: 202, name: "Mulugeta Bekele", license: "ET-D789012", expiry: "2025-03-15", assignedBus: "Zemen Bus 05", status: "On Leave", performance: "Good" },
  { id: 203, name: "Sara Yohannes", license: "ET-D345678", expiry: "2025-09-20", assignedBus: "Sky Bus 11", status: "Active", performance: "Excellent" },
  { id: 204, name: "Dawit Nigussie", license: "ET-D901234", expiry: "2026-01-10", assignedBus: null, status: "Available", performance: "Satisfactory" },
];

const initialUsers = [
  { id: 101, name: "Abebe Kebede", email: "abebe@example.com", role: "Passenger", status: "Active" },
  { id: 102, name: "Hana Girma", email: "hana.g@example.com", role: "Ticketing Officer", status: "Active" },
  { id: 103, name: "John Doe", email: "j.doe@example.com", role: "Passenger", status: "Suspended" },
  { id: 104, name: "Admin User", email: "admin@bus.com", role: "Admin", status: "Active" },
  { id: 105, name: "Cashier One", email: "cashier1@bus.com", role: "Cashier", status: "Active" },
];

const initialBookings = [
  { id: 'BK-1123', passenger: 'Abebe Kebede', route: 'Addis Ababa -> Gondar', status: 'Confirmed', date: '2025-10-15', seat: 'A12', cashier: null },
  { id: 'BK-1124', passenger: 'John Doe', route: 'Addis Ababa -> Bahir Dar', status: 'Pending Payment', date: '2025-10-15', seat: 'B5', cashier: 'Cashier One' },
  { id: 'BK-1125', passenger: 'Lensa Tadesse', route: 'Addis Ababa -> Hawassa', status: 'Cancelled', date: '2025-10-14', seat: 'C20', cashier: null },
  { id: 'BK-1126', passenger: 'Michael Asfaw', route: 'Addis Ababa -> Mekelle', status: 'Confirmed', date: '2025-10-16', seat: 'D8', cashier: 'Cashier One' },
];

const initialCashiers = [
  { id: 301, name: "Cashier One", ticketsSold: 15, totalHandled: 45000, shiftStart: "2025-10-15 08:00", shiftEnd: "2025-10-15 18:00", loginHistory: ["2025-10-15 07:55"] },
  { id: 302, name: "Cashier Two", ticketsSold: 12, totalHandled: 36000, shiftStart: "2025-10-15 09:00", shiftEnd: "2025-10-15 17:00", loginHistory: ["2025-10-15 08:45"] },
];

const initialRoutes = [
  { id: 1, name: "Addis Ababa -> Gondar", status: "Active", buses: 3 },
  { id: 2, name: "Addis Ababa -> Bahir Dar", status: "Active", buses: 2 },
  { id: 3, name: "Addis Ababa -> Hawassa", status: "Inactive", buses: 1 },
];

// Data for Analytics Charts (keeping custom CSS-based for simplicity, as Shadcn doesn't have charts)
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

// Bus Form Component (using Shadcn Form elements)
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Bus Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="plateNumber">Plate Number</Label>
        <Input id="plateNumber" name="plateNumber" value={formData.plateNumber} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="operator">Operator</Label>
        <Input id="operator" name="operator" value={formData.operator} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="model">Model</Label>
        <Input id="model" name="model" value={formData.model} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="capacity">Capacity</Label>
        <Input id="capacity" name="capacity" type="number" value={formData.capacity} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="maintenanceNext">Next Maintenance</Label>
        <Input id="maintenanceNext" name="maintenanceNext" type="date" value={formData.maintenanceNext} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select name="status" value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Maintenance">Maintenance</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  );
};

// Driver Form Component (similarly refactored)
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Driver Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="license">License Number</Label>
        <Input id="license" name="license" value={formData.license} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="expiry">License Expiry</Label>
        <Input id="expiry" name="expiry" type="date" value={formData.expiry} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="assignedBus">Assigned Bus</Label>
        <Input id="assignedBus" name="assignedBus" value={formData.assignedBus} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select name="status" value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="On Leave">On Leave</SelectItem>
            <SelectItem value="Available">Available</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="performance">Performance</Label>
        <Select name="performance" value={formData.performance} onValueChange={(value) => setFormData({ ...formData, performance: value })}>
          <SelectTrigger id="performance">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Excellent">Excellent</SelectItem>
            <SelectItem value="Good">Good</SelectItem>
            <SelectItem value="Satisfactory">Satisfactory</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  );
};

// User Form Component (refactored)
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">User Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <Select name="role" value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
          <SelectTrigger id="role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Passenger">Passenger</SelectItem>
            <SelectItem value="Ticketing Officer">Ticketing Officer</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Cashier">Cashier</SelectItem>
            <SelectItem value="Driver">Driver</SelectItem>
            <SelectItem value="Inspector">Inspector</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select name="status" value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  );
};

// Seat Layout Preview Component (Tailwind grid)
const SeatLayout = ({ capacity }) => {
  const seats = Array.from({ length: capacity }, (_, i) => i + 1);
  return (
    <div className="grid grid-cols-5 gap-2 max-w-xs">
      {seats.map(seat => (
        <div key={seat} className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs font-medium border border-gray-300">
          S{seat}
        </div>
      ))}
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

  // Modal states (using Dialog state)
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

  // Computed values for overview (updated to current date 2025-10-15)
  const totalBuses = buses.length;
  const activeBuses = buses.filter(b => b.status === 'Active').length;
  const totalDrivers = drivers.length;
  const activeDrivers = drivers.filter(d => d.status === 'Active').length;
  const totalBookingsToday = bookings.filter(b => b.date === '2025-10-15').length; // Updated to current date
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

  // --- ACTION HANDLERS --- (unchanged logic)
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

  // Status Badge Variant Mapper
  const getBadgeVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'confirmed':
        return 'default';
      case 'maintenance':
      case 'pending payment':
      case 'on leave':
        return 'secondary';
      case 'inactive':
      case 'suspended':
      case 'cancelled':
      case 'available':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6 bg-background min-h-screen ">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Control Panel</h1>
      </div>

      {/* 🧭 Dashboard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium"><Bus className="h-4 w-4" /> Total Buses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBuses}</div>
            <p className="text-xs text-muted-foreground">{activeBuses} Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium"><User className="h-4 w-4" /> Total Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDrivers}</div>
            <p className="text-xs text-muted-foreground">{activeDrivers} Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium"><Ticket className="h-4 w-4" /> Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Today: {totalBookingsToday}</div>
            <p className="text-xs text-muted-foreground">Weekly: {totalBookingsWeekly} | Monthly: {totalBookingsMonthly}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium"><DollarSign className="h-4 w-4" /> Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">ETB {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% MoM</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium"><MapPin className="h-4 w-4" /> Active Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRoutes}</div>
            <p className="text-xs text-muted-foreground">Out of {routes.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      <Card className="bg-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><AlertCircle className="h-4 w-4" /> System Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div key={index} className={`flex items-start gap-3 p-3 rounded-md border ${alert.type === 'warning' ? 'border-amber-200 bg-amber-50' : alert.type === 'error' ? 'border-destructive bg-destructive/5' : 'border-primary/20 bg-primary/5'}`}>
                <AlertCircle className={`h-4 w-4 mt-0.5 ${alert.type === 'warning' ? 'text-amber-600' : alert.type === 'error' ? 'text-destructive' : 'text-primary'}`} />
                <p className="text-sm">{alert.message}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 📊 Reports & Analytics Dashboard */}
      <Card className="bg-gray-200">
        <CardHeader>
          <CardTitle>Performance Analytics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Revenue Trend (Custom bar chart with Tailwind) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end h-40 gap-2 p-2">
                {revenueData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="bg-primary w-6 rounded-t" style={{ height: `${(item.revenue / 200000) * 100}%` }}></div>
                    <span className="text-xs mt-1">{item.month}</span>
                    <span className="text-xs text-muted-foreground">ETB {item.revenue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Booking Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Weekly Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end h-40 gap-2 p-2">
                {bookingTrendsData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="bg-primary w-6 rounded-t" style={{ height: `${(item.bookings / 50) * 100}%` }}></div>
                    <span className="text-xs mt-1">{item.day}</span>
                    <span className="text-xs text-muted-foreground">{item.bookings}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Route Performance (Doughnut-like with badges) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Route Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {routePerformanceData.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-muted rounded-md">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `hsl(${index * 90}, 70%, 50%)` }}></div>
                    <span className="text-sm">{item.route}</span>
                    <Badge variant="secondary">{item.performance}%</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Trips by Operator */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Trips by Operator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tripData.map((item, index) => {
                  const totalTrips = tripData.reduce((sum, current) => sum + current.trips, 0);
                  const percentage = (item.trips / totalTrips) * 100;
                  return (
                    <div key={index} className="flex items-center gap-3 p-2 bg-muted rounded-md">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `hsl(${index * 70}, 70%, 50%)` }}></div>
                      <span className="text-sm">{item.name}: {item.trips} trips</span>
                      <Badge variant="outline">({percentage.toFixed(1)}%)</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          {/* Passenger Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Passenger Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {passengerTypeData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <span className="text-sm">{item.type}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${item.count}%` }}></div>
                      </div>
                      <span className="text-sm">{item.count}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* 💰 Cashier Summary */}
      <Card className="bg-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Cashier Summary</CardTitle>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export Report</Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tickets Sold</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cash Collected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">ETB 382,500</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">ETB 500,000</div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* 📅 Cashier Activity Log */}
      <Card className="bg-gray-200">
        <CardHeader>
          <CardTitle>Cashier Activity Log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cashiers.map((cashier) => (
            <Card key={cashier.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">{cashier.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <p><strong>Tickets Sold:</strong> {cashier.ticketsSold}</p>
                <p><strong>Total Handled:</strong> ETB {cashier.totalHandled.toLocaleString()}</p>
                <p><strong>Shift:</strong> {cashier.shiftStart} - {cashier.shiftEnd}</p>
                <p><strong>Recent Logins:</strong> {cashier.loginHistory.slice(-2).join(', ')}</p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* 🚍 Bus Management */}
      <Card className="bg-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Bus Fleet Management</CardTitle>
          <Dialog open={showFormModal && formType === 'bus'} onOpenChange={(open) => { if (!open) setShowFormModal(false); }}>
            <DialogTrigger asChild>
              <Button><Settings className="h-4 w-4 mr-2" /> Add New Bus</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{formMode === 'add' ? 'Add New Bus' : 'Edit Bus'}</DialogTitle>
              </DialogHeader>
              <BusForm item={selectedItem} onSubmit={handleFormSubmit} onCancel={() => setShowFormModal(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buses.map((bus) => (
              <Card key={bus.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">{bus.name}</CardTitle>
                  <Badge variant={getBadgeVariant(bus.status)}>{bus.status}</Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Plate Number:</strong> {bus.plateNumber}</p>
                  <p><strong>Operator:</strong> {bus.operator}</p>
                  <p><strong>Model:</strong> {bus.model}</p>
                  <p><strong>Capacity:</strong> {bus.capacity}</p>
                  <p><strong>Next Maintenance:</strong> {bus.maintenanceNext}</p>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2 pt-0">
                  <Dialog open={showBusModal && selectedBus?.id === bus.id} onOpenChange={(open) => { if (!open) setShowBusModal(false); }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon"><Users className="h-4 w-4" /></Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Seat Layout for {bus.name}</DialogTitle>
                      </DialogHeader>
                      <SeatLayout capacity={bus.capacity} />
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="icon" onClick={() => handleEdit('bus', bus.id)}><Edit className="h-4 w-4" /></Button>
                  <Button variant={bus.status === 'Active' ? 'destructive' : 'default'} size="icon" onClick={() => handleToggleStatus('bus', bus.id, bus.status)}>
                    {bus.status === 'Active' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete('bus', bus.id)}><Trash2 className="h-4 w-4" /></Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 👨‍✈️ Driver Management */}
      <Card className="bg-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Driver Management</CardTitle>
          <Dialog open={showFormModal && formType === 'driver'} onOpenChange={(open) => { if (!open) setShowFormModal(false); }}>
            <DialogTrigger asChild>
              <Button><User className="h-4 w-4 mr-2" /> Register New Driver</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{formMode === 'add' ? 'Add New Driver' : 'Edit Driver'}</DialogTitle>
              </DialogHeader>
              <DriverForm item={selectedItem} onSubmit={handleFormSubmit} onCancel={() => setShowFormModal(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drivers.map((driver) => (
              <Card key={driver.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">{driver.name}</CardTitle>
                  <Badge variant={getBadgeVariant(driver.status)}>{driver.status}</Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>License:</strong> {driver.license}</p>
                  <p><strong>Expiry:</strong> {driver.expiry}</p>
                  <p><strong>Assigned Bus:</strong> {driver.assignedBus || 'None'}</p>
                  <p><strong>Performance:</strong> {driver.performance}</p>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2 pt-0">
                  <Button variant="outline" size="icon" onClick={() => handleEdit('driver', driver.id)}><Edit className="h-4 w-4" /></Button>
                  <Button variant={driver.status === 'Active' ? 'destructive' : 'default'} size="icon" onClick={() => handleToggleStatus('driver', driver.id, driver.status)}>
                    {driver.status === 'Active' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete('driver', driver.id)}><Trash2 className="h-4 w-4" /></Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 🧑‍💼 User & Role Management */}
      <Card className="bg-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User & Role Management</CardTitle>
          <Dialog open={showFormModal && formType === 'user'} onOpenChange={(open) => { if (!open) setShowFormModal(false); }}>
            <DialogTrigger asChild>
              <Button><Users className="h-4 w-4 mr-2" /> Create New User</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{formMode === 'add' ? 'Add New User' : 'Edit User'}</DialogTitle>
              </DialogHeader>
              <UserForm item={selectedItem} onSubmit={handleFormSubmit} onCancel={() => setShowFormModal(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <Card key={user.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                  <Badge variant={getBadgeVariant(user.status)}>{user.status}</Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2 pt-0">
                  <Button variant="outline" size="icon" onClick={() => handleEdit('user', user.id)}><Edit className="h-4 w-4" /></Button>
                  <Button variant={user.status === 'Active' ? 'destructive' : 'default'} size="icon" onClick={() => handleToggleStatus('user', user.id, user.status)}>
                    {user.status === 'Active' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                  </Button>
                  <Dialog open={showConfirmModal && confirmAction === 'resetPassword' && confirmItemId === user.id} onOpenChange={(open) => { if (!open) setShowConfirmModal(false); }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon"><Settings className="h-4 w-4" /></Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reset Password</DialogTitle>
                      </DialogHeader>
                      <p>Send password reset email to this user?</p>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleConfirm}>Confirm</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete('user', user.id)}><Trash2 className="h-4 w-4" /></Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 🎟 Booking Management */}
      <Card className="bg-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Booking Management</CardTitle>
          <Button variant="outline"><FileText className="h-4 w-4 mr-2" /> View All Bookings</Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4 p-4 rounded-md items-center justify-center">
            <Input className="bg-white w-[200px]" type="date" placeholder="Date" value={bookingFilter.date} onChange={(e) => setBookingFilter({...bookingFilter, date: e.target.value})}  />
            <Input className="bg-white w-[200px]" type="text" placeholder="Route" value={bookingFilter.route} onChange={(e) => setBookingFilter({...bookingFilter, route: e.target.value})} />
            <Select value={bookingFilter.status} onValueChange={(value) => setBookingFilter({...bookingFilter, status: value})}>
              <SelectTrigger className="bg-white w-[200px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="Pending Payment">Pending</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">{booking.id}</CardTitle>
                  <Badge variant={getBadgeVariant(booking.status)}>{booking.status}</Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Passenger:</strong> {booking.passenger}</p>
                  <p><strong>Route:</strong> {booking.route}</p>
                  <p><strong>Date:</strong> {booking.date}</p>
                  <p><strong>Seat:</strong> {booking.seat}</p>
                  <p><strong>Cashier:</strong> {booking.cashier || 'N/A'}</p>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2 pt-0">
                  <Dialog open={showBookingModal && selectedBooking?.id === booking.id} onOpenChange={(open) => { if (!open) setShowBookingModal(false); }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon"><Eye className="h-4 w-4" /></Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Booking Details</DialogTitle>
                      </DialogHeader>
                      {selectedBooking && (
                        <div className="space-y-2">
                          <p><strong>Passenger:</strong> {selectedBooking.passenger}</p>
                          <p><strong>Route:</strong> {selectedBooking.route}</p>
                          <p><strong>Date:</strong> {selectedBooking.date}</p>
                          <p><strong>Seat:</strong> {selectedBooking.seat}</p>
                          <p><strong>Status:</strong> <Badge>{selectedBooking.status}</Badge></p>
                          <p><strong>Cashier:</strong> {selectedBooking.cashier || 'N/A'}</p>
                          <Button onClick={() => generateTicket(selectedBooking)}><Ticket className="h-4 w-4 mr-2" /> Generate Ticket</Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="icon" onClick={() => generateTicket(booking)}><Ticket className="h-4 w-4" /></Button>
                  <Dialog open={showConfirmModal && confirmAction === 'cancelBooking' && confirmItemId === booking.id} onOpenChange={(open) => { if (!open) setShowConfirmModal(false); }}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="icon"><XCircle className="h-4 w-4" /></Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cancel Booking</DialogTitle>
                      </DialogHeader>
                      <p>Are you sure you want to cancel this booking?</p>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleConfirm}>Confirm</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Modals (using Dialog for all) */}
      <Dialog open={showFormModal} onOpenChange={(open) => { if (!open) setShowFormModal(false); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{formMode === 'add' ? `Add New ${formType}` : `Edit ${formType}`}</DialogTitle>
          </DialogHeader>
          {formType === 'bus' ? (
            <BusForm item={selectedItem} onSubmit={handleFormSubmit} onCancel={() => setShowFormModal(false)} />
          ) : formType === 'driver' ? (
            <DriverForm item={selectedItem} onSubmit={handleFormSubmit} onCancel={() => setShowFormModal(false)} />
          ) : (
            <UserForm item={selectedItem} onSubmit={handleFormSubmit} onCancel={() => setShowFormModal(false)} />
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Modal */}
      <Dialog open={showConfirmModal} onOpenChange={(open) => { if (!open) setShowConfirmModal(false); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
          </DialogHeader>
          <p>{getConfirmMessage()}</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={(open) => { if (!open) { setShowBookingModal(false); setSelectedBooking(null); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-2">
              <p><strong>Passenger:</strong> {selectedBooking.passenger}</p>
              <p><strong>Route:</strong> {selectedBooking.route}</p>
              <p><strong>Date:</strong> {selectedBooking.date}</p>
              <p><strong>Seat:</strong> {selectedBooking.seat}</p>
              <p><strong>Status:</strong> <Badge variant={getBadgeVariant(selectedBooking.status)}>{selectedBooking.status}</Badge></p>
              <p><strong>Cashier:</strong> {selectedBooking.cashier || 'N/A'}</p>
              <Button onClick={() => generateTicket(selectedBooking)} className="w-full"><Ticket className="h-4 w-4 mr-2" /> Generate Ticket</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Seat Layout Modal */}
      <Dialog open={showBusModal} onOpenChange={(open) => { if (!open) { setShowBusModal(false); setSelectedBus(null); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Seat Layout for {selectedBus?.name || 'Bus'}</DialogTitle>
          </DialogHeader>
          {selectedBus && <SeatLayout capacity={selectedBus.capacity || 45} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ComprehensiveAdminDashboard;