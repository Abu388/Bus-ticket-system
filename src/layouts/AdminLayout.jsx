import Navbar from "../components/Navbar";
import "./AdminLayout.css";

export default function AdminLayout({ children }) {
  return (
    <div>
      <Navbar role="admin" />
      <div className="container">{children}</div>
    </div>
  );
}
