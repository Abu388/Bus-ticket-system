import React, { useEffect, useState } from "react";

function Spot({onSeatsFetched}) {
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

      // ⚡ This is the key step
      if (onSeatsFetched) {
        onSeatsFetched(data); // send available seats to parent
      }

      console.log("Seats fetched:", data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchSeats();
}, []); // no need to include onSeatsFetched in deps unless it can change


  if (loading) return <p style={{ color: "blue" ,textAlign :"center"}}>Loading available seats...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  // Create an array from 1 to totalSeats
  const allSeats = Array.from({ length: totalSeats }, (_, i) => i + 1);

  return (
    <div className="seats-container">
      <h2>Seats Layout</h2>
      <div className="seats-grid">
        {allSeats.map((seatNumber) => {
          const isAvailable = availableSeats.includes(seatNumber);
          return (
            <span
              key={seatNumber}
              className={`seat-item ${isAvailable ? "available" : "used"}`}
            >
              {seatNumber}
            </span>
          );
        })}
      </div>

      {/* Inline CSS */}
      <style>{`
        .seats-container {
          max-width: 600px;
          margin: 20px auto;
          text-align: center;
        }
        .seats-grid {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          gap: 10px;
          justify-items: center;
        }
        .seat-item {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .seat-item.available {
          background-color: #3b82f6; /* blue */
        }
        .seat-item.used {
          background-color: #ef4444; /* red */
          cursor: not-allowed;
        }
        .seat-item:hover.available {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}

export default Spot;
