export default function Castle({ castle }) {
  const hpPercent = Math.round((castle.hp / castle.max_hp) * 100);
  const hpDisplay = Math.round(castle.hp);
  const maxDisplay = Math.round(castle.max_hp);

  return (
    <div className="castle-card ks-card">
      <div className="ks-card-head">
        <span className="ks-icon-circle primary">🏰</span>
        <div>
          <p className="ks-label">Cidadela</p>
          <strong className="ks-title">Castelo central</strong>
        </div>
        <span className="ks-chip">Muralha Lv {castle.wall_level}</span>
      </div>

      <div className="ks-bar">
        <div className="ks-bar-fill" style={{ width: `${hpPercent}%` }} />
      </div>
      <div className="castle-stats">
        <span>Vida {hpDisplay} / {maxDisplay}</span>
        <span>Defesa +{castle.defense_bonus}%</span>
      </div>
    </div>
  );
}
