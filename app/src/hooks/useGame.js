import { useEffect, useState } from "react";
import {
  getStatus,
  nextTurn,
  upgradeTower,
  trainTroops,
  collectResources,
  addTower,
  upgradeWall,
  resetGame,
  nextMap,
} from "../api/gameApi";

export function useGame() {
  const [state, setState] = useState(null);
  const [loading] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  function updateFrom(data) {
    setState(data?.state ?? data);
  }

  async function loadStatus() {
    const data = await getStatus();
    updateFrom(data);
  }

  async function runNextTurn() {
    const data = await nextTurn();
    updateFrom(data);
  }

  async function runUpgradeTower(id) {
    const data = await upgradeTower(id);
    updateFrom(data);
  }

  async function runTrainTroops(type, amount) {
    const data = await trainTroops(type, amount);
    updateFrom(data);
  }

  async function runCollect() {
    const data = await collectResources();
    updateFrom(data);
  }

  async function runAddTower() {
    const data = await addTower();
    updateFrom(data);
  }

  async function runUpgradeWall() {
    const data = await upgradeWall();
    updateFrom(data);
  }

  async function runResetGame() {
    const data = await resetGame();
    updateFrom(data);
  }

  async function runNextMap() {
    const data = await nextMap();
    updateFrom(data);
  }

  return {
    state,
    loading,
    runNextTurn,
    runUpgradeTower,
    runTrainTroops,
    runCollect,
    runAddTower,
    runUpgradeWall,
    runResetGame,
    runNextMap,
  };
}
