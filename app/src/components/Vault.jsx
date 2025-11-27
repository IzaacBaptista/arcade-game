const potionData = [
  { key: "heal", label: "Poção de cura", icon: "🧪", desc: "+HP no castelo" },
  { key: "energy", label: "Poção de energia", icon: "⚡", desc: "+Energia" },
  { key: "loot", label: "Poção de saque", icon: "💰", desc: "+Ouro e madeira" },
];

export default function Vault({ vault, onCollect, onUsePotion, onUseRare, onOpen }) {
  const artifacts = vault.artifacts || [];
  const potions = vault.potions || {};

  return (
    <div className="ks-card vault-card">
      <div className="ks-card-head" style={{ cursor: "pointer" }} onClick={onOpen} title="Abrir baú e ver itens">
        <span className="ks-icon-circle">🗄️</span>
        <div>
          <p className="ks-label">Tesouros</p>
          <strong className="ks-title">{vault.jewels} joias</strong>
        </div>
        <button className="ks-btn primary" onClick={onCollect} style={{ marginLeft: "auto" }}>
          Abrir baú
        </button>
      </div>

      <div className="ks-row" style={{ marginTop: 10, flexWrap: "wrap", gap: 6 }}>
        {artifacts.length === 0 ? (
          <span className="ks-pill soft">Nenhum artefato ainda</span>
        ) : (
          artifacts.map((a, idx) => (
            <span key={idx} className="ks-pill gold" title={a.desc || "Artefato especial"}>
              {a.icon || "🔸"} {a.name || "Artefato"}
            </span>
          ))
        )}
      </div>

      <div className="ks-mini-label" style={{ marginTop: 6 }}>Clique para ver poções e itens</div>

      <div className="ks-vault-grid">
        {potionData.map(p => (
          <div key={p.key} className="ks-card" title={p.desc}>
            <div className="ks-card-head">
              <span className="ks-icon-circle">{p.icon}</span>
              <div>
                <p className="ks-label">{p.label}</p>
                <strong className="ks-title">Qtd {potions[p.key] ?? 0}</strong>
              </div>
            </div>
            <p className="ks-subtitle">{p.desc}</p>
            <div className="ks-card-actions">
              <button
                className="ks-btn ghost"
                onClick={() => onUsePotion(p.key)}
                disabled={(potions[p.key] ?? 0) <= 0}
              >
                Usar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
