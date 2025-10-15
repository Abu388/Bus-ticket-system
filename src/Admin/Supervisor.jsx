import { useContext, useState, useEffect } from "react";
import { BookingContext } from "../BookingContext";
import { RefundContext } from "../Context/RefundContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  BusFront,
  Route,
  Bell,
  Ticket,
  RefreshCcw,
  Star,
  LayoutDashboard,
  Map,
  Users as UsersIcon,
  Settings,
  FileText,
  DollarSign as DollarIcon,
  Clock as ClockIcon,
  MapPin as MapPinIcon,
  Bell as BellIcon,
  CreditCard,
  FileText as FileTextIcon,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import LiveTracker from "@/components/map/liveTracker";

// Chart Data from second component
const bookingData = [
  { day: "Mon", bookings: 200 },
  { day: "Tue", bookings: 340 },
  { day: "Wed", bookings: 280 },
  { day: "Thu", bookings: 410 },
  { day: "Fri", bookings: 520 },
  { day: "Sat", bookings: 480 },
  { day: "Sun", bookings: 390 },
];

const revenueData = [
  { month: "Jan", revenue: 15000 },
  { month: "Feb", revenue: 22000 },
  { month: "Mar", revenue: 18500 },
  { month: "Apr", revenue: 26000 },
  { month: "May", revenue: 31000 },
  { month: "Jun", revenue: 28000 },
];

const routePerformance = [
  { name: "Addis-Hawassa", value: 40 },
  { name: "Adama-Dire Dawa", value: 25 },
  { name: "Bahir Dar-Gondar", value: 20 },
  { name: "Mekelle-Axum", value: 15 },
];

const driverStats = [
  { name: "Abebe", completedTrips: 42, onTime: 96, rating: 4.8 },
  { name: "Kebede", completedTrips: 38, onTime: 89, rating: 4.6 },
  { name: "Tesfaye", completedTrips: 33, onTime: 83, rating: 4.2 },
  { name: "Getachew", completedTrips: 29, onTime: 77, rating: 4.0 },
  { name: "Solomon", completedTrips: 26, onTime: 72, rating: 3.8 },
];

const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444"];

const initialTripsData = [
  {
    id: 1,
    busNumber: "AA-1234",
    start: "Addis Ababa",
    destination: "Hawassa",
    departure: "07:00 AM",
    arrival: "11:00 AM",
    driver: "Abebe",
    conductor: "Mulu",
    passengers: 35,
    status: "On-time",
  },
  {
    id: 2,
    busNumber: "AD-5678",
    start: "Adama",
    destination: "Dire Dawa",
    departure: "08:30 AM",
    arrival: "12:15 PM",
    driver: "Kebede",
    conductor: "Sinta",
    passengers: 28,
    status: "Delayed",
  },
  {
    id: 3,
    busNumber: "BD-9101",
    start: "Bahir Dar",
    destination: "Gondar",
    departure: "09:00 AM",
    arrival: "01:00 PM",
    driver: "Tesfaye",
    conductor: "Sara",
    passengers: 40,
    status: "On-time",
  },
];

function Supervisor() {
  const { allBookings, updateBookingStatus } = useContext(BookingContext);
  const { allRefunds, updateRefundStatus } = useContext(RefundContext);
  const [bookings, setBookings] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState("pending");

  // Mock data for new features from first component
  const [buses, setBuses] = useState([
    {
      id: 1,
      name: "Selam Bus 01",
      status: "Active",
      maintenanceNext: "2025-11-01",
      condition: "Good",
    },
    {
      id: 2,
      name: "Zemen Bus 05",
      status: "Under Repair",
      maintenanceNext: "2025-10-20",
      condition: "Needs Check",
    },
    {
      id: 3,
      name: "Sky Bus 11",
      status: "Active",
      maintenanceNext: "2025-12-15",
      condition: "Excellent",
    },
  ]);

  const [drivers, setDrivers] = useState([
    {
      id: 1,
      name: "Tesfaye Alemu",
      phone: "0912345678",
      assignedBus: "Selam Bus 01",
      status: "On Duty",
      punctuality: 95,
      licenseExpiry: "2026-06-30",
    },
    {
      id: 2,
      name: "Mulugeta Bekele",
      phone: "0918765432",
      assignedBus: null,
      status: "Off Duty",
      punctuality: 88,
      licenseExpiry: "2025-03-15",
    },
    {
      id: 3,
      name: "Sara Yohannes",
      phone: "0911122334",
      assignedBus: "Sky Bus 11",
      status: "On Duty",
      punctuality: 98,
      licenseExpiry: "2024-09-20",
    },
  ]);

  const [trips, setTrips] = useState([
    {
      id: 1,
      bus: "Selam Bus 01",
      route: "Addis -> Gondar",
      departure: "2025-10-15 08:00",
      arrival: "2025-10-15 16:00",
      status: "On Time",
      passengers: 32,
      driver: "Tesfaye Alemu",
    },
    {
      id: 2,
      bus: "Sky Bus 11",
      route: "Addis -> Bahir Dar",
      departure: "2025-10-15 10:00",
      arrival: "2025-10-15 17:00",
      status: "Delayed",
      passengers: 45,
      driver: "Sara Yohannes",
    },
  ]);

  const [routes, setRoutes] = useState([
    {
      id: 1,
      name: "Addis Ababa -> Gondar",
      schedule: "Daily 08:00",
      busesAssigned: 2,
      onTimeRate: 92,
    },
    {
      id: 2,
      name: "Addis Ababa -> Bahir Dar",
      schedule: "Daily 10:00",
      busesAssigned: 1,
      onTimeRate: 85,
    },
  ]);

  const [attendance, setAttendance] = useState([
    {
      id: 1,
      name: "Tesfaye Alemu (Driver)",
      status: "On Duty",
      shiftStart: "2025-10-15 07:00",
      notes: "Handover complete",
    },
    {
      id: 2,
      name: "Hana Girma (Cashier)",
      status: "Off Duty",
      shiftStart: null,
      notes: "",
    },
  ]);

  const [cashiers, setCashiers] = useState([
    {
      id: 1,
      name: "Cashier One",
      dailyCollection: 45000,
      routeRevenue: { "Addis -> Gondar": 25000, "Addis -> Bahir Dar": 20000 },
    },
    {
      id: 2,
      name: "Cashier Two",
      dailyCollection: 36000,
      routeRevenue: { "Addis -> Gondar": 18000, "Addis -> Bahir Dar": 18000 },
    },
  ]);

  // Additional mock data from second component
  const [supervisorRoutes, setSupervisorRoutes] = useState([]);
  const [tripsData, setTripsData] = useState(initialTripsData);

  // Computed stats for overview
  const totalActiveBuses = buses.filter((b) => b.status === "Active").length;
  const totalDriversOnDuty = drivers.filter(
    (d) => d.status === "On Duty"
  ).length;
  const totalTicketsSold = bookings.filter(
    (b) => b.date === "2025-10-15" && b.status === "approved"
  ).length;
  const totalRoutes = routes.length;
  const alerts = [
    {
      id: 1,
      message: "Zemen Bus 05 under repair - schedule adjustment needed",
      type: "warning",
    },
    {
      id: 2,
      message: "Driver license expiry reminder for Sara Yohannes",
      type: "info",
    },
  ];
  const nextDeparture = "Addis -> Gondar at 08:00 (Selam Bus 01)";

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    setBookings(savedBookings);

    const savedRefunds = JSON.parse(localStorage.getItem("refunds") || "[]");
    setRefunds(savedRefunds);

    // Load supervisor routes from second component
    setTimeout(() => {
      setSupervisorRoutes([
        {
          id: 1,
          route: "Addis Ababa - Hawassa",
          driver: "Abebe",
          status: "Active",
          time: "07:00 AM",
          busesAssigned: 2,
          onTimeRate: 92,
        },
        {
          id: 2,
          route: "Adama - Dire Dawa",
          driver: "Kebede",
          status: "Pending",
          time: "08:30 AM",
          busesAssigned: 1,
          onTimeRate: 85,
        },
        {
          id: 3,
          route: "Bahir Dar - Gondar",
          driver: "Tesfaye",
          status: "Active",
          time: "09:00 AM",
          busesAssigned: 3,
          onTimeRate: 95,
        },
      ]);
      setLoading(false);
    }, 1200);
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
    const updatedBookings = bookings.map((booking) =>
      booking.id === id ? { ...booking, status: decision } : booking
    );
    setBookings(updatedBookings);

    if (updateBookingStatus) {
      updateBookingStatus(id, decision);
    }

    localStorage.setItem("bookings", JSON.stringify(updatedBookings));

    alert(
      `Change request for Booking #${id} has been ${
        decision === "change_approved" ? "approved" : "denied"
      }`
    );
  };

  const handleRefundDecision = (id, decision) => {
    const updatedRefunds = refunds.map((refund) =>
      refund.id === id ? { ...refund, status: decision } : refund
    );
    setRefunds(updatedRefunds);

    if (updateRefundStatus) {
      updateRefundStatus(id, decision);
    }

    localStorage.setItem("refunds", JSON.stringify(updatedRefunds));

    alert(
      `Refund #${id} has been ${
        decision === "approved" ? "approved" : "denied"
      }`
    );
  };

  const handleAssignDriver = (busId, driverId) => {
    const updatedDrivers = drivers.map((d) =>
      d.id === driverId
        ? { ...d, assignedBus: buses.find((b) => b.id === busId)?.name }
        : d
    );
    const updatedBuses = buses.map((b) =>
      b.id === busId
        ? { ...b, assignedDriver: drivers.find((d) => d.id === driverId)?.name }
        : b
    );
    setDrivers(updatedDrivers);
    setBuses(updatedBuses);
    alert(`Driver assigned to bus.`);
  };

  const handleUpdateBusStatus = (busId, status) => {
    const updatedBuses = buses.map((b) =>
      b.id === busId ? { ...b, status } : b
    );
    setBuses(updatedBuses);
    alert(`Bus status updated to ${status}.`);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "approved":
      case "change_approved":
      case "On Time":
      case "On-time":
      case "Arrived":
        return "default";
      case "denied":
      case "change_denied":
        return "destructive";
      case "change_requested":
      case "pending":
      case "Delayed":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "change_requested":
        return "Change Request (10% Penalty)";
      case "change_approved":
        return "Change Approved";
      case "change_denied":
        return "Change Denied";
      case "approved":
        return "Approved";
      case "denied":
        return "Denied";
      case "On Time":
      case "On-time":
        return "On Time";
      case "Delayed":
        return "Delayed";
      case "Arrived":
        return "Arrived";
      case "pending":
        return "Pending";
      default:
        return status;
    }
  };

  // Filter data based on active tab
  const getTabData = () => {
    switch (activeTab) {
      case "change-requests":
        return {
          data: bookings.filter(
            (booking) =>
              booking.status === "change_requested" ||
              booking.status === "change_approved" ||
              booking.status === "change_denied"
          ),
          type: "booking",
        };
      default:
        return { data: [], type: "booking" };
    }
  };

  const getTabCount = (tab) => {
    switch (tab) {
      case "change-requests":
        return bookings.filter(
          (b) =>
            b.status === "change_requested" ||
            b.status === "change_approved" ||
            b.status === "change_denied"
        ).length;
      case "refunds-pending":
        return refunds.filter((r) => r.status === "pending").length;
      case "refunds-approved":
        return refunds.filter((r) => r.status === "approved").length;
      case "refunds-denied":
        return refunds.filter((r) => r.status === "denied").length;
      default:
        return 0;
    }
  };

  const { data: tabData, type: dataType } = getTabData();

  // Sidebar tabs configuration
  const sidebarTabs = [
    { value: "overview", label: "Overview", icon: LayoutDashboard },
    { value: "trips", label: "Trips", icon: Map },
    { value: "drivers", label: "Drivers", icon: UsersIcon },
    { value: "buses", label: "Buses", icon: BusFront },
    { value: "routes", label: "Routes", icon: Route },
    { value: "tickets", label: "Tickets", icon: Ticket },
    { value: "revenue", label: "Revenue", icon: DollarIcon },
    { value: "shifts", label: "Shifts", icon: ClockIcon },
    { value: "tracking", label: "Tracking", icon: MapPinIcon },
    { value: "notifications", label: "Notifications", icon: BellIcon },
    {
      value: "change-requests",
      label: `Changes (${getTabCount("change-requests")})`,
      icon: FileText,
    },
    {
      value: "refunds",
      label: `Refunds (${getTabCount("refunds-pending")})`,
      icon: CreditCard,
    },
    { value: "reports", label: "Reports", icon: FileTextIcon },
  ];

  // Reusable StatCard from second component
  const StatCard = ({ title, value, icon }) => (
    <Card className="p-4 shadow-md hover:shadow-lg transition-all border border-slate-200">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-full bg-slate-50">{icon}</div>
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h2 className="text-2xl font-bold">{value}</h2>
        </div>
      </div>
    </Card>
  );

  // Reusable ChartCard from second component
  const ChartCard = ({ title, children }) => (
    <Card className="shadow-lg border">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );

  // Render content based on activeTab
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Top Stats from second */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Buses"
                value={totalActiveBuses}
                icon={<BusFront className="text-indigo-600" />}
              />
              <StatCard
                title="Active Drivers"
                value={totalDriversOnDuty}
                icon={<Users className="text-green-600" />}
              />
              <StatCard
                title="Active Routes"
                value={totalRoutes}
                icon={<Route className="text-orange-600" />}
              />
              <StatCard
                title="Today’s Bookings"
                value={totalTicketsSold}
                icon={<Ticket className="text-blue-600" />}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Alerts & Issues</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {alerts.map((alert) => (
                    <Alert
                      key={alert.id}
                      variant={
                        alert.type === "warning" ? "default" : "secondary"
                      }
                    >
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{alert.message}</AlertDescription>
                    </Alert>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Next Departure</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-gray-900">
                    {nextDeparture}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Data Visualizations from second */}
            <div className="grid lg:grid-cols-3 gap-6">
              <ChartCard title="📈 Weekly Bookings Trend">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={bookingData}>
                    <XAxis dataKey="day" stroke="#94a3b8" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="bookings"
                      stroke="#6366F1"
                      strokeWidth={3}
                      dot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="💰 Monthly Revenue">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={revenueData}>
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="revenue"
                      fill="#22C55E"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="🛣 Route Performance">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={routePerformance}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {routePerformance.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </div>
        );
      case "trips":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trip Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bus</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Departure</TableHead>
                      <TableHead>Arrival</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Passengers</TableHead>
                      <TableHead>Driver</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trips.map((trip) => (
                      <TableRow key={trip.id}>
                        <TableCell>{trip.bus}</TableCell>
                        <TableCell>{trip.route}</TableCell>
                        <TableCell>{trip.departure}</TableCell>
                        <TableCell>{trip.arrival}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(trip.status)}>
                            {getStatusBadge(trip.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>{trip.passengers}</TableCell>
                        <TableCell>{trip.driver}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );
      case "drivers":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Driver Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Assigned Bus</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Punctuality</TableHead>
                      <TableHead>License Expiry</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {drivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell>{driver.name}</TableCell>
                        <TableCell>{driver.phone}</TableCell>
                        <TableCell>{driver.assignedBus || "None"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              driver.status === "On Duty"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {driver.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{driver.punctuality}%</TableCell>
                        <TableCell>{driver.licenseExpiry}</TableCell>
                        <TableCell>
                          <Select
                            onValueChange={(value) =>
                              handleAssignDriver(Number(value), driver.id)
                            }
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Assign Bus" />
                            </SelectTrigger>
                            <SelectContent>
                              {buses.map((b) => (
                                <SelectItem key={b.id} value={b.id.toString()}>
                                  {b.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Driver Performance from second */}
            <Card className="shadow-xl border bg-white/80 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-indigo-700 flex items-center gap-2">
                  🚦 Driver Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 text-left text-[15px]">
                        <th className="py-3 px-4">Driver</th>
                        <th className="py-3 px-4">Completed Trips</th>
                        <th className="py-3 px-4">On-Time (%)</th>
                        <th className="py-3 px-4">Rating</th>
                        <th className="py-3 px-4">Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {driverStats.map((driver) => {
                        let performanceLabel = "";
                        let badgeColor = "";

                        if (driver.rating >= 4.5) {
                          performanceLabel = "Excellent";
                          badgeColor = "bg-green-100 text-green-700";
                        } else if (driver.rating >= 3.8) {
                          performanceLabel = "Good";
                          badgeColor = "bg-yellow-100 text-yellow-700";
                        } else {
                          performanceLabel = "Needs Improvement";
                          badgeColor = "bg-red-100 text-red-700";
                        }

                        return (
                          <tr
                            key={driver.name}
                            className="border-b hover:bg-slate-50 transition-all"
                          >
                            <td className="py-3 px-4 font-medium text-slate-800">
                              {driver.name}
                            </td>
                            <td className="py-3 px-4">
                              {driver.completedTrips}
                            </td>
                            <td className="py-3 px-4">{driver.onTime}%</td>
                            <td className="py-3 px-4 flex items-center gap-1">
                              {Array.from({
                                length: Math.round(driver.rating),
                              }).map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-5 h-5 text-yellow-400"
                                />
                              ))}
                              <span className="text-slate-500 ml-1">
                                ({driver.rating.toFixed(1)})
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor}`}
                              >
                                {performanceLabel}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "buses":
        return (
          <div className="space-y-6">
            <Card className="bg-gray-100">
              <CardHeader>
                <CardTitle>Bus Condition & Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {buses.map((bus) => (
                    <Card className="bg-gray-50" key={bus.id}>
                      <CardHeader>
                        <CardTitle>{bus.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <p>
                            <strong>Status:</strong>
                          </p>
                          <Badge
                            variant={
                              bus.status === "Active"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {bus.status}
                          </Badge>
                        </div>
                        <p>
                          <strong>Condition:</strong> {bus.condition}
                        </p>
                        <p>
                          <strong>Next Maintenance:</strong>{" "}
                          {bus.maintenanceNext}
                        </p>
                        <Select
                          defaultValue={bus.status}
                          onValueChange={(value) =>
                            handleUpdateBusStatus(bus.id, value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Under Repair">
                              Under Repair
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "routes":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Route & Schedule Management</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-center text-slate-500">
                    Loading routes...
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Route</TableHead>
                        <TableHead>Schedule</TableHead>
                        <TableHead>Buses Assigned</TableHead>
                        <TableHead>On-Time Rate</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {supervisorRoutes.map((route) => (
                        <TableRow key={route.id}>
                          <TableCell>{route.route}</TableCell>
                          <TableCell>{route.time}</TableCell>
                          <TableCell>{route.busesAssigned}</TableCell>
                          <TableCell>{route.onTimeRate}%</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRoute(route);
                                setEditModalOpen(true);
                              }}
                            >
                              Edit Schedule
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Schedule</DialogTitle>
                  <DialogDescription>
                    Make changes to the route schedule for{" "}
                    {selectedRoute?.route}.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedule">Schedule</Label>
                    <Input id="schedule" defaultValue={selectedRoute?.time} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buses">Buses Assigned</Label>
                    <Input
                      id="buses"
                      type="number"
                      defaultValue={selectedRoute?.busesAssigned}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    onClick={() => {
                      const newSchedule =
                        document.getElementById("schedule").value;
                      const newBuses = parseInt(
                        document.getElementById("buses").value
                      );
                      setSupervisorRoutes((prev) =>
                        prev.map((r) =>
                          r.id === selectedRoute.id
                            ? {
                                ...r,
                                time: newSchedule,
                                busesAssigned: newBuses,
                              }
                            : r
                        )
                      );
                      setEditModalOpen(false);
                      alert("Schedule updated successfully!");
                    }}
                  >
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );
      case "tickets":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tickets Sold per Route</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {routes.map((route) => (
                    <div
                      key={route.id}
                      className="flex justify-between p-2 bg-gray-50 rounded"
                    >
                      <span>{route.name}</span>
                      <span className="font-bold">25 tickets</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Occupancy Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="min-w-full text-sm text-left">
                      <thead>
                        <tr className="bg-slate-100 text-slate-600">
                          <th className="py-2 px-3">Route</th>
                          <th className="py-2 px-3">Tickets Sold</th>
                          <th className="py-2 px-3">Passengers Today</th>
                          <th className="py-2 px-3">Occupancy (%)</th>
                          <th className="py-2 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tripsData.map((trip) => {
                          const occupancy = Math.min(
                            100,
                            (trip.passengers / 50) * 100
                          );
                          const statusColor =
                            occupancy > 100
                              ? "bg-red-100 text-red-700"
                              : occupancy < 20
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700";
                          return (
                            <tr
                              key={trip.id}
                              className="border-b hover:bg-slate-50 transition-all"
                            >
                              <td className="py-2 px-3">
                                {trip.start} → {trip.destination}
                              </td>
                              <td className="py-2 px-3">{trip.passengers}</td>
                              <td className="py-2 px-3">{trip.passengers}</td>
                              <td className="py-2 px-3">
                                {occupancy.toFixed(0)}%
                              </td>
                              <td className="py-2 px-3">
                                <span
                                  className={`px-2 py-1 rounded text-xs font-semibold ${statusColor}`}
                                >
                                  {occupancy > 100
                                    ? "Overbooked"
                                    : occupancy < 20
                                    ? "Low"
                                    : "Normal"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "revenue":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Collections by Cashier</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {cashiers.map((cashier) => (
                    <div
                      key={cashier.id}
                      className="flex justify-between p-2 bg-gray-50 rounded"
                    >
                      <span>{cashier.name}</span>
                      <span className="font-bold text-green-600">
                        ETB {cashier.dailyCollection}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Route</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span>Addis {"->"} Gondar</span>
                    <span className="font-bold text-green-600">ETB 43,000</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span>Addis {"->"} Bahir Dar</span>
                    <span className="font-bold text-green-600">ETB 36,000</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button className="bg-green-500">Download Daily Summary</Button>
            </div>

            {/* Additional chart from second */}
            <ChartCard title="💵 Cashier & Revenue Overview">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={revenueData}>
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#22C55E" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        );
      case "shifts":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shift & Attendance Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Shift Start</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance.map((att) => (
                      <TableRow key={att.id}>
                        <TableCell>{att.name}</TableCell>
                        <TableCell>Driver</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              att.status === "On Duty" ? "default" : "secondary"
                            }
                          >
                            {att.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{att.shiftStart || "N/A"}</TableCell>
                        <TableCell>{att.notes}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => alert("attendance marked")}
                            variant="outline"
                            size="sm"
                          >
                            Mark Attendance
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Additional list from second */}
                <ul className="list-disc pl-5 text-slate-700 space-y-2 mt-4">
                  <li>Driver Abebe: Present</li>
                  <li>Driver Kebede: Present</li>
                  <li>Driver Tesfaye: Absent</li>
                  <li>Driver Getachew: Present</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        );
      case "tracking":
        return (
          <div className="space-y-6">
            <Card className="shadow-lg border h-screen">
              <CardHeader>
                <CardTitle>🗺 Live Bus Tracking</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center ">
                <LiveTracker />
                <p className="mt-3 text-slate-600 text-center">
                  Real-time bus tracking will be displayed here.
                </p>
              </CardContent>
            </Card>
          </div>
        );
      case "notifications":
        return (
          <div className="space-y-6">
            <Card className="shadow-lg border">
              <CardHeader>
                <CardTitle>🔔 System Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="p-3 rounded-md bg-blue-50 border border-blue-100">
                    <Bell className="w-4 h-4 inline mr-2 text-blue-500" /> Route
                    Addis-Hawassa departed successfully.
                  </li>
                  <li className="p-3 rounded-md bg-yellow-50 border border-yellow-100">
                    <Bell className="w-4 h-4 inline mr-2 text-yellow-500" />{" "}
                    Driver Tesfaye reported a delay due to traffic.
                  </li>
                  <li className="p-3 rounded-md bg-green-50 border border-green-100">
                    <Bell className="w-4 h-4 inline mr-2 text-green-500" /> All
                    buses completed yesterday’s schedule.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        );
      case "change-requests":
        return tabData.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-400 text-6xl mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No change requests
              </h3>
              <p className="text-gray-500">
                Late change requests will appear here (10% penalty applies)
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tabData.map((booking) => (
              <Card
                key={booking.id}
                className={`border-2 ${
                  booking.status === "change_requested"
                    ? "border-orange-200"
                    : booking.status === "change_approved"
                    ? "border-green-200"
                    : "border-red-200"
                }`}
              >
                <CardHeader className="flex flex-row items-start justify-between">
                  <CardTitle>Booking #{booking.id}</CardTitle>
                  <Badge variant={getStatusVariant(booking.status)}>
                    {getStatusBadge(booking.status)}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Route
                      </p>
                      <p className="text-gray-900">
                        {booking.from} → {booking.to}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Date & Time
                      </p>
                      <p className="text-gray-900">
                        {booking.date} at {booking.time}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Bus</p>
                      <p className="text-gray-900">{booking.bus}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Passengers
                      </p>
                      <p className="text-gray-900">
                        {booking.passengers} person(s)
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Original Price
                    </p>
                    <p className="text-gray-900">
                      ETB {booking.price * booking.passengers}
                    </p>
                  </div>

                  {booking.status === "change_requested" && (
                    <Alert variant="default" className="border-orange-200">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <p className="font-semibold text-orange-700">
                          10% Penalty
                        </p>
                        <p className="font-bold text-orange-800">
                          ETB{" "}
                          {(booking.price * booking.passengers * 0.1).toFixed(
                            2
                          )}
                        </p>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Passenger Details */}
                  {booking.passengerInfo && (
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Passenger Details
                      </h4>
                      {booking.passengerInfo.map((passenger, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <p className="font-medium text-gray-900">
                            Passenger {index + 1}
                          </p>
                          <p className="text-gray-700">
                            Name: {passenger.name}
                          </p>
                          <p className="text-gray-700">
                            Phone: {passenger.phone}
                          </p>
                          <p className="text-gray-700">
                            Seat: {passenger.selected_spot}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {booking.status === "change_requested" && (
                      <>
                        <Button
                          onClick={() =>
                            handleBookingDecision(booking.id, "change_approved")
                          }
                          className="flex-1"
                        >
                          Approve Change
                        </Button>
                        <Button
                          onClick={() =>
                            handleBookingDecision(booking.id, "change_denied")
                          }
                          variant="destructive"
                          className="flex-1"
                        >
                          Deny Change
                        </Button>
                      </>
                    )}

                    {booking.status === "change_approved" && (
                      <div className="w-full text-center py-2">
                        <Badge variant="default" className="text-green-600">
                          Change Approved
                        </Badge>
                      </div>
                    )}

                    {booking.status === "change_denied" && (
                      <div className="w-full text-center py-2">
                        <Badge variant="destructive" className="text-red-600">
                          Change Denied
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      case "refunds":
        return (
          <div className="space-y-6">
            <div className="w-full">
              <div className="grid w-full grid-cols-3 gap-2 mb-4">
                <Button
                  variant={activeSubTab === "pending" ? "default" : "outline"}
                  onClick={() => setActiveSubTab("pending")}
                >
                  Pending ({getTabCount("refunds-pending")})
                </Button>
                <Button
                  variant={activeSubTab === "approved" ? "default" : "outline"}
                  onClick={() => setActiveSubTab("approved")}
                >
                  Approved ({getTabCount("refunds-approved")})
                </Button>
                <Button
                  variant={activeSubTab === "denied" ? "default" : "outline"}
                  onClick={() => setActiveSubTab("denied")}
                >
                  Denied ({getTabCount("refunds-denied")})
                </Button>
              </div>

              {activeSubTab === "pending" &&
                (refunds.filter((r) => r.status === "pending").length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <div className="text-gray-400 text-6xl mb-4"></div>
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        No pending refunds
                      </h3>
                      <p className="text-gray-500">
                        Pending refund requests will appear here
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {refunds
                      .filter((r) => r.status === "pending")
                      .map((refund) => (
                        <Card
                          key={refund.id}
                          className="border-2 border-yellow-200"
                        >
                          <CardHeader className="flex flex-row items-start justify-between">
                            <CardTitle>Refund #{refund.id}</CardTitle>
                            <Badge variant={getStatusVariant(refund.status)}>
                              {getStatusBadge(refund.status)}
                            </Badge>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <p className="text-sm font-semibold text-gray-700">
                                Refund Date
                              </p>
                              <p className="text-gray-900">
                                {refund.RefundDate}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-semibold text-gray-700">
                                  Ticket Number
                                </p>
                                <p className="text-gray-900">
                                  {refund.TicketNumber}
                                </p>
                              </div>

                              <div>
                                <p className="text-sm font-semibold text-gray-700">
                                  Account Number
                                </p>
                                <p className="text-gray-900">
                                  {refund.AccountNumber}
                                </p>
                              </div>
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-gray-700">
                                Description
                              </p>
                              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                                {refund.RefundDescription}
                              </p>
                            </div>

                            {refund.submittedAt && (
                              <div>
                                <p className="text-sm font-semibold text-gray-700">
                                  Submitted
                                </p>
                                <p className="text-gray-900 text-sm">
                                  {new Date(
                                    refund.submittedAt
                                  ).toLocaleDateString()}{" "}
                                  at{" "}
                                  {new Date(
                                    refund.submittedAt
                                  ).toLocaleTimeString()}
                                </p>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                              <>
                                <Button
                                  onClick={() =>
                                    handleRefundDecision(refund.id, "approved")
                                  }
                                  className="flex-1"
                                >
                                  Approve Refund
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleRefundDecision(refund.id, "denied")
                                  }
                                  variant="destructive"
                                  className="flex-1"
                                >
                                  Deny Refund
                                </Button>
                              </>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ))}

              {activeSubTab === "approved" &&
                (refunds.filter((r) => r.status === "approved").length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <div className="text-gray-400 text-6xl mb-4"></div>
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        No approved refunds
                      </h3>
                      <p className="text-gray-500">
                        Refund requests will appear here when processed
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {refunds
                      .filter((r) => r.status === "approved")
                      .map((refund) => (
                        <Card
                          key={refund.id}
                          className="border-2 border-green-200"
                        >
                          <CardHeader className="flex flex-row items-start justify-between">
                            <CardTitle>Refund #{refund.id}</CardTitle>
                            <Badge variant="default">
                              {getStatusBadge(refund.status)}
                            </Badge>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <p className="text-sm font-semibold text-gray-700">
                                Refund Date
                              </p>
                              <p className="text-gray-900">
                                {refund.RefundDate}
                              </p>
                            </div>
                            <div className="w-full text-center py-2">
                              <Badge
                                variant="default"
                                className="text-green-600"
                              >
                                Refund Approved
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ))}

              {activeSubTab === "denied" &&
                (refunds.filter((r) => r.status === "denied").length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <div className="text-gray-400 text-6xl mb-4"></div>
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        No denied refunds
                      </h3>
                      <p className="text-gray-500">
                        Refund requests will appear here when processed
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {refunds
                      .filter((r) => r.status === "denied")
                      .map((refund) => (
                        <Card
                          key={refund.id}
                          className="border-2 border-red-200"
                        >
                          <CardHeader className="flex flex-row items-start justify-between">
                            <CardTitle>Refund #{refund.id}</CardTitle>
                            <Badge variant="destructive">
                              {getStatusBadge(refund.status)}
                            </Badge>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <p className="text-sm font-semibold text-gray-700">
                                Refund Date
                              </p>
                              <p className="text-gray-900">
                                {refund.RefundDate}
                              </p>
                            </div>
                            <div className="w-full text-center py-2">
                              <Badge
                                variant="destructive"
                                className="text-red-600"
                              >
                                Refund Denied
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ))}
            </div>
          </div>
        );
      case "reports":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Operation Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>Total Trips: 5</p>
                  <p>On-Time: 80%</p>
                  <p>Average Passengers: 38</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Punctuality Report</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>Route 1: 92%</p>
                  <p>Route 2: 85%</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Top Routes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>Addis {"->"} Gondar: ETB 43,000</p>
                  <p>Addis {"->"} Bahir Dar: ETB 36,000</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance vs Revenue</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            </div>
          <div className="flex justify-end">
                <Button className="bg-green-500">Generate Full Report</Button>
          </div>
          
            {/* Additional chart from second */}
            <ChartCard title="📊 Reports & Analytics">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={bookingData}>
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="#6366F1"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-800 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg h-screen overflow-y-auto">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">🚌 Dashboard</h1>
        </div>
        <nav className="p-4 space-y-2">
          {sidebarTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.value}
                variant={activeTab === tab.value ? "secondary" : "ghost"}
                className="w-full justify-start h-12"
                onClick={() => setActiveTab(tab.value)}
              >
                <Icon className="w-4 h-4 mr-2" />
                <span className="text-sm">{tab.label}</span>
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Bus Supervisor Dashboard
          </h1>
          <Button className="flex gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
            <RefreshCcw className="w-4 h-4" /> Refresh Data
          </Button>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}

export default Supervisor;
