const labels = {
  catapults: "Catapultas",
  cannons: "Canhões antigos",
  horses: "Cavalos",
  cavalry: "Cavalaria",
  shields: "Escudos",
  spears: "Lanças"
};

export default function Barracks({ armory, onBuild, onUpgrade }) {
  return (
    <div className="ks-card-grid">
      {Object.entries(armory).map(([key, item]) => (
        <div key={key} className="ks-card">
          <div className="ks-card-head">
            <span className="ks-icon-circle">🏹</span>
            <div>
              <p className="ks-label">{labels[key] ?? key}</p>
              <strong className="ks-title">Lv {item.level}</strong>
            </div>
            <span className="ks-chip">{item.qty} em estoque</span>
          </div>
          <div className="ks-row">
            <span className="ks-pill soft">
              {item.attack ? `ATK ${item.attack}` : `DEF ${item.defense}`}
            </span>
            <span className="ks-pill soft">Função: {item.role}</span>
          </div>
          <div className="ks-card-actions" style={{ justifyContent: "space-between", marginTop: 10 }}>
            <button className="ks-btn ghost" onClick={() => onBuild(key, 1)}>Fabricar +1</button>
            <button className="ks-btn primary" onClick={() => onUpgrade(key)}>Melhorar</button>
          </div>
        </div>
      ))}
    </div>
  );
}
