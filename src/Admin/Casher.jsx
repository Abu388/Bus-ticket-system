"use client";
import { toast } from "sonner"

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingCart,
  DollarSign,
  CreditCard,
  Bus,
  Bell,
  RefreshCw,
  Ticket,
  Printer,
  User,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// ---------------- Combined Component ----------------
const CombinedCashierDashboard = () => {
  // Core data stores (local demo, merged from both)
  const [transactions, setTransactions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [passengers, setPassengers] = useState([
    {
      id: "P001",
      name: "Abebe Kebede",
      phone: "0912345678",
      email: "abebe@example.com",
      nationalId: "",
      pastTrips: 5,
      unpaidBookings: 0,
    },
    {
      id: "P002",
      name: "Hana Girma",
      phone: "0918765432",
      email: "hana@example.com",
      nationalId: "",
      pastTrips: 3,
      unpaidBookings: 1,
    },
  ]);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Payment success for Booking #BK-1123", type: "success" },
    { id: 2, message: "Refund request for Booking #BK-1125", type: "warning" },
  ]);

  // Mock data for buses and routes (from second)
  const [buses, setBuses] = useState([
    {
      id: 1,
      name: "Selam Bus 01",
      capacity: 45,
      availableSeats: 30,
      status: "Active",
    },
    {
      id: 2,
      name: "Zemen Bus 05",
      capacity: 50,
      availableSeats: 10,
      status: "Active",
    },
    {
      id: 3,
      name: "Sky Bus 11",
      capacity: 48,
      availableSeats: 48,
      status: "Inactive",
    },
  ]);
  const [routes, setRoutes] = useState([
    { id: 1, name: "Addis Ababa -> Gondar", activeBuses: 2 },
    { id: 2, name: "Addis Ababa -> Bahir Dar", activeBuses: 1 },
  ]);

  // Sales state (from first)
  const [cartItem, setCartItem] = useState({
    item: "",
    quantity: 1,
    price: 0,
    paymentType: "",
  });

  // Booking state (merged)
  const [newBooking, setNewBooking] = useState({
    passengerId: "",
    passengerName: "",
    busNumber: "",
    seatNumber: "",
    route: "",
    date: "",
    time: "",
    passengers: 1,
    pickup: "",
    dropoff: "",
    price: 0,
    paymentType: "cash",
  });

  // Passenger registration form (merged)
  const [newPassenger, setNewPassenger] = useState({
    name: "",
    phone: "",
    email: "",
    nationalId: "",
    id: "",
  });

  // Payment form (merged)
  const [newPayment, setNewPayment] = useState({
    item: "",
    price: 0,
    paymentType: "cash",
    passengerId: "",
    bookingId: "",
  });

  // States for issuing tickets (from second)
  const [issueTicketOpen, setIssueTicketOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    route: "",
    date: "",
    bus: "",
    passengers: 1,
    passengerDetails: [{ name: "", phone: "", seat: "", id: "", email: "" }],
    pickup: "",
    dropoff: "",
    price: 0,
    paymentType: "cash",
  });
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatMapVisible, setSeatMapVisible] = useState(false);
  const [selectedBusForTicket, setSelectedBusForTicket] = useState(null);

  // States for validation (from second)
  const [validateInput, setValidateInput] = useState("");
  const [validatedTicket, setValidatedTicket] = useState(null);

  // States for payment (merged from both)
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amountReceived, setAmountReceived] = useState(0);
  const [splitPayments, setSplitPayments] = useState([
    { method: "cash", amount: 0 },
  ]);
  const [refundAmount, setRefundAmount] = useState(0);
  const [refundMethod, setRefundMethod] = useState("cash");
  const [refundReason, setRefundReason] = useState("");

  // States for customer lookup and management (from second)
  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupResults, setLookupResults] = useState([]);
  const [newPassengerOpen, setNewPassengerOpen] = useState(false);

  // States for profile (from second)
  const [profile, setProfile] = useState({
    name: "John Doe",
    role: "Cashier",
    id: "C001",
  });
  const [performance, setPerformance] = useState({
    sales: 0,
    revenue: 0,
    refunds: 0,
  });

  // States for reports (from second)
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [revenueBreakdown, setRevenueBreakdown] = useState([]);
  const [dailyIncomeData, setDailyIncomeData] = useState([
    { day: "Mon", income: 12500 },
    { day: "Tue", income: 14500 },
    { day: "Wed", income: 13200 },
    { day: "Thu", income: 15800 },
    { day: "Fri", income: 17200 },
    { day: "Sat", income: 19500 },
    { day: "Sun", income: 11000 },
  ]);
  const [paymentTypeBreakdown, setPaymentTypeBreakdown] = useState({
    cash: 0,
    online: 0,
  });

  // States for support (from second)
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [escalationIssue, setEscalationIssue] = useState("");

  // Dashboard stats (merged)
  const [chaserPayment, setChaserPayment] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [cancellations, setCancellations] = useState(0);
  const [weeklyTickets, setWeeklyTickets] = useState(0);
  const [cashCollected, setCashCollected] = useState(0);
  const [onlinePayments, setOnlinePayments] = useState(0);
  const [activeBuses, setActiveBuses] = useState(0);
  const [activeRoutes, setActiveRoutes] = useState(0);

  // Active tab state (from second, extended)
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    setBookings(savedBookings);
    calculateDashboardStats(savedBookings);
  }, []);

  useEffect(() => {
    localStorage.setItem("bookings", JSON.stringify(bookings));
    calculateDashboardStats(bookings);
  }, [bookings]);

  // ---------------- Utilities ----------------
  const pushNotification = (message, type = "info") => {
    const toastType = type === "success"
      ? "success"
      : type === "destructive" || type === "refund"
      ? "error"
      : "info";
    const title = type.charAt(0).toUpperCase() + type.slice(1);
    const messageToShow = `${title}: ${message}`;
    if (toastType === "info") {
      toast(messageToShow, { duration: 5000 });
    } else {
      toast[toastType](messageToShow, { duration: 5000 });
    }
  };

  // ---------------- Passenger Management (merged) ----------------
  const handleAddPassenger = () => {
    if (!newPassenger.name || !newPassenger.phone) {
      alert("Please provide at least name and phone.");
      return;
    }
    const passengerId = newPassenger.id || `P${passengers.length + 1}`;
    const passenger = {
      id: passengerId,
      name: newPassenger.name,
      phone: newPassenger.phone,
      email: newPassenger.email || undefined,
      nationalId: newPassenger.nationalId || undefined,
      pastTrips: 0,
      unpaidBookings: 0,
    };
    setPassengers((s) => [...s, passenger]);
    setNewPassenger({ name: "", phone: "", email: "", nationalId: "", id: "" });
    setNewPassengerOpen(false);
    pushNotification(`Passenger ${passenger.name} registered`, "success");
  };

  // ---------------- Booking Functions (merged) ----------------
  const isSeatTaken = (busNumber, seatNumber) =>
    bookings.some(
      (b) =>
        b.busNumber === busNumber &&
        b.seatNumber === seatNumber &&
        b.status === "booked"
    );

  const handleAddBooking = () => {
    if (!newBooking.busNumber || !newBooking.seatNumber || !newBooking.route) {
      alert("Please fill bus, seat and route.");
      return;
    }

    if (isSeatTaken(newBooking.busNumber, newBooking.seatNumber)) {
      alert("Seat already booked!");
      return;
    }

    let passengerIdNum = undefined;
    let passengerNameFinal = newBooking.passengerName.trim();

    if (newBooking.passengerId) {
      passengerIdNum = Number(newBooking.passengerId);
      const found = passengers.find((p) => p.id === passengerIdNum);
      if (found) passengerNameFinal = found.name;
    }

    const booking = {
      id: bookings.length + 1,
      passengerId: passengerIdNum,
      passengerName: passengerNameFinal || `Guest-${bookings.length + 1}`,
      busNumber: newBooking.busNumber,
      seatNumber: newBooking.seatNumber,
      route: newBooking.route,
      date: newBooking.date || "",
      time: newBooking.time || "",
      passengers: newBooking.passengers || 1,
      pickup: newBooking.pickup || "",
      dropoff: newBooking.dropoff || "",
      price: newBooking.price || 0,
      status: "booked",
      paid: false,
      paymentType: newBooking.paymentType || "cash",
    };

    setBookings((s) => [...s, booking]);

    // If passenger exists, increase unpaidBookings count
    if (passengerIdNum) {
      setPassengers((ps) =>
        ps.map((p) =>
          p.id === passengerIdNum
            ? { ...p, unpaidBookings: p.unpaidBookings + 1 }
            : p
        )
      );
    }

    pushNotification(
      `Booking created for ${booking.passengerName} (Bus ${booking.busNumber} Seat ${booking.seatNumber})`,
      "success"
    );

    setNewBooking({
      passengerId: "",
      passengerName: "",
      busNumber: "",
      seatNumber: "",
      route: "",
      date: "",
      time: "",
      passengers: 1,
      pickup: "",
      dropoff: "",
      price: 0,
      paymentType: "cash",
    });
  };

  const handleCancelBooking = (id) => {
    const reason = prompt("Enter reason for cancellation:");
    if (!reason) return;
    setBookings((s) =>
      s.map((b) => (b.id === id ? { ...b, status: "canceled", reason } : b))
    );

    // If booking had been paid, mark related transactions as refunded? (not automatic here)
    // If passenger linked, decrement unpaidBookings if it was unpaid
    const b = bookings.find((x) => x.id === id);
    if (b && b.passengerId && !b.paid) {
      setPassengers((ps) =>
        ps.map((p) =>
          p.id === b.passengerId
            ? { ...p, unpaidBookings: Math.max(0, p.unpaidBookings - 1) }
            : p
        )
      );
    }

    pushNotification(`Booking ${id} canceled. Reason: ${reason}`, "refund");
  };

  const rebookBooking = (id) => {
    // prompt for new bus/seat
    const newBus = prompt("Enter new bus number:");
    if (!newBus) return;
    const newSeat = prompt("Enter new seat number:");
    if (!newSeat) return;

    setBookings((s) =>
      s.map((b) =>
        b.id === id
          ? { ...b, busNumber: newBus, seatNumber: newSeat, status: "booked" }
          : b
      )
    );
    pushNotification(
      `Booking ${id} rebooked to Bus ${newBus} Seat ${newSeat}`,
      "info"
    );
  };

  // Merged decision handler from second
  const handleDecision = (id, decision, reason = "") => {
    const updatedBookings = bookings.map((booking) =>
      booking.id === id
        ? { ...booking, status: decision, cancelReason: reason }
        : booking
    );
    setBookings(updatedBookings);
    const booking = updatedBookings.find((b) => b.id === id);
    if (
      booking &&
      (decision === "approved" || decision === "change_approved")
    ) {
      setChaserPayment((prev) => prev + booking.price * booking.passengers);
    } else if (decision === "denied" || decision === "change_denied") {
      setChaserPayment(
        (prev) => prev - booking.price * booking.passengers * 0.9
      );
    }
    calculateDashboardStats(updatedBookings);
    pushNotification(
      `${decision.includes("change") ? "Change" : "Booking"} #${id} has been ${
        decision.includes("approved") ? "approved" : "denied"
      }${decision.includes("change") ? " for change" : ""}. Reason: ${reason}`
    );
  };

  // Seat selection and issue ticket (from second, integrated)
  const handleSeatSelection = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : prev.length < newTicket.passengers
        ? [...prev, seat]
        : prev
    );
  };

  const generateSeats = (busId) => {
    const bus = buses.find((b) => b.id === busId);
    if (!bus) return [];
    return Array.from({ length: bus.capacity }, (_, i) => ({
      number: i + 1,
      available: bus.availableSeats >= i + 1,
    }));
  };

  const handleIssueTicket = () => {
    if (selectedSeats.length !== newTicket.passengers) {
      alert("Please select seats for all passengers.");
      return;
    }
    const ticketId = Date.now().toString();
    const passengerDetails = newTicket.passengerDetails.map((p, i) => ({
      ...p,
      seat: selectedSeats[i],
    }));
    const newB = {
      id: ticketId,
      route: newTicket.route,
      date: newTicket.date,
      bus: newTicket.bus,
      passengers: newTicket.passengers,
      passengerInfo: passengerDetails,
      pickup: newTicket.pickup,
      dropoff: newTicket.dropoff,
      price: newTicket.price,
      status: "approved",
      qrCode: `QR_${ticketId}`,
      paymentType: newTicket.paymentType,
      paid: false,
    };
    setBookings((prev) => [...prev, newB]);
    setBuses(
      buses.map((b) =>
        b.id === parseInt(newTicket.bus)
          ? { ...b, availableSeats: b.availableSeats - newTicket.passengers }
          : b
      )
    );
    setNewTicket({
      route: "",
      date: "",
      bus: "",
      passengers: 1,
      passengerDetails: [{ name: "", phone: "", seat: "", id: "", email: "" }],
      pickup: "",
      dropoff: "",
      price: 0,
      paymentType: "cash",
    });
    setSelectedSeats([]);
    setIssueTicketOpen(false);
    setSeatMapVisible(false);
    setSelectedBusForTicket(null);
    setChaserPayment((prev) => prev + newTicket.price * newTicket.passengers);
    pushNotification(`Ticket #${ticketId} issued with QR: ${newB.qrCode}.`);
  };

  const handlePrintTicket = (booking) =>
    pushNotification(
      `Printing e-ticket for #${booking.id} with QR: ${
        booking.qrCode || booking.qrCode
      }`
    );

  // ---------------- Payment Handling (merged) ----------------
  const handleAddPayment = () => {
    if (!newPayment.item || newPayment.price <= 0) {
      alert("Please enter item and price.");
      return;
    }

    const transaction = {
      id: transactions.length + 1,
      item: newPayment.item,
      quantity: 1,
      price: newPayment.price,
      paymentType: newPayment.paymentType,
      total: newPayment.price,
      status: "paid",
      passengerId: newPayment.passengerId
        ? Number(newPayment.passengerId)
        : undefined,
      bookingId: newPayment.bookingId
        ? Number(newPayment.bookingId)
        : undefined,
    };

    setTransactions((s) => [...s, transaction]);

    // If this payment is for a booking, mark booking paid and decrement passenger unpaidBookings
    if (transaction.bookingId) {
      setBookings((bs) =>
        bs.map((b) =>
          b.id === transaction.bookingId
            ? {
                ...b,
                paid: true,
                paymentStatus: "paid",
                paymentType: transaction.paymentType,
              }
            : b
        )
      );

      const booking = bookings.find((b) => b.id === transaction.bookingId);
      if (booking && booking.passengerId) {
        setPassengers((ps) =>
          ps.map((p) =>
            p.id === booking.passengerId
              ? {
                  ...p,
                  unpaidBookings: Math.max(0, p.unpaidBookings - 1),
                  pastTrips: p.pastTrips + 1,
                }
              : p
          )
        );
      }
    }

    pushNotification(
      `Payment recorded: ${transaction.item} (${transaction.paymentType})`,
      "success"
    );

    // reset payment form
    setNewPayment({
      item: "",
      price: 0,
      paymentType: "cash",
      passengerId: "",
      bookingId: "",
    });
  };

  const markPaymentPending = (id) => {
    setTransactions((s) =>
      s.map((t) => (t.id === id ? { ...t, status: "pending" } : t))
    );
    pushNotification(`Payment ${id} marked pending`, "info");
  };

  const refundPayment = (id) => {
    const reason = prompt("Reason for refund:");
    if (!reason) return;

    const tx = transactions.find((t) => t.id === id);
    if (!tx) return;

    setTransactions((s) =>
      s.map((t) => (t.id === id ? { ...t, status: "refunded" } : t))
    );

    // If linked to a booking, mark booking paid = false and increment unpaidBookings for passenger
    if (tx.bookingId) {
      setBookings((bs) =>
        bs.map((b) =>
          b.id === tx.bookingId
            ? { ...b, paid: false, paymentStatus: "refunded" }
            : b
        )
      );
      const booking = bookings.find((b) => b.id === tx.bookingId);
      if (booking && booking.passengerId) {
        setPassengers((ps) =>
          ps.map((p) =>
            p.id === booking.passengerId
              ? {
                  ...p,
                  unpaidBookings: p.unpaidBookings + 1,
                  pastTrips: Math.max(0, p.pastTrips - 1),
                }
              : p
          )
        );
      }
    }

    pushNotification(`Payment ${id} refunded. Reason: ${reason}`, "refund");
  };

  // Merged payment handlers from second
  const addSplitPayment = () =>
    setSplitPayments([...splitPayments, { method: "cash", amount: 0 }]);

  const updateSplitPayment = (index, field, value) => {
    const updated = [...splitPayments];
    updated[index][field] = value;
    setSplitPayments(updated);
  };

  const handleRecordPayment = () => {
    const totalSplit = splitPayments.reduce((sum, p) => sum + p.amount, 0);
    if (totalSplit !== amountReceived) {
      alert("Split payments total must match amount received.");
      return;
    }
    const updatedBookings = bookings.map((b) =>
      b.id === selectedBookingId
        ? {
            ...b,
            paymentStatus: "paid",
            paymentType: paymentMethod,
            paid: true,
          }
        : b
    );
    setBookings(updatedBookings);
    const booking = updatedBookings.find((b) => b.id === selectedBookingId);
    if (booking && booking.passengerId) {
      setPassengers((ps) =>
        ps.map((p) =>
          p.id === booking.passengerId
            ? {
                ...p,
                unpaidBookings: Math.max(0, p.unpaidBookings - 1),
                pastTrips: p.pastTrips + 1,
              }
            : p
        )
      );
    }
    calculateDashboardStats(updatedBookings);
    pushNotification(
      `Payment of ETB ${amountReceived} via ${paymentMethod} recorded for Booking #${selectedBookingId}.`
    );
    setSelectedBookingId(null);
    setAmountReceived(0);
    setSplitPayments([{ method: "cash", amount: 0 }]);
  };

  const handleRefund = () => {
    if (!refundReason) {
      alert("Please provide a reason for the refund.");
      return;
    }
    const updatedBookings = bookings.map((b) =>
      b.id === selectedBookingId
        ? {
            ...b,
            status: "refunded",
            paymentStatus: "refunded",
            paid: false,
            refundReason,
          }
        : b
    );
    setBookings(updatedBookings);
    calculateDashboardStats(updatedBookings);
    pushNotification(
      `Refund of ETB ${refundAmount} via ${refundMethod} processed for Booking #${selectedBookingId}. Reason: ${refundReason}`
    );
    setSelectedBookingId(null);
    setRefundAmount(0);
    setRefundReason("");
  };

  const handleValidateTicket = () => {
    const ticket = bookings.find(
      (b) => b.id === validateInput || b.qrCode === validateInput
    );
    if (ticket) {
      setValidatedTicket(ticket);
      pushNotification(
        `Ticket #${validateInput} is valid. Route: ${ticket.route}`
      );
    } else {
      pushNotification("Invalid ticket number or QR.", "error");
    }
  };

  const handleLookup = () => {
    setLookupResults(
      bookings.filter(
        (b) =>
          b.id.includes(lookupQuery) ||
          (b.passengerInfo &&
            b.passengerInfo.some(
              (p) =>
                p.phone.includes(lookupQuery) ||
                p.name.toLowerCase().includes(lookupQuery.toLowerCase())
            ))
      )
    );
  };

  // ---------------- Summary Calculations (merged) ----------------
  const calculateDashboardStats = (bkgs) => {
    const today = new Date().toISOString().split("T")[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    const todayBookings = bkgs.filter(
      (b) => b.date === today && b.status === "approved"
    );
    const weeklyBookings = bkgs.filter(
      (b) => b.date >= weekAgo && b.status === "approved"
    );
    const cashBkgs = todayBookings.filter((b) => b.paymentType === "cash");
    const onlineBkgs = todayBookings.filter((b) => b.paymentType === "online");
    setTotalTickets(todayBookings.length);
    setWeeklyTickets(weeklyBookings.length);
    setTotalRevenue(
      todayBookings.reduce((sum, b) => sum + b.price * b.passengers, 0)
    );
    setCashCollected(
      cashBkgs.reduce((sum, b) => sum + b.price * b.passengers, 0)
    );
    setOnlinePayments(
      onlineBkgs.reduce((sum, b) => sum + b.price * b.passengers, 0)
    );
    setActiveBuses(buses.filter((b) => b.status === "Active").length);
    setActiveRoutes(routes.filter((r) => r.activeBuses > 0).length);
    setCancellations(bkgs.filter((b) => b.status === "denied").length);
    setPaymentTypeBreakdown({
      cash: cashBkgs.reduce((sum, b) => sum + b.price * b.passengers, 0),
      online: onlineBkgs.reduce((sum, b) => sum + b.price * b.passengers, 0),
    });
    setPerformance({
      sales: todayBookings.length,
      revenue: todayBookings.reduce(
        (sum, b) => sum + b.price * b.passengers,
        0
      ),
      refunds: bkgs.filter((b) => b.status === "denied").length,
    });
  };

  const totalTicketsSold = bookings.filter((b) => b.status === "booked").length;
  const totalCashCollected = transactions
    .filter((t) => t.paymentType === "cash" && t.status === "paid")
    .reduce((acc, t) => acc + t.total, 0);
  const totalOnlinePaymentsMerged = transactions
    .filter((t) => t.paymentType === "online" && t.status === "paid")
    .reduce((acc, t) => acc + t.total, 0);

  // Reports functions (from second)
  const generateRevenueBreakdown = () => {
    const filtered =
      dateRange.start && dateRange.end
        ? bookings.filter(
            (b) =>
              b.date >= dateRange.start &&
              b.date <= dateRange.end &&
              b.status === "approved"
          )
        : bookings.filter((b) => b.status === "approved");
    const breakdown = filtered.reduce((acc, b) => {
      const key = b.route || `${b.from} → ${b.to}`;
      acc[key] = (acc[key] || 0) + b.price * b.passengers;
      return acc;
    }, {});
    setRevenueBreakdown(Object.entries(breakdown));
  };

  // Support functions (from second)
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([
        ...chatMessages,
        { text: newMessage, sender: "cashier" },
      ]);
      setNewMessage("");
      setTimeout(
        () =>
          setChatMessages((prev) => [
            ...prev,
            { text: "Admin: Received your message.", sender: "admin" },
          ]),
        1000
      );
    }
  };

  const handleEscalate = () => {
    if (escalationIssue.trim()) {
      pushNotification(`Issue escalated: ${escalationIssue}`);
      setEscalationIssue("");
    }
  };

  // Status helpers (from second)
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "approved":
      case "change_approved":
        return "default";
      case "denied":
      case "change_denied":
      case "refunded":
        return "destructive";
      case "change_pending":
      case "change_requested":
      case "pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusBadgeText = (status) => {
    switch (status) {
      case "change_pending":
        return "Change Request (No Penalty)";
      case "change_requested":
        return "Change Request (10% Penalty)";
      case "change_approved":
        return "Change Approved";
      case "change_denied":
        return "Change Denied";
      case "refunded":
        return "Refunded";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getTabCount = (tab) => {
    switch (tab) {
      case "pending":
        return bookings.filter((b) => b.status === "pending").length;
      case "change-requests":
        return bookings.filter(
          (b) =>
            b.status === "change_pending" || b.status === "change_requested"
        ).length;
      case "approved":
        return bookings.filter(
          (b) => b.status === "approved" || b.status === "change_approved"
        ).length;
      case "denied":
        return bookings.filter(
          (b) =>
            b.status === "denied" ||
            b.status === "change_denied" ||
            b.status === "refunded"
        ).length;
      default:
        return 0;
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    switch (activeTab) {
      case "pending":
        return booking.status === "pending";
      case "change-requests":
        return (
          booking.status === "change_pending" ||
          booking.status === "change_requested"
        );
      case "approved":
        return (
          booking.status === "approved" || booking.status === "change_approved"
        );
      case "denied":
        return (
          booking.status === "denied" ||
          booking.status === "change_denied" ||
          booking.status === "refunded"
        );
      case "bookings":
        return booking.status === "booked" || booking.status === "canceled";
      default:
        return true;
    }
  });

  // ---------------- Render ----------------
  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Combined Cashier Dashboard</h1>
        <div className="text-right">
          <p className="text-lg font-semibold">
            Cashier Payment: ETB {chaserPayment}
          </p>
          <p className="text-sm text-muted-foreground">
            Profile: {profile.name} ({profile.role}) - ID: {profile.id}
          </p>
        </div>
      </div>

      {/* Summary Section (merged) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <SummaryCard
          title="Tickets Sold"
          value={totalTicketsSold}
          icon={<ShoppingCart />}
          color="text-indigo-500"
        />
        <SummaryCard
          title="Cash Collected"
          value={`$${totalCashCollected.toFixed(2)}`}
          icon={<DollarSign />}
          color="text-green-500"
        />
        <SummaryCard
          title="Online Payments"
          value={`$${totalOnlinePaymentsMerged.toFixed(2)}`}
          icon={<CreditCard />}
          color="text-blue-500"
        />
        <SummaryCard
          title="Active Buses/Routes"
          value={`${activeBuses} / ${activeRoutes}`}
          icon={<Bus />}
          color="text-orange-500"
        />
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="max-h-32 overflow-y-auto space-y-2">
            {notifications.length === 0 ? (
              <p className="text-sm text-slate-500">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-2 text-sm rounded ${
                    n.type === "success"
                      ? "bg-green-100 text-green-800"
                      : n.type === "refund"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {n.message}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs (merged structure) */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="bookings">Ticket Bookings</TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({getTabCount("pending")})
          </TabsTrigger>
          <TabsTrigger value="change-requests">
            Changes ({getTabCount("change-requests")})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({getTabCount("approved")})
          </TabsTrigger>
          <TabsTrigger value="denied">
            Denied ({getTabCount("denied")})
          </TabsTrigger>
          <TabsTrigger value="passengers">Passengers</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab (from second) */}
        <TabsContent value="dashboard" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">{totalTickets}</CardTitle>
                <CardDescription>Tickets Sold Today</CardDescription>
                <p className="text-sm text-muted-foreground">
                  Weekly: {weeklyTickets}
                </p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">ETB {cashCollected}</CardTitle>
                <CardDescription>Cash Collected</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">ETB {onlinePayments}</CardTitle>
                <CardDescription>Online Payments</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">
                  {activeBuses} / {activeRoutes}
                </CardTitle>
                <CardDescription>Active Buses / Routes</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Dialog
                    open={issueTicketOpen}
                    onOpenChange={setIssueTicketOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="w-full">Issue Ticket</Button>
                    </DialogTrigger>
                  </Dialog>
                  <Dialog
                    open={newPassengerOpen}
                    onOpenChange={setNewPassengerOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="secondary" className="w-full">
                        Register Passenger
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder="Scan QR or Enter Ticket Number"
                    value={validateInput}
                    onChange={(e) => setValidateInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleValidateTicket()
                    }
                    className="pr-24"
                  />
                  <Button
                    onClick={handleValidateTicket}
                    variant="secondary"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8"
                  >
                    Validate
                  </Button>
                </div>
                {validatedTicket && (
                  <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-3 rounded-md border border-green-200 dark:border-green-800">
                    <p className="font-semibold">
                      Ticket Valid: #{validatedTicket.id} -{" "}
                      {validatedTicket.route} | QR: {validatedTicket.qrCode}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => setActiveTab("payments")}
                  variant="outline"
                  className="w-full"
                >
                  Record Payment
                </Button>
                <Button
                  onClick={() => setActiveTab("support")}
                  variant="outline"
                  className="w-full"
                >
                  Escalate Issue
                </Button>
                <Button
                  onClick={() => setActiveTab("reports")}
                  variant="outline"
                  className="w-full"
                >
                  View Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sales Tab (from first) */}
        <TabsContent value="sales">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 items-end">
            <Input
              placeholder="Item Name"
              value={cartItem.item}
              onChange={(e) =>
                setCartItem({ ...cartItem, item: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Quantity"
              value={cartItem.quantity}
              onChange={(e) =>
                setCartItem({ ...cartItem, quantity: Number(e.target.value) })
              }
            />
            <Input
              type="number"
              placeholder="Price"
              value={cartItem.price}
              onChange={(e) =>
                setCartItem({ ...cartItem, price: Number(e.target.value) })
              }
            />
            <select
              className="border rounded p-2"
              value={cartItem.paymentType}
              onChange={(e) =>
                setCartItem({ ...cartItem, paymentType: e.target.value })
              }
            >
              <option value="cash">Cash</option>
              <option value="online">Online</option>
            </select>
            <Button
              onClick={() => {
                const newTx = {
                  id: transactions.length + 1,
                  item: cartItem.item || "Sale",
                  quantity: cartItem.quantity,
                  price: cartItem.price,
                  paymentType: cartItem.paymentType,
                  total: cartItem.quantity * cartItem.price,
                  status: "paid",
                };
                setTransactions((s) => [...s, newTx]);
                pushNotification(`Sale recorded: ${newTx.item}`, "success");
                setCartItem({
                  item: "",
                  quantity: 1,
                  price: 0,
                  paymentType: "cash",
                });
              }}
              className="col-span-4 md:col-auto"
            >
              Add Sale
            </Button>
          </div>
        </TabsContent>

        {/* Bookings Tab (merged) */}
        <TabsContent value="bookings">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-4 items-end">
            <select
              className="border rounded p-2"
              value={newBooking.passengerId}
              onChange={(e) =>
                setNewBooking({ ...newBooking, passengerId: e.target.value })
              }
            >
              <option value="">
                -- Select Passenger (or leave empty for guest) --
              </option>
              {passengers.map((p) => (
                <option key={p.id} value={String(p.id)}>
                  {p.name} ({p.phone})
                </option>
              ))}
            </select>

            <Input
              placeholder="Passenger Name (if guest)"
              value={newBooking.passengerName}
              onChange={(e) =>
                setNewBooking({ ...newBooking, passengerName: e.target.value })
              }
            />
            <Input
              placeholder="Bus Number"
              value={newBooking.busNumber}
              onChange={(e) =>
                setNewBooking({ ...newBooking, busNumber: e.target.value })
              }
            />
            <Input
              placeholder="Seat Number"
              value={newBooking.seatNumber}
              onChange={(e) =>
                setNewBooking({ ...newBooking, seatNumber: e.target.value })
              }
            />
            <Input
              placeholder="Route"
              value={newBooking.route}
              onChange={(e) =>
                setNewBooking({ ...newBooking, route: e.target.value })
              }
            />
            <Button
              onClick={handleAddBooking}
              className="col-span-6 md:col-auto"
            >
              Book Ticket
            </Button>
          </div>

          {/* Booking Table (from first, with status badges from second) */}
          <div className="overflow-x-auto mt-6">
            <table className="w-full table-auto border border-slate-200">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-2">#</th>
                  <th className="p-2">Passenger</th>
                  <th className="p-2">Bus</th>
                  <th className="p-2">Seat</th>
                  <th className="p-2">Route</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Paid</th>
                  <th className="p-2">E-Ticket</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-4 text-center text-slate-500">
                      No bookings yet
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr
                      key={b.id}
                      className="text-center border-t border-slate-200"
                    >
                      <td className="p-2">{b.id}</td>
                      <td className="p-2">
                        {b.passengerId
                          ? passengers.find((p) => p.id === b.passengerId)
                              ?.name || b.passengerName
                          : b.passengerName}
                      </td>
                      <td className="p-2">{b.busNumber || b.bus}</td>
                      <td className="p-2">{b.seatNumber || b.seat}</td>
                      <td className="p-2">{b.route}</td>
                      <td className="p-2">
                        <Badge variant={getStatusBadgeVariant(b.status)}>
                          {getStatusBadgeText(b.status)}
                        </Badge>
                      </td>
                      <td className="p-2">{b.paid ? "Yes" : "No"}</td>
                      <td className="p-2">
                        {b.status === "booked" && (
                          <div className="flex flex-col items-center">
                            <QRCodeSVG value={`Ticket-${b.id}`} size={64} />
                            <Button
                              size="sm"
                              variant="outline"
                              className="mt-2 flex items-center gap-1"
                              onClick={() => handlePrintTicket(b)}
                            >
                              <Printer size={14} /> Print
                            </Button>
                          </div>
                        )}
                      </td>
                      <td className="p-2 space-y-2">
                        {b.status === "booked" ? (
                          <>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleCancelBooking(b.id)}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => rebookBooking(b.id)}
                            >
                              Rebook
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleDecision(b.id, "approved")}
                            >
                              Approve
                            </Button>
                          </>
                        ) : (
                          <span className="text-sm text-slate-500">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Status-specific Tabs (from second, integrated) */}
        {["pending", "change-requests", "approved", "denied"].includes(
          activeTab
        ) && (
          <TabsContent value={activeTab} className="space-y-6 mt-4">
            {filteredBookings.length === 0 ? (
              <Card className="text-center py-12">
                <CardHeader>
                  <CardTitle className="text-xl text-muted-foreground">{`No ${activeTab.replace(
                    "-",
                    " "
                  )} bookings`}</CardTitle>
                  <CardDescription>
                    New requests will appear here when submitted
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardHeader className="flex flex-row items-start justify-between">
                      <div>
                        <CardTitle>Booking #{booking.id}</CardTitle>
                        <CardDescription>
                          {booking.route || `${booking.from} → ${booking.to}`}
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusBadgeVariant(booking.status)}>
                        {getStatusBadgeText(booking.status)}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Date & Time</Label>
                          <p>
                            {booking.date} at {booking.time}
                          </p>
                        </div>
                        <div>
                          <Label>Passengers</Label>
                          <p>{booking.passengers} person(s)</p>
                        </div>
                        <div>
                          <Label>Bus</Label>
                          <p>{booking.bus || booking.busNumber}</p>
                        </div>
                        <div>
                          <Label>Total Price</Label>
                          <p className="font-bold">
                            ETB {booking.price * booking.passengers}
                          </p>
                        </div>
                      </div>

                      {booking.passengerInfo && (
                        <div>
                          <Label className="font-semibold mb-2">
                            Passenger Details
                          </Label>
                          <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-2 bg-muted/50">
                            {booking.passengerInfo.map((p, i) => (
                              <div key={i} className="text-sm">
                                <span className="font-medium">{p.name}</span> (
                                {p.phone}) - Seat: {p.selected_spot || p.seat}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3">
                        {booking.status === "pending" && (
                          <>
                            <Button
                              onClick={() =>
                                handleDecision(booking.id, "approved")
                              }
                              className="flex-1"
                            >
                              Approve
                            </Button>
                            <Button
                              onClick={() =>
                                handleDecision(booking.id, "denied")
                              }
                              variant="destructive"
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {(booking.status === "change_pending" ||
                          booking.status === "change_requested") && (
                          <>
                            <Button
                              onClick={() =>
                                handleDecision(booking.id, "change_approved")
                              }
                              className="flex-1"
                            >
                              Approve Change
                            </Button>
                            <Button
                              onClick={() =>
                                handleDecision(booking.id, "change_denied")
                              }
                              variant="destructive"
                              className="flex-1"
                            >
                              Deny Change
                            </Button>
                          </>
                        )}
                        {(booking.status === "approved" ||
                          booking.status === "change_approved") && (
                          <div className="flex w-full items-center gap-2">
                            <span className="font-semibold text-green-600">
                              Approved
                            </span>
                            <div className="flex-grow" />
                            <Button
                              onClick={() =>
                                handleDecision(booking.id, "change_requested")
                              }
                              variant="secondary"
                              size="sm"
                            >
                              Reschedule
                            </Button>
                            <Button
                              onClick={() => handlePrintTicket(booking)}
                              variant="outline"
                              size="sm"
                            >
                              Print
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        )}
        {/* Passengers Tab (merged) */}
        <TabsContent value="passengers" className="space-y-6 mt-4">
          <div className="flex gap-4">
            <Dialog open={newPassengerOpen} onOpenChange={setNewPassengerOpen}>
              <DialogTrigger asChild>
                <Button>Register New Passenger</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Register New Passenger</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Name"
                      value={newPassenger.name}
                      onChange={(e) =>
                        setNewPassenger({
                          ...newPassenger,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="id">ID/Passport</Label>
                    <Input
                      id="id"
                      placeholder="ID/Passport"
                      value={newPassenger.id}
                      onChange={(e) =>
                        setNewPassenger({ ...newPassenger, id: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="Phone"
                      value={newPassenger.phone}
                      onChange={(e) =>
                        setNewPassenger({
                          ...newPassenger,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      value={newPassenger.email}
                      onChange={(e) =>
                        setNewPassenger({
                          ...newPassenger,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationalId">National ID</Label>
                    <Input
                      id="nationalId"
                      placeholder="National ID"
                      value={newPassenger.nationalId}
                      onChange={(e) =>
                        setNewPassenger({
                          ...newPassenger,
                          nationalId: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="secondary"
                    onClick={() => setNewPassengerOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddPassenger}>Register</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Input
              type="text"
              placeholder="Search Passengers by Name or Phone"
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLookup()}
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Passenger List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>National ID</TableHead>
                    <TableHead>Past Trips</TableHead>
                    <TableHead>Unpaid</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {passengers
                    .filter(
                      (p) =>
                        p.name
                          .toLowerCase()
                          .includes(lookupQuery.toLowerCase()) ||
                        p.phone.includes(lookupQuery)
                    )
                    .map((p) => {
                      const handleView = () => {
                        const pBookings = bookings.filter(
                          (b) => b.passengerId === p.id
                        );
                        const pPayments = transactions.filter(
                          (t) => t.passengerId === p.id
                        );
                        toast(`Passenger: ${p.name}\nTrips: ${pBookings.length}\nPayments: ${pPayments.length}\nUnpaid bookings: ${p.unpaidBookings}`)
                      };

                      const handleCollectPayment = () => {
                        const unpaid = bookings.filter(
                          (b) =>
                            b.passengerId === p.id &&
                            !b.paid &&
                            b.status === "booked"
                        );
                        if (unpaid.length === 0)
                          return toast("No unpaid bookings.");
                        const choice = prompt(
                          `Unpaid bookings: ${unpaid
                            .map(
                              (u) =>
                                `${u.id} (Bus ${u.busNumber} Seat ${u.seatNumber})`
                            )
                            .join("; ")}\nEnter booking id to mark paid:`
                        );
                        if (!choice) return;
                        const bid = Number(choice);
                        const booking = unpaid.find((u) => u.id === bid);
                        if (!booking)
                          return pushNotification("Invalid booking id.");
                        const payAmount = Number(
                          prompt("Enter amount to record (numeric):") || "0"
                        );
                        if (!payAmount || payAmount <= 0)
                          return pushNotification("Invalid amount.");
                        const tx = {
                          id: transactions.length + 1,
                          item: `Booking ${booking.id}`,
                          quantity: 1,
                          price: payAmount,
                          paymentType: "cash",
                          total: payAmount,
                          status: "paid",
                          passengerId: p.id,
                          bookingId: booking.id,
                        };
                        setTransactions((s) => [...s, tx]);
                        setBookings((bs) =>
                          bs.map((b) =>
                            b.id === booking.id ? { ...b, paid: true } : b
                          )
                        );
                        setPassengers((ps) =>
                          ps.map((pp) =>
                            pp.id === p.id
                              ? {
                                  ...pp,
                                  unpaidBookings: Math.max(
                                    0,
                                    pp.unpaidBookings - 1
                                  ),
                                  pastTrips: pp.pastTrips + 1,
                                }
                              : pp
                          )
                        );
                        pushNotification(
                          `Recorded payment for booking ${booking.id}`,
                          "success"
                        );
                      };

                      const handleCancelBookingClick = () => {
                        const unpaid = bookings.filter(
                          (b) =>
                            b.passengerId === p.id &&
                            !b.paid &&
                            b.status === "booked"
                        );
                        if (unpaid.length === 0)
                          return pushNotification("No unpaid bookings.");
                        const choice = prompt(
                          `Unpaid bookings: ${unpaid
                            .map((u) => u.id)
                            .join(", ")}\nEnter booking id to cancel:`
                        );
                        if (!choice) return;
                        const bid = Number(choice);
                        handleCancelBooking(bid);
                      };

                      return (
                        <TableRow key={p.id}>
                          <TableCell>{p.id}</TableCell>
                          <TableCell>{p.id}</TableCell>
                          <TableCell>{p.name}</TableCell>
                          <TableCell>{p.phone}</TableCell>
                          <TableCell>{p.email || "-"}</TableCell>
                          <TableCell>{p.nationalId || "-"}</TableCell>
                          <TableCell>{p.pastTrips}</TableCell>
                          <TableCell>
                            {p.unpaidBookings > 0 ? (
                              <span className="text-destructive">
                                {p.unpaidBookings}
                              </span>
                            ) : (
                              "0"
                            )}
                          </TableCell>
                          <TableCell className="flex gap-2">
                            <Button size="sm" onClick={handleView}>
                              View
                            </Button>
                            <Button size="sm" onClick={handleCollectPayment}>
                              Collect Payment
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={handleCancelBookingClick}
                            >
                              Cancel Booking
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {passengers.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="p-4 text-center text-slate-500"
                      >
                        No passengers yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab (merged) */}
        <TabsContent value="payments" className="space-y-6 mt-4">
          <h2 className="text-xl font-bold">Payment Handling</h2>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-4 items-end">
            <Input
              placeholder="Item / Description"
              value={newPayment.item}
              onChange={(e) =>
                setNewPayment({ ...newPayment, item: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Price"
              value={newPayment.price}
              onChange={(e) =>
                setNewPayment({ ...newPayment, price: Number(e.target.value) })
              }
            />
            <select
              className="border rounded p-2"
              value={newPayment.paymentType}
              onChange={(e) =>
                setNewPayment({ ...newPayment, paymentType: e.target.value })
              }
            >
              <option value="cash">Cash</option>
              <option value="online">Online</option>
            </select>

            <select
              className="border rounded p-2"
              value={newPayment.passengerId}
              onChange={(e) =>
                setNewPayment({ ...newPayment, passengerId: e.target.value })
              }
            >
              <option value="">(Optional) Link to passenger</option>
              {passengers.map((p) => (
                <option key={p.id} value={String(p.id)}>
                  {p.name}
                </option>
              ))}
            </select>

            <select
              className="border rounded p-2"
              value={newPayment.bookingId}
              onChange={(e) =>
                setNewPayment({ ...newPayment, bookingId: e.target.value })
              }
            >
              <option value="">(Optional) Link to booking</option>
              {bookings
                .filter((b) => b.status === "booked" && !b.paid)
                .map((b) => (
                  <option key={b.id} value={String(b.id)}>
                    Booking {b.id} — {b.passengerName} (Bus {b.busNumber} Seat{" "}
                    {b.seatNumber})
                  </option>
                ))}
            </select>

            <Button onClick={handleAddPayment}>Record Payment</Button>
          </div>

          {/* Payments list (from first) */}
          <div className="overflow-x-auto mt-6">
            <table className="w-full table-auto border border-slate-200">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-2">#</th>
                  <th className="p-2">Item</th>
                  <th className="p-2">Passenger</th>
                  <th className="p-2">Booking</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="text-center border-t">
                    <td className="p-2">{t.id}</td>
                    <td className="p-2">{t.item}</td>
                    <td className="p-2">
                      {t.passengerId
                        ? passengers.find((p) => p.id === t.passengerId)
                            ?.name ?? "-"
                        : "-"}
                    </td>
                    <td className="p-2">
                      {t.bookingId ? String(t.bookingId) : "-"}
                    </td>
                    <td className="p-2">{t.paymentType}</td>
                    <td className="p-2">${t.total.toFixed(2)}</td>
                    <td className="p-2">{t.status}</td>
                    <td className="p-2 space-x-2">
                      {t.status === "paid" && (
                        <Button
                          size="sm"
                          onClick={() => markPaymentPending(t.id)}
                        >
                          Mark Pending
                        </Button>
                      )}
                      {t.status !== "refunded" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => refundPayment(t.id)}
                        >
                          Refund
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-slate-500">
                      No payments yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Additional Payment/Refund from second */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Accept Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  value={selectedBookingId || ""}
                  onValueChange={setSelectedBookingId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Booking" />
                  </SelectTrigger>
                  <SelectContent>
                    {bookings
                      .filter(
                        (b) =>
                          (b.status === "pending" || b.status === "approved") &&
                          b.paymentStatus !== "paid"
                      )
                      .map((b) => (
                        <SelectItem key={b.id} value={b.id.toString()}>
                          #{b.id} - ETB {b.price * b.passengers}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {selectedBookingId && (
                  <>
                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <Select
                        value={paymentMethod}
                        onValueChange={setPaymentMethod}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="online">
                            Online / Mobile Money
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Total Amount Received</Label>
                      <Input
                        type="number"
                        value={amountReceived}
                        onChange={(e) =>
                          setAmountReceived(parseFloat(e.target.value))
                        }
                      />
                    </div>
                    <Button onClick={handleRecordPayment} className="w-full">
                      Record & Sync
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Refund Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  value={selectedBookingId || ""}
                  onValueChange={setSelectedBookingId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Booking for Refund" />
                  </SelectTrigger>
                  <SelectContent>
                    {bookings
                      .filter(
                        (b) =>
                          b.status === "denied" ||
                          b.status === "change_denied" ||
                          b.status === "approved"
                      )
                      .map((b) => (
                        <SelectItem key={b.id} value={b.id.toString()}>
                          #{b.id}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {selectedBookingId && (
                  <>
                    <div className="space-y-2">
                      <Label>Refund Amount</Label>
                      <Input
                        type="number"
                        value={refundAmount}
                        onChange={(e) =>
                          setRefundAmount(parseFloat(e.target.value))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Refund Method</Label>
                      <Select
                        value={refundMethod}
                        onValueChange={setRefundMethod}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="credit">Credit</SelectItem>
                          <SelectItem value="wallet">Wallet Balance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Refund Reason</Label>
                      <Textarea
                        value={refundReason}
                        onChange={(e) => setRefundReason(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={handleRefund}
                      variant="destructive"
                      className="w-full"
                    >
                      Process Refund
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transaction History Tab (from first) */}
        <TabsContent value="history">
          <div className="overflow-x-auto mt-4">
            <table className="w-full table-auto border border-slate-200">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-2">#</th>
                  <th className="p-2">Item</th>
                  <th className="p-2">Qty</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Payment</th>
                  <th className="p-2">Total</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-slate-500">
                      No transactions yet
                    </td>
                  </tr>
                ) : (
                  transactions.map((t) => (
                    <tr
                      key={t.id}
                      className="text-center border-t border-slate-200"
                    >
                      <td className="p-2">{t.id}</td>
                      <td className="p-2">{t.item}</td>
                      <td className="p-2">{t.quantity}</td>
                      <td className="p-2">${t.price.toFixed(2)}</td>
                      <td className="p-2">{t.paymentType}</td>
                      <td className="p-2">${t.total.toFixed(2)}</td>
                      <td className="p-2">{t.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Reports Tab (from second) */}
        <TabsContent value="reports" className="space-y-6 mt-4">
          <h2 className="text-xl font-bold">Sales & Revenue Summary</h2>
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-muted-foreground">Tickets Today</p>
                <p className="text-2xl font-bold">{totalTickets}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tickets Weekly</p>
                <p className="text-2xl font-bold">{weeklyTickets}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Revenue Today</p>
                <p className="text-2xl font-bold text-green-600">
                  ETB {totalRevenue}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Cancellations</p>
                <p className="text-2xl font-bold text-destructive">
                  {cancellations}
                </p>
              </div>
            </CardContent>
          </Card>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown by Route</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) =>
                        setDateRange({ ...dateRange, start: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) =>
                        setDateRange({ ...dateRange, end: e.target.value })
                      }
                    />
                  </div>
                </div>
                <Button onClick={generateRevenueBreakdown}>
                  Filter & Generate
                </Button>
                {revenueBreakdown.length > 0 && (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {revenueBreakdown.map(([route, rev]) => (
                      <div
                        key={route}
                        className="flex justify-between p-2 bg-muted rounded"
                      >
                        <span className="text-sm">{route}</span>
                        <span className="font-bold text-green-600">
                          ETB {rev}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Breakdown by Payment Type</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-around text-center pt-6">
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    ETB {paymentTypeBreakdown.cash}
                  </p>
                  <p className="text-muted-foreground">Cash</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    ETB {paymentTypeBreakdown.online}
                  </p>
                  <p className="text-muted-foreground">Online</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Support Tab (from second) */}
        <TabsContent value="support" className="space-y-6 mt-4">
          <h2 className="text-xl font-bold">Support & Escalation</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Escalate Issue</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Describe the unresolved refund/payment problem..."
                  value={escalationIssue}
                  onChange={(e) => setEscalationIssue(e.target.value)}
                />
                <Button onClick={handleEscalate}>Send to Support Team</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Chat with Admin</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-40 bg-muted rounded p-2 overflow-y-auto space-y-2">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded max-w-[80%] ${
                        msg.sender === "cashier"
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-secondary"
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type urgent message..."
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>Send</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Issue Ticket Dialog (from second) */}
      <Dialog open={issueTicketOpen} onOpenChange={setIssueTicketOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Issue New Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Route (From → To)</Label>
                <Input
                  value={newTicket.route}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, route: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newTicket.date}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Bus</Label>
                <Select
                  value={newTicket.bus}
                  onValueChange={(v) => {
                    setNewTicket({ ...newTicket, bus: v });
                    setSelectedBusForTicket(parseInt(v));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Bus" />
                  </SelectTrigger>
                  <SelectContent>
                    {buses.map((b) => (
                      <SelectItem key={b.id} value={b.id.toString()}>
                        {b.name} ({b.availableSeats} seats available)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Passengers</Label>
                <Input
                  type="number"
                  min="1"
                  value={newTicket.passengers}
                  onChange={(e) => {
                    const num = parseInt(e.target.value) || 1;
                    let details = newTicket.passengerDetails;
                    if (num < details.length) {
                      details = details.slice(0, num);
                    } else {
                      for (let i = details.length; i < num; i++) {
                        details.push({
                          name: "",
                          phone: "",
                          seat: "",
                          id: "",
                          email: "",
                        });
                      }
                    }
                    setNewTicket({
                      ...newTicket,
                      passengers: num,
                      passengerDetails: details,
                    });
                  }}
                />
              </div>
            </div>
            <Button
              type="button"
              onClick={() => setSeatMapVisible(true)}
              variant="outline"
              className="w-full"
            >
              View & Assign Seats
            </Button>
            {seatMapVisible && selectedBusForTicket && (
              <div className="grid grid-cols-5 gap-1 p-4 bg-muted rounded-lg max-h-60 overflow-y-auto">
                {generateSeats(selectedBusForTicket).map((seat) => (
                  <Button
                    key={seat.number}
                    type="button"
                    onClick={() => handleSeatSelection(seat.number)}
                    disabled={!seat.available}
                    variant={
                      selectedSeats.includes(seat.number)
                        ? "default"
                        : "outline"
                    }
                    className="p-2 h-auto text-xs"
                  >
                    {seat.number}
                  </Button>
                ))}
              </div>
            )}
            <div>
              <Label className="font-semibold mb-2 block">
                Passenger Details
              </Label>
              {newTicket.passengerDetails.map((pax, idx) => (
                <div key={idx} className="space-y-2 mb-2 p-2 bg-muted rounded">
                  <Input
                    placeholder={`Name ${idx + 1}`}
                    value={pax.name}
                    onChange={(e) => {
                      const d = [...newTicket.passengerDetails];
                      d[idx].name = e.target.value;
                      setNewTicket({ ...newTicket, passengerDetails: d });
                    }}
                  />
                  <Input
                    placeholder="Phone"
                    value={pax.phone}
                    onChange={(e) => {
                      const d = [...newTicket.passengerDetails];
                      d[idx].phone = e.target.value;
                      setNewTicket({ ...newTicket, passengerDetails: d });
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payment Type</Label>
                <Select
                  value={newTicket.paymentType}
                  onValueChange={(v) =>
                    setNewTicket({ ...newTicket, paymentType: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="online">
                      Online / Mobile Money
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Price per Passenger</Label>
                <Input
                  type="number"
                  value={newTicket.price}
                  onChange={(e) =>
                    setNewTicket({
                      ...newTicket,
                      price: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIssueTicketOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleIssueTicket}>
              Issue Ticket & Generate QR
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button
        variant="outline"
        onClick={() => {
          setTransactions([]);
          setBookings([]);
          setPassengers([]);
          setNotifications([]);
        }}
        className="mt-4 flex items-center gap-2"
      >
        <RefreshCw /> Clear All
      </Button>
    </div>
  );
};

// ---------------- Reusable Summary Card ----------------
const SummaryCard = ({ title, value, icon, color }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="flex items-center gap-4">
      <div className={`p-3 rounded-full bg-slate-50 ${color}`}>{icon}</div>
      <span className="text-xl font-semibold">{value}</span>
    </CardContent>
  </Card>
);

export default CombinedCashierDashboard;