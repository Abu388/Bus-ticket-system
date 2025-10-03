import { useContext, useState, useEffect } from "react";
import { BookingContext } from "../BookingContext";

function Cashier() {
  const { allBookings, updateBookingStatus } = useContext(BookingContext);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [chaserPayment, setChaserPayment] = useState(0);

  // Load bookings from localStorage on component mount
  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(savedBookings);
  }, []);

  // Update local state when allBookings changes
  useEffect(() => {
    if (allBookings && allBookings.length > 0) {
      setBookings(allBookings);
    }
  }, [allBookings]);

  const handleDecision = (id, decision) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === id ? { ...booking, status: decision } : booking
    );
    setBookings(updatedBookings);
    const booking = updatedBookings.find(b => b.id === id);
    if (booking) {
      setChaserPayment(booking.price * booking.passengers);
    }
    // Update the context as well
    if (updateBookingStatus) {
      updateBookingStatus(id, decision);
    }
    
    // Update localStorage
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    
    // Show confirmation message
    if (decision === 'change_approved') {
      alert(`Change request for Booking #${id} has been approved!`);
    } else if (decision === 'change_denied') {
      alert(`Change request for Booking #${id} has been denied.`);
    } else {
      alert(`Booking #${id} has been ${decision === 'approved' ? 'approved' : 'denied'}`);
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
        return status;
    }
  };

  // Filter bookings based on active tab
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
      <p className="text-lg text-gray-700 text-right">Cashier Payment: -{chaserPayment}</p>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cashier Dashboard</h1>
          <p className="text-xl text-gray-600">Manage bookings and change requests</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 justify-center flex-wrap">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === 'pending'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Pending Bookings ({getTabCount('pending')})
          </button>
          <button
            onClick={() => setActiveTab('change-requests')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === 'change-requests'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Change Requests ({getTabCount('change-requests')})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === 'approved'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Approved ({getTabCount('approved')})
          </button>
          <button
            onClick={() => setActiveTab('denied')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === 'denied'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Denied ({getTabCount('denied')})
          </button>
        </div>
        
        {filteredBookings.length === 0 ? (
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
            <p className="text-gray-500">
              {activeTab === 'change-requests' ? 
               'Change requests will appear here when users request modifications' :
               'New requests will appear here when submitted'}
            </p>
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
                    <label className="block text-sm font-semibold text-gray-700">Total Price</label>
                    <p className="text-gray-900 text-lg font-bold">ETB {booking.price * booking.passengers}</p>
                  </div>
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
                  {booking.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleDecision(booking.id, "approved")}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-200"
                      >
                        Approve Booking
                      </button>
                      <button 
                        onClick={() => handleDecision(booking.id, "denied")}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-200"
                      >
                        Deny Booking
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
                    <div className="w-full text-center py-2">
                      <span className="text-green-600 font-semibold">
                        ✅ Approved
                      </span>
                    </div>
                  )}
                  
                  {(booking.status === 'denied' || booking.status === 'change_denied') && (
                    <div className="w-full text-center py-2">
                      <span className="text-red-600 font-semibold">
                        ❌ Denied
                      </span>
                    </div>
                  )}
                </div>

                {/* Change Request Info */}
                {booking.status === 'change_pending' && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 font-semibold">
                      🔄 Change Request - No Penalty
                    </p>
                    <p className="text-blue-600 text-sm">
                      User requested changes within 2-minute window
                    </p>
                  </div>
                )}

                {booking.status === 'change_requested' && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-orange-800 font-semibold">
                      ⚠️ Change Request - 10% Penalty
                    </p>
                    <p className="text-orange-600 text-sm">
                      User requested changes after 2-minute window
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Cashier;