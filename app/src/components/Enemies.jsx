export default function Enemies({ enemies }) {
  return (
    <div className="ks-card-grid">
      {enemies.length === 0 ? (
        <div className="ks-empty">Nenhum inimigo no momento.</div>
      ) : (
        enemies.map(e => (
          <div key={e.id} className="ks-card enemy-card">
            <div className="ks-card-head">
              <span className="ks-icon-circle danger">👹</span>
              <div>
                <p className="ks-label">{e.name}</p>
                <strong className="ks-title">HP {e.hp}</strong>
              </div>
              <span className="ks-chip danger">ATK {e.attack}</span>
            </div>
            {e.boss && <div className="ks-chip danger" style={{ marginTop: 8 }}>BOSS</div>}
          </div>
        ))
      )}
    </div>
  );
}
