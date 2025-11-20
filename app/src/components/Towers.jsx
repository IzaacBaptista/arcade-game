export default function Towers({ towers, onUpgrade }) {
  return (
    <div>
      <h2>🏹 Torres</h2>

      {towers.map(t => (
        <div key={t.id}>
          <strong>{t.name}</strong> — Lv {t.level} — Dano {t.damage}
          <button onClick={() => onUpgrade(t.id)} style={{ marginLeft: 10 }}>
            Upar
          </button>
        </div>
      ))}
    </div>
  );
}
