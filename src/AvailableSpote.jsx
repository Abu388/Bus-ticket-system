import { useLocation } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Spot from "./Spot";
import { BookingContext } from "./BookingContext";
import Naveigator from "./Header/Naveigator";

function AvailableSpots() {
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [availableSeats, setAvailableSeats] = useState([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]);
  const navigate = useNavigate();
  const { addBooking, bookingData, allBookings } = useContext(BookingContext);
  const location = useLocation();
  const { from, to, date, time, price, image, busImage, passengers = 1, busName } = location.state || {};

  const [passengerInfo, setPassengerInfo] = useState(
    Array.from({ length: passengers }, () => ({
      name: "",
      phone: "",
      seat: "",
      pickup: "",
      dropoff: ""
    }))
  );

  // Common pickup and drop-off towns in Ethiopian context
  const ethiopianTowns = [
    "Addis Ababa",
    "Adama",
    "Bahir Dar",
    "Gondar",
    "Hawassa",
    "Jimma",
    "Mekelle",
    "Dire Dawa",
    "Dessie",
    "Debre Markos"
  ];

  const handlePassengerInfoSet = (index, field, value) => {
    const updatedPassengerInfo = [...passengerInfo];
    updatedPassengerInfo[index][field] = value;

    if (field === "seat") {
      const seatCounts = updatedPassengerInfo.reduce((acc, p) => {
        if (p.seat) acc[p.seat] = (acc[p.seat] || 0) + 1;
        return acc;
      }, {});
      if (seatCounts[value] > 1) {
        alert(`Seat ${value} is already selected. Please choose a different seat.`);
        updatedPassengerInfo[index][field] = "";
      }
    }

    setPassengerInfo(updatedPassengerInfo);
  };

  const handlePassengerInfoChange = (index, field, value) => {
    const updatedPassengerInfo = [...passengerInfo];
    updatedPassengerInfo[index][field] = value;
    setPassengerInfo(updatedPassengerInfo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields are filled
    for (let i = 0; i < passengerInfo.length; i++) {
      if (!passengerInfo[i].name || !passengerInfo[i].phone || !passengerInfo[i].seat || 
          !passengerInfo[i].pickup || !passengerInfo[i].dropoff) {
        alert(`Please fill all information for passenger ${i + 1}`);
        return;
      }
    }

    const booking = {
      from,
      to,
      date,
      time,
      price,
      bus: busName,
      passengers,
      passengerInfo: passengerInfo.map((p) => ({
        name: p.name,
        phone: p.phone,
        selected_spot: Number(p.seat),
        pickup: p.pickup,
        dropoff: p.dropoff
      })),
    };

    console.log("Available seats:", availableSeats);
    console.log("Passenger Info:", passengerInfo);
    console.log("Booking Data:", booking);
    setBookingSubmitted(true);
    addBooking(booking);
    
    alert("Booking sent! Waiting for approval. You can track the status in 'Manage Booking'.");
    try {
      const response = await fetch(
        "https://busbooking-jvft.onrender.com/api/bookings",
        {
          method: "POST",
          headers: {
            Authorization:
              "Bearer E0IFVhX3gEo8mmVGXbBFyurQ3NXRGBqbijYqicq9929acd07",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            passengers,
            passengerInfo: passengerInfo.map(p => ({
              name: p.name,
              phone: p.phone,
              selected_spot: Number(p.seat),
              pickup: p.pickup,
              dropoff: p.dropoff
            }))
          }),
        }
      );

      const result = await response.json();
      console.log("Button click result:", result);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-8 px-4 sm:py-12 sm:px-6 lg:py-16 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Complete Your Booking
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto">
              Select your seats and enter passenger details to finalize your journey from {from} to {to}
            </p>
          </div>

          {/* Trip Details Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 mb-8 sm:mb-12 border border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-center">
              {/* Journey Type Badge */}
              <div className="sm:col-span-2 lg:col-span-4 mb-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold">
                  Town-to-Town Journey
                </div>
              </div>

              {/* Route */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Route
                </label>
                <div className="relative">
                  <div className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl bg-gray-50">
                    <span className="text-sm sm:text-lg font-semibold text-gray-900">{from} → {to}</span>
                  </div>
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Departure
                </label>
                <div className="relative">
                  <div className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl bg-gray-50">
                    <span className="text-sm font-medium text-gray-900">{date} at {time}</span>
                  </div>
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bus Information */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Bus Type
                </label>
                <div className="relative">
                  <div className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl bg-gray-50">
                    <span className="text-sm font-medium text-gray-900">{busName}</span>
                  </div>
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Price & Passengers */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Total
                </label>
                <div className="relative">
                  <div className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl bg-gray-50">
                    <span className="text-sm font-medium text-gray-900">
                      ETB {price * passengers} ({passengers} {passengers === 1 ? 'passenger' : 'passengers'})
                    </span>
                  </div>
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bus Image Section */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 mb-8 sm:mb-12 border border-gray-100">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
              Your Selected Bus: {busName}
            </h2>
            <div className="flex justify-center">
              <div className="relative w-full max-w-2xl h-48 sm:h-64 overflow-hidden rounded-2xl">
                <img
                  src={busImage}
                  alt={busName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/800x200?text=Bus+Image+Not+Available";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-base sm:text-lg font-semibold">{busName}</p>
                  <p className="text-sm">Premium Comfort Bus</p>
                </div>
              </div>
            </div>
          </div>

          {/* Seat Selection Section */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 mb-8 sm:mb-12 border border-gray-100">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
              Select Your Seats
            </h2>
            <p className="text-gray-600 text-center mb-8 text-sm sm:text-base">
              Choose {passengers} seat{passengers > 1 ? 's' : ''} for your journey. Available seats are shown in blue.
            </p>
            <Spot onSeatsFetched={setAvailableSeats} />
          </div>

          {/* Passenger Information Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
              Passenger Information
            </h2>
            <p className="text-gray-600 text-center mb-8 text-sm sm:text-base">
              Please enter details for all {passengers} passenger{passengers > 1 ? 's' : ''}
            </p>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {passengerInfo.map((passenger, index) => (
                  <div key={index} className="border-2 border-gray-200 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                        {index + 1}
                      </span>
                      Passenger {index + 1}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          Full Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={passenger.name}
                            onChange={(e) => handlePassengerInfoChange(index, 'name', e.target.value)}
                            className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                            placeholder="Enter full name"
                            required
                          />
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Phone Number
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            value={passenger.phone}
                            onChange={(e) => handlePassengerInfoChange(index, 'phone', e.target.value)}
                            className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                            placeholder="Enter phone number (e.g., +2519...)"
                            required
                          />
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Pickup Location */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Pickup Town
                        </label>
                        <div className="relative">
                          <select
                            value={passenger.pickup}
                            onChange={(e) => handlePassengerInfoSet(index, 'pickup', e.target.value)}
                            className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 appearance-none bg-white"
                            required
                          >
                            <option value="">Select Pickup Town</option>
                            {ethiopianTowns.filter(town => town !== to).map(town => (
                              <option key={town} value={town}>
                                {town}
                              </option>
                            ))}
                          </select>
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314  Bas1z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Drop-off Location */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                          Drop-off Town
                        </label>
                        <div className="relative">
                          <select
                            value={passenger.dropoff}
                            onChange={(e) => handlePassengerInfoSet(index, 'dropoff', e.target.value)}
                            className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200 appearance-none bg-white"
                            required
                          >
                            <option value="">Select Drop-off Town</option>
                            {ethiopianTowns.filter(town => town !== from).map(town => (
                              <option key={town} value={town}>
                                {town}
                              </option>
                            ))}
                          </select>
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 Pill 4-4.243a8 8 0 1111.314 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Seat Selection */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          Seat Preference
                        </label>
                        <div className="relative">
                          <select
                            value={passenger.seat}
                            onChange={(e) => handlePassengerInfoSet(index, 'seat', e.target.value)}
                            className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 appearance-none bg-white"
                            required
                          >
                            <option value="">Select Seat</option>
                            {availableSeats.map(seat => {
                              const isTaken = passengerInfo.some((p, i) => p.seat === seat && i !== index);
                              return (
                                <option key={seat} value={seat} disabled={isTaken}>
                                  {seat} {isTaken ? '(Taken)' : ''}
                                </option>
                              );
                            })}
                          </select>
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center mt-6 sm:mt-8">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>

          {/* Success Message */}
          {bookingSubmitted && (
            <div className="fixed top-4 right-4 bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-2xl z-50 animate-slide-in">
              <div className="flex items-center gap-3">
                <svg className="w-5 sm:w-6 h-5 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="font-semibold text-sm sm:text-base">Booking Submitted Successfully!</span>
                  <p className="text-xs sm:text-sm opacity-90">Track your booking status in 'Manage Booking'</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Additional Styles */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 1rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
          -webkit-print-color-adjust: exact;
        }
      `}</style>
    </div>
  );
}

export default AvailableSpots;