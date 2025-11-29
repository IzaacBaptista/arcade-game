import { useEffect, useState, useCallback } from "react";
import type { ApiResponse } from "../types/ApiResponse";
import type { GameState } from "../types/GameState";
import {
  getStatus,
  startGame,
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
  selectHero,
  healCastle,
  resetGame,
  nextMap,
  buildArmory,
  upgradeArmory,
} from "../api/gameApi";

type GameApiResult = ApiResponse<GameState> | GameState | null;

export function useGame() {
  const [state, setState] = useState<GameState | null>(null);
  const [loading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("kingshot-token") || null);

  const loadSaved = useCallback((requireToken: boolean = false): GameState | null => {
    if (requireToken && !token) return null;
    try {
      const raw = localStorage.getItem("kingshot-save");
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return null;
  }, [token]);

  const updateFrom = useCallback((data: GameApiResult) => {
    if (data && "msg" in data && data.msg && `${data.msg}`.toLowerCase().includes("não autenticado")) {
      setState(null);
      return;
    }
    const next: GameState | null =
      data && typeof data === "object" && "state" in data ? (data.state as GameState | null) : (data as GameState | null);
    setState(next ?? null);
    try {
      localStorage.setItem("kingshot-save", JSON.stringify(next));
    } catch (_) {}
  }, []);

  const loadStatus = useCallback(async () => {
    const data = await getStatus();
    updateFrom(data);
  }, [updateFrom]);

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
  }, [token, loadSaved, loadStatus]);

  async function runStartGame(difficulty?: string) {
    const data = await startGame(difficulty);
    updateFrom(data);
    return data;
  }
  async function runNextTurn() {
    const data = await nextTurn();
    updateFrom(data);
  }

  async function runUpgradeTower(id: number) {
    return upgradeTower(id).then(d => { updateFrom(d); return d; });
  }

  async function runTrainTroops(type: string, amount: number) {
    const data = await trainTroops(type, amount);
    updateFrom(data);
  }

  async function runUpgradeTroops(type: string) {
    const data = await upgradeTroops(type);
    updateFrom(data);
  }

  async function runUpgradeResearch(type: string) {
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

  async function runHireBuilders(amount: number = 1) {
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

  async function runCastSpell(type: string) {
    const data = await castSpell(type);
    updateFrom(data);
  }

  async function runApplyRune(type: string) {
    return applyRune(type).then(d => { updateFrom(d); return d; });
  }

  async function runCollectTreasure() {
    return collectTreasure().then(d => { updateFrom(d); return d; });
  }

  async function runUsePotion(type: string) {
    return consumePotion(type).then(d => { updateFrom(d); return d; });
  }

  async function runUseRareItem(type: string) {
    return consumeRareItem(type).then(d => { updateFrom(d); return d; });
  }

  async function runSummonBeast() {
    const data = await summonBeast();
    updateFrom(data);
  }

  async function runSelectHero(key: string) {
    const data = await selectHero(key);
    updateFrom(data);
    return data;
  }

  async function runBuildArmory(type: string, amount: number) {
    return buildArmory(type, amount).then(d => { updateFrom(d); return d; });
  }

  async function runUpgradeArmory(type: string) {
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
    runStartGame,
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
    runSelectHero,
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
