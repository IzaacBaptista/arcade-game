// @ts-nocheck
export default function Enemies({ enemies }) {
  return (
    <div className="ks-card-grid">
      {enemies.length === 0 ? (
        <div className="ks-empty">Nenhum inimigo no momento.</div>
      ) : (
        enemies.map(e => (
          <div key={e.id} className={`ks-card enemy-card ${e.boss ? "boss" : ""}`}>
            <div className="ks-card-head">
              <span className="ks-icon-circle danger ks-enemy-icon">
                {e.icon ?? "👹"}
              </span>

              <div>
                <p className="ks-label">{e.name}</p>
                <strong className="ks-title">HP {e.hp}</strong>

                <div className="ks-bar small">
                  <div
                    className="ks-bar-fill hp"
                    style={{ width: `${Math.max(0, Math.min(100, ((e.hp ?? 0) / (e.max_hp || e.hp || 1)) * 100))}%` }}
                  ></div>
                </div>
              </div>

              <span className="ks-chip danger">ATK {e.attack}</span>
            </div>

            <div className="ks-enemy-stats">
              <span className="ks-tag">Distância: {e.distance}</span>
              <span className="ks-tag gold">Recompensa: +{e.reward ?? 0}💰</span>
            </div>

            {e.boss && (
              <div className="ks-chip boss-tag">👑 BOSS</div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
