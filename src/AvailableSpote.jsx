import { useLocation } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Spot from "./Spot";
import { BookingContext } from "./BookingContext";
import Naveigator from "./Header/Naveigator";
import { MapPin, Users, Armchair, Zap, Star, DollarSign, Eye } from "lucide-react";

function AvailableSpots() {
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [showPricing, setShowPricing] = useState(false);
  const [showRatings, setShowRatings] = useState(false);
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  const navigate = useNavigate();
  const { addBooking, bookingData, allBookings } = useContext(BookingContext);
  const location = useLocation();
  const { from, to, date, time, price, image, busImage, passengers = 1, busName } = location.state || {};

  const seatSelectionRef = useRef();

  const [passengerInfo, setPassengerInfo] = useState(
    Array.from({ length: passengers }, () => ({
      name: "",
      phone: "",
      seat: ""
    }))
  );

  // Generate enhanced seat layout with features
  const generateSeatLayout = () => {
    const seats = [];
    const occupiedSeats = availableSeats.length > 0 
      ? Array.from({length: 40 - availableSeats.length}, (_, i) => {
          const row = Math.floor(i / 4) + 1;
          const letters = ["A", "B", "C", "D"];
          const letter = letters[i % 4];
          return `${row}${letter}`;
        }).slice(0, 6)
      : ["1A", "2B", "3A", "4B", "6A", "7B"];
    
    const premiumSeats = ["1A", "1B", "1C", "1D", "8A", "8B", "8C", "8D"];
    const windowSeats = ["A", "D"];

    for (let row = 1; row <= 10; row++) {
      const rowSeats = ["A", "B", "C", "D"].map((letter) => {
        const seatId = `${row}${letter}`;
        const isWindow = windowSeats.includes(letter);
        const isPremium = premiumSeats.includes(seatId);
        const isOccupied = occupiedSeats.includes(seatId);

        return {
          id: seatId,
          row,
          position: letter,
          type: row <= 5 ? "lower" : "upper",
          isOccupied: isOccupied,
          isWindow,
          isPremium,
          price: price + (isWindow ? 5 : 0) + (isPremium ? 10 : 0),
          rating: 3.5 + Math.random() * 1.5,
          features: [
            ...(isWindow ? ["Window View"] : []),
            ...(isPremium ? ["Extra Legroom", "Premium Service"] : []),
            ...(row <= 2 ? ["Quick Exit"] : []),
            ...(letter === "B" || letter === "C" ? ["Aisle Access"] : []),
          ],
        };
      });
      seats.push(...rowSeats);
    }
    return seats;
  };

  const [seats] = useState(generateSeatLayout());

  // AI-powered seat recommendations
  useEffect(() => {
    const getRecommendations = () => {
      const availableSeatsList = seats.filter((seat) => !seat.isOccupied);
      const bestValue = availableSeatsList
        .filter((seat) => !seat.isPremium && seat.rating > 4.0)
        .slice(0, 3)
        .map((seat) => seat.id);
      setAiRecommendations(bestValue);
    };
    getRecommendations();
  }, [seats]);

  const handleSmartSelect = (type) => {
    const availableSeatsList = seats.filter((seat) => !seat.isOccupied);
    let recommendedSeats = [];

    switch (type) {
      case "best-value":
        recommendedSeats = availableSeatsList
          .filter((seat) => !seat.isPremium && seat.rating > 4.0)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, passengers);
        break;
      case "premium":
        recommendedSeats = availableSeatsList
          .filter((seat) => seat.isPremium)
          .slice(0, passengers);
        break;
      case "window":
        recommendedSeats = availableSeatsList
          .filter((seat) => seat.isWindow)
          .slice(0, passengers);
        break;
      case "group":
        recommendedSeats = findBestGroupSeating(availableSeatsList, passengers);
        break;
      case "cheapest":
        recommendedSeats = availableSeatsList
          .filter((seat) => !seat.isPremium)
          .sort((a, b) => a.price - b.price)
          .slice(0, passengers);
        break;
      case "recommend":
        recommendedSeats = aiRecommendations
          .map((id) => seats.find((s) => s.id === id))
          .filter(Boolean)
          .slice(0, passengers);
        break;
    }

    if (recommendedSeats.length > 0) {
      const newSelectedSeats = recommendedSeats.map((seat) => seat.id);
      setSelectedSeats(newSelectedSeats);
      
      // Update passenger info with selected seats
      const updatedPassengerInfo = passengerInfo.map((passenger, index) => ({
        ...passenger,
        seat: newSelectedSeats[index] || ""
      }));
      setPassengerInfo(updatedPassengerInfo);
    }
  };

  const findBestGroupSeating = (availableSeatsList, groupSize) => {
    const seatsByRow = availableSeatsList.reduce((acc, seat) => {
      if (!acc[seat.row]) acc[seat.row] = [];
      acc[seat.row].push(seat);
      return acc;
    }, {});

    for (const row in seatsByRow) {
      const rowSeats = seatsByRow[row];
      if (rowSeats.length >= groupSize) {
        return rowSeats.slice(0, groupSize);
      }
    }
    return availableSeatsList.slice(0, groupSize);
  };

  const handleSeatClick = (seatId) => {
    const seat = seats.find((s) => s.id === seatId);
    if (!seat || seat.isOccupied) return;

    let newSelectedSeats;
    if (selectedSeats.includes(seatId)) {
      newSelectedSeats = selectedSeats.filter((id) => id !== seatId);
    } else if (selectedSeats.length < passengers) {
      newSelectedSeats = [...selectedSeats, seatId];
    } else {
      return; // Cannot select more than passenger count
    }

    setSelectedSeats(newSelectedSeats);

    // Update passenger info with selected seats
    const updatedPassengerInfo = passengerInfo.map((passenger, index) => ({
      ...passenger,
      seat: newSelectedSeats[index] || ""
    }));
    setPassengerInfo(updatedPassengerInfo);
  };

  const getSeatStatus = (seat) => {
    if (seat.isOccupied) return "occupied";
    if (selectedSeats.includes(seat.id)) return "selected";
    if (aiRecommendations.includes(seat.id)) return "recommended";
    return "available";
  };

  const getSeatColor = (status, seat) => {
    const baseClasses = "transition-all duration-200 border-2 cursor-pointer";

    switch (status) {
      case "occupied":
        return `${baseClasses} bg-red-500 border-red-600 cursor-not-allowed text-white`;
      case "selected":
        return `${baseClasses} bg-blue-500 border-blue-600 text-white shadow-lg scale-105`;
      case "recommended":
        return `${baseClasses} bg-green-100 border-green-400 text-green-800 hover:bg-green-200`;
      case "available":
        const premiumClass = seat.isPremium
          ? "bg-purple-50 border-purple-200 hover:bg-purple-100"
          : "bg-gray-50 border-gray-200 hover:bg-gray-100";
        return `${baseClasses} ${premiumClass}`;
      default:
        return `${baseClasses} bg-gray-50 border-gray-200`;
    }
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = seats.find((s) => s.id === seatId);
      return total + (seat?.price || 0);
    }, 0);
  };

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
        return;
      }

      // Update selected seats array
      const newSelectedSeats = [...selectedSeats];
      const currentSeat = passengerInfo[index].seat;
      if (currentSeat) {
        const currentIndex = newSelectedSeats.indexOf(currentSeat);
        if (currentIndex > -1) {
          newSelectedSeats.splice(currentIndex, 1);
        }
      }
      if (value) {
        newSelectedSeats[index] = value;
      }
      setSelectedSeats(newSelectedSeats.filter(seat => seat));
    }

    setPassengerInfo(updatedPassengerInfo);
  };

  const handlePassengerInfoChange = (index, field, value) => {
    const updatedPassengerInfo = [...passengerInfo];
    updatedPassengerInfo[index][field] = value;
    setPassengerInfo(updatedPassengerInfo);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields are filled
    for (let i = 0; i < passengerInfo.length; i++) {
      if (!passengerInfo[i].name || !passengerInfo[i].phone || !passengerInfo[i].seat) {
        alert(`Please fill all information for passenger ${i + 1}`);
        return;
      }
    }

    const booking = {
      from,
      to,
      date,
      time,
      price: getTotalPrice(),
      bus: busName,
      passengers,
      passengerInfo: passengerInfo.map((p) => ({
        name: p.name,
        phone: p.phone,
        selected_spot: Number(p.seat.replace(/\D/g, '')),
      })),
    };

    console.log("Available seats:", availableSeats);
    console.log("Passenger Info:", passengerInfo);
    console.log("Booking Data:", booking);

    addBooking(booking);
    setBookingSubmitted(true);
    alert("Booking sent! Waiting for approval. You can track the status in 'Manage Booking'.");
  };

  const renderSeatMap = () => (
    <div className="space-y-6">
      {/* Smart Selection Tools */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-blue-500" />
          <h3 className="text-xl font-bold text-gray-900">Smart Seat Selection</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
          <button 
            onClick={() => handleSmartSelect("best-value")}
            className="flex items-center justify-center gap-1 p-3 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 text-sm font-medium"
          >
            <Star className="h-3 w-3 text-blue-500" />
            Best Value
          </button>
          <button 
            onClick={() => handleSmartSelect("premium")}
            className="flex items-center justify-center gap-1 p-3 border border-gray-200 rounded-xl hover:bg-purple-50 hover:border-purple-200 transition-all duration-200 text-sm font-medium"
          >
            <DollarSign className="h-3 w-3 text-purple-500" />
            Premium
          </button>
          <button 
            onClick={() => handleSmartSelect("window")}
            className="flex items-center justify-center gap-1 p-3 border border-gray-200 rounded-xl hover:bg-green-50 hover:border-green-200 transition-all duration-200 text-sm font-medium"
          >
            <Eye className="h-3 w-3 text-green-500" />
            Window
          </button>
          <button 
            onClick={() => handleSmartSelect("group")}
            className="flex items-center justify-center gap-1 p-3 border border-gray-200 rounded-xl hover:bg-orange-50 hover:border-orange-200 transition-all duration-200 text-sm font-medium"
          >
            <Users className="h-3 w-3 text-orange-500" />
            Together
          </button>
          <button 
            onClick={() => handleSmartSelect("cheapest")}
            className="flex items-center justify-center gap-1 p-3 border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-200 transition-all duration-200 text-sm font-medium"
          >
            <DollarSign className="h-3 w-3 text-red-500" />
            Cheapest
          </button>
          <button 
            onClick={() => handleSmartSelect("recommend")}
            className="flex items-center justify-center gap-1 p-3 border border-gray-200 rounded-xl hover:bg-yellow-50 hover:border-yellow-200 transition-all duration-200 text-sm font-medium"
          >
            <Star className="h-3 w-3 text-yellow-500" />
            Recommended
          </button>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="show-pricing"
              checked={showPricing}
              onChange={(e) => setShowPricing(e.target.checked)}
              className="w-4 h-4 text-blue-500 rounded focus:ring-blue-200"
            />
            <label htmlFor="show-pricing" className="font-medium">Show Pricing</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="show-ratings"
              checked={showRatings}
              onChange={(e) => setShowRatings(e.target.checked)}
              className="w-4 h-4 text-blue-500 rounded focus:ring-blue-200"
            />
            <label htmlFor="show-ratings" className="font-medium">Show Ratings</label>
          </div>
        </div>
      </div>

      {/* Enhanced Seat Map */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Armchair className="h-5 w-5 text-gray-700" />
            <h3 className="text-xl font-bold text-gray-900">
              Select Seats ({selectedSeats.length}/{passengers})
            </h3>
            {selectedSeats.length > 0 && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                Total: ETB {getTotalPrice()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-50 rounded border-2 border-gray-200"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 rounded border-2 border-green-400"></div>
              <span>Recommended</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded border-2 border-blue-600"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded border-2 border-red-600"></div>
              <span>Occupied</span>
            </div>
          </div>
        </div>

        {/* Bus Layout */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <div className="text-center mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
              🚌 Driver
            </div>
          </div>

          {/* Lower Deck */}
          <div className="mb-8">
            <h4 className="text-sm font-semibold mb-4 text-center text-gray-700">Lower Deck</h4>
            <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
              {seats
                .filter((seat) => seat.type === "lower")
                .map((seat) => {
                  const status = getSeatStatus(seat);
                  return (
                    <div
                      key={seat.id}
                      className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center text-xs font-medium relative ${getSeatColor(status, seat)}`}
                      onClick={() => handleSeatClick(seat.id)}
                      onMouseEnter={() => setHoveredSeat(seat.id)}
                      onMouseLeave={() => setHoveredSeat(null)}
                      title={`Seat ${seat.id} - ETB ${seat.price} ${seat.features.join(", ")}`}
                    >
                      <span className="font-bold">{seat.id}</span>
                      {showPricing && <span className="text-[10px] opacity-75">ETB {seat.price}</span>}
                      {showRatings && (
                        <div className="flex items-center text-[10px]">
                          <Star className="h-2 w-2 text-yellow-400 mr-0.5" />
                          <span>{seat.rating.toFixed(1)}</span>
                        </div>
                      )}
                      {seat.isPremium && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full flex items-center justify-center">
                          <Star className="h-2 w-2 text-white" />
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Upper Deck */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-center text-gray-700">Upper Deck</h4>
            <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
              {seats
                .filter((seat) => seat.type === "upper")
                .map((seat) => {
                  const status = getSeatStatus(seat);
                  return (
                    <div
                      key={seat.id}
                      className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center text-xs font-medium relative ${getSeatColor(status, seat)}`}
                      onClick={() => handleSeatClick(seat.id)}
                      onMouseEnter={() => setHoveredSeat(seat.id)}
                      onMouseLeave={() => setHoveredSeat(null)}
                      title={`Seat ${seat.id} - ETB ${seat.price} ${seat.features.join(", ")}`}
                    >
                      <span className="font-bold">{seat.id}</span>
                      {showPricing && <span className="text-[10px] opacity-75">ETB {seat.price}</span>}
                      {showRatings && (
                        <div className="flex items-center text-[10px]">
                          <Star className="h-2 w-2 text-yellow-400 mr-0.5" />
                          <span>{seat.rating.toFixed(1)}</span>
                        </div>
                      )}
                      {seat.isPremium && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full flex items-center justify-center">
                          <Star className="h-2 w-2 text-white" />
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Seat Details on Hover */}
        {hoveredSeat && (
          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            {(() => {
              const seat = seats.find((s) => s.id === hoveredSeat);
              if (!seat) return null;

              return (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Seat {seat.id}</h4>
                    <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                      ETB {seat.price}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {seat.features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-white text-gray-700 px-2 py-1 rounded-lg text-xs font-medium border border-gray-200"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-gray-600">{seat.rating.toFixed(1)} rating</span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Selected Seats Summary */}
        {selectedSeats.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Selected Seats:</span>
                <div className="flex gap-2">
                  {selectedSeats.map((seatId) => (
                    <span
                      key={seatId}
                      className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {seatId}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {selectedSeats.length} seat{selectedSeats.length !== 1 ? "s" : ""} selected
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Complete Your Booking
            </h1>
            <p className="text-xl text-gray-600 max-w-6xl mx-auto">
              Select your seats and enter passenger details to finalize your journey from {from} to {to}
            </p>
          </div>

          {/* Trip Details Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12 border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Journey Type Badge */}
              <div className="lg:col-span-12 mb-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold">
                  One Way Journey
                </div>
              </div>

              {/* Route */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Route
                </label>
                <div className="relative">
                  <div className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl bg-gray-50">
                    <span className="text-lg font-semibold text-gray-900">{from} → {to}</span>
                  </div>
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
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

              {/* Bus Information */}
              <div className="lg:col-span-3">
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
              <div className="lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Total
                </label>
                <div className="relative">
                  <div className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl bg-gray-50">
                    <span className="text-sm font-medium text-gray-900">
                      ETB {getTotalPrice() || price * passengers} ({passengers} {passengers === 1 ? 'passenger' : 'passengers'})
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
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Your Selected Bus: {busName}
            </h2>
            <div className="flex justify-center">
              <div className="relative w-full max-w-2xl h-64 overflow-hidden rounded-2xl">
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
                  <p className="text-lg font-semibold">{busName}</p>
                  <p className="text-sm">Premium Comfort Bus</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Seat Selection Section */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Select Your Seats
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Choose {passengers} seat{passengers > 1 ? 's' : ''} for your journey. Available seats are shown in green.
            </p>
            {renderSeatMap()}
          </div>

          {/* Passenger Information Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Passenger Information
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Please enter details for all {passengers} passenger{passengers > 1 ? 's' : ''}
            </p>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {passengerInfo.map((passenger, index) => (
                  <div key={index} className="border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                        {index + 1}
                      </span>
                      Passenger {index + 1}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                            placeholder="Enter phone number"
                            required
                          />
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
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
                            {seats
                              .filter(seat => !seat.isOccupied)
                              .map(seat => {
                                const isTaken = passengerInfo.some((p, i) => p.seat === seat.id && i !== index);
                                return (
                                  <option key={seat.id} value={seat.id} disabled={isTaken}>
                                    {seat.id} {isTaken ? '(Taken)' : ''}
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
              <div className="flex justify-center mt-8">
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-12 py-4 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Confirm Booking - ETB {getTotalPrice() || price * passengers}
                </button>
              </div>
            </form>
          </div>

          {/* Success Message */}
          {bookingSubmitted && (
            <div className="fixed top-4 right-4 bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-slide-in">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="font-semibold">Booking Submitted Successfully!</span>
                  <p className="text-sm opacity-90">Track your booking status in 'Manage Booking'</p>
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