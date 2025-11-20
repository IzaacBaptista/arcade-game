export default function Towers({ towers, onUpgrade }) {
  return (
    <div className="ks-card-grid">
      {towers.map(t => (
        <div key={t.id} className="ks-card tower-card">
          <div className="ks-card-head">
            <span className="ks-icon-circle">🏹</span>
            <div>
              <p className="ks-label">{t.name}</p>
              <strong className="ks-title">Lv {t.level}</strong>
            </div>
            <span className="ks-chip">Dano {t.damage}</span>
          </div>
          <div className="ks-card-actions">
            <button className="ks-btn ghost" onClick={() => onUpgrade(t.id)}>
              Upar torre
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
