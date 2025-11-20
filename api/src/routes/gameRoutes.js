const express = require("express");
const router = express.Router();
const GameController = require("../controllers/GameController");

router.post("/start", GameController.start);
router.get("/status", GameController.status);
router.post("/turn", GameController.nextTurn);
router.post("/tower/:id/upgrade", GameController.upgradeTower);
router.post("/troops/train", GameController.trainTroops);
router.post("/collect", GameController.collect);
router.post("/tower/add", GameController.addTower);
router.post("/castle/wall/upgrade", GameController.upgradeWall);
router.post("/reset", GameController.reset);
router.post("/map/next", GameController.nextMap);

module.exports = router;
