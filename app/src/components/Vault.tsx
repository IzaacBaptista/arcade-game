// @ts-nocheck
export default function Vault({ vault, onCollect, onUsePotion, onUseRare, onOpen }) {
  const artifacts = vault.artifacts || [];
  const potions = vault.potions || {};
  
  // Conta total de poções
  const totalPotions = Object.values(potions).reduce((sum, qty) => sum + (qty || 0), 0);

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

      <div className="ks-row" style={{ marginTop: 6, flexWrap: "wrap", gap: 6 }}>
        <span className="ks-pill soft">🧪 {totalPotions} poções</span>
        <span className="ks-pill soft">📦 {artifacts.length} artefatos</span>
      </div>

      <div className="ks-mini-label" style={{ marginTop: 6 }}>Clique para ver poções e itens</div>
    </div>
  );
}
