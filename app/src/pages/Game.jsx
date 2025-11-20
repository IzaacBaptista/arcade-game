import Castle from "../components/Castle";
import Towers from "../components/Towers";
import Troops from "../components/Troops";
import Enemies from "../components/Enemies";
import Log from "../components/Log";

import { useGame } from "../hooks/useGame";

export default function Game() {
  const {
    state,
    loading,
    runNextTurn,
    runUpgradeTower,
    runTrainTroops,
  } = useGame();

  if (loading || !state) return <p>Carregando...</p>;

  const { castle, towers, troops, enemies, log, stage, turn } = state;

  return (
    <div style={{ padding: 20 }}>
      <h1>🎮 Kingshot Terminal — React Front</h1>
      <h3>Fase {stage} • Turno {turn}</h3>

      <Castle castle={castle} />

      <Towers towers={towers} onUpgrade={runUpgradeTower} />

      <Troops troops={troops} onTrain={runTrainTroops} />

      <Enemies enemies={enemies} />

      <button onClick={runNextTurn} style={{ marginTop: 20 }}>
        ➡️ Próximo turno
      </button>

      <Log log={log} />
    </div>
  );
}
