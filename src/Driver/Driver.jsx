import React from "react";
import { Star } from "lucide-react"; // only if you are using Star icons

const Driver = () => {
  const seats = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    type: i < 20 ? "lower" : "upper", // first 20 = lower deck, rest = upper
    price: 150,
    rating: 4.3,
    features: ["Window"],
    isPremium: i % 10 === 0,
  }));

  const getSeatColor = () => "bg-red-500 text-white"; // simplified for now
  const getSeatStatus = () => "available"; // dummy for now
  const handleSeatClick = (id) => alert(`Seat ${id} clicked`);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-10">
      {/* Bus Layout */}
            {/* Bus Info */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Selam Bus</h2>
        
        <div className="space-y-3 text-gray-700 text-sm">
          <p>
            <span className="font-semibold">From:</span>{" "}
            Hawassa, University Main Campus
          </p>
          <p>
            <span className="font-semibold">To:</span>{" "}
            Addis Ababa
          </p>
          <p>
            <span className="font-semibold">Departure:</span>{" "}
            2024-06-20T08:00
          </p>
          <p>
            <span className="font-semibold">Arrival:</span>{" "}
            2024-06-20T12:00
          </p>
          <p>
            <span className="font-semibold">Tag Number:</span>{" "}
            ABC1234
          </p>
          <p className="text-red-600 font-medium">All seats are full</p>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-md max-w-2xl w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
            🚌 Driver
          </div>
        </div>

        {/* Lower Deck */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold mb-4 text-center text-gray-700">
            Lower Deck
          </h4>
          <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
            {seats
              .filter((seat) => seat.type === "lower")
              .map((seat) => (
                <div
                  key={seat.id}
                  className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center text-xs font-medium relative ${getSeatColor()}`}
                  onClick={() => handleSeatClick(seat.id)}
                  title={`Seat ${seat.id} - ETB ${seat.price} ${seat.features.join(", ")}`}
                >
                  <span className="font-bold">{seat.id}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Upper Deck */}
        <div>
          <h4 className="text-sm font-semibold mb-4 text-center text-gray-700">
            Upper Deck
          </h4>
          <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
            {seats
              .filter((seat) => seat.type === "upper")
              .map((seat) => (
                <div
                  key={seat.id}
                  className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center text-xs font-medium relative ${getSeatColor()}`}
                  onClick={() => handleSeatClick(seat.id)}
                  title={`Seat ${seat.id} - ETB ${seat.price} ${seat.features.join(", ")}`}
                >
                  <span className="font-bold">{seat.id}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Download button (inside card, aligned center) */}
        <div className="text-center mt-8">
          <a href="/travelers.csv" download={"travelers.csv"}>
            <button 
                
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-12 py-4 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
              Download Travelers File
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Driver;
