import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Naveigator from "./Header/Naveigator";

function TypeOfBuss() {
  const location = useLocation();
  const { from, to, date, time, image, returnDate, returnTime, routes, isRoundTrip, isMultiCity } = location.state || {};

  const [selectedBus, setSelectedBus] = useState(null);
  const [passengers, setPassengers] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const types = [
    {
      id: 1,
      name: "Selam Bus",
      description: "Comfortable Seating: Buses feature 2x2 reclining seats with ample legroom for a relaxing journey.",
      print: 800,
      image: "https://image.made-in-china.com/202f0j00NnUhFpCalKqc/Cheap-Used-Yellow-Yutong-Bus-Car-6122-and-40-Seats-Used-Coach-Tourist-Bus.webp",
      features: ["WiFi", "AC", "Entertainment", "USB Charging", "Snack Service"]
    },
    {
      id: 2,
      name: "Zemen Bus",
      description: "Premium comfort with extra legroom and premium amenities for business travelers.",
      print: 900,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9fQLF3FWfBaB9A5o_H6Jts7X_hMN9K0LxPw&s",
      features: ["WiFi", "AC", "Premium Seats", "USB Charging", "Meal Service"]
    },
    {
      id: 3,
      name: "Sky Bus",
      description: "Economical option with comfortable seating and essential amenities for budget travelers.",
      print: 750,
      image: "https://img.12go.asia/0/fit/0/320/ce/0/plain/s3://12go-web-static/static/images/operator/13152/class/29-outside.jpg",
      features: ["WiFi", "AC", "Comfortable", "Restroom", "Water Service"]
    },
    {
      id: 4,
      name: "Golden Bus",
      description: "Family-friendly buses with spacious seating and entertainment options for all ages.",
      print: 630,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0sYLsr8S0vi9NJMXBuvBd1vMMSnWMuJNxIA&s",
      features: ["WiFi", "AC", "Family Seating", "Entertainment", "Snack Service"]
    },
    {
      id: 5,
      name: "Liyu Bus",
      description: "Luxury travel experience with premium amenities and exceptional service quality.",
      print: 850,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMrj-LwqW97gsz0WGOovX2huKspBl_apaFpA&s",
      features: ["WiFi", "AC", "Luxury Seats", "Gourmet Meals", "Personal Service"]
    },
  ];

  // Filter buses based on search term
  const filteredBuses = types.filter(bus =>
    bus.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBusSelect = (bus) => {
    setSelectedBus(bus);
  };

  const handlePassengerChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setPassengers(value);
  };

  const calculateDiscountPrice = (price) => {
    return (price - 5) * passengers;
  };

  const getJourneyType = () => {
    if (isMultiCity) return "Multi-City Journey";
    if (isRoundTrip) return "Round Trip";
    return "One Way";
  };

  const getRouteDescription = () => {
    if (isMultiCity && routes) {
      return `${routes[0].from} → ${routes[routes.length - 1].to} (${routes.length} stops)`;
    }
    if (isRoundTrip) {
      return `${from} ↔ ${to}`;
    }
    return `${from} → ${to}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">


      {/* Hero Section */}
      <section className="relative py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Select Your Bus Type
            </h1>
            <p className="text-xl text-gray-600 max-w-6xl mx-auto">
              Choose the perfect bus for your {getJourneyType().toLowerCase()}. Compare amenities and prices to find your ideal travel experience.
            </p>
          </div>

          {/* Journey Details Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12 border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

              {/* Journey Type Badge */}
              <div className="lg:col-span-12 mb-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold">
                  {getJourneyType()}
                </div>
              </div>

              {/* Route Description */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Route
                </label>
                <div className="relative">
                  <div className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl bg-gray-50">
                    <span className="text-lg font-semibold text-gray-900">{getRouteDescription()}</span>
                  </div>
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Departure Details */}
              <div className="lg:col-span-3">
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

              {/* Return Details (if round trip) */}
              {isRoundTrip && returnDate && (
                <div className="lg:col-span-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    Return
                  </label>
                  <div className="relative">
                    <div className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl bg-gray-50">
                      <span className="text-sm font-medium text-gray-900">{returnDate} at {returnTime}</span>
                    </div>
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Passenger Selection */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Passengers
                </label>
                <div className="relative">
                  <div className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-xl p-1">
                    <button
                      onClick={() => setPassengers(Math.max(1, passengers - 1))}
                      className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-400 text-white 
             rounded-lg flex items-center justify-center 
             hover:from-pink-300 hover:to-pink-500 
             transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>

                    <input
                      type="number"
                      min="1"
                      value={passengers}
                      onChange={handlePassengerChange}
                      className="w-20 text-center p-3 border-2 border-blue-200 rounded-lg 
             font-bold text-lg text-gray-900 
             focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
             transition-all duration-200"
                    />

                    <button
                      onClick={() => setPassengers(passengers + 1)}
                      className="w-12 h-12 bg-gradient-to-r from-blue-800 to-blue-500 text-white 
             rounded-lg flex items-center justify-center 
             hover:from-blue-400 hover:to-blue-600 
             transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>


                  </div>
                </div>
              </div>

            </div>

            {/* Search Bar */}
            <div className="mt-8 max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search buses by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-4 pl-12 pr-4 border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bus Selection Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Available Bus Types
            </h2>
            <p className="text-gray-600">
              {filteredBuses.length} bus{filteredBuses.length !== 1 ? 'es' : ''} found • Prices for {passengers} {passengers === 1 ? 'passenger' : 'passengers'}
            </p>
          </div>

          {/* Bus Grid */}
          {filteredBuses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🚌</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No buses found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBuses.map((bus) => (
                <div
                  key={bus.id}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${selectedBus?.id === bus.id ? 'border-blue-500' : 'border-gray-100'
                    } overflow-hidden`}
                >
                  <div className="relative">
                    <img
                      src={bus.image}
                      alt={bus.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/800x200?text=Bus+Image+Not+Available";
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {bus.name}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {bus.name}
                    </h3>

                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {bus.description}
                    </p>

                    {/* Features */}
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {bus.features.map((feature, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-2xl font-bold text-green-600">
                          ETB {calculateDiscountPrice(bus.print).toLocaleString()}
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          ETB {(bus.print * passengers).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        ETB {bus.print - 5} per passenger
                      </p>
                    </div>

                    {/* Select Button */}
                    <Link
                      to='/AvailableSpots'
                      state={{
                        from,
                        to,
                        date,
                        time,
                        image,
                        returnDate,
                        returnTime,
                        routes,
                        isRoundTrip,
                        isMultiCity,
                        price: calculateDiscountPrice(bus.print),
                        busImage: bus.image,
                        passengers,
                        busName: bus.name,
                      }}
                    >
                      <button
                        className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${selectedBus?.id === bus.id
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                          }`}
                        onClick={() => handleBusSelect(bus)}
                      >
                        {selectedBus?.id === bus.id ? 'Selected' : 'Select Bus'}
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Selection Summary */}
          {selectedBus && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
              <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Selected: {selectedBus.name}
                    </h3>
                    <p className="text-gray-600">
                      Total: ETB {calculateDiscountPrice(selectedBus.print).toLocaleString()} for {passengers} {passengers === 1 ? 'passenger' : 'passengers'}
                    </p>
                  </div>
                  <Link
                    to='/AvailableSpots'
                    state={{
                      from,
                      to,
                      date,
                      time,
                      image,
                      returnDate,
                      returnTime,
                      routes,
                      isRoundTrip,
                      isMultiCity,
                      price: calculateDiscountPrice(selectedBus.print),
                      busImage: selectedBus.image,
                      passengers,
                      busName: selectedBus.name,
                    }}
                  >
                    <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-200">
                      Continue to Seat Selection
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Additional Styles */}
      <style jsx>{`
        select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 1rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
          -webkit-print-color-adjust: exact;
        }
        
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}

export default TypeOfBuss;