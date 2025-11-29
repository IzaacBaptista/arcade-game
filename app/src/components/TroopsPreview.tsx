// @ts-nocheck
const labels = {
  soldiers: "Soldados",
  archers: "Arqueiros",
  cavalry: "Cavalaria",
  mages: "Magos",
  spearmen: "Lanceiros",
  lancers: "Lanceiros",
  assassins: "Assassinos",
  berserkers: "Berserkers",
  giants: "Gigantes",
  elephants: "Elefantes",
  imps: "Diabretes",
};

const icons = {
  soldiers: "⚔️",
  archers: "🏹",
  cavalry: "🐎",
  mages: "✨",
  spearmen: "🛡️",
  lancers: "🛡️",
  assassins: "🗡️",
  berserkers: "💢",
  giants: "🪨",
  elephants: "🐘",
  imps: "😈",
};

export default function TroopsPreview({ troops, onOpen }) {
  const entries = Object.entries(troops || {});
  const total = entries.reduce((acc, [, t]) => acc + (t.qty || 0), 0);
  const top = entries
    .sort((a, b) => (b[1].qty || 0) - (a[1].qty || 0))
    .slice(0, 3);

  return (
    <div className="ks-card" style={{ cursor: "pointer" }} onClick={onOpen} title="Ver tropas completas">
      <div className="ks-card-head">
        <span className="ks-icon-circle">🛡️</span>
        <div>
          <p className="ks-label">Quartel</p>
          <strong className="ks-title">{total} unidades</strong>
        </div>
        <button className="ks-btn primary" style={{ marginLeft: "auto" }}>
          Abrir
        </button>
      </div>
      <div className="ks-row" style={{ gap: 6, flexWrap: "wrap", marginTop: 10 }}>
        {top.map(([key, t]) => (
          <span key={key} className="ks-pill soft">
            {icons[key] || "🎖️"} {t.qty ?? 0}x {labels[key] || key} (Lv {t.level ?? 1})
          </span>
        ))}
        {top.length === 0 && <span className="ks-pill soft">Nenhuma tropa ainda</span>}
      </div>
      <div className="ks-mini-label" style={{ marginTop: 8 }}>Clique para treinar e evoluir</div>
    </div>
  );
}
