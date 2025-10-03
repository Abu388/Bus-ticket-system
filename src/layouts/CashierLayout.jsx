import Navbar from "../components/Navbar";
import "./CashierLayout.css";

export default function CashierLayout({ children }) {
  return (
    <div>
      <Navbar role="cashier" />
      <div className="container">{children}</div>
    </div>
  );
}
