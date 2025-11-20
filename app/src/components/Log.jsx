export default function Log({ log }) {
  return (
    <div className="ks-log">
      {log.length === 0 && <div className="ks-empty">Nenhuma atividade registrada ainda.</div>}
      {log.map((line, idx) => (
        <div key={idx} className="ks-log-line">
          <span className="ks-dot" />
          <span>{line}</span>
        </div>
      ))}
    </div>
  );
}
