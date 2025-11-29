// @ts-nocheck
const potionData = [
  { key: "heal", label: "Poção de cura", icon: "🧪", desc: "+HP no castelo" },
  { key: "energy", label: "Poção de energia", icon: "⚡", desc: "+Energia" },
  { key: "loot", label: "Poção de saque", icon: "💰", desc: "+Ouro e madeira" },
];

const rareData = [
  { key: "ring", label: "Anel de Poder", icon: "💍" },
  { key: "book", label: "Grimório", icon: "📜" },
  { key: "armor", label: "Armadura Sagrada", icon: "🛡️" },
  { key: "haste", label: "Relógio Arcano", icon: "⏳" },
];

export default function VaultModal({ vault, onClose, onCollect, onUsePotion, onUseRare }) {
  const artifacts = vault.artifacts || [];
  const potions = vault.potions || {};
  const rare = vault.rare || [];

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
                  onClick={() => onUsePotion(p.key)}
                  disabled={(potions[p.key] ?? 0) <= 0}
                >
                  Usar
                </button>
              </div>
            </div>
          ))}
        </div>

        <h3 style={{ marginTop: 12 }}>Itens raros</h3>
        <div className="ks-vault-grid">
          {rareData.map(r => {
            const item = rare.find(x => x.key === r.key) || {};
            const active = item.activeTurns > 0;
            const maxTurns = r.key === "haste" ? 2 : 3;
            const pct = active ? Math.max(0, Math.min(100, (item.activeTurns / maxTurns) * 100)) : 0;
            return (
              <div key={r.key} className="ks-card" title={item.desc || ""}>
                <div className="ks-card-head">
                  <span className="ks-icon-circle">{r.icon}</span>
                  <div>
                    <p className="ks-label">{item.label || r.label}</p>
                    <strong className="ks-title">{item.unlocked ? "Desbloqueado" : "Bloqueado"}</strong>
                  </div>
                </div>
                <p className="ks-subtitle">{item.desc || "Item raro"}</p>
                {active && (
                  <div className="ks-bar small">
                    <div className="ks-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                )}
                <div className="ks-card-actions">
                  <button
                    className="ks-btn ghost"
                    onClick={() => onUseRare(r.key)}
                    disabled={!item.unlocked}
                  >
                    Ativar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
