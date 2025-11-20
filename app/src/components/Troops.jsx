export default function Troops({ troops, onTrain }) {
  return (
    <div>
      <h2>⚔️ Tropas</h2>

      {Object.entries(troops).map(([key, t]) => (
        <div key={key}>
          {key}: {t.qty} (Lv {t.level}, ATK {t.attack})
          <button onClick={() => onTrain(key, 5)} style={{ marginLeft: 10 }}>
            Treinar +5
          </button>
        </div>
      ))}
    </div>
  );
}
