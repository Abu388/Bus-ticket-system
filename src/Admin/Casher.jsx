import { useContext, useState, useEffect } from "react";
import { BookingContext } from "../BookingContext";

function Cashier() {
  const { allBookings, updateBookingStatus } = useContext(BookingContext);
  const [bookings, setBookings] = useState([]);

  // Load bookings from localStorage on component mount
  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(savedBookings);
  }, []);

  // Update local state when allBookings changes
  useEffect(() => {
    if (allBookings && allBookings.length > 0) {
      setBookings(allBookings);
    }
  }, [allBookings]);

  // Save to localStorage whenever bookings change
  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [bookings]);

  const handleDecision = (id, decision) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === id ? { ...booking, status: decision } : booking
    );
    setBookings(updatedBookings);
    
    // Update the context as well
    if (updateBookingStatus) {
      updateBookingStatus(id, decision);
    }
    
    // Show confirmation message
    alert(`Booking #${id} has been ${decision === 'approved' ? 'approved' : 'denied'}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Cashier Dashboard</h1>
      
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div>
          {bookings.map(booking => (
            <div key={booking.id} style={{
              border: '1px solid #ccc',
              padding: '15px',
              margin: '10px',
              borderRadius: '5px',
              backgroundColor: booking.status === 'approved' ? '#e6f7e6' : 
                              booking.status === 'denied' ? '#ffe6e6' : '#fff'
            }}>
              <h3>Booking #{booking.id}</h3>
              <p>From: {booking.from} → To: {booking.to}</p>
              <p>Date: {booking.date} | Time: {booking.time}</p>
              <p>Bus: {booking.bus} | Passengers: {booking.passengers}</p>
              <p>Total Price: {booking.price * booking.passengers} ETB</p>
              
              <div>
                <h4>Passenger Details:</h4>
                {booking.passengerInfo && booking.passengerInfo.map((passenger, index) => (
                  <div key={index} style={{ marginLeft: '20px', marginBottom: '10px' }}>
                    <p>Name: {passenger.name}</p>
                    <p>Phone: {passenger.phone}</p>
                    <p>Seat: {passenger.selected_spot}</p>
                  </div>
                ))}
              </div>
              
              <p>Status: <strong style={{
                color: booking.status === 'approved' ? 'green' : 
                       booking.status === 'denied' ? 'red' : 'orange'
              }}>{booking.status || 'pending'}</strong></p>
              
              <div>
                <button 
                  onClick={() => handleDecision(booking.id, "approved")}
                  disabled={booking.status === 'approved'}
                  style={{
                    marginRight: '10px', 
                    backgroundColor: booking.status === 'approved' ? '#cccccc' : '#4CAF50', 
                    color: 'white',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: booking.status === 'approved' ? 'not-allowed' : 'pointer'
                  }}
                >
                  {booking.status === 'approved' ? 'Approved' : 'Approve'}
                </button>
                <button 
                  onClick={() => handleDecision(booking.id, "denied")}
                  disabled={booking.status === 'denied'}
                  style={{
                    backgroundColor: booking.status === 'denied' ? '#cccccc' : '#f44336', 
                    color: 'white',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: booking.status === 'denied' ? 'not-allowed' : 'pointer'
                  }}
                >
                  {booking.status === 'denied' ? 'Denied' : 'Deny'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cashier;