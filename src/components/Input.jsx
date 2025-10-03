export default function Input({ label, value, onChange, type = "text" }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      {label && <label>{label}: </label>}
      <input type={type} value={value} onChange={onChange} style={{ padding: "5px" }} />
    </div>
  );
}
