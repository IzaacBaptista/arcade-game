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
  useRareItem as consumeRareItem,
  summonBeast,
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
    return upgradeTower(id).then(d => { updateFrom(d); return d; });
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
    return addTower().then(d => { updateFrom(d); return d; });
  }

  async function runUpgradeWall() {
    return upgradeWall().then(d => { updateFrom(d); return d; });
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
    return applyRune(type).then(d => { updateFrom(d); return d; });
  }

  async function runCollectTreasure() {
    return collectTreasure().then(d => { updateFrom(d); return d; });
  }

  async function runUsePotion(type) {
    return consumePotion(type).then(d => { updateFrom(d); return d; });
  }

  async function runUseRareItem(type) {
    return consumeRareItem(type).then(d => { updateFrom(d); return d; });
  }

  async function runSummonBeast() {
    const data = await summonBeast();
    updateFrom(data);
  }

  async function runBuildArmory(type, amount) {
    return buildArmory(type, amount).then(d => { updateFrom(d); return d; });
  }

  async function runUpgradeArmory(type) {
    return upgradeArmory(type).then(d => { updateFrom(d); return d; });
  }

  async function runResetGame() {
    return resetGame().then(d => { updateFrom(d); return d; });
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
    logout() {
      setState(null);
      setToken(null);
      localStorage.removeItem("kingshot-token");
      localStorage.removeItem("kingshot-save");
    },
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
    runUseRareItem,
    runSummonBeast,
    runBuildArmory,
    runUpgradeArmory,
    runResetGame,
    runNextMap,
  };
}
