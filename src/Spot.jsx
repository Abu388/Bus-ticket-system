import React, { useEffect, useState } from "react";

function Spot({ onSeatsFetched }) {
  const [availableSeats, setAvailableSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seats, setSeats] = useState([]);

  // Total seats in bus
  const totalSeats = 50;

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const res = await fetch(
          "https://busbooking-jvft.onrender.com/api/trips/1/available-seats",
          {
            method: "GET",
            headers: {
              Authorization:
                "Bearer an86Tmrg4d8G5RZqBJcyvSAiY6WvUywz1dV3Yxp511775974",
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setSeats(data);
        setAvailableSeats(data);

        if (onSeatsFetched) {
          onSeatsFetched(data);
        }

        console.log("Seats fetched:", data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, []);

  if (loading)
    return <p className="text-blue-500 text-center">Loading available seats...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  // Split seats into lower (1-25) and upper (26-50)
  const lowerSeats = Array.from({ length: totalSeats / 2 }, (_, i) => i + 1);
  const upperSeats = Array.from(
    { length: totalSeats / 2 },
    (_, i) => i + 1 + totalSeats / 2
  );

  const getSeatColor = (seatNumber) => {
    return availableSeats.includes(seatNumber)
      ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
      : "bg-red-500 cursor-not-allowed opacity-7";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-10">
      {/* Bus Layout */}
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
          <div className="grid grid-cols-5 gap-3 max-w-md mx-auto">
            {lowerSeats.map((seatNumber) => (
              <div
                key={seatNumber}
                className={`w-14 h-14 rounded-lg flex items-center justify-center text-sm font-bold text-white transition ${getSeatColor(
                  seatNumber
                )}`}
                title={`Seat ${seatNumber}`}
              >
                {seatNumber}
              </div>
            ))}
          </div>
        </div>

        {/* Upper Deck */}
        <div>
          <h4 className="text-sm font-semibold mb-4 text-center text-gray-700">
            Upper Deck
          </h4>
          <div className="grid grid-cols-5 gap-3 max-w-md mx-auto">
            {upperSeats.map((seatNumber) => (
              <div
                key={seatNumber}
                className={`w-14 h-14 rounded-lg flex items-center justify-center text-sm font-bold text-white transition ${getSeatColor(
                  seatNumber
                )}`}
                title={`Seat ${seatNumber}`}
              >
                {seatNumber}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Spot;
