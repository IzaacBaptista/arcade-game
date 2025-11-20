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
    const message = GameEngine.upgradeTower(Number(req.params.id));
    return res.json({ msg: message, state: GameEngine.status() });
  },

  trainTroops(req, res) {
    const { type, amount } = req.body;
    const message = GameEngine.trainTroops(type, amount);
    return res.json({ msg: message, state: GameEngine.status() });
  }
};
