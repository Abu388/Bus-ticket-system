import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import './AvailableSpote.jsx'

function TypeOfBuss() {
  const location = useLocation();
  const { from, to, date, time, image } = location.state || {};

  const [selectedBus, setSelectedBus] = useState(null);
  const [name, setName] = useState("");
  const [basePrice, setBasePrice] = useState(0);
  const [passengers, setPassengers] = useState(1);

  const types = [
    {
      id: 1,
      name: "Selam Bus",
      description:
        "Comfortable Seating: Buses feature 2x2 reclining seats with ample legroom for a relaxing journey.",
      print: 800,
      image:
        "https://image.made-in-china.com/202f0j00NnUhFpCalKqc/Cheap-Used-Yellow-Yutong-Bus-Car-6122-and-40-Seats-Used-Coach-Tourist-Bus.webp",
    },
    {
      id: 2,
      name: "Zemen Bus",
      description:
        "Comfortable Seating: Buses feature 2x2 reclining seats with ample legroom for a relaxing journey.",
      print: 900,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9fQLF3FWfBaB9A5o_H6Jts7X_hMN9K0LxPw&s",
    },
    {
      id: 3,
      name: "Sky Bus",
      description:
        "Comfortable Seating: Buses feature 2x2 reclining seats with ample legroom for a relaxing journey.",
      print: 750,
      image:
        "https://img.12go.asia/0/fit/0/320/ce/0/plain/s3://12go-web-static/static/images/operator/13152/class/29-outside.jpg",
    },
    {
      id: 4,
      name: "Golden Bus",
      description:
        "Comfortable Seating: Buses feature 2x2 reclining seats with ample legroom for a relaxing journey.",
      print: 630,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0sYLsr8S0vi9NJMXBuvBd1vMMSnWMuJNxIA&s",
    },
    {
      id: 5,
      name: "Liyu Bus",
      description:
        "Comfortable Seating: Buses feature 2x2 reclining seats with ample legroom for a relaxing journey.",
      print: 850,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMrj-LwqW97gsz0WGOovX2huKspBl_apaFpA&s",
    },
  ];

  const handleBusSelect = (bus) => {
    setSelectedBus(bus);
    setName(bus.name);
    setBasePrice(bus.print);
  };

  const handlePassengerChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setPassengers(value);
  };

  const calculateTotalPrice = () => {
    return basePrice * passengers;
  };

  const calculateDiscountPrice = (price) => {
    return (price - 5) * passengers;
  };

  return (
    <div className="type-of-buss-container">
      {/* Header Section */}
      <section className="header">
        <div className="header-image-container">
          <img src={image} alt={`Journey from ${from} to ${to}`} className="header-image" />
          <div className="image-overlay"></div>
          <div className="header-content">
            <h1>Select Your Bus Type</h1>
            <p>Choose the perfect bus for your journey from {from} to {to}</p>
          </div>
        </div>
        
        {/* Trip Details */}
        <div className="trip-details-container">
          <div className="trip-details">
            <div className="detail-item">
              <span className="detail-label">From:</span>
              <span className="detail-value">{from}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">To:</span>
              <span className="detail-value">{to}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Date:</span>
              <span className="detail-value">{date}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Time:</span>
              <span className="detail-value">{time}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Passengers:</span>
              <div className="passenger-controls">
                <button 
                  onClick={() => setPassengers(Math.max(1, passengers - 1))}
                  className="passenger-btn"
                >
                  -
                </button>
                <input
                  id="passengers"
                  type="number"
                  min="1"
                  value={passengers}
                  onChange={handlePassengerChange}
                  className="passenger-input"
                />
                <button 
                  onClick={() => setPassengers(passengers + 1)}
                  className="passenger-btn"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bus Selection Section */}
      <section className="bus-selection">
        <h2>Available Bus Types</h2>
        <div className="passenger-notice">
          <p>Prices shown are for {passengers} {passengers === 1 ? 'passenger' : 'passengers'}</p>
        </div>
        <div className="bus-grid">
          {types.map((bus) => (
            <div 
              key={bus.id} 
              className={`bus-card ${selectedBus?.id === bus.id ? 'selected' : ''}`}
              onClick={() => handleBusSelect(bus)}
            >
              <div className="bus-image-container">
                <img src={bus.image} alt={bus.name} className="bus-image" />
                <div className="bus-type-badge">{bus.name}</div>
              </div>
              <div className="bus-content">
                <h3>{bus.name}</h3>
                <p className="bus-description">{bus.description}</p>
                <div className="bus-features">
                  <span className="feature">WiFi</span>
                  <span className="feature">AC</span>
                  <span className="feature">Comfortable</span>
                </div>
                <div className="price-container">
                  <p className="bus-price">Price: {calculateDiscountPrice(bus.print)} ETB</p>
                  <p className="original-price">{bus.print * passengers} ETB</p>
                  <p className="per-person">({bus.print - 5} ETB per person)</p>
                </div>
        <Link 
  to='/AvailableSpots'
  state={{
    from,
    to,
    date,
    time,
    image,
    price: calculateDiscountPrice(bus.print),
    busImage: bus.image,
    passengers,
    busName: bus.name,
  }}>
  <button className="select-button">
    {selectedBus?.id === bus.id ? 'Selected' : 'Select Bus'}
  </button>
</Link>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* {selectedBus && (
        <div className="selection-summary">
          <div className="summary-content">
            <div className="selected-info">
              <h3>You selected: {name}</h3>
              <p className="selected-price">Total Price: {calculateTotalPrice()} ETB</p>
              <p className="passenger-count">For {passengers} {passengers === 1 ? 'passenger' : 'passengers'}</p>
            </div>
            <button className="continue-button">Continue to Payment</button>
          </div>
        </div>
      )} */}

      {/* Inline CSS */}
      <style>
        {`
          body {
            margin: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: #f8fafc;
          }

          /* Header Section */
          .type-of-buss-container .header {
            position: relative;
          }
          .header-image-container {
            position: relative;
            width: 100%;
            height: 300px;
            overflow: hidden;
          }
          .header-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .image-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7));
          }
          .header-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: white;
            z-index: 2;
            width: 90%;
          }
          .header-content h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
          }
          .header-content p {
            font-size: 1.2rem;
            opacity: 0.9;
            margin-bottom: 0;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
          }
          
          /* Trip Details */
          .trip-details-container {
            background: linear-gradient(45deg, #2563eb, #3b82f6);
            color: white;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          .trip-details {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1.5rem;
            max-width: 900px;
            margin: 0 auto;
          }
          .detail-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            min-width: 120px;
          }
          .detail-label {
            font-size: 0.9rem;
            color: white;
            margin-bottom: 0.5rem;
            font-weight: 500;
          }
          .detail-value {
            font-size: 1.1rem;
            font-weight: 600;
            color: white;
          }
          .passenger-controls {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .passenger-btn {
            background: linear-gradient(45deg, #10b981, #34d399);
            color: white;
            border: none;
            width: 36px;
            height: 36px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 1.4rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          }
          .passenger-btn:hover {
            transform: translateY(-2px);
            background: linear-gradient(45deg, #34d399, #10b981);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }
          .passenger-btn:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .passenger-input {
            width: 60px;
            text-align: center;
            padding: 8px;
            border: 2px solid #3b82f6;
            border-radius: 8px;
            background: white;
            color: #1e293b;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
          }
          .passenger-input:focus {
            outline: none;
            border-color: #10b981;
            box-shadow: 0 0 8px rgba(16, 185, 129, 0.3);
          }
          .passenger-input::-webkit-outer-spin-button,
          .passenger-input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          /* Bus Selection Section */
          .bus-selection {
            padding: 40px 20px;
            max-width: 1200px;
            margin: 0 auto;
          }
          .bus-selection h2 {
            font-size: 2rem;
            font-weight: 700;
            color: #1e293b;
            text-align: center;
            margin-bottom: 1rem;
          }
          .passenger-notice {
            text-align: center;
            margin-bottom: 2rem;
            color: #64748b;
            font-style: italic;
          }
          .bus-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
          }
          .bus-card {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
            cursor: pointer;
          }
          .bus-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
          }
          .bus-card.selected {
            border: 2px solid #3b82f6;
            transform: translateY(-5px);
            box-shadow: 0 12px 24px rgba(59, 130, 246, 0.2);
          }
          .bus-image-container {
            position: relative;
            width: 100%;
            height: 200px;
            overflow: hidden;
          }
          .bus-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }
          .bus-card:hover .bus-image {
            transform: scale(1.05);
          }
          .bus-type-badge {
            position: absolute;
            top: 15px;
            right: 15px;
            background: rgba(59, 130, 246, 0.9);
            color: white;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
          }
          .bus-content {
            padding: 1.5rem;
          }
          .bus-content h3 {
            font-size: 1.5rem;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 0.75rem;
          }
          .bus-description {
            font-size: 0.95rem;
            color: #64748b;
            line-height: 1.5;
            margin-bottom: 1rem;
          }
          .bus-features {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1rem;
          }
          .feature {
            background: #eef2ff;
            color: #4f46e5;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 500;
          }
          .price-container {
            margin-bottom: 1rem;
          }
          .bus-price {
            font-size: 1.5rem;
            font-weight: 700;
            color: #10b981;
            margin: 0 0 0.25rem 0;
          }
          .original-price {
            font-size: 1rem;
            color: #94a3b8;
            text-decoration: line-through;
            margin: 0;
          }
          .per-person {
            font-size: 0.8rem;
            color: #64748b;
            margin: 0.25rem 0 0 0;
          }
          .select-button {
            width: 100%;
            background: linear-gradient(45deg, #10b981, #34d399);
            color: white;
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .select-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }
          .bus-card.selected .select-button {
            background: linear-gradient(45deg, #3b82f6, #2563eb);
          }

          /* Selection Summary */
          .selection-summary {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: white;
            padding: 1.5rem;
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
            z-index: 100;
          }
          .summary-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
          }
          .selected-info h3 {
            font-size: 1.25rem;
            font-weight: 600;
            color: #1e293b;
            margin: 0 0 0.5rem 0;
          }
          .selected-price {
            font-size: 1.5rem;
            font-weight: 700;
            color: #10b981;
            margin: 0 0 0.25rem 0;
          }
          .passenger-count {
            font-size: 0.9rem;
            color: #64748b;
            margin: 0;
          }
          .continue-button {
            background: linear-gradient(45deg, #f59e0b, #f97316);
            color: white;
            padding: 14px 28px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 1rem;
          }
          .continue-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .header-content h1 {
              font-size: 2rem;
            }
            .header-content p {
              font-size: 1.1rem;
            }
            .header-image-container {
              height: 250px;
            }
            .trip-details {
              flex-direction: column;
              gap: 1rem;
            }
            .detail-item {
              flex-direction: row;
              justify-content: space-between;
              width: 100%;
            }
            .bus-grid {
              grid-template-columns: 1fr;
              gap: 1.5rem;
            }
            .summary-content {
              flex-direction: column;
              gap: 1rem;
              text-align: center;
            }
          }
          @media (max-width: 480px) {
            .header-image-container {
              height: 200px;
            }
            .bus-content {
              padding: 1rem;
            }
            .continue-button {
              padding: 12px 24px;
              font-size: 0.9rem;
            }
            .bus-selection {
              padding: 30px 15px;
            }
          }
        `}
      </style>
    </div>
  );
}

export default TypeOfBuss;