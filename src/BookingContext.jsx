import { createContext, useState, useEffect } from "react";

export const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [bookingData, setBookingData] = useState(null);
  const [allBookings, setAllBookings] = useState([]);

  // Load bookings from localStorage on component mount
  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setAllBookings(savedBookings);
    
    // If there's a current booking in localStorage, set it
    const currentBooking = JSON.parse(localStorage.getItem('currentBooking') || 'null');
    if (currentBooking) {
      setBookingData(currentBooking);
    }
  }, []);

  // Save to localStorage whenever allBookings change
  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(allBookings));
  }, [allBookings]);

  // Save current booking to localStorage whenever it changes
  useEffect(() => {
    if (bookingData) {
      localStorage.setItem('currentBooking', JSON.stringify(bookingData));
    }
  }, [bookingData]);

  const addBooking = (booking) => {
    const newBooking = {
      ...booking,
      id: Date.now(), // Simple ID generation
      status: 'pending'
    };
    setAllBookings(prev => [...prev, newBooking]);
    setBookingData(newBooking);
  };

  const updateBookingStatus = (id, status) => {
    setAllBookings(prev => 
      prev.map(booking => 
        booking.id === id ? { ...booking, status } : booking
      )
    );
    
    // Also update the current booking data if it's the one being modified
    if (bookingData && bookingData.id === id) {
      const updatedBooking = { ...bookingData, status };
      setBookingData(updatedBooking);
    }
  };

  return (
    <BookingContext.Provider value={{ 
      bookingData, 
      setBookingData, 
      allBookings, 
      addBooking, 
      updateBookingStatus 
    }}>
      {children}
    </BookingContext.Provider>
  );
}