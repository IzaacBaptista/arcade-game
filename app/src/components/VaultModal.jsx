const potionData = [
  { key: "heal", label: "Poção de cura", icon: "🧪", desc: "+HP no castelo" },
  { key: "energy", label: "Poção de energia", icon: "⚡", desc: "+Energia" },
  { key: "loot", label: "Poção de saque", icon: "💰", desc: "+Ouro e madeira" },
];

export default function VaultModal({ vault, onClose, onCollect, onUse }) {
  const artifacts = vault.artifacts || [];
  const potions = vault.potions || {};

  return (
    <div className="ks-modal-backdrop" onClick={onClose}>
      <div className="ks-modal" onClick={e => e.stopPropagation()}>
        <div className="ks-modal-header">
          <div>
            <p className="ks-eyebrow">Baú do reino</p>
            <h2>{vault.jewels} joias</h2>
          </div>
          <div className="ks-inline-actions">
            <button className="ks-btn ghost" onClick={onCollect}>Coletar tesouro</button>
            <button className="ks-btn ghost" onClick={onClose}>Fechar</button>
          </div>
        </div>

        <div className="ks-row" style={{ flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
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
                  onClick={() => onUse(p.key)}
                  disabled={(potions[p.key] ?? 0) <= 0}
                >
                  Usar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
