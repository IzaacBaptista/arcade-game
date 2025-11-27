export default function BattlefieldTroops({ troops, armory }) {
  // Calcula total de tropas no campo
  const totalTroops = Object.values(troops || {}).reduce((sum, troop) => sum + (troop.qty || 0), 0);
  
  // Calcula total de equipamentos
  const totalArmory = Object.values(armory || {}).reduce((sum, item) => sum + (item.qty || 0), 0);

  if (totalTroops === 0 && totalArmory === 0) {
    return (
      <div className="ks-battlefield-troops empty">
        <span className="ks-empty-message">Sem tropas no campo</span>
      </div>
    );
  }

  return (
    <div className="ks-battlefield-troops">
      {/* Exibe tropas */}
      {Object.entries(troops || {}).map(([type, troop]) => {
        if (troop.qty <= 0) return null;
        
        const icon = type === "soldiers" ? "⚔️" : type === "archers" ? "🏹" : "🛡️";
        
        return (
          <div key={type} className="ks-troop-unit" title={`${troop.qty} ${type} (ATK ${troop.attack})`}>
            <span className="ks-troop-icon">{icon}</span>
            <span className="ks-troop-count">{troop.qty}</span>
          </div>
        );
      })}

      {/* Exibe armamento */}
      {Object.entries(armory || {}).map(([type, item]) => {
        if (item.qty <= 0) return null;
        
        const icons = {
          catapults: "🎯",
          cannons: "💥", 
          horses: "🐎",
          cavalry: "🐴",
          shields: "🛡️",
          spears: "🗡️"
        };
        
        const icon = icons[type] || "⚔️";
        const attack = item.attack || item.defense || 0;
        
        return (
          <div key={type} className="ks-armory-unit" title={`${item.qty} ${type} (${item.attack ? `ATK ${attack}` : `DEF ${attack}`})`}>
            <span className="ks-armory-icon">{icon}</span>
            <span className="ks-armory-count">{item.qty}</span>
          </div>
        );
      })}
    </div>
  );
}