export default function Castle({ castle }) {
  const hpPercent = Math.round((castle.hp / castle.max_hp) * 100);

  return (
    <div>
      <h2>🏰 Castelo</h2>
      <div>
        Vida: {castle.hp} / {castle.max_hp} ({hpPercent}%)
      </div>
      <div>
        Nível da muralha: {castle.wall_level} • Bônus de defesa: {castle.defense_bonus}%
      </div>
      <div style={{ marginTop: 8, background: "#eee", height: 12, width: 240 }}>
        <div
          style={{
            height: "100%",
            width: `${hpPercent}%`,
            background: hpPercent > 50 ? "#4caf50" : "#e67e22",
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}
