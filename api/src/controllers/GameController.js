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

  collect(req, res) {
    const result = GameEngine.collectResources();
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
