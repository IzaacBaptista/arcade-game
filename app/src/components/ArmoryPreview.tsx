// @ts-nocheck
const labels = {
  catapults: "Catapultas",
  cannons: "Canhões antigos",
  horses: "Cavalos",
  cavalry: "Cavalaria",
  shields: "Escudos",
  spears: "Lanças"
};

const icons = {
  catapults: "🎯",
  cannons: "💥",
  horses: "🐎",
  cavalry: "🐴",
  shields: "🛡️",
  spears: "🗡️"
};

export default function ArmoryPreview({ armory, onOpen }) {
  const entries = Object.entries(armory || {});
  const total = entries.reduce((acc, [, item]) => acc + (item.qty || 0), 0);
  const top = entries
    .sort((a, b) => (b[1].qty || 0) - (a[1].qty || 0))
    .slice(0, 3);

  return (
    <div className="ks-card" style={{ cursor: "pointer" }} onClick={onOpen} title="Ver arsenal completo">
      <div className="ks-card-head">
        <span className="ks-icon-circle">🏰</span>
        <div>
          <p className="ks-label">Quartel & Arsenal</p>
          <strong className="ks-title">{total} itens</strong>
        </div>
        <button className="ks-btn primary" style={{ marginLeft: "auto" }}>
          Abrir
        </button>
      </div>
      <div className="ks-row" style={{ gap: 6, flexWrap: "wrap", marginTop: 10 }}>
        {top.map(([key, item]) => (
          <span key={key} className="ks-pill soft">
            {icons[key] || "🛡️"} {item.qty ?? 0}x {labels[key] || item.name || key}
          </span>
        ))}
        {top.length === 0 && <span className="ks-pill soft">Nenhum item ainda</span>}
      </div>
      <div className="ks-mini-label" style={{ marginTop: 8 }}>Clique para gerenciar arsenal</div>
    </div>
  );
}
