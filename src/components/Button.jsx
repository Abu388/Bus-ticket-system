import "./Button.css";

export default function Button({ children, onClick, className }) {
  return (
    <button onClick={onClick} className={`btn ${className ? className : ""}`}>
      {children}
    </button>
  );
}
