// @ts-nocheck
export default function Enemies({ enemies }) {
  const list = (enemies || []).filter(Boolean);
  return (
    <div className="ks-card-grid">
      {list.length === 0 ? (
        <div className="ks-empty">Nenhum inimigo no momento.</div>
      ) : (
        list.map(e => {
          const hp = e?.hp ?? 0;
          const max = e?.max_hp || hp || 1;
          const pct = Math.max(0, Math.min(100, (hp / max) * 100));
          return (
          <div key={e.id} className={`ks-card enemy-card ${e.boss ? "boss" : ""}`}>
            <div className="ks-card-head">
              <span className="ks-icon-circle danger ks-enemy-icon">
                {e.icon ?? "👹"}
              </span>

              <div>
                <p className="ks-label">{e.name}</p>
                <strong className="ks-title">HP {hp}</strong>

                <div className="ks-bar small">
                  <div
                    className="ks-bar-fill hp"
                    style={{ width: `${pct}%` }}
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
        );
        })
      )}
    </div>
  );
}
