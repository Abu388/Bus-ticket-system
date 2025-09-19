import React, { useState } from "react";
import { Link } from "react-router-dom";
import TypeOfBuss from "./TypeOfBuss";

// Dummy data for destinations with separate from/to fields, times, and dates
const destinations = [
  {
    id: 1,
    from: "Addis Ababa",
    to: "Gondar",
    description: "The vibrant capital city to historic Gondar.",
    times: ["08:00 AM", "12:00 PM", "06:00 PM"],
    availableDates: ["2025-09-20", "2025-09-21", "2025-09-22"],
    image: "https://imgix.brilliant-ethiopia.com/fasil-ghebbi-royal-enclosure-gondar.jpg?auto=format,enhance,compress&fit=crop&crop=entropy,faces,focalpoint&w=580&h=480&q=40",
  },
  {
    id: 2,
    from: "Bahir Dar",
    to: "Addis Ababa",
    description: "From stunning Lake Tana to the capital city.",
    times: ["07:00 AM", "01:00 PM", "05:00 PM"],
    availableDates: ["2025-09-20", "2025-09-23", "2025-09-24"],
    image: "https://cdn.atrsafari.com/cdn/05explore/locations-and-lodges/africa/ethiopia/addis-ababa/0/stills/00page/01ADDI-IM0001-addis-ababa.jpg",
  },
  {
    id: 3,
    from: "Gondar",
    to: "Lalibela",
    description: "From historic castles to rock-hewn churches.",
    times: ["09:00 AM", "02:00 PM"],
    availableDates: ["2025-09-21", "2025-09-22"],
    image: "https://media-cdn.tripadvisor.com/media/photo-s/1a/fa/c9/84/the-rock-hewn-churches.jpg",
  },
  {
    id: 4,
    from: "Hawassa",
    to: "Arba Minch",
    description: "From serene Lake Hawassa to beautiful Arba Minch.",
    times: ["06:00 AM", "11:00 AM", "04:00 PM"],
    availableDates: ["2025-09-20", "2025-09-23", "2025-09-25"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl53snccJCGWDKGLfbyHzgj31SwGuOlnGYkQ&s",
  },
  {
    id: 5,
    from: "Lalibela",
    to: "Axum",
    description: "From UNESCO rock-hewn churches to ancient Axum.",
    times: ["10:00 AM", "03:00 PM"],
    availableDates: ["2025-09-22", "2025-09-24"],
    image: "https://cdn.britannica.com/23/93423-050-107B2836/obelisk-kingdom-Aksum-Ethiopian-name-city.jpg",
  },
];

function Ticket() {
  const [searchTerm, setSearchTerm] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  

  // Unique cities for dropdowns
  const cities = [...new Set(destinations.flatMap((dest) => [dest.from, dest.to]))];

  // Available times based on selected from/to/date
  const availableTimes = from && to && date
    ? destinations
        .filter((dest) => dest.from === from && dest.to === to && dest.availableDates.includes(date))
        .flatMap((dest) => dest.times)
    : from && to
      ? destinations
          .filter((dest) => dest.from === from && dest.to === to)
          .flatMap((dest) => dest.times)
      : [...new Set(destinations.flatMap((dest) => dest.times))];

  // Available dates based on selected from/to
  const availableDates = from && to
    ? destinations
        .filter((dest) => dest.from === from && dest.to === to)
        .flatMap((dest) => dest.availableDates)
    : [...new Set(destinations.flatMap((dest) => dest.availableDates))];

  // Filter destinations based on search term, from, to, time, and date
  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch = dest.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dest.to.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFrom = from ? dest.from === from : true;
    const matchesTo = to ? dest.to === to : true;
    const matchesTime = time ? dest.times.includes(time) : true;
    const matchesDate = date ? dest.availableDates.includes(date) : true;
    return matchesSearch && matchesFrom && matchesTo && matchesTime && matchesDate;
  });

  // Fallback image handler
  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/800x200?text=Image+Not+Available";
  };

  return (
    <div>
      {/* Header Section */}
      <section className="header">
        <h1>Book Your Bus Ticket</h1>
        <p>Choose your destination and start your journey across Ethiopia.</p>
        <div className="filter-container">
          <div className="filter-group">
            <label htmlFor="from">From</label>
            <select
              id="from"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setTo(""); // Reset 'To' when 'From' changes
                setTime(""); // Reset 'Time' when 'From' changes
                setDate(""); // Reset 'Date' when 'From' changes
              }}
              className="filter-select"
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="to">To</label>
            <select
              id="to"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setTime(""); // Reset 'Time' when 'To' changes
                setDate(""); // Reset 'Date' when 'To' changes
              }}
              className="filter-select"
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="date">Date</label>
            <select
              id="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setTime(""); // Reset 'Time' when 'Date' changes
              }}
              className="filter-select"
            >
              <option value="">Select Date</option>
              {availableDates.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="time">Time</label>
            <select
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="filter-select"
            >
              <option value="">Select Time</option>
              {availableTimes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          {/* <div className="filter-group">
            <label htmlFor="passengers">Passengers</label>
            <input
              id="passengers"
              type="number"
              min="1"
              value={passengers}
              onChange={(e) => setPassengers(Math.max(1, e.target.value))}
              className="filter-input"
            />
          </div> */}
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </section>

      {/* Destinations Section */}
      <section className="destinations">
        <h2>Available Destinations</h2>
        {filteredDestinations.length === 0 ? (
          <p className="no-results">No destinations found.</p>
        ) : (
          <div className="destination-grid">
            {filteredDestinations.map((dest) => (
              <div key={dest.id} className="destination-card">
                <img
                  src={dest.image}
                  alt={`${dest.from} to ${dest.to}`}
                  className="card-image"
                  onError={handleImageError}
                />
                <div className="card-content">
                  <h3>{`${dest.from} to ${dest.to}`}</h3>
                  <p>{dest.description}</p>
                  <p className="times">Available Times: {dest.times.join(", ")}</p>
                  <p className="dates">Available Dates: {dest.availableDates.join(", ")}</p>
                  <div className="card-footer">
                    {/* <span className="price">{dest.price * passengers} ETB ({passengers} {passengers > 1 ? "passengers" : "passenger"})</span> */}
                  <Link
  className="book-button"
  to="/TypeOfBuss"
  state={{
    from: dest.from,
    to: dest.to,
    date: date || dest.availableDates[0],
    time: time || dest.times[0],
    image: dest.image,
    price: 0, // default, will be updated in TypeOfBus when a bus is selected
    busImage: "", // default empty, updated later
    passengers: 1, // default to 1 passenger
    busName: '',
  }}
>
  Book Now
</Link>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Inline CSS */}
      <style>
        {`
          body {
            margin: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: #f8fafc;
          }

          /* Header Section */
          .header {
            background: linear-gradient(45deg, #2563eb, #3b82f6);
            color: white;
            text-align: center;
            padding: 60px 20px;
          }
          .header h1 {
            font-size: 2.75rem;
            font-weight: 700;
            margin-bottom: 1rem;
          }
          .header p {
            font-size: 1.25rem;
            opacity: 0.9;
            margin-bottom: 2rem;
          }
          .filter-container {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            max-width: 1000px;
            margin: 0 auto 2rem;
            justify-content: center;
          }
          .filter-group {
            display: flex;
            flex-direction: column;
            min-width: 150px;
          }
          .filter-group label {
            font-size: 1rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
          }
          .filter-select, .filter-input {
            padding: 10px;
            font-size: 1rem;
            border: none;
            border-radius: 8px;
            outline: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: box-shadow 0.3s;
          }
          .filter-select:focus, .filter-input:focus {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }
          .filter-input {
            width: 100px;
          }
          .search-container {
            max-width: 500px;
            margin: 0 auto;
          }
          .search-input {
            width: 100%;
            padding: 12px 20px;
            font-size: 1rem;
            border: none;
            border-radius: 50px;
            outline: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: box-shadow 0.3s;
          }
          .search-input:focus {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }

          /* Destinations Section */
          .destinations {
            padding: 60px 20px;
            max-width: 1200px;
            margin: 0 auto;
          }
          .destinations h2 {
            font-size: 2.25rem;
            font-weight: 700;
            color: #1e293b;
            text-align: center;
            margin-bottom: 2.5rem;
          }
          .no-results {
            text-align: center;
            font-size: 1.125rem;
            color: #64748b;
          }
          .destination-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
          }
          .destination-card {
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .destination-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
          }
          .card-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
          }
          .card-content {
            padding: 1.5rem;
          }
          .card-content h3 {
            font-size: 1.5rem;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 0.75rem;
          }
          .card-content p {
            font-size: 1rem;
            color: #64748b;
            line-height: 1.5;
            margin-bottom: 1rem;
          }
          .card-content .times, .card-content .dates {
            font-size: 0.9rem;
            color: #64748b;
            margin-bottom: 1rem;
          }
          .card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .price {
            font-size: 1.25rem;
            font-weight: 700;
            color: #10b981;
          }
          .book-button {
            background: linear-gradient(45deg, #10b981, #34d399);
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            font-weight: 600;
            border-radius: 50px;
            transition: transform 0.3s, box-shadow 0.3s;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }
          .book-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
            background: linear-gradient(45deg, #059669, #22c55e);
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .header h1 {
              font-size: 2rem;
            }
            .header p {
              font-size: 1.1rem;
            }
            .destinations h2 {
              font-size: 1.75rem;
            }
            .destination-grid {
              grid-template-columns: 1fr;
            }
            .filter-container {
              flex-direction: column;
              align-items: center;
            }
            .filter-group {
              width: 100%;
              max-width: 300px;
            }
          }
          @media (max-width: 480px) {
            .header {
              padding: 40px 15px;
            }
            .search-input, .filter-select, .filter-input {
              padding: 10px 15px;
            }
            .book-button {
              padding: 8px 15px;
              font-size: 0.9rem;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Ticket;