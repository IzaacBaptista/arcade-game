// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import Castle from "../components/Castle";
import Towers from "../components/Towers";
import Troops from "../components/Troops";
import TroopsPreview from "../components/TroopsPreview";
import TroopsModal from "../components/TroopsModal";
import Enemies from "../components/Enemies";
import Log from "../components/Log";
import Builders from "../components/Builders";
import Barracks from "../components/Barracks";
import Vault from "../components/Vault";
import VaultModal from "../components/VaultModal";
import ArmoryPreview from "../components/ArmoryPreview";
import ArmoryModal from "../components/ArmoryModal";
import BattlefieldTroops from "../components/BattlefieldTroops";
import { login, register } from "../api/gameApi";

import { useGame } from "../hooks/useGame";

export default function Game() {
  const [autoMode, setAutoMode] = useState(false);
  const [autoStatus, setAutoStatus] = useState("Auto parado");
  const [vaultOpen, setVaultOpen] = useState(false);
  const [heroModalOpen, setHeroModalOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [armoryOpen, setArmoryOpen] = useState(false);
  const [troopsOpen, setTroopsOpen] = useState(false);
  const [showHelper, setShowHelper] = useState(true);
  const [authForm, setAuthForm] = useState({ email: "", password: "", mode: "login", message: "" });
  const autoTimer = useRef(null);
  
  const {
    state,
    loading,
    setToken,
    logout,
    runStartGame,
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
    runSummonBeast,
    runSelectHero,
    runCollectTreasure,
    runUsePotion,
    runUseRareItem,
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
    heroRoster = [],
    vault = { jewels: 0, potions: {} },
  } = state || {};

  const gameOver = status === "over";
  const gameWon = status === "won";
  const isActive = status === "ongoing";

  const timeline = (() => {
    const items = [];
    const troopSpeeds = Object.values(troops || {});
    if (troopSpeeds.length > 0) {
      const totalQty = troopSpeeds.reduce((acc, t) => acc + (t.qty || 0), 0) || 1;
      const weighted = troopSpeeds.reduce((acc, t) => acc + (t.speed || 0) * (t.qty || 0), 0) / totalQty;
      items.push({ name: "Tropas", icon: "⚔️", speed: Math.round(weighted) || 5, side: "ally" });
    }
    if (towers?.length) {
      items.push({ name: "Torres", icon: "🏹", speed: 5, side: "ally" });
    }
    (enemies || []).forEach(e => items.push({ name: e.name, icon: e.icon || "👹", speed: e.speed || 4, side: "enemy", boss: e.boss }));
    return items.sort((a, b) => (b.speed || 0) - (a.speed || 0)).slice(0, 10);
  })();

  const helperTips = (() => {
    const tips = [];
    if (castle.hp < castle.max_hp * 0.4 && resources.energy >= 10 && resources.food >= 10) {
      tips.push("HP baixo: priorize curar castelo (energia + comida).");
    }
    if ((enemies?.length || 0) > (towers?.length || 0) * 2) {
      tips.push("Mais inimigos que torres: construir/upar torres pode equilibrar.");
    }
    if (resources.gold > 80 && resources.wood > 50) {
      tips.push("Recursos altos: invista em pesquisa ou upgrades antes da próxima onda.");
    }
    if ((resources.stone || 0) > 30 && (resources.iron || 0) > 15) {
      tips.push("Use pedra/ferro em pesquisas de defesa/ferro para muralha/torres.");
    }
    if (enemies?.some(e => e.boss)) {
      tips.push("Chefe em campo: feitiço de Meteoro ou Escudo ajuda a segurar o dano extra.");
    }
    if ((state.achievements?.winStreak || 0) >= 5) {
      tips.push("Streak alta: mantenha sem dano ao castelo para maximizar recompensas.");
    }
    if (tips.length === 0) tips.push("Situação estável. Continue avançando turnos ou pesquisando.");
    return tips.slice(0, 4);
  })();

  const effectsActive = (() => {
    const eff = state.effects || {};
    const rare = [];
    if (eff.ringPowerTurns > 0) rare.push({ label: "Anel ativo", turns: eff.ringPowerTurns, icon: "💍" });
    if (eff.bookTurns > 0) rare.push({ label: "Grimório ativo", turns: eff.bookTurns, icon: "📜" });
    if (eff.armorTurns > 0) rare.push({ label: "Armadura ativa", turns: eff.armorTurns, icon: "🛡️" });
    if (eff.hasteTurns > 0) rare.push({ label: "Relógio ativo", turns: eff.hasteTurns, icon: "⏳" });
    if (state.hero?.beast?.activeTurns > 0) {
      rare.push({ label: "Fera ativa", turns: state.hero.beast.activeTurns, icon: "🐉" });
    }
    return rare;
  })();

  const mapStyle = (() => {
    const name = (state.mapLayout?.name || "").toLowerCase();
    if (name.includes("gelad")) {
      return { background: "linear-gradient(180deg, #e8f4ff, #d0e4f9)" };
    }
    if (name.includes("deserto") || name.includes("cânion")) {
      return { background: "linear-gradient(180deg, #f8e3b0, #f0c98a)" };
    }
    if (name.includes("floresta")) {
      return { background: "linear-gradient(180deg, #d9f2c6, #bfe4a7)" };
    }
    return {};
  })();

  function changeDifficulty(level) {
    runStartGame(level);
  }

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
            <span className="ks-pill hp">❤️ {Math.round(castle.hp)} / {castle.max_hp}</span>
            <span className="ks-pill soft" title="Streak de vitórias">🔥 Streak {state.achievements?.winStreak ?? 0}</span>
            <span className="ks-pill stone">🪨 Pedra {resources.stone ?? 0}</span>
            <span className="ks-pill iron">⛓️ Ferro {resources.iron ?? 0}</span>
            <span className="ks-pill population">👥 Pop {resources.population ?? 0}</span>
          </div>
        </div>
        <div className="ks-hero-actions">
          <div
            className={`ks-profile-card ${profileOpen ? "open" : ""}`}
            onClick={() => setProfileOpen(p => !p)}
            style={{ cursor: "pointer" }}
            title="Clique para ver detalhes do perfil"
          >
            <div className="ks-profile-header">
              <span className="ks-profile-icon">{hero.icon || "🛡️"}</span>
              <div>
                <p className="ks-label">Herói ativo</p>
                <strong className="ks-title">{hero.name || "Herói"}</strong>
                <span className="ks-mini-label">{hero.role || "Role"}</span>
              </div>
            </div>
            {profileOpen && (
              <>
                <div className="ks-profile-meta">
                  <span className="ks-pill soft">Lv {hero.level ?? 1}</span>
                  <span className="ks-pill gold">XP {hero.xp ?? 0}</span>
                  <span className="ks-pill soft">Cargas {hero.charges ?? 0}</span>
                </div>
                <div className="ks-inline-actions" style={{ marginTop: 8 }}>
                  <button className="ks-btn ghost" onClick={(e) => { e.stopPropagation(); setHeroModalOpen(true); }}>Trocar herói</button>
                  <button className="ks-btn ghost" onClick={(e) => e.stopPropagation()}>Configurações</button>
                  <button className="ks-btn ghost" onClick={(e) => { e.stopPropagation(); logout(); }}>Logout</button>
                </div>
              </>
            )}
          </div>
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
            <button className={`ks-btn ${state.difficulty === "easy" ? "primary" : "ghost"}`} onClick={() => changeDifficulty("easy")}>Easy</button>
            <button className={`ks-btn ${state.difficulty === "medium" ? "primary" : "ghost"}`} onClick={() => changeDifficulty("medium")}>Medium</button>
            <button className={`ks-btn ${state.difficulty === "hard" ? "primary" : "ghost"}`} onClick={() => changeDifficulty("hard")}>Hard</button>
          </div>
          <div className="ks-inline-actions">
            <button className="ks-btn ghost" onClick={() => { const saved = loadSaved(); if (saved) setAutoMode(false); }}>
              Continuar sessão
            </button>
            <button className="ks-btn ghost" onClick={() => setShowHelper(!showHelper)}>
              {showHelper ? "Esconder ajuda" : "Mostrar ajuda"}
            </button>
            {state.hero?.beast?.unlocked && (
              <button className="ks-btn primary" onClick={runSummonBeast} disabled={!state.hero.beast.ready}>
                Invocar fera {state.hero.beast.ready ? "" : "(já usada)"}
              </button>
            )}
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
            <span className="ks-pill gold">XP {hero.xp ?? state.xp ?? 0}</span>
            <span className="ks-pill gold">Buff: {state.effects?.enemyWeakTurns > 0 ? "Inimigos fracos" : "Nenhum"}</span>
            <span className="ks-pill hp">Debuff: {state.effects?.castleShield ? "Escudo ativo" : "Nenhum"}</span>
            <span className="ks-pill soft">Evento: {state.lastEvent || "Nenhum"}</span>
          </div>
          <div className="ks-pill-row" style={{ marginTop: 8 }}>
            <span className="ks-pill energy">
              ⚔️ Tropas: {Object.values(troops || {}).reduce((sum, t) => sum + (t.qty || 0), 0)} unidades
            </span>
            <span className="ks-pill wood">
              🎯 Arsenal: {Object.values(armory || {}).reduce((sum, a) => sum + (a.qty || 0), 0)} equipamentos
            </span>
            <span className="ks-pill stone">
              💥 ATK Total: {
                Object.values(troops || {}).reduce((sum, t) => sum + (t.qty * t.attack || 0), 0) + 
                Object.values(armory || {}).reduce((sum, a) => sum + (a.qty * (a.attack || 0)), 0)
              }
            </span>
          </div>
          <div className="ks-timeline">
            {timeline.map((t, idx) => (
              <div key={idx} className={`ks-timeline-item ${t.side}`}>
                <span className="ks-timeline-icon">{t.icon}</span>
                <div>
                  <p className="ks-label">{t.name}</p>
                  <strong className="ks-title">SPD {t.speed}</strong>
                </div>
                {t.boss && <span className="ks-chip danger">BOSS</span>}
              </div>
            ))}
          </div>
          {showHelper && (
            <div className="ks-helper">
              <h3>Conselheiro IA (heurística)</h3>
              {helperTips.map((tip, idx) => (
                <div key={idx} className="ks-helper-item">{tip}</div>
              ))}
            </div>
          )}
          {effectsActive.length > 0 && (
            <div className="ks-helper">
              <h3>Itens ativos</h3>
              <div className="ks-effect-grid">
                {effectsActive.map((e, idx) => (
                  <div key={idx} className="ks-effect-chip">
                    <span>{e.icon} {e.label}</span>
                    <span className="ks-mini-label">{e.turns} turnos</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
            <div className="ks-map-overlay" style={mapStyle}></div>
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
            <BattlefieldTroops troops={troops} armory={armory} />
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
            <Vault
              vault={vault}
              onCollect={runCollectTreasure}
              onUsePotion={runUsePotion}
              onUseRare={runUseRareItem}
              onOpen={() => setVaultOpen(true)}
            />
          </div>
        </section>

        <section className="ks-panel troops-panel">
          <div className="ks-panel-header">
            <div>
              <p className="ks-eyebrow">Unidades em campo</p>
              <h2>Tropas</h2>
            </div>
          </div>
          <TroopsPreview troops={troops} onOpen={() => setTroopsOpen(true)} />
        </section>

        <section className="ks-panel barracks-panel">
          <div className="ks-panel-header">
            <div>
              <p className="ks-eyebrow">Quartel & Arsenal</p>
              <h2>Catapultas, canhões, cavalaria e armas</h2>
            </div>
          </div>
          <ArmoryPreview armory={armory} onOpen={() => setArmoryOpen(true)} />
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
          onUsePotion={runUsePotion}
          onUseRare={runUseRareItem}
        />
      )}
      {heroModalOpen && (
        <div className="ks-modal-backdrop" onClick={() => setHeroModalOpen(false)}>
          <div className="ks-modal" onClick={e => e.stopPropagation()}>
            <div className="ks-modal-header">
              <h3>Escolher herói</h3>
              <button className="ks-btn ghost" onClick={() => setHeroModalOpen(false)}>Fechar</button>
            </div>
            <div className="ks-hero-grid">
              {(heroRoster || []).map(h => (
                <div key={h.key} className={`ks-hero-card ${hero.key === h.key ? "active" : ""}`}>
                  <div className="ks-hero-card-head">
                    <span className="ks-hero-icon">{h.icon}</span>
                    <div>
                      <strong className="ks-title">{h.name}</strong>
                      <p className="ks-mini-label">{h.role}</p>
                    </div>
                    {hero.key === h.key && <span className="ks-chip success">Ativo</span>}
                  </div>
                  <div className="ks-hero-card-body">
                    <span className="ks-pill soft">Lv {h.level ?? 1}</span>
                    <span className="ks-pill gold">XP {h.xp ?? 0}</span>
                    <span className="ks-mini-label">Cargas {h.charges ?? 0}</span>
                  </div>
                  <button
                    className="ks-btn primary"
                    disabled={hero.key === h.key}
                    onClick={() => { runSelectHero(h.key); setHeroModalOpen(false); }}
                  >
                    {hero.key === h.key ? "Selecionado" : "Ativar"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {armoryOpen && (
        <ArmoryModal
          armory={armory}
          onClose={() => setArmoryOpen(false)}
          onBuild={(type, amount) => runBuildArmory(type, amount)}
          onUpgrade={runUpgradeArmory}
        />
      )}
      {troopsOpen && (
        <TroopsModal
          troops={troops}
          onClose={() => setTroopsOpen(false)}
          onTrain={runTrainTroops}
          onUpgrade={runUpgradeTroops}
        />
      )}
  </div>
);
}
