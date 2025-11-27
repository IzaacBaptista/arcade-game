const { randomUUID } = require("crypto");
const { gameState, initialState } = require("../data/gameState");

function shortageMessage(required) {
  const res = gameState.resources;
  const missing = [];
  if (required.gold && res.gold < required.gold) missing.push(`ouro ${res.gold}/${required.gold}`);
  if (required.wood && res.wood < required.wood) missing.push(`madeira ${res.wood}/${required.wood}`);
  if (required.energy && res.energy < required.energy) missing.push(`energia ${res.energy}/${required.energy}`);
  if (required.food && res.food < required.food) missing.push(`comida ${res.food}/${required.food}`);
  if (required.stone && res.stone < required.stone) missing.push(`pedra ${res.stone}/${required.stone}`);
  if (required.iron && res.iron < required.iron) missing.push(`ferro ${res.iron}/${required.iron}`);
  return missing.length ? `Recursos insuficientes: ${missing.join(", ")}` : "Recursos insuficientes.";
}

class GameEngine {
  constructor() {
    this.enemySeq = 0;
    this.mapLayouts = [
      { name: "Vale Sereno", paths: 2, effects: { enemySlow: 0.08, towerBuff: 0.05, obstacles: ["lama", "pedras"] } },
      { name: "Desfiladeiro Sombrio", paths: 3, effects: { enemySlow: 0.12, towerBuff: 0.0, obstacles: ["neblina", "raízes"] } },
      { name: "Ruínas Antigas", paths: 2, effects: { enemySlow: 0.04, towerBuff: 0.1, obstacles: ["ruína", "estátua"] } },
      { name: "Floresta Encantada", paths: 4, effects: { enemySlow: 0.1, towerBuff: 0.03, obstacles: ["árvores", "lama"] } },
      { name: "Montanhas Geladas", paths: 3, effects: { enemySlow: 0.15, towerBuff: 0.0, obstacles: ["gelo", "neblina"] } },
      { name: "Pântano Nebuloso", paths: 2, effects: { enemySlow: 0.2, towerBuff: 0.0, obstacles: ["lama", "neblina"] } },
      { name: "Deserto Escaldante", paths: 3, effects: { enemySlow: 0.05, towerBuff: 0.07, obstacles: ["areia", "rochas"] } },
      { name: "Cânion Ardente", paths: 3, effects: { enemySlow: 0.07, towerBuff: 0.05, obstacles: ["rochas", "fumaça"] } },
      { name: "Planície Ventosa", paths: 2, effects: { enemySlow: 0.03, towerBuff: 0.08, obstacles: ["grama", "pedras"] } }
    ];
  }

  resetState(keepMap = false) {
    const fresh = JSON.parse(JSON.stringify(initialState));
    this.enemySeq = 0;
    if (keepMap) {
      fresh.map = gameState.map + 1;
    }
    fresh.mapLayout = this.pickLayout(fresh.map);

    if (keepMap) {
      // mantém inventário acumulado
      fresh.vault = JSON.parse(JSON.stringify(gameState.vault || initialState.vault));
      // garante poções e joias mínimas
      fresh.vault.jewels = fresh.vault.jewels ?? 0;
      fresh.vault.potions = fresh.vault.potions || { heal: 0, energy: 0, loot: 0 };
    }
    // desbloqueia a fera gigante a partir do mapa 2
    if (fresh.map >= 2) {
      fresh.hero.beast = { unlocked: true, ready: true, activeTurns: 0 };
    }

    // garante itens raros disponíveis após mapa 2
    if (fresh.vault && fresh.vault.rare) {
      fresh.vault.rare = fresh.vault.rare.map(r => {
        if (fresh.map >= 2) return { ...r, unlocked: true };
        return r;
      });
    }
    Object.assign(gameState, fresh);
  }

  startGame() {
    this.resetState();
    gameState.enemies = this.generateEnemies(gameState.stage);
    return gameState;
  }

  status() {
    return gameState;
  }

  buildEnemy(name, baseHp, baseAttack, difficulty, distance, isBoss = false, role = "normal") {
    const bossMultiplier = isBoss ? 3.2 : 1;
    const hp = Math.floor((baseHp + difficulty * 2) * bossMultiplier);
    const attack = Math.floor((baseAttack + difficulty * 1.5) * bossMultiplier);
    const baseSpeed = role === "flyer" ? 10 : role === "support" ? 6 : role === "tank" ? 4 : 7;
    const initiative = isBoss ? 2 : role === "flyer" ? 1 : 0;

    const resist = {
      tower: role === "tank" ? 0.75 : 1,
      troop: role === "tank" ? 0.8 : 1,
      siege: role === "tank" ? 0.9 : 1,
      flyer: role === "flyer"
    };

    return {
      id: randomUUID(),
      name,
      icon: this.getEnemyIcon(name),
      hp,
      max_hp: hp,
      attack,
      distance,
      reward: this.getEnemyReward(name, isBoss),
      boss: isBoss,
      role,
      resist,
      shieldReady: isBoss,
      speed: baseSpeed,
      initiative,
      bossSkills: isBoss ? ["fury", "stomp", "gobcall", "resist"] : []
    };
  }

  getEnemyIcon(name) {
    const map = {
      "Goblin": "👺",
      "Ork": "🧌",
      "Lobo Ágil": "🐺",
      "Chefe: Juggernaut": "👑",
      "Batedor Alado": "🦅",
      "Xamã": "🧙"
    };
    return map[name] || "👹";
  }

  getEnemyReward(name, isBoss) {
    if (isBoss) return 80;
    const baseRewards = {
      "Goblin": 5,
      "Ork": 12,
      "Lobo Ágil": 9
    };
    return baseRewards[name] ?? 6;
  }

  generateEnemies(stage) {
    const difficulty = stage + gameState.map * 2;
    const enemies = [
      this.buildEnemy("Goblin", 12, 4, difficulty, 3),
      this.buildEnemy("Ork", 28, 7, difficulty, 4, false, "tank"),
      this.buildEnemy("Batedor Alado", 14, 6, difficulty, 2, false, "flyer")
    ];

    if (stage >= 2) {
      enemies.push(this.buildEnemy("Lobo Ágil", 18, 9, difficulty, 2));
      enemies.push(this.buildEnemy("Xamã", 20, 5, difficulty, 3, false, "support"));
    }

    const isBossStage = stage === gameState.maxStage;
    if (isBossStage) {
      enemies.push(this.buildEnemy("Chefe: Juggernaut", 90, 16, difficulty * 1.6, 4, true, "boss"));
    }

    return enemies;
  }

  pickLayout(mapNumber) {
    const idx = (mapNumber - 1) % this.mapLayouts.length;
    return JSON.parse(JSON.stringify(this.mapLayouts[idx]));
  }

  ensureWorkersCount() {
    if (!gameState.builders.workers) gameState.builders.workers = [];
    while (gameState.builders.workers.length < (gameState.builders.qty || 0)) {
      const id = gameState.builders.workers.length + 1;
      gameState.builders.workers.push({ id, profession: "wood", fatigue: 0, dead: false });
    }
    if (gameState.builders.workers.length > (gameState.builders.qty || 0)) {
      gameState.builders.workers = gameState.builders.workers.slice(0, gameState.builders.qty);
    }
  }

  ensureOngoing(log) {
    if (gameState.status !== "ongoing") {
      if (log) {
        log.unshift(`Partida finalizada (${gameState.status}).`);
      }
      return false;
    }
    return true;
  }

  collectResources() {
    const log = [];
    if (!this.ensureOngoing(log)) return { msg: "Partida encerrada.", state: this.status() };

    if (gameState.actionLocks.lastCollectTurn === gameState.turn) {
      return { msg: "Coleta limitada a 1 por turno.", state: this.status() };
    }

    const gold = 20 + gameState.stage * 5 + gameState.map * 3;
    const wood = 15 + gameState.stage * 4 + gameState.map * 2;
    const food = 12 + gameState.stage * 3 + gameState.map * 2;
    const energy = 6 + gameState.stage * 2;
    const stone = 8 + gameState.stage * 3;
    const iron = 5 + gameState.stage * 2 + gameState.map;
    gameState.resources.gold += gold;
    gameState.resources.wood += wood;
    gameState.resources.food += food;
    gameState.resources.energy += energy;
    gameState.resources.stone += stone;
    gameState.resources.iron += iron;
    gameState.xp += 5 + gameState.stage;
    gameState.actionLocks.lastCollectTurn = gameState.turn;
    log.push(`Coletou +${gold} ouro, +${wood} madeira, +${food} comida, +${energy} energia, +${stone} pedra, +${iron} ferro.`);
    gameState.log = [...log, ...gameState.log].slice(0, 10);

    return { msg: "Recursos coletados", state: this.status() };
  }

  addTower() {
    const log = [];
    if (!this.ensureOngoing(log)) return { msg: "Partida encerrada.", state: this.status() };

    const costGold = 60 + 10 * gameState.stage + 5 * gameState.map;
    const costWood = 35 + 8 * gameState.stage + 4 * gameState.map;

    if (gameState.resources.gold < costGold || gameState.resources.wood < costWood) {
      return { msg: shortageMessage({ gold: costGold, wood: costWood }), state: this.status() };
    }

    gameState.resources.gold -= costGold;
    gameState.resources.wood -= costWood;

    const nextId = (gameState.towers[gameState.towers.length - 1]?.id || 0) + 1;
    const newTower = {
      id: nextId,
      name: `Torre ${nextId}`,
      level: 1,
      damage: 12 + gameState.stage * 3 + gameState.map * 2
    };

    gameState.towers.push(newTower);
    log.push(`${newTower.name} construída! (custo ${costGold} ouro / ${costWood} madeira)`);
    gameState.log = [...log, ...gameState.log].slice(0, 10);

    return { msg: "Torre construída", state: this.status() };
  }

  upgradeWall() {
    const log = [];
    if (!this.ensureOngoing(log)) return { msg: "Partida encerrada.", state: this.status() };

    const costWood = 45 + gameState.castle.wall_level * 20 + gameState.map * 5;
    if (gameState.resources.wood < costWood) {
      return { msg: shortageMessage({ wood: costWood }), state: this.status() };
    }

    gameState.resources.wood -= costWood;
    gameState.castle.wall_level += 1;
    gameState.castle.defense_bonus += 5;

    log.push(`Muralha reforçada para nível ${gameState.castle.wall_level} (custo ${costWood} madeira)`);
    gameState.log = [...log, ...gameState.log].slice(0, 10);

    return { msg: "Muralha reforçada", state: this.status() };
  }

  resetGame() {
    this.resetState();
    gameState.enemies = this.generateEnemies(gameState.stage);
    return this.status();
  }

  nextMap() {
    if (gameState.status !== "won") {
      return { msg: "Mapa atual não foi vencido ainda.", state: this.status() };
    }
    this.resetState(true);
    gameState.status = "ongoing";
    gameState.enemies = this.generateEnemies(gameState.stage);
    gameState.xp += 50 + gameState.map * 20;
    return { msg: `Novo mapa iniciado (${gameState.map}).`, state: this.status() };
  }

  upgradeTower(towerId) {
    const log = [];
    if (!this.ensureOngoing(log)) return { msg: "Partida encerrada.", state: this.status() };

    const tower = gameState.towers.find(t => t.id === towerId);

    if (!tower) {
      return { msg: "Torre não encontrada.", state: this.status() };
    }

    const cost = 40 + (tower.level * 20);

    if (gameState.resources.gold < cost) {
      return { msg: shortageMessage({ gold: cost }), state: this.status() };
    }

    gameState.resources.gold -= cost;
    tower.level++;
    tower.damage = Math.round(tower.damage * 1.4);

    log.push(`${tower.name} evoluiu para nível ${tower.level}!`);
    gameState.log = [...log, ...gameState.log].slice(0, 10);
    return { msg: `${tower.name} evoluiu para nível ${tower.level}!`, state: this.status() };
  }

  trainTroops(type, amount) {
    const log = [];
    if (!this.ensureOngoing(log)) return { msg: "Partida encerrada.", state: this.status() };

    const troop = gameState.troops[type];

    if (!troop) return { msg: "Tipo de tropa inválido.", state: this.status() };

    const cost = type === "soldiers" ? 5 * amount : 8 * amount;

    if (gameState.resources.gold < cost) {
      return { msg: "Ouro insuficiente.", state: this.status() };
    }

    gameState.resources.gold -= cost;
    troop.qty += amount;

    log.push(`Treinou ${amount} unidade(s) de ${type}.`);
    gameState.log = [...log, ...gameState.log].slice(0, 10);

    return { msg: `Treinou ${amount} unidade(s) de ${type}.`, state: this.status() };
  }

  collectBuilders() {
    const log = [];
    if (!this.ensureOngoing(log)) return { msg: "Partida encerrada.", state: this.status() };

    if (gameState.actionLocks.lastBuilderCollectTurn === gameState.turn) {
      return { msg: "Construtores já trabalharam neste turno.", state: this.status() };
    }

    this.ensureWorkersCount();
    const { efficiency } = gameState.builders;
    const tiles = gameState.builderTiles || [];
    const workers = gameState.builders.workers || [];

    // auto atribui trabalhadores aos tiles com menos atribuídos
    tiles.forEach(t => t.assigned = 0);
    workers.forEach(w => {
      const target = tiles.sort((a, b) => a.assigned - b.assigned)[0];
      if (target) {
        target.assigned += 1;
        w.tileId = target.id;
        w.profession = w.profession || target.type;
      }
    });

    const effectiveWorkers = Math.max(1, Math.pow((gameState.builders.qty || workers.length || 1), 0.85));
    const efficiencyFactor = 0.75 + 0.12 * efficiency;
    const loadFactor = effectiveWorkers / 2.2;

    const totalYield = { wood: 0, gold: 0, food: 0, stone: 0, iron: 0, energy: 0 };
    let tired = 0;
    let dead = 0;

    workers.forEach(w => {
      if (w.dead || w.fatigue >= 100) {
        tired += 1;
        return;
      }
      const tile = tiles.find(t => t.id === w.tileId) || tiles[0];
      if (!tile) return;
      const profBonus = tile.type === (w.profession || tile.type) ? 1.1 : 1;
      const base = (20 + gameState.stage * 5 + gameState.map * 3) * tile.richness;
      const yieldVal = Math.round(base * efficiencyFactor * loadFactor * profBonus / Math.max(1, workers.length));
      if (tile.type in totalYield) totalYield[tile.type] += yieldVal;

      const energyCost = 2 + Math.round((w.fatigue || 0) / 40);
      if ((gameState.resources.energy || 0) < energyCost) {
        tired += 1;
        return;
      }
      gameState.resources.energy -= energyCost;
      w.fatigue = Math.min(120, (w.fatigue || 0) + 15);
      if (w.fatigue > 80 && Math.random() < 0.08) {
        w.dead = true;
        dead += 1;
      }
    });

    Object.entries(totalYield).forEach(([k, v]) => { gameState.resources[k] += v; });
    gameState.actionLocks.lastBuilderCollectTurn = gameState.turn;

    log.push(`Construtores coletaram +${totalYield.wood} madeira, +${totalYield.gold} ouro, +${totalYield.food} comida, +${totalYield.stone} pedra, +${totalYield.iron} ferro, +${totalYield.energy} energia.`);
    if (tired) log.push(`${tired} trabalhador(es) cansados/faltou energia.`);
    if (dead) log.push(`${dead} trabalhador(es) morreram em acidentes.`);
    gameState.log = [...log, ...gameState.log].slice(0, 10);

    return { msg: "Coleta de construtores concluída.", state: this.status() };
  }

  hireBuilders(amount = 1) {
    const log = [];
    if (!this.ensureOngoing(log)) return { msg: "Partida encerrada.", state: this.status() };

    const costGold = (35 + gameState.stage * 6 + gameState.map * 4 + gameState.builders.qty * 10) * amount;
    const costFood = (20 + gameState.stage * 5 + gameState.map * 3) * amount;

    if (gameState.resources.gold < costGold || gameState.resources.food < costFood) {
      return { msg: shortageMessage({ gold: costGold, food: costFood }), state: this.status() };
    }

    gameState.resources.gold -= costGold;
    gameState.resources.food -= costFood;
    gameState.builders.qty += amount;
    this.ensureWorkersCount();

    log.push(`Contratou ${amount} construtor(es). (custo ${costGold} ouro / ${costFood} comida)`);
    gameState.log = [...log, ...gameState.log].slice(0, 10);

    return { msg: "Construtores contratados.", state: this.status() };
  }

  upgradeTroops(type) {
    const log = [];
    if (!this.ensureOngoing(log)) return { msg: "Partida encerrada.", state: this.status() };

    const troop = gameState.troops[type];
    if (!troop) return { msg: "Tipo de tropa inválido.", state: this.status() };

    const cost = 30 + troop.level * 15 + gameState.map * 5;

    if (gameState.resources.gold < cost) {
      return { msg: "Ouro insuficiente para evoluir tropas.", state: this.status() };
    }

    gameState.resources.gold -= cost;
    troop.level += 1;
    troop.attack = Math.round(troop.attack * 1.25 + 1);
    troop.hp = Math.round(troop.hp + 3 + troop.level * 0.5);

    log.push(`Tropas de ${type} evoluíram para nível ${troop.level} (+ATK, +HP). (custo ${cost} ouro)`);
    gameState.log = [...log, ...gameState.log].slice(0, 10);

    return { msg: `Tropas de ${type} evoluíram para nível ${troop.level}.`, state: this.status() };
  }

  upgradeResearch(type) {
    const log = [];
    if (!this.ensureOngoing(log)) return { msg: "Partida encerrada.", state: this.status() };

    const research = gameState.research || { tower: 0, troop: 0, siege: 0, defense: 0 };
    if (!(type in research)) return { msg: "Pesquisa inválida.", state: this.status() };

    const current = research[type];
    const costGold = 80 + current * 40 + gameState.map * 20;
    const costWood = 50 + current * 30;
    const costEnergy = 30 + current * 12;

    if (gameState.resources.gold < costGold || gameState.resources.wood < costWood || gameState.resources.energy < costEnergy) {
      return { msg: shortageMessage({ gold: costGold, wood: costWood, energy: costEnergy }), state: this.status() };
    }

    gameState.resources.gold -= costGold;
    gameState.resources.wood -= costWood;
    gameState.resources.energy -= costEnergy;
    research[type] = current + 1;
    gameState.research = research;

    log.push(`Pesquisa ${type} avançou para nível ${research[type]} (custo ${costGold} ouro / ${costWood} madeira / ${costEnergy} energia).`);
    gameState.log = [...log, ...gameState.log].slice(0, 10);
    return { msg: "Pesquisa concluída.", state: this.status() };
  }

  castSpell(type) {
    const log = [];
    if (!this.ensureOngoing(log)) return { msg: "Partida encerrada.", state: this.status() };

    const hero = gameState.hero;
    if (!hero) return { msg: "Herói indisponível.", state: this.status() };

    if (hero.cooldown > 0) {
      return { msg: `Herói em recarga (${hero.cooldown} turnos).`, state: this.status() };
    }

    if (hero.charges <= 0) {
      return { msg: "Sem cargas de habilidade.", state: this.status() };
    }

    let applied = false;
    if (type === "meteor") {
      const target = gameState.enemies[0];
      if (target) {
        const resist = target.bossSkills?.includes("resist") ? 0.5 : 1;
        const dmg = Math.round((70 + gameState.map * 10) * resist);
        target.hp -= dmg;
        log.push(`Meteoro caiu em ${target.name} causando ${dmg}.`);
        if (target.hp <= 0) {
          log.push(`${target.name} morreu!`);
          this.grantEnemyRewards(target, log);
          gameState.enemies.shift();
        }
        applied = true;
      }
    } else if (type === "ice") {
      const bossHasResist = gameState.enemies.some(e => e.boss && e.bossSkills?.includes("resist"));
      if (bossHasResist) {
        log.push("Feitiço de gelo resistido pelo chefe!");
      } else {
        gameState.effects.enemyWeakTurns = 2;
        log.push("Feitiço de gelo: inimigos enfraquecidos por 2 turnos.");
        applied = true;
      }
    } else if (type === "shield") {
      gameState.effects.castleShield = 120 + gameState.map * 20;
      log.push("Escudo mágico levantado no castelo.");
      applied = true;
    }

    if (applied) {
      hero.charges -= 1;
      hero.cooldown = 2;
      gameState.hero = hero;
      gameState.log = [...log, ...gameState.log].slice(0, 10);
      return { msg: "Habilidade usada.", state: this.status() };
    }

    return { msg: "Habilidade inválida.", state: this.status() };
  }

  healCastle() {
    const log = [];
    if (!this.ensureOngoing(log)) return { msg: "Partida encerrada.", state: this.status() };

    if (gameState.castle.hp >= gameState.castle.max_hp) {
      return { msg: "Castelo já está com vida máxima.", state: this.status() };
    }

    const energyCost = 12 + gameState.stage * 3;
    const foodCost = 18 + gameState.stage * 4;

    if (gameState.resources.energy < energyCost || gameState.resources.food < foodCost) {
      return { msg: "Recursos insuficientes para curar (energia/comida).", state: this.status() };
    }

    gameState.resources.energy -= energyCost;
    gameState.resources.food -= foodCost;

    const heal = 120 + gameState.map * 20 + gameState.stage * 30;
    gameState.castle.hp = Math.min(gameState.castle.max_hp, gameState.castle.hp + heal);

    log.push(`Curou o castelo em ${heal} (custo ${energyCost} energia / ${foodCost} comida).`);
    gameState.log = [...log, ...gameState.log].slice(0, 10);

    return { msg: "Castelo curado.", state: this.status() };
  }

  buildArmory(type, amount = 1) {
    const log = [];
    if (!this.ensureOngoing(log)) return { msg: "Partida encerrada.", state: this.status() };

    const item = gameState.armory[type];
    if (!item) return { msg: "Tipo de arsenal inválido.", state: this.status() };

    const costScale = 1 + (gameState.map - 1) * 0.12 + (gameState.stage - 1) * 0.08;
    const baseCost = {
      catapults: { gold: 40, wood: 50, energy: 10, food: 10 },
      cannons: { gold: 60, wood: 35, energy: 12, food: 10 },
      horses: { gold: 30, wood: 10, energy: 6, food: 30 },
      cavalry: { gold: 45, wood: 20, energy: 8, food: 35 },
      shields: { gold: 18, wood: 35, energy: 4, food: 8 },
      spears: { gold: 24, wood: 40, energy: 5, food: 10 },
    }[type];

    const totalCost = Object.fromEntries(
      Object.entries(baseCost).map(([key, val]) => [key, Math.round(val * amount * costScale)])
    );

    const lacks = Object.entries(totalCost).find(([res, val]) => (gameState.resources[res] ?? 0) < val);
    if (lacks) {
      return { msg: shortageMessage(totalCost), state: this.status() };
    }

    gameState.resources.gold -= totalCost.gold;
    gameState.resources.wood -= totalCost.wood;
    gameState.resources.energy -= totalCost.energy;
    gameState.resources.food -= totalCost.food;
    item.qty += amount;

    log.push(`Fabricou ${amount} ${type}. (custo ${totalCost.gold} ouro, ${totalCost.wood} madeira, ${totalCost.food} comida, ${totalCost.energy} energia)`);
    gameState.log = [...log, ...gameState.log].slice(0, 10);

    return { msg: "Produção concluída.", state: this.status() };
  }

  applyRune(type) {
    const log = [];
    if (!this.ensureOngoing(log)) return { msg: "Partida encerrada.", state: this.status() };
    if (!["power", "guard"].includes(type)) return { msg: "Tipo de runa inválido.", state: this.status() };

    const costGold = 60 + (gameState.runes[type] || 0) * 40;
    const costEnergy = 35 + (gameState.runes[type] || 0) * 20;

    if (gameState.resources.gold < costGold || gameState.resources.energy < costEnergy) {
      return { msg: shortageMessage({ gold: costGold, energy: costEnergy }), state: this.status() };
    }

    gameState.resources.gold -= costGold;
    gameState.resources.energy -= costEnergy;
    gameState.runes[type] = (gameState.runes[type] || 0) + 1;

    log.push(`Runa ${type} aplicada (Lv ${gameState.runes[type]}).`);
    gameState.log = [...log, ...gameState.log].slice(0, 10);
    return { msg: "Runa aplicada.", state: this.status() };
  }

  collectTreasure() {
    const log = [];
    if (!this.ensureOngoing(log)) return { msg: "Partida encerrada.", state: this.status() };

    const gainJewels = 10 + gameState.map * 3;
    const gainGold = 25 + gameState.stage * 5;
    const gainWood = 15 + gameState.stage * 3;

    gameState.vault.jewels += gainJewels;
    gameState.resources.gold += gainGold;
    gameState.resources.wood += gainWood;
    gameState.xp += 10;

    log.push(`Baú: +${gainJewels} joias, +${gainGold} ouro, +${gainWood} madeira.`);
    gameState.log = [...log, ...gameState.log].slice(0, 10);
    return { msg: "Tesouro coletado.", state: this.status() };
  }

  usePotion(type) {
    const log = [];
    if (!this.ensureOngoing(log)) return { msg: "Partida encerrada.", state: this.status() };
    const potions = gameState.vault.potions || {};
    if (!potions[type] || potions[type] <= 0) {
      return { msg: "Sem poção disponível.", state: this.status() };
    }

    potions[type] -= 1;
    if (type === "heal") {
      const heal = 180;
      gameState.castle.hp = Math.min(gameState.castle.max_hp, gameState.castle.hp + heal);
      log.push(`Poção de cura: +${heal} HP no castelo.`);
    } else if (type === "energy") {
      const energy = 80;
      gameState.resources.energy += energy;
      log.push(`Poção de energia: +${energy} energia.`);
    } else if (type === "loot") {
      const gold = 60;
      const wood = 40;
      gameState.resources.gold += gold;
      gameState.resources.wood += wood;
      log.push(`Poção de saque: +${gold} ouro, +${wood} madeira.`);
    }

    gameState.vault.potions = potions;
    gameState.log = [...log, ...gameState.log].slice(0, 10);
    return { msg: "Poção usada.", state: this.status() };
  }

  useRareItem(type) {
    const log = [];
    if (!this.ensureOngoing(log)) return { msg: "Partida encerrada.", state: this.status() };
    const rare = gameState.vault.rare || [];
    const item = rare.find(r => r.key === type);
    if (!item || !item.unlocked) return { msg: "Item indisponível.", state: this.status() };

    if (type === "ring") gameState.effects.ringPowerTurns = 3;
    if (type === "book") gameState.effects.bookTurns = 3;
    if (type === "armor") gameState.effects.armorTurns = 3;
    if (type === "haste") gameState.effects.hasteTurns = 2;
    item.activeTurns = type === "haste" ? 2 : 3;

    log.push(`${item.label} ativado!`);
    gameState.log = [...log, ...gameState.log].slice(0, 10);
    return { msg: "Item ativado.", state: this.status() };
  }

  summonBeast() {
    const log = [];
    if (!this.ensureOngoing(log)) return { msg: "Partida encerrada.", state: this.status() };
    const beast = gameState.hero?.beast;
    if (!beast?.unlocked) return { msg: "Fera não desbloqueada.", state: this.status() };
    if (!beast.ready) return { msg: "Fera já usada neste mapa.", state: this.status() };

    const dmg = 80 + gameState.map * 15;
    const targets = gameState.enemies.slice(0, 3);
    targets.forEach(t => {
      t.hp -= dmg;
      log.push(`Fera gigante causou ${dmg} em ${t.name}!`);
    });
    gameState.enemies = gameState.enemies.filter(t => t.hp > 0);
    gameState.castle.hp = Math.min(gameState.castle.max_hp, gameState.castle.hp + 120);

    beast.ready = false;
    beast.activeTurns = 2;
    gameState.hero.beast = beast;
    log.push("Fera invocada! Pronta novamente no próximo mapa.");
    gameState.log = [...log, ...gameState.log].slice(0, 10);
    return { msg: "Fera invocada.", state: this.status() };
  }

  upgradeArmory(type) {
    const log = [];
    if (!this.ensureOngoing(log)) return { msg: "Partida encerrada.", state: this.status() };

    const item = gameState.armory[type];
    if (!item) return { msg: "Tipo de arsenal inválido.", state: this.status() };

    const costGold = 50 + item.level * 25 + gameState.map * 10;
    const costWood = 30 + item.level * 20;
    const costEnergy = 10 + item.level * 6;

    if (gameState.resources.gold < costGold || gameState.resources.wood < costWood || gameState.resources.energy < costEnergy) {
      return { msg: shortageMessage({ gold: costGold, wood: costWood, energy: costEnergy }), state: this.status() };
    }

    gameState.resources.gold -= costGold;
    gameState.resources.wood -= costWood;
    gameState.resources.energy -= costEnergy;
    item.level += 1;

    if (item.attack) {
      item.attack = Math.round(item.attack * 1.2 + 2);
    }
    if (item.defense) {
      item.defense = Math.round(item.defense * 1.25 + 1);
    }

    log.push(`Melhorou ${type} para nível ${item.level}. (custo ${costGold} ouro, ${costWood} madeira, ${costEnergy} energia)`);
    gameState.log = [...log, ...gameState.log].slice(0, 10);

    return { msg: "Arsenal melhorado.", state: this.status() };
  }

  nextTurn() {
    const log = [];

    if (!this.ensureOngoing(log)) {
      gameState.log = [...log, ...gameState.log].slice(0, 10);
      return gameState;
    }

    // Chefe usa habilidades
    const boss = gameState.enemies.find(e => e.boss);
    if (boss) {
      if (boss.bossSkills?.includes("fury")) {
        const buff = Math.round(5 + gameState.stage * 1.5);
        gameState.enemies.forEach(e => e.attack += buff);
        log.push("Grito da Fúria: inimigos ganharam ataque extra!");
        boss.bossSkills = boss.bossSkills.filter(s => s !== "fury");
      }
      if (boss.bossSkills?.includes("stomp")) {
        gameState.castle.defense_bonus = Math.max(0, gameState.castle.defense_bonus - 10);
        log.push("Pisada Sísmica: defesa da muralha reduzida!");
        boss.bossSkills = boss.bossSkills.filter(s => s !== "stomp");
      }
      if (boss.bossSkills?.includes("gobcall")) {
        const difficulty = gameState.stage + gameState.map * 2;
        const gob1 = this.buildEnemy("Goblin", 12, 4, difficulty, 3);
        const gob2 = this.buildEnemy("Goblin", 12, 4, difficulty, 3);
        gameState.enemies.push(gob1, gob2);
        log.push("Chamado dos Goblins: 2 goblins extras entraram em campo!");
        boss.bossSkills = boss.bossSkills.filter(s => s !== "gobcall");
      }
    }

    // decaimento de buffs e itens raros
    const rare = gameState.vault.rare || [];
    ["ringPowerTurns", "bookTurns", "armorTurns", "hasteTurns"].forEach(k => {
      if (gameState.effects[k] && gameState.effects[k] > 0) gameState.effects[k] -= 1;
    });
    rare.forEach(r => { if (r.activeTurns && r.activeTurns > 0) r.activeTurns -= 1; });

    if (gameState.hero && gameState.hero.cooldown > 0) {
      gameState.hero.cooldown -= 1;
    }

    let eventBuff = { towerAtk: 1, castleDef: 0, troopAtk: 1 };
    if (Math.random() < 0.2) {
      const events = [
        { key: "chuva", desc: "Chuva forte: torres -30% atk, muralha +10 def", towerAtk: 0.7, castleDef: 10, troopAtk: 1 },
        { key: "sol", desc: "Dia ensolarado: colheita +50% comida", harvest: { food: 1.5 } },
        { key: "goblin", desc: "Bando de goblins: +20% ouro de abates", loot: 1.2 },
        { key: "alfa", desc: "Lobo Alfa: feras +20% atk", beast: 1.2 }
      ];
      const chosen = events[Math.floor(Math.random() * events.length)];
      gameState.lastEvent = chosen.desc;
      if (chosen.towerAtk) eventBuff.towerAtk = chosen.towerAtk;
      if (chosen.castleDef) eventBuff.castleDef = chosen.castleDef;
      if (chosen.troopAtk) eventBuff.troopAtk = chosen.troopAtk;
      if (chosen.harvest) {
        gameState.resources.food = Math.round(gameState.resources.food * chosen.harvest.food);
      }
      if (chosen.loot) {
        gameState.lootBuff = chosen.loot;
      }
      if (chosen.beast) {
        gameState.beastBuff = chosen.beast;
      }
    }

    if (gameState.effects.enemyWeakTurns > 0) {
      gameState.effects.enemyWeakTurns -= 1;
    }
    for (const enemy of gameState.enemies) {
      if (enemy.boss) {
        enemy.tempShield = Math.round(enemy.max_hp * 0.15);
      } else {
        enemy.tempShield = 0;
      }
    }

    const supportUnits = gameState.enemies.filter(e => e.role === "support");
    if (supportUnits.length > 0) {
      const heal = 6 + gameState.stage;
      gameState.enemies.forEach(e => {
        if (e.role !== "support") {
          e.hp = Math.min(e.max_hp, e.hp + heal);
        }
      });
      log.push(`Xamãs restauraram ${heal} de vida para os aliados.`);
    }

    const research = gameState.research || { tower: 0, troop: 0, siege: 0, defense: 0 };
    const ringBuff = gameState.effects.ringPowerTurns > 0 ? 0.2 : 0;
    const bookBuff = gameState.effects.bookTurns > 0 ? 0.15 : 0;
    const armorBuff = gameState.effects.armorTurns > 0 ? 10 : 0;
    const hasteDebuff = gameState.effects.hasteTurns > 0 ? 0.85 : 1;
    const towerMult = 1 + 0.05 * research.tower + (gameState.runes?.power || 0) * 0.02 + (gameState.mapLayout?.effects?.towerBuff || 0) + ringBuff;
    const troopMult = (1 + 0.05 * research.troop + bookBuff);
    const siegeMult = 1 + 0.05 * research.siege;
    const defenseMult = gameState.castle.defense_bonus + armorBuff + (research.defense * 2) + (gameState.runes?.guard || 0) * 0.5;

    const applyDamage = (enemy, rawDamage, sourceType) => {
      if (!enemy) return 0;
      const resist = enemy.resist || {};
      let mult = 1;
      if (sourceType === "tower") mult = resist.tower ?? 1;
      if (sourceType === "troop") mult = resist.troop ?? 1;
      if (sourceType === "siege") mult = resist.siege ?? 1;
      let damage = Math.round(rawDamage * mult);
      if (gameState.effects.enemyWeakTurns > 0) {
        damage = Math.round(damage * 1.15);
      }
      if (enemy.tempShield && enemy.tempShield > 0) {
        const absorbed = Math.min(enemy.tempShield, damage);
        enemy.tempShield -= absorbed;
        damage -= absorbed;
        if (absorbed > 0) {
          log.push(`${enemy.name} bloqueou ${absorbed} com escudo!`);
        }
      }
      enemy.hp -= damage;
      return damage;
    };

    for (const tower of gameState.towers) {
      if (gameState.enemies.length === 0) break;

      const target = gameState.enemies[0];
      const runeBonus = 1 + (tower.rune_power || 0) * 0.05;
      const dmg = Math.round(tower.damage * towerMult * eventBuff.towerAtk * runeBonus);
      const dealt = applyDamage(target, dmg, "tower");
      log.push(`${tower.name} causou ${dealt} em ${target.name}`);

      if (target.hp <= 0) {
        log.push(`${target.name} morreu!`);
        this.grantEnemyRewards(target, log);
        gameState.enemies.shift();
      }
    }

    let totalAttack = 0;
    for (const t of Object.values(gameState.troops)) {
      totalAttack += t.qty * t.attack * troopMult;
    }

    const { armory } = gameState;
    const siegeAttack =
      (armory.catapults.qty * armory.catapults.attack) +
      (armory.cannons.qty * armory.cannons.attack);
    const cavalryAttack =
      (armory.cavalry.qty * armory.cavalry.attack) +
      (armory.horses.qty * Math.round(armory.horses.attack * 0.6));
    const infantryAttack =
      (armory.spears.qty * armory.spears.attack);

    totalAttack += (siegeAttack * siegeMult) + (cavalryAttack * troopMult) + (infantryAttack * troopMult);

    if (gameState.enemies.length > 0 && totalAttack > 0) {

      const fastestEnemy = [...gameState.enemies].sort((a, b) => (b.speed || 0) - (a.speed || 0))[0];
      if (fastestEnemy && (fastestEnemy.speed || 0) >= 9) {

        const preDmg = Math.max(0, Math.round(fastestEnemy.attack * 0.8) - (gameState.castle.defense_bonus || 0));
        if (preDmg > 0) {
          gameState.castle.hp = Math.max(0, gameState.castle.hp - preDmg);
          log.push(`${fastestEnemy.name} atacou primeiro e causou ${preDmg} no castelo!`);
        }
      }

      const target = gameState.enemies[0];
      const dealt = applyDamage(target, totalAttack, "troop");
      log.push(`Tropas causam ${dealt} em ${target.name}`);

      if (target.hp <= 0) {
        log.push(`${target.name} morreu!`);
        this.grantEnemyRewards(target, log);
        gameState.enemies.shift();
      }
    }

    let castleDamage = 0;
    const extraDefense = (armory.shields.qty * armory.shields.defense);
    const runeDefense = (gameState.towers || []).reduce((acc, t) => acc + (t.rune_guard || 0), 0) * 1.5;
    const slowFactor = 1 - (gameState.mapLayout?.effects?.enemySlow || 0);
    const defenseTotal = defenseMult + extraDefense + runeDefense + (gameState.effects.castleShield ? 10 : 0);

    for (const enemy of gameState.enemies) {
      let enemyAttack = enemy.attack * slowFactor * hasteDebuff;
      if (enemy.boss) enemyAttack *= 1.1;
      if (gameState.effects.enemyWeakTurns > 0) {
        enemyAttack = Math.round(enemyAttack * 0.7);
      }
      const dmg = Math.max(0, enemyAttack - defenseTotal);
      castleDamage += dmg;
      if (enemy.boss) {
        castleDamage += Math.max(0, enemyAttack - defenseTotal);
      }
    }

    if (gameState.effects.castleShield) {
      const absorbed = Math.min(gameState.effects.castleShield, castleDamage);
      castleDamage -= absorbed;
      gameState.effects.castleShield -= absorbed;
      if (absorbed > 0) log.push(`Escudo protegeu ${absorbed} de dano no castelo.`);
    }

    if (castleDamage > 0) {
      gameState.castleDamageThisMap += castleDamage;
      gameState.castle.hp = Math.max(0, gameState.castle.hp - castleDamage);
      log.push(`Castelo recebeu ${castleDamage} de dano`);
    }

    if (gameState.castle.hp <= 0) {
      gameState.status = "over";
      log.push("Castelo caiu! Game Over.");
      gameState.achievements.winStreak = 0;
    }

    if (gameState.enemies.length === 0 && gameState.status === "ongoing") {
      if (gameState.stage >= gameState.maxStage) {
        gameState.status = "won";
        log.push(`Mapa ${gameState.map} conquistado!`);
        if (gameState.castleDamageThisMap === 0) {
          gameState.achievements.noDamageClear = true;
          log.push("Conquista: mapa vencido sem dano no castelo!");
        }
        gameState.achievements.winStreak += 1;
      } else {
        gameState.stage++;
        gameState.turn = 0;
        gameState.castleDamageThisMap = 0;
        log.push(`Você avançou para a fase ${gameState.stage}!`);
        gameState.enemies = this.generateEnemies(gameState.stage);
      }
    }

    gameState.turn++;
    gameState.log = [...log, ...gameState.log].slice(0, 10);

    return gameState;
  }

  grantEnemyRewards(enemy, log) {
    let goldGain = enemy.reward ?? 10;
    if (gameState.lootBuff) goldGain = Math.round(goldGain * gameState.lootBuff);
    gameState.resources.gold += goldGain;
    log.push(`Recompensa: +${goldGain} ouro de ${enemy.name}.`);
    const xpGain = Math.max(5, Math.round(goldGain * 2));
    gameState.xp += xpGain;

    this.rewardForEnemy(enemy, log);
    // desbloqueia itens raros conforme progressão
    const rare = gameState.vault.rare || [];
    const unlock = (key) => {
      const item = rare.find(r => r.key === key);
      if (item) item.unlocked = true;
    };
    if (enemy.boss) {
      unlock("armor");
      unlock("ring");
      unlock("book");
      unlock("haste");
    } else if (enemy.role === "tank") {
      unlock("armor");
    } else if (enemy.role === "support") {
      unlock("book");
    } else if (enemy.role === "flyer") {
      unlock("haste");
    }
  }

  rewardForEnemy(enemy, log) {
    const isOrk = enemy.name?.toLowerCase().includes("ork");
    if (!isOrk && !enemy.boss) return;

    const energyGain = enemy.boss ? 30 : 10;
    const heal = enemy.boss ? 100 : 25;

    gameState.resources.energy += energyGain;
    gameState.castle.hp = Math.min(gameState.castle.max_hp, gameState.castle.hp + heal);

    log.push(`${enemy.name} derrubado! +${energyGain} energia e +${heal} vida para o castelo.`);
  }

  setState(stateObj) {
    Object.assign(gameState, JSON.parse(JSON.stringify(stateObj)));
    this.ensureWorkersCount();
  }

  state() {
    return gameState;
  }
}

module.exports = new GameEngine();
