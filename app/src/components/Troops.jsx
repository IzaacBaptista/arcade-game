export default function Troops({ troops, onTrain, onUpgrade }) {
  return (
    <div className="ks-card-grid">
      {Object.entries(troops).map(([key, t]) => (
        <div key={key} className="ks-card troop-card">
          <div className="ks-card-head">
            <span className="ks-icon-circle">⚔️</span>
            <div>
              <p className="ks-label">{key}</p>
              <strong className="ks-title">Lv {t.level}</strong>
            </div>
            <span className="ks-chip">ATK {t.attack}</span>
          </div>
          <div className="ks-row">
            <span className="ks-pill soft">Qtd {t.qty}</span>
            <button className="ks-btn ghost" onClick={() => onTrain(key, 5)}>
              Treinar +5
            </button>
          </div>
          <div className="ks-row">
            <span className="ks-pill gold">HP {t.hp}</span>
            <button className="ks-btn primary" onClick={() => onUpgrade(key)}>
              Evoluir tropa
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
