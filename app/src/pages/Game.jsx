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
    runCollect,
    runAddTower,
    runUpgradeWall,
    runResetGame,
    runNextMap,
  } = useGame();

  if (loading || !state) {
    return <div className="ks-loading">Carregando as defesas...</div>;
  }

  const {
    castle,
    towers,
    troops,
    enemies,
    log,
    stage,
    turn,
    map,
    status,
    resources = {},
  } = state;

  const gameOver = status === "over";
  const gameWon = status === "won";
  const isActive = status === "ongoing";

  return (
    <div className="ks-layout">
      <header className="ks-hero">
        <div className="ks-hero-text">
          <p className="ks-eyebrow">Kingshot Command</p>
          <h1>Mapa {map} • Fase {stage} • Turno {turn}</h1>
          <div className="ks-pill-row" style={{ marginTop: 6, marginBottom: 6 }}>
            <span className={`ks-pill ${status === "won" ? "gold" : status === "over" ? "hp" : "soft"}`}>
              {gameWon ? "🎉 Vitória" : gameOver ? "☠️ Game Over" : "Em batalha"}
            </span>
          </div>
          <p className="ks-subtitle">
            Eleve muralhas, treine tropas e mantenha a linha enquanto os invasores avançam.
          </p>
          <div className="ks-pill-row">
            <span className="ks-pill gold">🪙 Ouro {resources.gold ?? 0}</span>
            <span className="ks-pill wood">🌲 Madeira {resources.wood ?? 0}</span>
            <span className="ks-pill hp">❤️ {castle.hp} / {castle.max_hp}</span>
          </div>
        </div>
        <div className="ks-hero-actions">
          <button className="ks-btn primary" onClick={runNextTurn} disabled={!isActive}>
            {isActive ? "Próximo turno" : "Ação indisponível"}
          </button>
          <span className="ks-mini-label">Antecipe ondas e fortaleça as torres.</span>
          <div className="ks-inline-actions">
            <button className="ks-btn ghost" onClick={runCollect} disabled={!isActive}>Coletar recursos</button>
            <button className="ks-btn ghost" onClick={runAddTower} disabled={!isActive}>Construir torre</button>
            <button className="ks-btn ghost" onClick={runUpgradeWall} disabled={!isActive}>Reforçar muralha</button>
          </div>
          <div className="ks-inline-actions">
            <button className="ks-btn ghost" onClick={runResetGame}>Resetar jogo</button>
            <button className="ks-btn ghost" onClick={runNextMap} disabled={!gameWon}>Próximo mapa</button>
          </div>
        </div>
      </header>

      {(gameOver || gameWon) && (
        <div className={`ks-alert ${gameOver ? "danger" : "success"}`}>
          {gameOver ? "O castelo foi destruído. Reinicie para tentar de novo." : `Mapa ${map} conquistado! Avance para o próximo mapa.`}
        </div>
      )}

      <div className="ks-grid">
        <section className="ks-panel map-panel">
          <div className="ks-panel-header">
            <div>
              <p className="ks-eyebrow">Mapa de batalha</p>
              <h2>Perímetro de defesa</h2>
            </div>
            <div className="ks-badges">
              <span className="ks-badge">Torres: {towers.length}</span>
              <span className="ks-badge danger">Inimigos: {enemies.length}</span>
            </div>
          </div>

          <div className="ks-map">
            <div className="ks-map-ring ring-1" />
            <div className="ks-map-ring ring-2" />
            <div className="ks-map-ring ring-3" />
            <div className="ks-map-center">
              <span className="ks-map-flag">🏰</span>
            </div>
            <div className="ks-path">Rotas inimigas</div>
            <div className="ks-map-grid">
              <Towers towers={towers} onUpgrade={runUpgradeTower} />
              <Enemies enemies={enemies} />
            </div>
          </div>
        </section>

        <section className="ks-panel castle-panel">
          <div className="ks-panel-header">
            <div>
              <p className="ks-eyebrow">Coração do reino</p>
              <h2>Castelo</h2>
            </div>
          </div>
          <Castle castle={castle} />
        </section>

        <section className="ks-panel troops-panel">
          <div className="ks-panel-header">
            <div>
              <p className="ks-eyebrow">Unidades em campo</p>
              <h2>Tropas</h2>
            </div>
          </div>
          <Troops troops={troops} onTrain={runTrainTroops} />
        </section>

        <section className="ks-panel log-panel">
          <div className="ks-panel-header">
            <div>
              <p className="ks-eyebrow">Inteligência</p>
              <h2>Relatório</h2>
            </div>
          </div>
          <Log log={log} />
        </section>
      </div>
    </div>
  );
}
