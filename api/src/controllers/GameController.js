const GameEngine = require("../services/GameEngine");
const { getSave, saveState, freshState } = require("../services/saveStore");

async function withUserState(req, res, action) {
  const userId = req.userId;
  let stored = await getSave(userId);
  if (!stored) {
    stored = freshState();
    await saveState(userId, stored);
  }
  GameEngine.setState(stored);
  const result = await action();
  await saveState(userId, GameEngine.state());
  return res.json(result);
}

module.exports = {
  start(req, res) {
    return withUserState(req, res, () => GameEngine.startGame());
  },

  status(req, res) {
    return withUserState(req, res, () => GameEngine.status());
  },

  nextTurn(req, res) {
    return withUserState(req, res, () => GameEngine.nextTurn());
  },

  upgradeTower(req, res) {
    return withUserState(req, res, () => GameEngine.upgradeTower(Number(req.params.id)));
  },

  trainTroops(req, res) {
    const { type, amount } = req.body;
    return withUserState(req, res, () => GameEngine.trainTroops(type, amount));
  },

  upgradeTroops(req, res) {
    const { type } = req.body;
    return withUserState(req, res, () => GameEngine.upgradeTroops(type));
  },

  upgradeResearch(req, res) {
    const { type } = req.body;
    return withUserState(req, res, () => GameEngine.upgradeResearch(type));
  },

  collect(req, res) {
    return withUserState(req, res, () => GameEngine.collectResources());
  },

  collectBuilders(req, res) {
    return withUserState(req, res, () => GameEngine.collectBuilders());
  },

  hireBuilders(req, res) {
    const { amount = 1 } = req.body || {};
    return withUserState(req, res, () => GameEngine.hireBuilders(Number(amount) || 1));
  },

  heal(req, res) {
    return withUserState(req, res, () => GameEngine.healCastle());
  },

  castSpell(req, res) {
    const { type } = req.body;
    return withUserState(req, res, () => GameEngine.castSpell(type));
  },

  buildArmory(req, res) {
    const { type, amount = 1 } = req.body;
    return withUserState(req, res, () => GameEngine.buildArmory(type, Number(amount) || 1));
  },

  upgradeArmory(req, res) {
    const { type } = req.body;
    return withUserState(req, res, () => GameEngine.upgradeArmory(type));
  },

  applyRune(req, res) {
    const { type } = req.body;
    return withUserState(req, res, () => GameEngine.applyRune(type));
  },

  collectTreasure(req, res) {
    return withUserState(req, res, () => GameEngine.collectTreasure());
  },

  usePotion(req, res) {
    const { type } = req.body;
    return withUserState(req, res, () => GameEngine.usePotion(type));
  },

  addTower(req, res) {
    return withUserState(req, res, () => GameEngine.addTower());
  },

  upgradeWall(req, res) {
    return withUserState(req, res, () => GameEngine.upgradeWall());
  },

  reset(req, res) {
    return withUserState(req, res, () => GameEngine.resetGame());
  },

  nextMap(req, res) {
    return withUserState(req, res, () => GameEngine.nextMap());
  }
};
