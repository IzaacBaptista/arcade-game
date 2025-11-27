const { randomUUID } = require("crypto");
const { gameState, initialState } = require("../data/gameState");

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
    fresh.vault = { jewels: Math.max(30, initialState.vault.jewels - 10 + fresh.map * 5), artifacts: [], potions: { heal: 2, energy: 2, loot: 1 } };
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
      initiative
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
    gameState.resources.gold += gold;
    gameState.resources.wood += wood;
    gameState.resources.food += food;
    gameState.resources.energy += energy;
    gameState.actionLocks.lastCollectTurn = gameState.turn;
    log.push(`Coletou +${gold} ouro, +${wood} madeira, +${food} comida e +${energy} energia.`);
    gameState.log = [...log, ...gameState.log].slice(0, 10);

    return { msg: "Recursos coletados", state: this.status() };
  }

  addTower() {
    const log = [];
    if (!this.ensureOngoing(log)) return { msg: "Partida encerrada.", state: this.status() };

    const costGold = 60 + 10 * gameState.stage + 5 * gameState.map;
    const costWood = 35 + 8 * gameState.stage + 4 * gameState.map;

    if (gameState.resources.gold < costGold || gameState.resources.wood < costWood) {
      return { msg: "Recursos insuficientes para construir uma torre.", state: this.status() };
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
      return { msg: "Madeira insuficiente para reforçar a muralha.", state: this.status() };
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
      return { msg: "Ouro insuficiente.", state: this.status() };
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

    const { qty, efficiency } = gameState.builders;
    const effectiveWorkers = Math.max(1, Math.pow(qty || 1, 0.85));
    const efficiencyFactor = 0.75 + 0.12 * efficiency;
    const loadFactor = effectiveWorkers / 2.2; // suaviza ganhos e reduz snowball

    const wood = Math.round((25 + gameState.stage * 6 + gameState.map * 4) * efficiencyFactor * loadFactor);
    const gold = Math.round((16 + gameState.stage * 5 + gameState.map * 3) * efficiencyFactor * loadFactor);
    const food = Math.round((18 + gameState.stage * 4 + gameState.map * 3) * efficiencyFactor * loadFactor);

    gameState.resources.wood += wood;
    gameState.resources.gold += gold;
    gameState.resources.food += food;
    gameState.actionLocks.lastBuilderCollectTurn = gameState.turn;

    log.push(`Construtores coletaram +${wood} madeira, +${gold} ouro e +${food} comida.`);
    gameState.log = [...log, ...gameState.log].slice(0, 10);

    return { msg: "Coleta de construtores concluída.", state: this.status() };
  }

  hireBuilders(amount = 1) {
    const log = [];
    if (!this.ensureOngoing(log)) return { msg: "Partida encerrada.", state: this.status() };

    const costGold = (35 + gameState.stage * 6 + gameState.map * 4 + gameState.builders.qty * 10) * amount;
    const costFood = (20 + gameState.stage * 5 + gameState.map * 3) * amount;

    if (gameState.resources.gold < costGold || gameState.resources.food < costFood) {
      return { msg: "Recursos insuficientes para contratar construtores.", state: this.status() };
    }

    gameState.resources.gold -= costGold;
    gameState.resources.food -= costFood;
    gameState.builders.qty += amount;

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
      return { msg: "Recursos insuficientes para pesquisar.", state: this.status() };
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
        const dmg = 70 + gameState.map * 10;
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
      gameState.effects.enemyWeakTurns = 2;
      log.push("Feitiço de gelo: inimigos enfraquecidos por 2 turnos.");
      applied = true;
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
      return { msg: `Recursos insuficientes para fabricar ${type}.`, state: this.status() };
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
      return { msg: "Recursos insuficientes para runa.", state: this.status() };
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

  upgradeArmory(type) {
    const log = [];
    if (!this.ensureOngoing(log)) return { msg: "Partida encerrada.", state: this.status() };

    const item = gameState.armory[type];
    if (!item) return { msg: "Tipo de arsenal inválido.", state: this.status() };

    const costGold = 50 + item.level * 25 + gameState.map * 10;
    const costWood = 30 + item.level * 20;
    const costEnergy = 10 + item.level * 6;

    if (gameState.resources.gold < costGold || gameState.resources.wood < costWood || gameState.resources.energy < costEnergy) {
      return { msg: "Recursos insuficientes para melhorar o arsenal.", state: this.status() };
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

    if (gameState.hero && gameState.hero.cooldown > 0) {
      gameState.hero.cooldown -= 1;
    }

    // efeitos de início de turno
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

    // suporte cura aliados
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
    const towerMult = 1 + 0.05 * research.tower + (gameState.runes?.power || 0) * 0.02 + (gameState.mapLayout?.effects?.towerBuff || 0);
    const troopMult = 1 + 0.05 * research.troop;
    const siegeMult = 1 + 0.05 * research.siege;
    const defenseMult = gameState.castle.defense_bonus + (research.defense * 2) + (gameState.runes?.guard || 0) * 0.5;

    const applyDamage = (enemy, rawDamage, sourceType) => {
      if (!enemy) return 0;
      const resist = enemy.resist || {};
      let mult = 1;
      if (sourceType === "tower") mult = resist.tower ?? 1;
      if (sourceType === "troop") mult = resist.troop ?? 1;
      if (sourceType === "siege") mult = resist.siege ?? 1;
      let damage = Math.round(rawDamage * mult);
      if (gameState.effects.enemyWeakTurns > 0) {
        damage = Math.round(damage * 1.15); // inimigos enfraquecidos sofrem mais
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

    // torres atacam
    for (const tower of gameState.towers) {
      if (gameState.enemies.length === 0) break;

      const target = gameState.enemies[0];
      const dmg = Math.round(tower.damage * towerMult);
      const dealt = applyDamage(target, dmg, "tower");
      log.push(`${tower.name} causou ${dealt} em ${target.name}`);

      if (target.hp <= 0) {
        log.push(`${target.name} morreu!`);
        this.grantEnemyRewards(target, log);
        gameState.enemies.shift();
      }
    }

    // tropas atacam
    let totalAttack = 0;
    for (const t of Object.values(gameState.troops)) {
      totalAttack += t.qty * t.attack * troopMult;
    }

    // arsenal contribui
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
      // calcula ordem por speed: flyers, tropas rápidas podem agir antes
      const fastestEnemy = [...gameState.enemies].sort((a, b) => (b.speed || 0) - (a.speed || 0))[0];
      if (fastestEnemy && (fastestEnemy.speed || 0) >= 9) {
        // ataque pré-turno no castelo
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

    // inimigos atacam castelo
    let castleDamage = 0;
    const extraDefense = (armory.shields.qty * armory.shields.defense);
    const slowFactor = 1 - (gameState.mapLayout?.effects?.enemySlow || 0);
    const defenseTotal = defenseMult + extraDefense + (gameState.effects.castleShield ? 10 : 0);

    for (const enemy of gameState.enemies) {
      let enemyAttack = enemy.attack * slowFactor;
      if (enemy.boss) enemyAttack *= 1.1;
      if (gameState.effects.enemyWeakTurns > 0) {
        enemyAttack = Math.round(enemyAttack * 0.7);
      }
      const dmg = Math.max(0, enemyAttack - defenseTotal);
      castleDamage += dmg;
      if (enemy.boss) {
        // chefe ataca duas vezes
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

    // todos inimigos morreram → próxima fase
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
    const goldGain = enemy.reward ?? 10;
    gameState.resources.gold += goldGain;
    log.push(`Recompensa: +${goldGain} ouro de ${enemy.name}.`);

    this.rewardForEnemy(enemy, log);
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
  }

  state() {
    return gameState;
  }
}

module.exports = new GameEngine();
