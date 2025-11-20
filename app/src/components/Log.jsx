export default function Log({ log }) {
  return (
    <div>
      <h2>📝 Log</h2>
      {log.map((line, idx) => (
        <div key={idx}>• {line}</div>
      ))}
    </div>
  );
}
