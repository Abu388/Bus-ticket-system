import { useContext, useState, useEffect } from "react";
import { BookingContext } from "../BookingContext";

function Cashier() {
  const { allBookings, updateBookingStatus, addBooking } = useContext(BookingContext);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [chaserPayment, setChaserPayment] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [cancellations, setCancellations] = useState(0);

  // New states for issuing tickets
  const [issueTicketModal, setIssueTicketModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    route: '',
    date: '',
    bus: '',
    passengers: 1,
    passengerDetails: [{ name: '', phone: '', seat: '' }],
    pickup: '',
    dropoff: '',
    price: 0,
  });
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatMapVisible, setSeatMapVisible] = useState(false);

  // States for validation
  const [validateInput, setValidateInput] = useState('');
  const [validatedTicket, setValidatedTicket] = useState(null);

  // States for payment
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountReceived, setAmountReceived] = useState(0);
  const [splitPayments, setSplitPayments] = useState([{ method: 'cash', amount: 0 }]);
  const [refundAmount, setRefundAmount] = useState(0);
  const [refundMethod, setRefundMethod] = useState('cash');

  // States for customer lookup
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResults, setLookupResults] = useState([]);

  // States for profile
  const [profile, setProfile] = useState({ name: 'John Doe', role: 'Cashier', id: 'C001' });
  const [performance, setPerformance] = useState({ sales: 0, revenue: 0, refunds: 0 });

  // States for reports
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [revenueBreakdown, setRevenueBreakdown] = useState([]);

  // States for support
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [escalationIssue, setEscalationIssue] = useState('');

  // Load bookings from localStorage on component mount
  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(savedBookings);
    calculateDashboardStats(savedBookings);
  }, []);

  // Update local state when allBookings changes
  useEffect(() => {
    if (allBookings && allBookings.length > 0) {
      setBookings(allBookings);
      calculateDashboardStats(allBookings);
    }
  }, [allBookings]);

  const calculateDashboardStats = (bkgs) => {
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = bkgs.filter(b => b.date === today && b.status === 'approved');
    setTotalTickets(todayBookings.length);
    setTotalRevenue(todayBookings.reduce((sum, b) => sum + (b.price * b.passengers), 0));
    setCancellations(bkgs.filter(b => b.status === 'denied').length);
    setPerformance({
      sales: todayBookings.length,
      revenue: todayBookings.reduce((sum, b) => sum + (b.price * b.passengers), 0),
      refunds: bkgs.filter(b => b.status === 'denied').length,
    });
  };

  const handleDecision = (id, decision) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === id ? { ...booking, status: decision } : booking
    );
    setBookings(updatedBookings);
    const booking = updatedBookings.find(b => b.id === id);
    if (booking && (decision === 'approved' || decision === 'change_approved')) {
      setChaserPayment(prev => prev + (booking.price * booking.passengers));
    } else if (decision === 'denied' || decision === 'change_denied') {
      // Simulate refund to wallet or cash
      setChaserPayment(prev => prev - (booking.price * booking.passengers * 0.9)); // 10% penalty
    }
    if (updateBookingStatus) {
      updateBookingStatus(id, decision);
    }
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    calculateDashboardStats(updatedBookings);
    alert(`${decision.includes('change') ? 'Change' : 'Booking'} #${id} has been ${decision.includes('approved') ? 'approved' : 'denied'}${decision.includes('change') ? ' for change' : ''}.`);
  };

  const handleSeatSelection = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else if (selectedSeats.length < newTicket.passengers) {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const generateSeats = () => {
    const seats = [];
    for (let i = 1; i <= 40; i++) {
      seats.push(i);
    }
    return seats;
  };

  const handleIssueTicket = () => {
    if (selectedSeats.length !== newTicket.passengers) {
      alert('Please select seats for all passengers.');
      return;
    }
    const ticketId = Date.now().toString();
    const passengerDetails = newTicket.passengerDetails.map((p, i) => ({
      ...p,
      seat: selectedSeats[i]
    }));
    const newBooking = {
      id: ticketId,
      route: newTicket.route,
      date: newTicket.date,
      bus: newTicket.bus,
      passengers: newTicket.passengers,
      passengerInfo: passengerDetails,
      pickup: newTicket.pickup,
      dropoff: newTicket.dropoff,
      price: newTicket.price,
      status: 'approved',
      qrCode: `QR_${ticketId}`, // Simulate QR
    };
    addBooking(newBooking);
    setBookings(prev => [...prev, newBooking]);
    setNewTicket({ route: '', date: '', bus: '', passengers: 1, passengerDetails: [{ name: '', phone: '', seat: '' }], pickup: '', dropoff: '', price: 0 });
    setSelectedSeats([]);
    setIssueTicketModal(false);
    setSeatMapVisible(false);
    setChaserPayment(prev => prev + (newTicket.price * newTicket.passengers));
    alert(`Ticket #${ticketId} issued with QR: ${newBooking.qrCode}. Print or send e-ticket.`);
  };

  const handleValidateTicket = () => {
    const ticket = bookings.find(b => b.id === validateInput || b.qrCode === validateInput);
    if (ticket) {
      setValidatedTicket(ticket);
      alert(`Ticket #${validateInput} is valid. Route: ${ticket.route}`);
    } else {
      alert('Invalid ticket number or QR.');
    }
  };

  const addSplitPayment = () => {
    setSplitPayments([...splitPayments, { method: 'cash', amount: 0 }]);
  };

  const updateSplitPayment = (index, field, value) => {
    const updated = [...splitPayments];
    updated[index][field] = value;
    setSplitPayments(updated);
  };

  const handleRecordPayment = () => {
    const totalSplit = splitPayments.reduce((sum, p) => sum + p.amount, 0);
    if (totalSplit !== amountReceived) {
      alert('Split payments total must match amount received.');
      return;
    }
    alert(`Payment of ETB ${amountReceived} via ${paymentMethod} (split: ${JSON.stringify(splitPayments)}) recorded for Booking #${selectedBookingId}. Auto-sync to finance.`);
    setSelectedBookingId(null);
    setAmountReceived(0);
    setSplitPayments([{ method: 'cash', amount: 0 }]);
  };

  const handleRefund = () => {
    alert(`Refund of ETB ${refundAmount} via ${refundMethod} processed for Booking #${selectedBookingId}.`);
    setSelectedBookingId(null);
    setRefundAmount(0);
  };

  const handleLookup = () => {
    const results = bookings.filter(b => 
      b.id.includes(lookupQuery) || 
      (b.passengerInfo && b.passengerInfo.some(p => p.phone.includes(lookupQuery) || p.name.toLowerCase().includes(lookupQuery.toLowerCase())))
    );
    setLookupResults(results);
  };

  const generateRevenueBreakdown = () => {
    const breakdown = {};
    bookings.filter(b => b.status === 'approved').forEach(b => {
      const key = b.route || `${b.from} → ${b.to}`;
      breakdown[key] = (breakdown[key] || 0) + (b.price * b.passengers);
    });
    setRevenueBreakdown(Object.entries(breakdown));
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([...chatMessages, { text: newMessage, sender: 'cashier' }]);
      setNewMessage('');
      // Simulate admin response after 1s
      setTimeout(() => {
        setChatMessages(prev => [...prev, { text: 'Admin: Received your message.', sender: 'admin' }]);
      }, 1000);
    }
  };

  const handleEscalate = () => {
    if (escalationIssue.trim()) {
      alert(`Issue escalated: ${escalationIssue}`);
      setEscalationIssue('');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
      case 'change_approved':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'denied':
      case 'change_denied':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'change_pending':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'change_requested':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'change_pending':
        return '🔄 Change Request (No Penalty)';
      case 'change_requested':
        return '⚠️ Change Request (10% Penalty)';
      case 'change_approved':
        return '✅ Change Approved';
      case 'change_denied':
        return '❌ Change Denied';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    switch (activeTab) {
      case 'pending':
        return booking.status === 'pending';
      case 'change-requests':
        return booking.status === 'change_pending' || booking.status === 'change_requested';
      case 'approved':
        return booking.status === 'approved' || booking.status === 'change_approved';
      case 'denied':
        return booking.status === 'denied' || booking.status === 'change_denied';
      default:
        return true;
    }
  });

  const getTabCount = (tab) => {
    switch (tab) {
      case 'pending':
        return bookings.filter(b => b.status === 'pending').length;
      case 'change-requests':
        return bookings.filter(b => b.status === 'change_pending' || b.status === 'change_requested').length;
      case 'approved':
        return bookings.filter(b => b.status === 'approved' || b.status === 'change_approved').length;
      case 'denied':
        return bookings.filter(b => b.status === 'denied' || b.status === 'change_denied').length;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Cashier Dashboard</h1>
        <div className="text-right">
          <p className="text-lg text-gray-700">Cashier Payment: ETB {chaserPayment}</p>
          <p className="text-sm text-gray-500">Profile: {profile.name} ({profile.role}) - ID: {profile.id}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 justify-center flex-wrap">
          {['dashboard', 'pending', 'change-requests', 'approved', 'denied', 'payments', 'reports', 'support'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 text-sm ${
                activeTab === tab
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab === 'dashboard' ? 'Dashboard' :
               tab === 'pending' ? `Pending (${getTabCount('pending')})` :
               tab === 'change-requests' ? `Changes (${getTabCount('change-requests')})` :
               tab === 'approved' ? `Approved (${getTabCount('approved')})` :
               tab === 'denied' ? `Denied (${getTabCount('denied')})` :
               tab === 'payments' ? 'Payments' :
               tab === 'reports' ? 'Reports' :
               'Support'}
            </button>
          ))}
        </div>

        {/* Dashboard Summary */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-blue-600">✅ {totalTickets}</div>
                <p className="text-gray-600">Total Tickets Sold Today</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-600">ETB {totalRevenue}</div>
                <p className="text-gray-600">Total Revenue</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-red-600">❌ {cancellations}</div>
                <p className="text-gray-600">Cancellations</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setIssueTicketModal(true)} className="bg-blue-500 text-white px-6 py-2 rounded-xl">Issue Ticket</button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Scan QR or Enter Ticket Number"
                  value={validateInput}
                  onChange={(e) => setValidateInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleValidateTicket()}
                  className="w-full p-3 border rounded-xl pr-20"
                />
                <button onClick={handleValidateTicket} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 text-white px-4 py-1 rounded">Validate</button>
              </div>
            </div>
            {validatedTicket && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="font-semibold">Ticket Valid: #{validatedTicket.id} - {validatedTicket.route} | QR: {validatedTicket.qrCode}</p>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4">Performance Stats</h3>
                <div className="space-y-2">
                  <p>Sales: {performance.sales}</p>
                  <p>Revenue Handled: ETB {performance.revenue}</p>
                  <p>Refunds Processed: {performance.refunds}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button onClick={() => setActiveTab('payments')} className="w-full bg-purple-500 text-white py-2 rounded">Record Payment</button>
                  <button onClick={() => setActiveTab('support')} className="w-full bg-orange-500 text-white py-2 rounded">Escalate Issue</button>
                  <button onClick={() => setActiveTab('reports')} className="w-full bg-indigo-500 text-white py-2 rounded">View Reports</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Issue Ticket Modal */}
        {issueTicketModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Issue New Ticket</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Route (From → To)"
                  value={newTicket.route}
                  onChange={(e) => setNewTicket({...newTicket, route: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
                <input
                  type="date"
                  value={newTicket.date}
                  onChange={(e) => setNewTicket({...newTicket, date: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Bus"
                  value={newTicket.bus}
                  onChange={(e) => setNewTicket({...newTicket, bus: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Passengers"
                  value={newTicket.passengers}
                  onChange={(e) => {
                    setNewTicket({...newTicket, passengers: parseInt(e.target.value)});
                    if (parseInt(e.target.value) < newTicket.passengerDetails.length) {
                      setNewTicket(prev => ({...prev, passengerDetails: prev.passengerDetails.slice(0, parseInt(e.target.value))}));
                    } else {
                      const details = [...newTicket.passengerDetails];
                      for (let i = details.length; i < parseInt(e.target.value); i++) {
                        details.push({ name: '', phone: '', seat: '' });
                      }
                      setNewTicket({...newTicket, passengerDetails: details});
                    }
                  }}
                  className="w-full p-2 border rounded-lg"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Pickup Point"
                    value={newTicket.pickup}
                    onChange={(e) => setNewTicket({...newTicket, pickup: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Drop-off Point"
                    value={newTicket.dropoff}
                    onChange={(e) => setNewTicket({...newTicket, dropoff: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <input
                  type="number"
                  placeholder="Price per Passenger"
                  value={newTicket.price}
                  onChange={(e) => setNewTicket({...newTicket, price: parseFloat(e.target.value)})}
                  className="w-full p-2 border rounded-lg"
                />
                <button onClick={() => setSeatMapVisible(true)} className="w-full bg-blue-500 text-white py-2 rounded-lg">View Seat Map & Assign Seats</button>
                {seatMapVisible && (
                  <div className="grid grid-cols-5 gap-1 p-4 bg-gray-100 rounded-lg max-h-60 overflow-y-auto">
                    {generateSeats().map(seat => (
                      <button
                        key={seat}
                        onClick={() => handleSeatSelection(seat)}
                        className={`p-2 rounded text-sm font-bold ${
                          selectedSeats.includes(seat)
                            ? 'bg-green-500 text-white'
                            : 'bg-white border hover:bg-gray-200'
                        }`}
                      >
                        {seat}
                      </button>
                    ))}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold mb-2">Passenger Details</h3>
                  {newTicket.passengerDetails.map((pax, idx) => (
                    <div key={idx} className="space-y-2 mb-2 p-2 bg-gray-50 rounded">
                      <input
                        placeholder={`Name ${idx + 1}`}
                        value={pax.name}
                        onChange={(e) => {
                          const details = [...newTicket.passengerDetails];
                          details[idx].name = e.target.value;
                          setNewTicket({...newTicket, passengerDetails: details});
                        }}
                        className="w-full p-1 border rounded"
                      />
                      <input
                        placeholder="Phone"
                        value={pax.phone}
                        onChange={(e) => {
                          const details = [...newTicket.passengerDetails];
                          details[idx].phone = e.target.value;
                          setNewTicket({...newTicket, passengerDetails: details});
                        }}
                        className="w-full p-1 border rounded"
                      />
                      <input
                        placeholder="Seat (auto-assigned if selected)"
                        value={pax.seat}
                        onChange={(e) => {
                          const details = [...newTicket.passengerDetails];
                          details[idx].seat = e.target.value;
                          setNewTicket({...newTicket, passengerDetails: details});
                        }}
                        className="w-full p-1 border rounded"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={handleIssueTicket} className="flex-1 bg-green-500 text-white py-2 rounded">Issue Ticket & Generate QR</button>
                  <button onClick={() => {
                    setIssueTicketModal(false);
                    setSeatMapVisible(false);
                    setSelectedSeats([]);
                  }} className="flex-1 bg-gray-500 text-white py-2 rounded">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content for Bookings */}
        {['pending', 'change-requests', 'approved', 'denied'].includes(activeTab) && (
          filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">
                {activeTab === 'pending' ? '📋' : 
                 activeTab === 'change-requests' ? '🔄' :
                 activeTab === 'approved' ? '✅' : '❌'}
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {activeTab === 'pending' ? 'No pending bookings' : 
                 activeTab === 'change-requests' ? 'No change requests' :
                 activeTab === 'approved' ? 'No approved bookings' : 'No denied bookings'}
              </h3>
              <p className="text-gray-500">New requests will appear here when submitted</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredBookings.map(booking => (
                <div key={booking.id} className="bg-white rounded-2xl shadow-lg border-2 p-6">
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
                        <p className="text-gray-900">{booking.route || `${booking.from} → ${booking.to}`}</p>
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
                      <label className="block text-sm font-semibold text-gray-700">Total Price</label>
                      <p className="text-gray-900 text-lg font-bold">ETB {booking.price * booking.passengers}</p>
                    </div>
                    {booking.pickup && <p className="text-sm text-gray-600">Pickup: {booking.pickup} | Dropoff: {booking.dropoff}</p>}
                    {booking.qrCode && <p className="text-sm text-gray-600">QR: {booking.qrCode}</p>}
                  </div>

                  {/* Passenger Details */}
                  {booking.passengerInfo && (
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Passenger Details</h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {booking.passengerInfo.map((passenger, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <p className="font-medium text-gray-900">Passenger {index + 1}</p>
                            <p className="text-gray-700">Name: {passenger.name}</p>
                            <p className="text-gray-700">Phone: {passenger.phone}</p>
                            <p className="text-gray-700">Seat: {passenger.selected_spot || passenger.seat}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {booking.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleDecision(booking.id, "approved")}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-200"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleDecision(booking.id, "denied")}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-200"
                        >
                          Cancel (Refund)
                        </button>
                      </>
                    )}
                    
                    {(booking.status === 'change_pending' || booking.status === 'change_requested') && (
                      <>
                        <button 
                          onClick={() => handleDecision(booking.id, "change_approved")}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-200"
                        >
                          Approve Change
                        </button>
                        <button 
                          onClick={() => handleDecision(booking.id, "change_denied")}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-200"
                        >
                          Deny Change
                        </button>
                      </>
                    )}
                    
                    {(booking.status === 'approved' || booking.status === 'change_approved') && (
                      <div className="w-full text-center py-2 flex justify-center items-center gap-2">
                        <span className="text-green-600 font-semibold">✅ Approved</span>
                        <button 
                          onClick={() => handleDecision(booking.id, "change_requested")}
                          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                        >
                          Reschedule
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Change Request Info */}
                  {(booking.status === 'change_pending' || booking.status === 'change_requested') && (
                    <div className={`mt-4 p-3 border rounded-lg ${booking.status === 'change_pending' ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
                      <p className={`font-semibold ${booking.status === 'change_pending' ? 'text-blue-800' : 'text-orange-800'}`}>
                        {booking.status === 'change_pending' ? '🔄 No Penalty' : '⚠️ 10% Penalty'}
                      </p>
                      <p className={`text-sm ${booking.status === 'change_pending' ? 'text-blue-600' : 'text-orange-600'}`}>
                        Requested {booking.status === 'change_pending' ? 'within 2 min' : 'after 2 min'}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Payment Handling</h2>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold mb-4">Accept Payment</h3>
              <select
                value={selectedBookingId || ''}
                onChange={(e) => setSelectedBookingId(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              >
                <option value="">Select Booking</option>
                {bookings.filter(b => b.status === 'pending' || b.status === 'approved').map(b => (
                  <option key={b.id} value={b.id}>#{b.id} - ETB {b.price * b.passengers}</option>
                ))}
              </select>
              {selectedBookingId && (
                <div className="space-y-4">
                  <label className="block text-sm font-semibold">Payment Method</label>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full p-2 border rounded">
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="mobile">Mobile Money</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Total Amount Received"
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(parseFloat(e.target.value))}
                    className="w-full p-2 border rounded"
                  />
                  <div>
                    <h4 className="font-semibold mb-2">Split Payment (Optional)</h4>
                    {splitPayments.map((split, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <select 
                          value={split.method} 
                          onChange={(e) => updateSplitPayment(index, 'method', e.target.value)}
                          className="flex-1 p-2 border rounded"
                        >
                          <option value="cash">Cash</option>
                          <option value="card">Card</option>
                          <option value="mobile">Mobile Money</option>
                        </select>
                        <input
                          type="number"
                          placeholder="Amount"
                          value={split.amount}
                          onChange={(e) => updateSplitPayment(index, 'amount', parseFloat(e.target.value))}
                          className="flex-1 p-2 border rounded"
                        />
                        {index > 0 && <button onClick={() => setSplitPayments(prev => prev.filter((_, i) => i !== index))} className="bg-red-500 text-white px-2 py-2 rounded">-</button>}
                      </div>
                    ))}
                    <button onClick={addSplitPayment} className="text-blue-500 text-sm">+ Add Split</button>
                  </div>
                  <button onClick={handleRecordPayment} className="w-full bg-green-500 text-white py-2 rounded">Record & Sync</button>
                </div>
              )}
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold mb-4">Refund Management</h3>
              <select
                value={selectedBookingId || ''}
                onChange={(e) => setSelectedBookingId(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              >
                <option value="">Select Booking for Refund</option>
                {bookings.filter(b => b.status === 'denied' || b.status === 'change_denied').map(b => (
                  <option key={b.id} value={b.id}>#{b.id}</option>
                ))}
              </select>
              {selectedBookingId && (
                <div className="space-y-4">
                  <input
                    type="number"
                    placeholder="Refund Amount (Partial/Full)"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(parseFloat(e.target.value))}
                    className="w-full p-2 border rounded"
                  />
                  <select value={refundMethod} onChange={(e) => setRefundMethod(e.target.value)} className="w-full p-2 border rounded">
                    <option value="cash">Cash</option>
                    <option value="credit">Credit</option>
                    <option value="wallet">Wallet Balance</option>
                  </select>
                  <button onClick={handleRefund} className="w-full bg-red-500 text-white py-2 rounded">Process Refund</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Reports</h2>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold mb-4">Daily Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div><p className="text-gray-600">Tickets Sold</p><p className="text-2xl font-bold">{totalTickets}</p></div>
                <div><p className="text-gray-600">Revenue</p><p className="text-2xl font-bold text-green-600">ETB {totalRevenue}</p></div>
                <div><p className="text-gray-600">Cancellations</p><p className="text-2xl font-bold text-red-600">{cancellations}</p></div>
                <div><p className="text-gray-600">Shift Balance</p><p className="text-2xl font-bold">ETB {chaserPayment}</p></div>
              </div>
              <button onClick={() => alert('Shift report generated and emailed.')} className="mt-4 bg-green-500 text-white py-2 px-4 rounded">End Shift & Generate Report</button>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold mb-4">Revenue Breakdown</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="date"
                  placeholder="Start Date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  className="p-2 border rounded"
                />
                <input
                  type="date"
                  placeholder="End Date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  className="p-2 border rounded"
                />
              </div>
              <button onClick={generateRevenueBreakdown} className="bg-blue-500 text-white py-2 px-4 rounded mb-4">Filter & Generate</button>
              {revenueBreakdown.length > 0 && (
                <div className="space-y-2">
                  {revenueBreakdown.map(([route, rev]) => (
                    <div key={route} className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>{route}</span>
                      <span className="font-bold text-green-600">ETB {rev}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Support Tab */}
        {activeTab === 'support' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Support & Escalation</h2>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold mb-4">Customer Lookup</h3>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Search by Phone, Name, or Ticket Number"
                  value={lookupQuery}
                  onChange={(e) => setLookupQuery(e.target.value)}
                  className="flex-1 p-2 border rounded"
                />
                <button onClick={handleLookup} className="bg-blue-500 text-white px-4 py-2 rounded">Search</button>
              </div>
              {lookupResults.length > 0 ? (
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {lookupResults.map(b => (
                    <div key={b.id} className="p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100" onClick={() => setActiveTab(b.status === 'pending' ? 'pending' : b.status === 'approved' ? 'approved' : 'denied')}>
                      <p className="font-semibold">#{b.id}</p>
                      <p>{b.passengerInfo?.[0]?.name} - {b.route}</p>
                    </div>
                  ))}
                </div>
              ) : lookupQuery && (
                <p className="text-gray-500">No results found.</p>
              )}
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold mb-4">Escalate Issue</h3>
              <textarea 
                placeholder="Describe the unresolved refund/payment problem..." 
                value={escalationIssue}
                onChange={(e) => setEscalationIssue(e.target.value)}
                className="w-full p-2 border rounded mb-4 h-24"
              ></textarea>
              <button onClick={handleEscalate} className="bg-orange-500 text-white py-2 px-4 rounded">Send to Support Team</button>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold mb-4">Chat with Admin</h3>
              <div className="h-40 bg-gray-100 rounded p-2 mb-4 overflow-y-auto space-y-2">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`p-2 rounded ${msg.sender === 'cashier' ? 'bg-blue-200 ml-auto' : 'bg-green-200'}`}>
                    <p className="font-semibold">{msg.sender === 'cashier' ? 'You' : 'Admin'}:</p>
                    <p>{msg.text}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  value={newMessage} 
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type urgent message..." 
                  className="flex-1 p-2 border rounded" 
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button onClick={handleSendMessage} className="bg-indigo-500 text-white px-4 py-2 rounded">Send</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cashier;