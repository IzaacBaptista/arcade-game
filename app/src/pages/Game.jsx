import { useEffect, useRef, useState } from "react";
import Castle from "../components/Castle";
import Towers from "../components/Towers";
import Troops from "../components/Troops";
import Enemies from "../components/Enemies";
import Log from "../components/Log";
import Builders from "../components/Builders";
import Barracks from "../components/Barracks";
import Vault from "../components/Vault";
import VaultModal from "../components/VaultModal";
import { login, register } from "../api/gameApi";

import { useGame } from "../hooks/useGame";

export default function Game() {
  const [autoMode, setAutoMode] = useState(false);
  const [autoStatus, setAutoStatus] = useState("Auto parado");
  const [vaultOpen, setVaultOpen] = useState(false);
  const [authForm, setAuthForm] = useState({ email: "", password: "", mode: "login", message: "" });
  const autoTimer = useRef(null);
  const {
    state,
    loading,
    token,
    setToken,
    runNextTurn,
    runUpgradeTower,
    runTrainTroops,
    runUpgradeTroops,
    runUpgradeResearch,
    runCollect,
    runCollectBuilders,
    runHireBuilders,
    runAddTower,
    runUpgradeWall,
    runHealCastle,
    runCastSpell,
    runApplyRune,
    runCollectTreasure,
    runUsePotion,
    runBuildArmory,
    runUpgradeArmory,
    runResetGame,
    runNextMap,
    loadSaved,
    loadStatus,
  } = useGame();

  useEffect(() => {
    if (!state) return () => {};

    const { castle, enemies, status } = state;
    const isActive = status === "ongoing";

    if (!autoMode) return () => {};

    const lowHp = castle.hp <= castle.max_hp * 0.25;
    const bossPresent = (enemies || []).some(e => e.boss);

    if (!isActive) {
      setAutoMode(false);
      setAutoStatus("Auto pausado: batalha encerrada");
      return () => {};
    }

    if (lowHp || bossPresent) {
      setAutoMode(false);
      setAutoStatus(lowHp ? "Auto pausado: HP < 25%" : "Auto pausado: BOSS em campo");
      return () => {};
    }

    setAutoStatus("Auto rodando…");
    autoTimer.current = setTimeout(() => {
      runNextTurn();
    }, 1200);

    return () => {
      if (autoTimer.current) clearTimeout(autoTimer.current);
    };
  }, [autoMode, state, runNextTurn]);

  useEffect(() => () => {
    if (autoTimer.current) clearTimeout(autoTimer.current);
  }, []);

  function toggleAuto() {
    if (autoMode) {
      setAutoMode(false);
      setAutoStatus("Auto parado");
      return;
    }
    if (!isActive) {
      setAutoStatus("Auto indisponível: fora de batalha");
      return;
    }
    setAutoMode(true);
  }

  if (loading || !state) {
    return (
      <div className="kingshot-shell">
        <div className="ks-layout" style={{ maxWidth: 480 }}>
          <div className="ks-panel">
            <h2>Login</h2>
            <form onSubmit={handleAuthSubmit} className="ks-auth-form">
              <input
                type="email"
                placeholder="Email"
                value={authForm.email}
                onChange={e => setAuthForm({ ...authForm, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Senha"
                value={authForm.password}
                onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
                required
              />
              <div className="ks-inline-actions">
                <button className="ks-btn primary" type="submit">
                  {authForm.mode === "login" ? "Entrar" : "Registrar"}
                </button>
                <button
                  className="ks-btn ghost"
                  type="button"
                  onClick={() =>
                    setAuthForm({
                      ...authForm,
                      mode: authForm.mode === "login" ? "register" : "login",
                      message: ""
                    })
                  }
                >
                  Mudar para {authForm.mode === "login" ? "Registrar" : "Login"}
                </button>
              </div>
              {authForm.message && <div className="ks-alert">{authForm.message}</div>}
            </form>
          </div>
        </div>
      </div>
    );
  }

  const {
    castle = { hp: 0, max_hp: 0 },
    towers = [],
    troops = {},
    enemies = [],
    log = [],
    stage = 1,
    turn = 1,
    map = 1,
    status = "ongoing",
    resources = {},
    builders = { qty: 0, efficiency: 1 },
    armory = {},
    research = { tower: 0, troop: 0, siege: 0, defense: 0 },
    hero = { name: "Herói", charges: 0, cooldown: 0 },
    vault = { jewels: 0, potions: {} },
  } = state || {};

  const gameOver = status === "over";
  const gameWon = status === "won";
  const isActive = status === "ongoing";

  async function handleAuthSubmit(e) {
    e.preventDefault();
    const fn = authForm.mode === "login" ? login : register;
    const res = await fn(authForm.email, authForm.password);
    if (res.token) {
      localStorage.setItem("kingshot-token", res.token);
      setToken(res.token);
      setAuthForm({ ...authForm, message: "Autenticado!" });
      loadStatus();
    } else {
      setAuthForm({ ...authForm, message: res.msg || "Erro" });
    }
  }

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
            <span className="ks-pill energy">⚡ Energia {resources.energy ?? 0}</span>
            <span className="ks-pill food">🥘 Comida {resources.food ?? 0}</span>
            <span className="ks-pill hp">❤️ {castle.hp} / {castle.max_hp}</span>
            <span className="ks-pill soft" title="Streak de vitórias">🔥 Streak {state.achievements?.winStreak ?? 0}</span>
          </div>
        </div>
        <div className="ks-hero-actions">
          <button className="ks-btn primary" onClick={runNextTurn} disabled={!isActive}>
            {isActive ? "Próximo turno" : "Ação indisponível"}
          </button>
          <span className="ks-mini-label">Antecipe ondas e fortaleça as torres. Herói: {hero.charges} cargas • CD {hero.cooldown}</span>
          <div className="ks-inline-actions">
            <button className={`ks-btn ${autoMode ? "primary" : "ghost"}`} onClick={toggleAuto}>
              {autoMode ? "Auto turnos: ON" : "Auto turnos: OFF"}
            </button>
            <span className="ks-mini-label">{autoStatus}</span>
          </div>
          <div className="ks-inline-actions">
            <button className="ks-btn ghost" onClick={() => { const saved = loadSaved(); if (saved) setAutoMode(false); }}>
              Continuar sessão
            </button>
          </div>
          <div className="ks-inline-actions">
            <button className="ks-btn ghost" title="Meteoro direto no inimigo da frente" onClick={() => runCastSpell("meteor")} disabled={!isActive}>
              Feitiço: Meteoro
            </button>
            <button className="ks-btn ghost" title="Enfraquece inimigos por 2 turnos" onClick={() => runCastSpell("ice")} disabled={!isActive}>
              Feitiço: Gelo
            </button>
            <button className="ks-btn ghost" title="Escudo temporário no castelo" onClick={() => runCastSpell("shield")} disabled={!isActive}>
              Feitiço: Escudo
            </button>
          </div>
          <div className="ks-inline-actions">
            <button className="ks-btn ghost" title="Runa de poder: buff em torres" onClick={() => runApplyRune("power")} disabled={!isActive}>
              Runa de poder (Lv {state.runes?.power ?? 0})
            </button>
            <button className="ks-btn ghost" title="Runa de guarda: defesa extra" onClick={() => runApplyRune("guard")} disabled={!isActive}>
              Runa de guarda (Lv {state.runes?.guard ?? 0})
            </button>
          </div>
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
        <section className="ks-panel hud-panel">
          <div className="ks-pill-row">
            <span className="ks-pill soft">Turno {turn}</span>
            <span className="ks-pill soft">Fase {stage}</span>
            <span className="ks-pill soft">Mapa {map}</span>
            <span className="ks-pill soft">Streak {state.achievements?.winStreak ?? 0}</span>
            <span className="ks-pill gold">Buff: {state.effects?.enemyWeakTurns > 0 ? "Inimigos fracos" : "Nenhum"}</span>
            <span className="ks-pill hp">Debuff: {state.effects?.castleShield ? "Escudo ativo" : "Nenhum"}</span>
          </div>
        </section>

        <section className="ks-panel map-panel">
          <div className="ks-panel-header">
            <div>
              <p className="ks-eyebrow">Mapa de batalha</p>
              <h2>Perímetro de defesa</h2>
              <p className="ks-subtitle"> {state.mapLayout?.name} • Rotas: {state.mapLayout?.paths} • Obstáculos: {(state.mapLayout?.effects?.obstacles || []).join(", ")}</p>
            </div>
            <div className="ks-badges">
              <span className="ks-badge">Torres: {towers.length}</span>
              <span className="ks-badge danger">Inimigos: {enemies.length}</span>
            </div>
          </div>

          <div className="ks-map">
            <div className="ks-obstacles">
              {(state.mapLayout?.effects?.obstacles || []).map((obs, idx) => (
                <span key={idx} className="ks-tag">
                  {obs}
                  <span className="ks-obstacle-icon">
                    {obs.includes("lama") ? "🪨" : obs.includes("neblina") ? "🌫️" : obs.includes("ruína") ? "🏛️" : "🪵"}
                  </span>
                </span>
              ))}
            </div>
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
          <div className="ks-inline-actions" style={{ marginTop: 12 }}>
            <button className="ks-btn primary" onClick={runHealCastle} disabled={!isActive}>
              Curar castelo (energia + comida)
            </button>
            <button className="ks-btn ghost" onClick={runUpgradeWall} disabled={!isActive}>Reforçar muralha</button>
          </div>
          <div className="ks-inline-actions" style={{ marginTop: 12 }}>
            <button className="ks-btn ghost" title="Pesquisa de torres (+dano)" onClick={() => runUpgradeResearch("tower")} disabled={!isActive}>
              Pesquisa: Torres (Lv {research.tower})
            </button>
            <button className="ks-btn ghost" title="Pesquisa de tropas (+ATK)" onClick={() => runUpgradeResearch("troop")} disabled={!isActive}>
              Pesquisa: Tropas (Lv {research.troop})
            </button>
            <button className="ks-btn ghost" title="Pesquisa de cerco (+dano)" onClick={() => runUpgradeResearch("siege")} disabled={!isActive}>
              Pesquisa: Cerco (Lv {research.siege})
            </button>
            <button className="ks-btn ghost" title="Pesquisa de defesa (+DEF)" onClick={() => runUpgradeResearch("defense")} disabled={!isActive}>
              Pesquisa: Defesa (Lv {research.defense})
            </button>
          </div>
          <div style={{ marginTop: 12 }}>
            <Builders builders={builders} onCollect={runCollectBuilders} onHire={runHireBuilders} />
          </div>
          <div className="ks-inline-actions" style={{ marginTop: 12 }}>
            <Vault vault={vault} onCollect={runCollectTreasure} onUse={runUsePotion} onOpen={() => setVaultOpen(true)} />
          </div>
        </section>

        <section className="ks-panel troops-panel">
          <div className="ks-panel-header">
            <div>
              <p className="ks-eyebrow">Unidades em campo</p>
              <h2>Tropas</h2>
            </div>
          </div>
          <Troops troops={troops} onTrain={runTrainTroops} onUpgrade={runUpgradeTroops} />
        </section>

        <section className="ks-panel barracks-panel">
          <div className="ks-panel-header">
            <div>
              <p className="ks-eyebrow">Quartel & Arsenal</p>
              <h2>Catapultas, canhões, cavalaria e armas</h2>
            </div>
          </div>
          <Barracks
            armory={armory}
            onBuild={(type, amount) => runBuildArmory(type, amount)}
            onUpgrade={runUpgradeArmory}
          />
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
      {vaultOpen && (
        <VaultModal
          vault={vault}
          onClose={() => setVaultOpen(false)}
          onCollect={runCollectTreasure}
          onUse={runUsePotion}
        />
      )}
  </div>
);
}
