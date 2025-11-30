const GameEngine = require("../services/GameEngine");
const { getSave, saveState, freshState } = require("../services/saveStore");
const { generateTips } = require("../services/aiClient");

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
    const { difficulty } = req.body || {};
    if (difficulty) GameEngine.setDifficulty(difficulty);
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
    const { amount = 1, type = "builder" } = req.body || {};
    return withUserState(req, res, () => GameEngine.hireBuilders(type, Number(amount) || 1));
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

  useRare(req, res) {
    const { type } = req.body;
    return withUserState(req, res, () => GameEngine.useRareItem(type));
  },

  buyRare(req, res) {
    const { type } = req.body;
    return withUserState(req, res, () => GameEngine.buyRareItem(type));
  },

  async aiTips(req, res) {
    return withUserState(req, res, async () => {
      const state = GameEngine.status();
      const result = await generateTips(state);
      if (result.error) {
        return { msg: result.error, tips: [], state };
      }
      const tips = (result.content || "")
        .split("\n")
        .map(t => t.trim())
        .filter(Boolean)
        .slice(0, 5);
      return { msg: "Dicas geradas.", tips, state };
    });
  },

  shop(req, res) {
    return withUserState(req, res, () => GameEngine.status());
  },

  shopBuy(req, res) {
    const { key } = req.body || {};
    return withUserState(req, res, () => GameEngine.buyShopItem(key));
  },

  summonBeast(req, res) {
    return withUserState(req, res, () => GameEngine.summonBeast());
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
  },

  selectHero(req, res) {
    const { key } = req.body || {};
    return withUserState(req, res, () => GameEngine.selectHero(key));
  },

  clearLog(req, res) {
    return withUserState(req, res, () => GameEngine.clearLog());
  }
};
