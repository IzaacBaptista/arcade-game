const { gameState, initialState } = require("../data/gameState");

class GameEngine {

  startGame() {
    Object.assign(gameState, initialState);
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
        hp: 10 + stage * 2,
        attack: 3 + stage,
        distance: 3
      },
      {
        id: 2,
        name: "Ork",
        hp: 25 + stage * 4,
        attack: 6 + stage,
        distance: 4
      }
    ];
  }

  upgradeTower(towerId) {
    const tower = gameState.towers.find(t => t.id === towerId);

    if (!tower) {
      return "Torre não encontrada.";
    }

    const cost = 40 + (tower.level * 20);

    if (gameState.resources.gold < cost) {
      return "Ouro insuficiente.";
    }

    gameState.resources.gold -= cost;
    tower.level++;
    tower.damage = Math.round(tower.damage * 1.4);

    return `${tower.name} evoluiu para nível ${tower.level}!`;
  }

  trainTroops(type, amount) {
    const troop = gameState.troops[type];

    if (!troop) return "Tipo de tropa inválido.";

    const cost = type === "soldiers" ? 5 * amount : 8 * amount;

    if (gameState.resources.gold < cost) {
      return "Ouro insuficiente.";
    }

    gameState.resources.gold -= cost;
    troop.qty += amount;

    return `Treinou ${amount} unidade(s) de ${type}.`;
  }

  nextTurn() {
    const log = [];

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
      gameState.castle.hp -= castleDamage;
      log.push(`Castelo recebeu ${castleDamage} de dano`);
    }

    // todos inimigos morreram → próxima fase
    if (gameState.enemies.length === 0) {
      gameState.stage++;
      gameState.turn = 0;
      log.push(`Você avançou para a fase ${gameState.stage}!`);
      gameState.enemies = this.generateEnemies(gameState.stage);
    }

    gameState.turn++;
    gameState.log = [...log, ...gameState.log].slice(0, 10);

    return gameState;
  }
}

module.exports = new GameEngine();
