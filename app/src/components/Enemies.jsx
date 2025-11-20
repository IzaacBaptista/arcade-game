export default function Enemies({ enemies }) {
  return (
    <div>
      <h2>👹 Inimigos</h2>

      {enemies.length === 0 ? (
        <p>Nenhum inimigo no momento.</p>
      ) : (
        enemies.map(e => (
          <div key={e.id}>
            {e.name} — HP {e.hp} — ATK {e.attack}
          </div>
        ))
      )}
    </div>
  );
}
