// @ts-nocheck
export default function Troops({ troops, onTrain, onUpgrade }) {
  const getIcon = (key) => {
    if (key === "soldiers") return "⚔️";
    if (key === "archers") return "🏹";
    if (key === "cavalry") return "🐎";
    if (key === "lancers" || key === "spearmen") return "🛡️";
    if (key === "mages") return "✨";
    if (key === "assassins") return "🗡️";
    if (key === "berserkers") return "💢";
    if (key === "giants") return "🪨";
    if (key === "elephants") return "🐘";
    if (key === "imps") return "😈";
    return "🎖️";
  };

  const getLabel = (key) => {
    if (key === "soldiers") return "Soldados";
    if (key === "archers") return "Arqueiros";
    if (key === "cavalry") return "Cavalaria";
    if (key === "mages") return "Magos";
    if (key === "spearmen" || key === "lancers") return "Lanceiros";
    if (key === "assassins") return "Assassinos";
    if (key === "berserkers") return "Berserkers";
    if (key === "giants") return "Gigantes";
    if (key === "elephants") return "Elefantes";
    if (key === "imps") return "Diabretes";
    return key;
  };

  return (
    <div className="ks-card-grid">
      {Object.entries(troops).map(([key, t]) => (
        <div key={key} className="ks-card troop-card">
          <div className="ks-card-head">
            <span className="ks-icon-circle">{getIcon(key)}</span>
            <div>
              <p className="ks-label">{getLabel(key)}</p>
              <strong className="ks-title">Lv {t.level}</strong>
            </div>
            <span className="ks-chip">ATK {t.attack}</span>
          </div>
          <div className="ks-row">
            <span className="ks-pill soft">Qtd {t.qty}</span>
            <span className="ks-pill hp">HP {t.hp}</span>
            <span className="ks-pill energy">SPD {t.speed || 5}</span>
          </div>
          <div className="ks-row">
            <button className="ks-btn ghost" onClick={() => onTrain(key, 5)}>
              Treinar +5
            </button>
            <button className="ks-btn primary" onClick={() => onUpgrade(key)}>
              Evoluir tropa
            </button>
          </div>
          {t.qty > 0 && (
            <div className="ks-row" style={{ marginTop: 8 }}>
              <span className="ks-pill success">🎯 Ativos no campo de batalha</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
