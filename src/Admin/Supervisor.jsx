import { useContext, useState, useEffect } from "react";
import { BookingContext } from "../BookingContext";
import { RefundContext } from "../Context/RefundContext";

function Supervisor() {
  const { allBookings, updateBookingStatus } = useContext(BookingContext);
  const { allRefunds, updateRefundStatus } = useContext(RefundContext);
  const [bookings, setBookings] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [activeTab, setActiveTab] = useState('change-requests');

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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Supervisor Dashboard</h1>
          <p className="text-xl text-gray-600">Manage change requests and refund approvals</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 justify-center flex-wrap">
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
            onClick={() => setActiveTab('refunds-pending')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === 'refunds-pending'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Pending Refunds ({getTabCount('refunds-pending')})
          </button>
          <button
            onClick={() => setActiveTab('refunds-approved')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === 'refunds-approved'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Approved Refunds ({getTabCount('refunds-approved')})
          </button>
          <button
            onClick={() => setActiveTab('refunds-denied')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === 'refunds-denied'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Denied Refunds ({getTabCount('refunds-denied')})
          </button>
        </div>

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
      </div>
    </div>
  );
}

export default Supervisor;