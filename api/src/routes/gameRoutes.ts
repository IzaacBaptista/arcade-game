const express = require("express");
const router = express.Router();
const GameController = require("../controllers/GameController");
const { requireAuth } = require("../middleware/requireAuth");

router.use(requireAuth);

router.post("/start", GameController.start);
router.get("/status", GameController.status);
router.post("/turn", GameController.nextTurn);
router.post("/tower/:id/upgrade", GameController.upgradeTower);
router.post("/troops/train", GameController.trainTroops);
router.post("/troops/upgrade", GameController.upgradeTroops);
router.post("/research/upgrade", GameController.upgradeResearch);
router.post("/collect", GameController.collect);
router.post("/builders/collect", GameController.collectBuilders);
router.post("/builders/hire", GameController.hireBuilders);
router.post("/castle/heal", GameController.heal);
router.post("/spell/cast", GameController.castSpell);
router.post("/armory/build", GameController.buildArmory);
router.post("/armory/upgrade", GameController.upgradeArmory);
router.post("/rune/apply", GameController.applyRune);
router.post("/vault/collect", GameController.collectTreasure);
router.post("/vault/potion", GameController.usePotion);
router.post("/vault/rare", GameController.useRare);
router.post("/hero/beast", GameController.summonBeast);
router.post("/tower/add", GameController.addTower);
router.post("/castle/wall/upgrade", GameController.upgradeWall);
router.post("/reset", GameController.reset);
router.post("/map/next", GameController.nextMap);
router.post("/hero/select", GameController.selectHero);
router.post("/log/clear", GameController.clearLog);

module.exports = router;
