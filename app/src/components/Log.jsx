export default function Log({ log }) {
  const grouped = [];
  for (const line of log) {
    const last = grouped[grouped.length - 1];
    if (last && last.text === line) {
      last.count += 1;
    } else {
      grouped.push({ text: line, count: 1 });
    }
  }

  return (
    <div className="ks-log">
      {grouped.length === 0 && <div className="ks-empty">Nenhuma atividade registrada ainda.</div>}
      {grouped.map((entry, idx) => (
        <div key={idx} className="ks-log-line">
          <span className="ks-dot" />
          <span>{entry.text}</span>
          {entry.count > 1 && <span className="ks-log-count">x{entry.count}</span>}
        </div>
      ))}
    </div>
  );
}
