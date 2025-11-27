export default function Builders({ builders, onCollect, onHire }) {
  return (
    <div className="ks-card">
      <div className="ks-card-head">
        <span className="ks-icon-circle">🪓</span>
        <div>
          <p className="ks-label">Construtores</p>
          <strong className="ks-title">{builders.qty} em serviço</strong>
        </div>
        <span className="ks-chip">Eficiência x{builders.efficiency}</span>
      </div>
      <p className="ks-subtitle" style={{ marginTop: 8 }}>
        Recolhem madeira, ouro e comida por turno de trabalho.
      </p>
      <div className="ks-card-actions" style={{ justifyContent: "space-between" }}>
        <button className="ks-btn ghost" onClick={() => onHire(1)}>Contratar +1</button>
        <button className="ks-btn primary" onClick={onCollect}>Coletar materiais</button>
      </div>
    </div>
  );
}
