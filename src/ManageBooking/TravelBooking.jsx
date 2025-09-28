import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookingContext } from "../BookingContext";

const TravelBooking = () => {
  const { allBookings, bookingData } = useContext(BookingContext);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  // Check for status updates
  useEffect(() => {
    // Check if our current booking has been updated in the allBookings list
    if (bookingData && bookingData.id && allBookings) {
      const updatedBooking = allBookings.find(b => b.id === bookingData.id);
      if (updatedBooking && updatedBooking.status !== bookingData.status) {
        // Show alert if status changed
        if (updatedBooking.status === 'approved') {
          alert("Your booking has been approved! 🎉");
        } else if (updatedBooking.status === 'denied') {
          alert("Your booking has been denied. Please contact support for more information.");
        }
      }
    }
  }, [allBookings, bookingData, lastUpdated]);

  // Set up interval to check for status updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(Date.now());
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Check if there's any booking data
  useEffect(() => {
    if (bookingData) {
      setBookingSubmitted(true);
    }
  }, [bookingData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Your Bookings
            </h1>
            <p className="text-xl text-gray-600 max-w-6xl mx-auto">
              Track and manage all your bus bookings in one place
            </p>
          </div>

          {/* Booking Status Display */}
          {bookingData ? (
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Current Booking Status
              </h2>
              
              <div className={`p-6 rounded-2xl border-2 ${
                bookingData.status === 'approved' ? 'bg-green-50 border-green-200' :
                bookingData.status === 'denied' ? 'bg-red-50 border-red-200' : 
                'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Booking #{bookingData.id}
                    </h3>
                    <p className="text-gray-600">
                      {bookingData.from} → {bookingData.to} • {bookingData.date} at {bookingData.time}
                    </p>
                  </div>
                  
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${
                    bookingData.status === 'approved' ? 'text-green-600 bg-green-100 border-green-200' :
                    bookingData.status === 'denied' ? 'text-red-600 bg-red-100 border-red-200' : 
                    'text-yellow-600 bg-yellow-100 border-yellow-200'
                  }`}>
                    {bookingData.status === 'approved' ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : bookingData.status === 'denied' ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    <span className="font-semibold capitalize text-lg">
                      {bookingData.status || 'pending'}
                    </span>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Route
                      </label>
                      <p className="text-gray-900 text-lg">{bookingData.from} → {bookingData.to}</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Date & Time
                      </label>
                      <p className="text-gray-900">{bookingData.date} at {bookingData.time}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Bus Type
                      </label>
                      <p className="text-gray-900">{bookingData.bus}</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Passengers
                      </label>
                      <p className="text-gray-900">{bookingData.passengers} person(s)</p>
                    </div>
                  </div>
                </div>

                {/* Passenger Details */}
                {bookingData.passengerInfo && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Passenger Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {bookingData.passengerInfo.map((passenger, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl border border-gray-200">
                          <h5 className="font-semibold text-gray-900 mb-2">Passenger {index + 1}</h5>
                          <p className="text-gray-700">Name: {passenger.name}</p>
                          <p className="text-gray-700">Phone: {passenger.phone}</p>
                          <p className="text-gray-700">Seat: {passenger.selected_spot}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status Messages */}
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-blue-800 font-semibold text-lg">
                        {bookingData.status === 'approved' 
                          ? 'Your booking has been approved! 🎉' 
                          : bookingData.status === 'denied' 
                          ? 'Your booking has been denied' 
                          : 'Your booking is under review'}
                      </p>
                      <p className="text-blue-600 mt-1">
                        {bookingData.status === 'approved' 
                          ? 'Please proceed to payment at the counter. Show your QR code and ticket for verification.' 
                          : bookingData.status === 'denied' 
                          ? 'Please contact customer service for more information.' 
                          : 'Our team will review your booking and update the status soon.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Approved Booking Content */}
                {bookingData.status === 'approved' && (
                  <div className="mt-6 text-center">
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-6 mb-6">
                      <div className="transform transition-all duration-300 hover:scale-105 cursor-pointer">
                        <img
                          src="data:image/png;base64,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"
                          alt="qr code"
                          className="w-48 h-48 object-cover rounded-2xl shadow-2xl mx-auto"
                        />
                        <p className="text-gray-600 mt-2">Scan QR Code</p>
                      </div>
                      
                      <div className="transform transition-all duration-300 hover:scale-105 cursor-pointer">
                        <img
                          src="https://cdn.vectorstock.com/i/500p/85/19/public-bus-ticket-icon-vector-32688519.jpg"
                          alt="bus ticket"
                          className="w-64 h-48 object-cover rounded-2xl shadow-2xl mx-auto"
                        />
                        <p className="text-gray-600 mt-2">Your Ticket</p>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Ticket No: 567421</h3>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">🚌</div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">No Active Bookings</h3>
              <p className="text-gray-500 mb-6">You haven't made any bookings yet.</p>
              <Link 
                to="/ticket" 
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-semibold text-lg"
              >
                Book Your Trip
              </Link>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">New Booking</h4>
                <p className="text-gray-600 mb-4">Book a new bus trip</p>
                <Link 
                  to="/ticket" 
                  className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-semibold"
                >
                  Book Now
                </Link>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Refresh Status</h4>
                <p className="text-gray-600 mb-4">Check for latest updates</p>
                <button 
                  onClick={() => setLastUpdated(Date.now())}
                  className="inline-block bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-200 font-semibold"
                >
                  Refresh
                </button>
              </div>

              <div className="text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Request Refund</h4>
                <p className="text-gray-600 mb-4">Submit a refund request</p>
                <Link 
                  to="/refund" 
                  className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-semibold"
                >
                  Refund
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TravelBooking;