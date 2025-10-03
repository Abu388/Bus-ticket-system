export default function Table({ columns, data }) {
  return (
    <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%", marginTop: "10px" }}>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {columns.map(col => (
              <td key={col}>{row[col]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
