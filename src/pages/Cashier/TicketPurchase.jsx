import CashierLayout from "../../layouts/CashierLayout";
import { useState } from "react";
import { useData } from "../../context/DataContext";
import Input from "../../components/Input";
import Button from "../../components/Button";

export default function TicketPurchase() {
  const { tickets, setTickets } = useData();
  const [ticket, setTicket] = useState({ passenger: "", route: "", price: "" });

  const handleSubmit = () => {
    if (!ticket.passenger || !ticket.route || !ticket.price) return alert("Fill all fields");
    setTickets([...tickets, { ...ticket, id: Date.now() }]);
    setTicket({ passenger: "", route: "", price: "" });
    alert("Ticket sold!");
  };

  return (
    <CashierLayout>
      <h1>Sell Ticket</h1>
      <Input label="Passenger" value={ticket.passenger} onChange={e => setTicket({ ...ticket, passenger: e.target.value })} />
      <Input label="Route" value={ticket.route} onChange={e => setTicket({ ...ticket, route: e.target.value })} />
      <Input label="Price" type="number" value={ticket.price} onChange={e => setTicket({ ...ticket, price: e.target.value })} />
      <Button onClick={handleSubmit}>Sell Ticket</Button>
    </CashierLayout>
  );
}
