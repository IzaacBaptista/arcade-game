const GameEngine = require("../services/GameEngine");

module.exports = {
  start(req, res) {
    return res.json(GameEngine.startGame());
  },

  status(req, res) {
    return res.json(GameEngine.status());
  },

  nextTurn(req, res) {
    return res.json(GameEngine.nextTurn());
  },

  upgradeTower(req, res) {
    const result = GameEngine.upgradeTower(Number(req.params.id));
    return res.json(result);
  },

  trainTroops(req, res) {
    const { type, amount } = req.body;
    const result = GameEngine.trainTroops(type, amount);
    return res.json(result);
  },

  upgradeTroops(req, res) {
    const { type } = req.body;
    const result = GameEngine.upgradeTroops(type);
    return res.json(result);
  },

  upgradeResearch(req, res) {
    const { type } = req.body;
    const result = GameEngine.upgradeResearch(type);
    return res.json(result);
  },

  collect(req, res) {
    const result = GameEngine.collectResources();
    return res.json(result);
  },

  collectBuilders(req, res) {
    const result = GameEngine.collectBuilders();
    return res.json(result);
  },

  hireBuilders(req, res) {
    const { amount = 1 } = req.body || {};
    const result = GameEngine.hireBuilders(Number(amount) || 1);
    return res.json(result);
  },

  heal(req, res) {
    const result = GameEngine.healCastle();
    return res.json(result);
  },

  castSpell(req, res) {
    const { type } = req.body;
    const result = GameEngine.castSpell(type);
    return res.json(result);
  },

  buildArmory(req, res) {
    const { type, amount = 1 } = req.body;
    const result = GameEngine.buildArmory(type, Number(amount) || 1);
    return res.json(result);
  },

  upgradeArmory(req, res) {
    const { type } = req.body;
    const result = GameEngine.upgradeArmory(type);
    return res.json(result);
  },

  applyRune(req, res) {
    const { type } = req.body;
    const result = GameEngine.applyRune(type);
    return res.json(result);
  },

  addTower(req, res) {
    const result = GameEngine.addTower();
    return res.json(result);
  },

  upgradeWall(req, res) {
    const result = GameEngine.upgradeWall();
    return res.json(result);
  },

  reset(req, res) {
    const result = GameEngine.resetGame();
    return res.json(result);
  },

  nextMap(req, res) {
    const result = GameEngine.nextMap();
    return res.json(result);
  }
};
