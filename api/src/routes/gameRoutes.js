const express = require("express");
const router = express.Router();
const GameController = require("../controllers/GameController");

router.post("/start", GameController.start);
router.get("/status", GameController.status);
router.post("/turn", GameController.nextTurn);
router.post("/tower/:id/upgrade", GameController.upgradeTower);
router.post("/troops/train", GameController.trainTroops);

module.exports = router;
