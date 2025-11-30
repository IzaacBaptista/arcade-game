// @ts-nocheck
const CIV_LABELS = {
  builder: { icon: "🪓", label: "Construtores", desc: "Montam torres e extraem recursos brutos." },
  farmer: { icon: "🌾", label: "Agricultores", desc: "Aumentam comida e madeira leve." },
  blacksmith: { icon: "⚒️", label: "Ferreiros", desc: "Forjam ferro para armas e torres." },
  engineer: { icon: "🧱", label: "Engenheiros", desc: "Refinam pedra e madeira técnica." },
  transporter: { icon: "🚚", label: "Transportadores", desc: "Geram energia e ouro em rotas rápidas." },
  ancient: { icon: "🔮", label: "Anciãos", desc: "Pesquisam magias e artefatos antigos." },
  prospector: { icon: "⛏️", label: "Garimpeiros", desc: "Extraem minérios raros e preciosos." },
};

export default function Builders({ builders, civilians = {}, onCollect, onHire, open = false, onOpen = () => {}, onClose = () => {} }) {
  const civs = { builder: { qty: builders.qty, level: 1 }, ...civilians };

  return (
    <>
    <div className="ks-card" style={{ cursor: "pointer" }} onClick={onOpen}>
      <div className="ks-card-head">
        <span className="ks-icon-circle">🏛️</span>
        <div>
          <p className="ks-label">Civis & Oficinas</p>
          <strong className="ks-title">{Object.values(civs).reduce((a, c) => a + (c?.qty || 0), 0)} ativos</strong>
        </div>
        <span className="ks-chip">Eficiência x{builders.efficiency}</span>
      </div>
      <p className="ks-subtitle" style={{ marginTop: 8 }}>
        Coordene civis para coletar recursos e acelerar construções.
      </p>
    </div>
    {open && (
      <div className="ks-modal-backdrop" onClick={onClose}>
        <div className="ks-modal" style={{ maxWidth: 900, width: "90%" }} onClick={e => e.stopPropagation()}>
          <div className="ks-modal-header">
            <div>
              <p className="ks-eyebrow">Civis & Oficinas</p>
              <h3>Distribua funções e contrate novos civis</h3>
            </div>
            <button className="ks-btn ghost" onClick={onClose}>Fechar</button>
          </div>
          <div className="ks-card-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            {Object.entries(CIV_LABELS).map(([key, meta]) => {
              const data = civs[key] || { qty: 0, level: 1 };
              return (
                <div key={key} className="ks-card" style={{ boxShadow: "var(--ks-shadow-soft)" }}>
                  <div className="ks-card-head">
                    <span className="ks-icon-circle">{meta.icon}</span>
                    <div>
                      <p className="ks-label">{meta.label}</p>
                      <span className="ks-mini-label">{meta.desc}</span>
                    </div>
                    <span className="ks-pill soft">Qtd {data.qty || 0}</span>
                  </div>
                  <div className="ks-card-actions" style={{ justifyContent: "space-between", marginTop: 10 }}>
                    <button className="ks-btn ghost" onClick={() => onHire(key, 1)}>Contratar +1</button>
                    <span className="ks-mini-label">Lv {data.level || 1}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="ks-card-actions" style={{ justifyContent: "space-between", marginTop: 16 }}>
            <button className="ks-btn primary" onClick={onCollect}>Coletar materiais</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
