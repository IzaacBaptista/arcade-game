import { useEffect, useState } from "react";
import {
  getStatus,
  nextTurn,
  upgradeTower,
  trainTroops,
  upgradeTroops,
  collectResources,
  collectBuilders,
  hireBuilders,
  addTower,
  upgradeWall,
  upgradeResearch,
  castSpell,
  healCastle,
  resetGame,
  nextMap,
  buildArmory,
  upgradeArmory,
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

  async function runUpgradeTroops(type) {
    const data = await upgradeTroops(type);
    updateFrom(data);
  }

  async function runUpgradeResearch(type) {
    const data = await upgradeResearch(type);
    updateFrom(data);
  }

  async function runCollect() {
    const data = await collectResources();
    updateFrom(data);
  }

  async function runCollectBuilders() {
    const data = await collectBuilders();
    updateFrom(data);
  }

  async function runHireBuilders(amount = 1) {
    const data = await hireBuilders(amount);
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

  async function runHealCastle() {
    const data = await healCastle();
    updateFrom(data);
  }

  async function runCastSpell(type) {
    const data = await castSpell(type);
    updateFrom(data);
  }

  async function runBuildArmory(type, amount) {
    const data = await buildArmory(type, amount);
    updateFrom(data);
  }

  async function runUpgradeArmory(type) {
    const data = await upgradeArmory(type);
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
    runUpgradeTroops,
    runUpgradeResearch,
    runCollect,
    runCollectBuilders,
    runHireBuilders,
    runAddTower,
    runUpgradeWall,
    runHealCastle,
    runCastSpell,
    runBuildArmory,
    runUpgradeArmory,
    runResetGame,
    runNextMap,
  };
}
