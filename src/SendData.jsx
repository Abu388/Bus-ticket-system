import { useContext } from "react";
import { BookingContext } from "./BookingContext";

function SendData() {
  const { bookingData } = useContext(BookingContext);

  if (!bookingData) return <p>No booking yet.</p>;

  return (
    <div>
      <h1>Booking Status</h1>
      {bookingData.status === "approved" && <h2>Booking Approved ✅</h2>}
      {bookingData.status === "denied" && <h2>Booking Denied ❌</h2>}
      {bookingData.status === "pending" && <h2>Waiting for cashier decision...</h2>}

      <h3>Booking Details:</h3>
      <pre>{JSON.stringify(bookingData, null, 2)}</pre>
    </div>
  );
}

export default SendData;
