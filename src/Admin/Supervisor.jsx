import { useContext, useState, useEffect } from "react";
import { BookingContext } from "../BookingContext";
import { RefundContext } from "../Context/RefundContext";

function Supervisor() {
  const { allBookings, updateBookingStatus } = useContext(BookingContext);
  const { allRefunds, updateRefundStatus } = useContext(RefundContext);
  const [bookings, setBookings] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for new features
  const [buses, setBuses] = useState([
    { id: 1, name: "Selam Bus 01", status: "Active", maintenanceNext: "2025-11-01", condition: "Good" },
    { id: 2, name: "Zemen Bus 05", status: "Under Repair", maintenanceNext: "2025-10-20", condition: "Needs Check" },
    { id: 3, name: "Sky Bus 11", status: "Active", maintenanceNext: "2025-12-15", condition: "Excellent" },
  ]);

  const [drivers, setDrivers] = useState([
    { id: 1, name: "Tesfaye Alemu", phone: "0912345678", assignedBus: "Selam Bus 01", status: "On Duty", punctuality: 95, licenseExpiry: "2026-06-30" },
    { id: 2, name: "Mulugeta Bekele", phone: "0918765432", assignedBus: null, status: "Off Duty", punctuality: 88, licenseExpiry: "2025-03-15" },
    { id: 3, name: "Sara Yohannes", phone: "0911122334", assignedBus: "Sky Bus 11", status: "On Duty", punctuality: 98, licenseExpiry: "2024-09-20" },
  ]);

  const [trips, setTrips] = useState([
    { id: 1, bus: "Selam Bus 01", route: "Addis -> Gondar", departure: "2025-10-15 08:00", arrival: "2025-10-15 16:00", status: "On Time", passengers: 32, driver: "Tesfaye Alemu" },
    { id: 2, bus: "Sky Bus 11", route: "Addis -> Bahir Dar", departure: "2025-10-15 10:00", arrival: "2025-10-15 17:00", status: "Delayed", passengers: 45, driver: "Sara Yohannes" },
  ]);

  const [routes, setRoutes] = useState([
    { id: 1, name: "Addis Ababa -> Gondar", schedule: "Daily 08:00", busesAssigned: 2, onTimeRate: 92 },
    { id: 2, name: "Addis Ababa -> Bahir Dar", schedule: "Daily 10:00", busesAssigned: 1, onTimeRate: 85 },
  ]);

  const [attendance, setAttendance] = useState([
    { id: 1, name: "Tesfaye Alemu (Driver)", status: "On Duty", shiftStart: "2025-10-15 07:00", notes: "Handover complete" },
    { id: 2, name: "Hana Girma (Cashier)", status: "Off Duty", shiftStart: null, notes: "" },
  ]);

  const [cashiers, setCashiers] = useState([
    { id: 1, name: "Cashier One", dailyCollection: 45000, routeRevenue: { "Addis -> Gondar": 25000, "Addis -> Bahir Dar": 20000 } },
    { id: 2, name: "Cashier Two", dailyCollection: 36000, routeRevenue: { "Addis -> Gondar": 18000, "Addis -> Bahir Dar": 18000 } },
  ]);

  // Computed stats for overview
  const totalActiveBuses = buses.filter(b => b.status === "Active").length;
  const totalDriversOnDuty = drivers.filter(d => d.status === "On Duty").length;
  const totalTicketsSold = bookings.filter(b => b.date === "2025-10-15" && b.status === "approved").length;
  const totalRoutes = routes.length;
  const alerts = [
    { id: 1, message: "Zemen Bus 05 under repair - schedule adjustment needed", type: "warning" },
    { id: 2, message: "Driver license expiry reminder for Sara Yohannes", type: "info" },
  ];
  const nextDeparture = "Addis -> Gondar at 08:00 (Selam Bus 01)";

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(savedBookings);
    
    const savedRefunds = JSON.parse(localStorage.getItem('refunds') || '[]');
    setRefunds(savedRefunds);
  }, []);

  // Update local state when context changes
  useEffect(() => {
    if (allBookings && allBookings.length > 0) {
      setBookings(allBookings);
    }
    if (allRefunds && allRefunds.length > 0) {
      setRefunds(allRefunds);
    }
  }, [allBookings, allRefunds]);

  const handleBookingDecision = (id, decision) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === id ? { ...booking, status: decision } : booking
    );
    setBookings(updatedBookings);
    
    if (updateBookingStatus) {
      updateBookingStatus(id, decision);
    }
    
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    
    alert(`Change request for Booking #${id} has been ${decision === 'change_approved' ? 'approved' : 'denied'}`);
  };

  const handleRefundDecision = (id, decision) => {
    const updatedRefunds = refunds.map(refund => 
      refund.id === id ? { ...refund, status: decision } : refund
    );
    setRefunds(updatedRefunds);
    
    if (updateRefundStatus) {
      updateRefundStatus(id, decision);
    }
    
    localStorage.setItem('refunds', JSON.stringify(updatedRefunds));
    
    alert(`Refund #${id} has been ${decision === 'approved' ? 'approved' : 'denied'}`);
  };

  const handleAssignDriver = (busId, driverId) => {
    const updatedDrivers = drivers.map(d => d.id === driverId ? { ...d, assignedBus: buses.find(b => b.id === busId)?.name } : d);
    const updatedBuses = buses.map(b => b.id === busId ? { ...b, assignedDriver: drivers.find(d => d.id === driverId)?.name } : b);
    setDrivers(updatedDrivers);
    setBuses(updatedBuses);
    alert(`Driver assigned to bus.`);
  };

  const handleUpdateBusStatus = (busId, status) => {
    const updatedBuses = buses.map(b => b.id === busId ? { ...b, status } : b);
    setBuses(updatedBuses);
    alert(`Bus status updated to ${status}.`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
      case 'change_approved':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'denied':
      case 'change_denied':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'change_requested':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'pending':
      case 'On Time':
      default:
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'change_requested':
        return '⚠️ Change Request (10% Penalty)';
      case 'change_approved':
        return '✅ Change Approved';
      case 'change_denied':
        return '❌ Change Denied';
      case 'approved':
        return '✅ Approved';
      case 'denied':
        return '❌ Denied';
      case 'On Time':
        return '🕐 On Time';
      case 'Delayed':
        return '⏰ Delayed';
      case 'Arrived':
        return '✅ Arrived';
      default:
        return status;
    }
  };

  // Filter data based on active tab
  const getTabData = () => {
    switch (activeTab) {
      case 'change-requests':
        return {
          data: bookings.filter(booking => 
            booking.status === 'change_requested' || 
            booking.status === 'change_approved' || 
            booking.status === 'change_denied'
          ),
          type: 'booking'
        };
      case 'refunds-pending':
        return {
          data: refunds.filter(refund => refund.status === 'pending'),
          type: 'refund'
        };
      case 'refunds-approved':
        return {
          data: refunds.filter(refund => refund.status === 'approved'),
          type: 'refund'
        };
      case 'refunds-denied':
        return {
          data: refunds.filter(refund => refund.status === 'denied'),
          type: 'refund'
        };
      default:
        return { data: [], type: 'booking' };
    }
  };

  const getTabCount = (tab) => {
    switch (tab) {
      case 'change-requests':
        return bookings.filter(b => 
          b.status === 'change_requested' || 
          b.status === 'change_approved' || 
          b.status === 'change_denied'
        ).length;
      case 'refunds-pending':
        return refunds.filter(r => r.status === 'pending').length;
      case 'refunds-approved':
        return refunds.filter(r => r.status === 'approved').length;
      case 'refunds-denied':
        return refunds.filter(r => r.status === 'denied').length;
      default:
        return 0;
    }
  };

  const { data: tabData, type: dataType } = getTabData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Bus Supervisor Dashboard</h1>
          <p className="text-xl text-gray-600">Monitor operations, manage teams, and ensure smooth bus services</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 justify-center flex-wrap">
          {['overview', 'trips', 'drivers', 'buses', 'routes', 'tickets', 'revenue', 'shifts', 'change-requests', 'refunds-pending', 'refunds-approved', 'refunds-denied', 'reports'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 text-sm ${
                activeTab === tab
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab === 'overview' ? 'Overview' :
               tab === 'trips' ? 'Trip Monitoring' :
               tab === 'drivers' ? 'Drivers' :
               tab === 'buses' ? 'Bus Maintenance' :
               tab === 'routes' ? 'Routes & Schedules' :
               tab === 'tickets' ? 'Ticket Summary' :
               tab === 'revenue' ? 'Revenue Overview' :
               tab === 'shifts' ? 'Shifts & Attendance' :
               tab === 'change-requests' ? `Changes (${getTabCount('change-requests')})` :
               tab === 'refunds-pending' ? `Pending Refunds (${getTabCount('refunds-pending')})` :
               tab === 'refunds-approved' ? `Approved Refunds (${getTabCount('refunds-approved')})` :
               tab === 'refunds-denied' ? `Denied Refunds (${getTabCount('refunds-denied')})` :
               'Reports'}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-blue-600">🚌 {totalActiveBuses}</div>
                <p className="text-gray-600">Active Buses Today</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-600">👨‍✈️ {totalDriversOnDuty}</div>
                <p className="text-gray-600">Drivers on Duty</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-indigo-600">🎫 {totalTicketsSold}</div>
                <p className="text-gray-600">Tickets Sold Today</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-purple-600">📍 {totalRoutes}</div>
                <p className="text-gray-600">Operating Routes</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4">⚠️ Alerts & Issues</h3>
                <div className="space-y-2">
                  {alerts.map(alert => (
                    <div key={alert.id} className={`p-3 rounded-lg ${alert.type === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-400' : 'bg-blue-50 border-l-4 border-blue-400'}`}>
                      <p className="text-sm">{alert.message}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4">🕓 Next Departure</h3>
                <p className="text-2xl font-bold text-gray-900">{nextDeparture}</p>
              </div>
            </div>

            {/* Simple Chart for Punctuality */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">📊 Punctuality Rate</h3>
              <div className="flex justify-between items-end h-32 gap-2">
                {[92, 85, 95].map((rate, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="bg-green-500" style={{ height: `${rate}%`, width: '20px', borderRadius: '4px 4px 0 0' }}></div>
                    <span className="text-xs mt-1">Route {index + 1}</span>
                    <span className="text-xs text-gray-500">{rate}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Trip Monitoring Tab */}
        {activeTab === 'trips' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Trip Monitoring</h2>
            <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Bus</th>
                    <th className="px-4 py-2 text-left">Route</th>
                    <th className="px-4 py-2 text-left">Departure</th>
                    <th className="px-4 py-2 text-left">Arrival</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Passengers</th>
                    <th className="px-4 py-2 text-left">Driver</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map(trip => (
                    <tr key={trip.id} className="border-b">
                      <td className="px-4 py-2">{trip.bus}</td>
                      <td className="px-4 py-2">{trip.route}</td>
                      <td className="px-4 py-2">{trip.departure}</td>
                      <td className="px-4 py-2">{trip.arrival}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(trip.status)}`}>
                          {getStatusBadge(trip.status)}
                        </span>
                      </td>
                      <td className="px-4 py-2">{trip.passengers}</td>
                      <td className="px-4 py-2">{trip.driver}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Driver Management Tab */}
        {activeTab === 'drivers' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Driver Management</h2>
            <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Phone</th>
                    <th className="px-4 py-2 text-left">Assigned Bus</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Punctuality</th>
                    <th className="px-4 py-2 text-left">License Expiry</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map(driver => (
                    <tr key={driver.id} className="border-b">
                      <td className="px-4 py-2">{driver.name}</td>
                      <td className="px-4 py-2">{driver.phone}</td>
                      <td className="px-4 py-2">{driver.assignedBus || 'None'}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${driver.status === 'On Duty' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {driver.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">{driver.punctuality}%</td>
                      <td className="px-4 py-2">{driver.licenseExpiry}</td>
                      <td className="px-4 py-2">
                        <select onChange={(e) => handleAssignDriver(1, driver.id)} className="border rounded px-2 py-1">
                          <option>Assign Bus</option>
                          {buses.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bus Maintenance Tab */}
        {activeTab === 'buses' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Bus Condition & Maintenance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {buses.map(bus => (
                <div key={bus.id} className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
                  <h3 className="text-lg font-bold mb-2">{bus.name}</h3>
                  <p><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs ${bus.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{bus.status}</span></p>
                  <p><strong>Condition:</strong> {bus.condition}</p>
                  <p><strong>Next Maintenance:</strong> {bus.maintenanceNext}</p>
                  <div className="mt-4 space-x-2">
                    <select onChange={(e) => handleUpdateBusStatus(bus.id, e.target.value)} className="border rounded px-2 py-1">
                      <option>{bus.status}</option>
                      <option value="Active">Active</option>
                      <option value="Under Repair">Under Repair</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Routes & Schedules Tab */}
        {activeTab === 'routes' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Route & Schedule Management</h2>
            <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Route</th>
                    <th className="px-4 py-2 text-left">Schedule</th>
                    <th className="px-4 py-2 text-left">Buses Assigned</th>
                    <th className="px-4 py-2 text-left">On-Time Rate</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {routes.map(route => (
                    <tr key={route.id} className="border-b">
                      <td className="px-4 py-2">{route.name}</td>
                      <td className="px-4 py-2">{route.schedule}</td>
                      <td className="px-4 py-2">{route.busesAssigned}</td>
                      <td className="px-4 py-2">{route.onTimeRate}%</td>
                      <td className="px-4 py-2">
                        <button className="bg-blue-500 text-white px-2 py-1 rounded text-sm">Edit Schedule</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Ticket Summary Tab */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Ticket & Passenger Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4">Tickets Sold per Route</h3>
                <div className="space-y-2">
                  {routes.map(route => (
                    <div key={route.id} className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>{route.name}</span>
                      <span className="font-bold">25 tickets</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4">Occupancy Rates</h3>
                <div className="space-y-2">
                  {buses.map(bus => (
                    <div key={bus.id} className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>{bus.name}</span>
                      <span className="font-bold">70% occupied</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Overview Tab */}
        {activeTab === 'revenue' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Cashier and Revenue Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4">Daily Collections by Cashier</h3>
                <div className="space-y-2">
                  {cashiers.map(cashier => (
                    <div key={cashier.id} className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>{cashier.name}</span>
                      <span className="font-bold text-green-600">ETB {cashier.dailyCollection}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4">Revenue by Route</h3>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span>Addis {'->'} Gondar</span>
                    <span className="font-bold text-green-600">ETB 43,000</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span>Addis {'->'} Bahir Dar</span>
                    <span className="font-bold text-green-600">ETB 36,000</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <button className="bg-green-500 text-white py-2 px-4 rounded">Download Daily Summary</button>
            </div>
          </div>
        )}

        {/* Shifts & Attendance Tab */}
        {activeTab === 'shifts' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Shift & Attendance Management</h2>
            <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Shift Start</th>
                    <th className="px-4 py-2 text-left">Notes</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map(att => (
                    <tr key={att.id} className="border-b">
                      <td className="px-4 py-2">{att.name}</td>
                      <td className="px-4 py-2">Driver</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${att.status === 'On Duty' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {att.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">{att.shiftStart || 'N/A'}</td>
                      <td className="px-4 py-2">{att.notes}</td>
                      <td className="px-4 py-2">
                        <button className="bg-blue-500 text-white px-2 py-1 rounded text-sm">Mark Attendance</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Change Requests Tab */}
        {activeTab === 'change-requests' && (
          <>
            {tabData.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔄</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No change requests</h3>
                <p className="text-gray-500">Late change requests will appear here (10% penalty applies)</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {tabData.map(booking => (
                  <div key={booking.id} className={`bg-white rounded-2xl shadow-lg border-2 p-6 ${
                    booking.status === 'change_requested' ? 'border-orange-200' :
                    booking.status === 'change_approved' ? 'border-green-200' :
                    'border-red-200'
                  }`}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900">Booking #{booking.id}</h3>
                      <span className={`flex items-center gap-2 px-3 py-1 rounded-full border-2 text-sm font-semibold ${getStatusColor(booking.status)}`}>
                        {getStatusBadge(booking.status)}
                      </span>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700">Route</label>
                          <p className="text-gray-900">{booking.from} → {booking.to}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700">Date & Time</label>
                          <p className="text-gray-900">{booking.date} at {booking.time}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700">Bus</label>
                          <p className="text-gray-900">{booking.bus}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700">Passengers</label>
                          <p className="text-gray-900">{booking.passengers} person(s)</p>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700">Original Price</label>
                        <p className="text-gray-900">ETB {booking.price * booking.passengers}</p>
                      </div>
                      
                      {booking.status === 'change_requested' && (
                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                          <label className="block text-sm font-semibold text-yellow-700">10% Penalty</label>
                          <p className="text-yellow-800 font-bold">
                            ETB {(booking.price * booking.passengers * 0.1).toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Passenger Details */}
                    {booking.passengerInfo && (
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Passenger Details</h4>
                        <div className="space-y-2">
                          {booking.passengerInfo.map((passenger, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-lg">
                              <p className="font-medium text-gray-900">Passenger {index + 1}</p>
                              <p className="text-gray-700">Name: {passenger.name}</p>
                              <p className="text-gray-700">Phone: {passenger.phone}</p>
                              <p className="text-gray-700">Seat: {passenger.selected_spot}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {booking.status === 'change_requested' && (
                        <>
                          <button 
                            onClick={() => handleBookingDecision(booking.id, "change_approved")}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-200"
                          >
                            Approve Change
                          </button>
                          <button 
                            onClick={() => handleBookingDecision(booking.id, "change_denied")}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-200"
                          >
                            Deny Change
                          </button>
                        </>
                      )}
                      
                      {booking.status === 'change_approved' && (
                        <div className="w-full text-center py-2">
                          <span className="text-green-600 font-semibold">
                            ✅ Change Approved
                          </span>
                        </div>
                      )}
                      
                      {booking.status === 'change_denied' && (
                        <div className="w-full text-center py-2">
                          <span className="text-red-600 font-semibold">
                            ❌ Change Denied
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Refunds Tabs */}
        {(activeTab === 'refunds-pending' || activeTab === 'refunds-approved' || activeTab === 'refunds-denied') && (
          <>
            {tabData.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">
                  {activeTab === 'refunds-pending' ? '💰' : 
                   activeTab === 'refunds-approved' ? '✅' : '❌'}
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {activeTab === 'refunds-pending' ? 'No pending refunds' : 
                   activeTab === 'refunds-approved' ? 'No approved refunds' : 'No denied refunds'}
                </h3>
                <p className="text-gray-500">
                  {activeTab === 'refunds-pending' ? 
                   'Pending refund requests will appear here' :
                   'Refund requests will appear here when processed'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {tabData.map(refund => (
                  <div key={refund.id} className={`bg-white rounded-2xl shadow-lg border-2 p-6 ${
                    refund.status === 'pending' ? 'border-yellow-200' :
                    refund.status === 'approved' ? 'border-green-200' :
                    'border-red-200'
                  }`}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900">Refund #{refund.id}</h3>
                      <span className={`flex items-center gap-2 px-3 py-1 rounded-full border-2 text-sm font-semibold ${getStatusColor(refund.status)}`}>
                        {getStatusBadge(refund.status)}
                      </span>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700">Refund Date</label>
                        <p className="text-gray-900">{refund.RefundDate}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700">Ticket Number</label>
                          <p className="text-gray-900">{refund.TicketNumber}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700">Account Number</label>
                          <p className="text-gray-900">{refund.AccountNumber}</p>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700">Description</label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{refund.RefundDescription}</p>
                      </div>

                      {refund.submittedAt && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700">Submitted</label>
                          <p className="text-gray-900 text-sm">
                            {new Date(refund.submittedAt).toLocaleDateString()} at {new Date(refund.submittedAt).toLocaleTimeString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {refund.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleRefundDecision(refund.id, "approved")}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-200"
                          >
                            Approve Refund
                          </button>
                          <button 
                            onClick={() => handleRefundDecision(refund.id, "denied")}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-200"
                          >
                            Deny Refund
                          </button>
                        </>
                      )}
                      
                      {refund.status === 'approved' && (
                        <div className="w-full text-center py-2">
                          <span className="text-green-600 font-semibold">
                            ✅ Refund Approved
                          </span>
                        </div>
                      )}
                      
                      {refund.status === 'denied' && (
                        <div className="w-full text-center py-2">
                          <span className="text-red-600 font-semibold">
                            ❌ Refund Denied
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Reports & Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4">Daily Operation Summary</h3>
                <div className="space-y-2">
                  <p>Total Trips: 5</p>
                  <p>On-Time: 80%</p>
                  <p>Average Passengers: 38</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4">Punctuality Report</h3>
                <div className="space-y-2">
                  <p>Route 1: 92%</p>
                  <p>Route 2: 85%</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4">Top Routes</h3>
                <div className="space-y-2">
                  <p>Addis {'->'} Gondar: ETB 43,000</p>
                  <p>Addis {'->'} Bahir Dar: ETB 36,000</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4">Maintenance vs Revenue</h3>
                <div className="flex justify-between items-end h-24 gap-2">
                  <div className="flex flex-col items-center flex-1">
                    <div className="bg-red-500 h-16 w-8 rounded-t"></div>
                    <span className="text-xs">Maintenance ETB 10k</span>
                  </div>
                  <div className="flex flex-col items-center flex-1">
                    <div className="bg-green-500 h-20 w-8 rounded-t"></div>
                    <span className="text-xs">Revenue ETB 79k</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <button className="bg-green-500 text-white py-2 px-4 rounded">Generate Full Report</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Supervisor;