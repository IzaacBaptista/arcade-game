const { gameState, initialState } = require("../data/gameState");

class GameEngine {
  resetState(keepMap = false) {
    const fresh = JSON.parse(JSON.stringify(initialState));
    if (keepMap) {
      fresh.map = gameState.map + 1;
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

  generateEnemies(stage) {
    return [
      {
        id: 1,
        name: "Goblin",
        hp: 10 + stage * 2 + gameState.map * 3,
        attack: 3 + stage + gameState.map,
        distance: 3
      },
      {
        id: 2,
        name: "Ork",
        hp: 25 + stage * 4 + gameState.map * 4,
        attack: 6 + stage + gameState.map,
        distance: 4
      }
    ];
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

    const gold = 20 + gameState.stage * 5 + gameState.map * 3;
    const wood = 15 + gameState.stage * 4 + gameState.map * 2;
    gameState.resources.gold += gold;
    gameState.resources.wood += wood;
    log.push(`Coletou +${gold} ouro e +${wood} madeira.`);
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

  nextTurn() {
    const log = [];

    if (!this.ensureOngoing(log)) {
      gameState.log = [...log, ...gameState.log].slice(0, 10);
      return gameState;
    }

    // torres atacam
    for (const tower of gameState.towers) {
      if (gameState.enemies.length === 0) break;

      const target = gameState.enemies[0];
      target.hp -= tower.damage;
      log.push(`${tower.name} causou ${tower.damage} em ${target.name}`);

      if (target.hp <= 0) {
        log.push(`${target.name} morreu!`);
        gameState.resources.gold += 10;
        gameState.enemies.shift();
      }
    }

    // tropas atacam
    let totalAttack = 0;
    for (const t of Object.values(gameState.troops)) {
      totalAttack += t.qty * t.attack;
    }

    if (gameState.enemies.length > 0 && totalAttack > 0) {
      const target = gameState.enemies[0];
      target.hp -= totalAttack;
      log.push(`Tropas causam ${totalAttack} em ${target.name}`);

      if (target.hp <= 0) {
        log.push(`${target.name} morreu!`);
        gameState.resources.gold += 15;
        gameState.enemies.shift();
      }
    }

    // inimigos atacam castelo
    let castleDamage = 0;

    for (const enemy of gameState.enemies) {
      const dmg = Math.max(0, enemy.attack - gameState.castle.defense_bonus);
      castleDamage += dmg;
    }

    if (castleDamage > 0) {
      gameState.castle.hp = Math.max(0, gameState.castle.hp - castleDamage);
      log.push(`Castelo recebeu ${castleDamage} de dano`);
    }

    if (gameState.castle.hp <= 0) {
      gameState.status = "over";
      log.push("Castelo caiu! Game Over.");
    }

    // todos inimigos morreram → próxima fase
    if (gameState.enemies.length === 0 && gameState.status === "ongoing") {
      if (gameState.stage >= gameState.maxStage) {
        gameState.status = "won";
        log.push(`Mapa ${gameState.map} conquistado!`);
      } else {
        gameState.stage++;
        gameState.turn = 0;
        log.push(`Você avançou para a fase ${gameState.stage}!`);
        gameState.enemies = this.generateEnemies(gameState.stage);
      }
    }

    gameState.turn++;
    gameState.log = [...log, ...gameState.log].slice(0, 10);

    return gameState;
  }
}

module.exports = new GameEngine();
