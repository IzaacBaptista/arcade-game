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
  applyRune,
  collectTreasure,
  consumePotion,
  healCastle,
  resetGame,
  nextMap,
  buildArmory,
  upgradeArmory,
} from "../api/gameApi";

export function useGame() {
  const [state, setState] = useState(null);
  const [loading] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem("kingshot-token") || null);

  useEffect(() => {
    if (!token) {
      setState(null);
      return;
    }
    const saved = loadSaved(true);
    if (saved) {
      setState(saved);
    } else {
      loadStatus();
    }
  }, [token]);

  function updateFrom(data) {
    if (data?.msg && `${data.msg}`.toLowerCase().includes("não autenticado")) {
      setState(null);
      return;
    }
    const next = data?.state ?? data;
    setState(next);
    try {
      localStorage.setItem("kingshot-save", JSON.stringify(next));
    } catch (_) {}
  }

  function loadSaved(requireToken = false) {
    if (requireToken && !token) return null;
    try {
      const raw = localStorage.getItem("kingshot-save");
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return null;
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

  async function runApplyRune(type) {
    const data = await applyRune(type);
    updateFrom(data);
  }

  async function runCollectTreasure() {
    const data = await collectTreasure();
    updateFrom(data);
  }

  async function runUsePotion(type) {
    const data = await consumePotion(type);
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
    token,
    setToken,
    loadStatus,
    loadSaved,
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
    runApplyRune,
    runCollectTreasure,
    runUsePotion,
    runBuildArmory,
    runUpgradeArmory,
    runResetGame,
    runNextMap,
  };
}
