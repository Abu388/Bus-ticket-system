import { useLocation } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Spot from "./Spot";
import { BookingContext } from "./BookingContext";
import Refund from "./Admin/Refund";

function AvailableSpots() {
    const [availableSeats, setAvailableSeats] = useState([]);
    const navigate = useNavigate();
    const { addBooking, bookingData, allBookings } = useContext(BookingContext);
    const location = useLocation();
    const { from, to, date, time, price, image, busImage, passengers = 1, busName } = location.state || {};
    console.log('Received data:', location.state);

    const [passengerInfo, setPassengerInfo] = useState(
        Array.from({ length: passengers }, () => ({
            name: "",
            phone: "",
            seat: ""
        }))
    );

    const [lastUpdated, setLastUpdated] = useState(Date.now());

    // Check for status updates
    useEffect(() => {
        // Check if our current booking has been updated in the allBookings list
        if (bookingData && bookingData.id && allBookings) {
            const updatedBooking = allBookings.find(b => b.id === bookingData.id);
            if (updatedBooking && updatedBooking.status !== bookingData.status) {
                // Update the booking data
                const updatedBookingData = { ...bookingData, status: updatedBooking.status };
                
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
            price,
            bus: busName,
            passengers,
            passengerInfo: passengerInfo.map((p) => ({
                name: p.name,
                phone: p.phone,
                selected_spot: Number(p.seat),
            })),
        };

        console.log("Available seats:", availableSeats);
        console.log("Passenger Info:", passengerInfo);
        console.log("Booking Data:", booking);

        addBooking(booking); // ✅ Use the addBooking function from context
        alert("Booking sent! Waiting for approval.");
    };

    return (
        <div className="available-spots-container">
            {/* Header Section */}
            <section className="header">
                <div className="header-image-container">
                    <img src={image} alt={`Journey from ${from} to ${to}`} className="header-image" />
                    <div className="image-overlay"></div>
                    <div className="header-content">
                        <h1>Trip Details</h1>
                        <p>Your journey from {from} to {to}</p>
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
                            <span className="detail-label">Price:</span>
                            <span className="detail-value">{price} ETB per person</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Passengers:</span>
                            <span className="detail-value">{passengers}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Total:</span>
                            <span className="detail-value">{price * passengers} ETB</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bus Image Section */}
            <section className="bus-image-section">
                <h2>{busName}</h2>
                <div className="bus-image-container">
                    <img src={busImage} alt="Selected Bus" className="bus-image" />
                </div>
            </section>

            <section className="seats-section">
                <Spot onSeatsFetched={setAvailableSeats} />
            </section>

            {/* Passenger Information Form */}
            <section className="passenger-form-section">
                <h2>Passenger Information</h2>
                <p className="form-description">
                    Please enter details for all {passengers} passenger{passengers > 1 ? 's' : ''}
                </p>

                <form onSubmit={handleSubmit} className="passenger-form">
                    {passengerInfo.map((passenger, index) => (
                        <div key={index} className="passenger-card">
                            <h3>Passenger {index + 1}</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor={`name-${index}`}>Full Name</label>
                                    <input
                                        type="text"
                                        id={`name-${index}`}
                                        value={passenger.name}
                                        onChange={(e) => handlePassengerInfoChange(index, 'name', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`phone-${index}`}>Phone Number</label>
                                    <input
                                        type="tel"
                                        id={`phone-${index}`}
                                        value={passenger.phone}
                                        onChange={(e) => handlePassengerInfoChange(index, 'phone', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`seat-${index}`}>Seat Preference</label>
                                    <select
                                        id={`seat-${index}`}
                                        value={passenger.seat}
                                        onChange={(e) => handlePassengerInfoSet(index, 'seat', e.target.value)}
                                        required
                                    >
                                        <option value="">Select Seat</option>
                                        {availableSeats.map(seat => {
                                            const isTaken = passengerInfo.some((p, i) => p.seat === seat && i !== index);
                                            return (
                                                <option key={seat} value={seat} disabled={isTaken}>
                                                    {seat}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button type="submit" className="submit-button">
                        Confirm Booking
                    </button>    
          
  


                </form>
                <Link to="/refund"   >
                <button type="button" className="submit-button" >
                
    Refund
  
  </button>
  </Link>
            </section>
                    
            {/* Booking Status Display */}
            {bookingData && (
                <div className="booking-status" style={{
                    padding: '20px',
                    margin: '20px',
                    borderRadius: '8px',
                    backgroundColor: bookingData.status === 'approved' ? '#e6f7e6' : 
                                    bookingData.status === 'denied' ? '#ffe6e6' : '#fff3cd',
                    border: bookingData.status === 'approved' ? '1px solid #c3e6cb' : 
                            bookingData.status === 'denied' ? '1px solid #f5c6cb' : '1px solid #ffeaa7',
                    textAlign: 'center'
                }}>
                    <h3>Booking Status: 
                        <span style={{
                            color: bookingData.status === 'approved' ? '#155724' : 
                                bookingData.status === 'denied' ? '#721c24' : '#856404',
                            marginLeft: '10px'
                        }}>
                            {bookingData.status || 'pending'}
                        </span>
                    </h3>
                    {bookingData.status === 'approved' && (
                        <div>
                            <p>Your booking has been approved! 🎉</p>
                            <p>Please proceed to payment at the counter.</p>
                            <div
                                style={{
                                    display: 'flex',        // side by side
                                    justifyContent: 'center', // center horizontally
                                    gap: '20px',            // space between images
                                    transform: 'scale(1)',
                                    transition: 'transform 0.3s ease, filter 0.3s ease',
                                    filter: 'brightness(0.9)',
                                    cursor: 'pointer',
                                }}
                                onMouseOver={e => {
                                    e.currentTarget.style.transform = 'scale(1.05)';  // zoom parent
                                    e.currentTarget.style.filter = 'brightness(1)';
                                }}
                                onMouseOut={e => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.filter = 'brightness(0.9)';
                                }}
                            >
                                <img
                                    src="data:image/png;base64,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"
                                    alt="qr code"
                                    style={{
                                        width: '200px',
                                        height: '200px',
                                        objectFit: 'cover',
                                        borderRadius: '12px',
                                        boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                                    }}
                                />

                                <img
                                    src="https://cdn.vectorstock.com/i/500p/85/19/public-bus-ticket-icon-vector-32688519.jpg"
                                    alt="busticket"
                                    style={{
                                        width: '300px',
                                        height: '200px',
                                        objectFit: 'cover',
                                        borderRadius: '12px',
                                        boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                                    }}
                                />
                                
                            </div>
                                    <h3>Tiket no:- 567421</h3>
                        </div>
                    )}
                    {bookingData.status === 'denied' && (
                        <div>
                            <p>Your booking has been denied.</p>
                            <p>Please contact support for more information.</p>
                        </div>
                    )}
                    {(!bookingData.status || bookingData.status === 'pending') && (
                        <p>Your booking is waiting for approval. Please check back later.</p>
                    )}
                </div>
            )}

            {/* Inline CSS */}
            <style>
                {`
          body {
            margin: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: #f8fafc;
          }

          /* Header Section */
          .available-spots-container .header {
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

          /* Bus Image Section */
          .bus-image-section {
            padding: 40px 20px;
            max-width: 1200px;
            margin: 0 auto;
            text-align: center;
          }
          .bus-image-section h2 {
            font-size: 2rem;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 1rem;
          }
          .bus-image-container {
            position: relative;
            width: 100%;
            max-width: 400px;
            height: 250px;
            margin: 0 auto;
            overflow: hidden;
            border-radius: 16px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
          }
          .bus-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }
          .bus-image:hover {
            transform: scale(1.05);
          }

          /* Passenger Form Section */
          .passenger-form-section {
            padding: 40px 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          .passenger-form-section h2 {
            font-size: 2rem;
            font-weight: 700;
            color: #1e293b;
            text-align: center;
            margin-bottom: 1rem;
          }
          .form-description {
            text-align: center;
            color: #64748b;
            margin-bottom: 2rem;
          }
          .passenger-card {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }
          .passenger-card h3 {
            font-size: 1.25rem;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 1rem;
          }
          .form-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
          }
          .form-group {
            display: flex;
            flex-direction: column;
          }
          .form-group label {
            font-size: 0.9rem;
            font-weight: 500;
            color: #374151;
            margin-bottom: 0.5rem;
          }
          .form-group input,
          .form-group select {
            padding: 10px 12px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 1rem;
            transition: all 0.3s ease;
          }
          .form-group input:focus,
          .form-group select:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
          }
          .submit-button {
            width: 100%;
            background: linear-gradient(45deg, #10b981, #34d399);
            color: white;
            padding: 14px 20px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 1rem;
          }
          .submit-button:hover {
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
            .bus-image-container {
              max-width: 300px;
              height: 200px;
            }
            .form-row {
              grid-template-columns: 1fr;
            }
          }
          @media (max-width: 480px) {
            .header-image-container {
              height: 200px;
            }
            .bus-image-section {
              padding: 30px 15px;
            }
            .bus-image-container {
              max-width: 250px;
              height: 150px;
            }
            .passenger-form-section {
              padding: 30px 15px;
            }
            .passenger-card {
              padding: 1rem;
            }
          }
        `}
            </style>
        </div>
    );
}

export default AvailableSpots;