import { create, type StateCreator } from "zustand";
import { persist } from "zustand/middleware";
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
  getShop,
  buyFromShop,
  clearLog,
} from "../api/gameApi";

type GameApiResult = ApiResponse<GameState> | GameState | null;

type GameStore = {
  state: GameState | null;
  token: string | null;
  loading: boolean;
  setToken: (token: string | null) => void;
  logout: () => void;
  loadSaved: (requireToken?: boolean) => GameState | null;
  loadStatus: () => Promise<void>;
  runStartGame: (difficulty?: string) => Promise<GameApiResult>;
  runNextTurn: () => Promise<GameApiResult>;
  runUpgradeTower: (id: number) => Promise<GameApiResult>;
  runTrainTroops: (type: string, amount: number) => Promise<GameApiResult>;
  runUpgradeTroops: (type: string) => Promise<GameApiResult>;
  runUpgradeResearch: (type: string) => Promise<GameApiResult>;
  runCollect: () => Promise<GameApiResult>;
  runCollectBuilders: () => Promise<GameApiResult>;
  runHireBuilders: (amount?: number) => Promise<GameApiResult>;
  runAddTower: () => Promise<GameApiResult>;
  runUpgradeWall: () => Promise<GameApiResult>;
  runHealCastle: () => Promise<GameApiResult>;
  runCastSpell: (type: string) => Promise<GameApiResult>;
  runApplyRune: (type: string) => Promise<GameApiResult>;
  runCollectTreasure: () => Promise<GameApiResult>;
  runUsePotion: (type: string) => Promise<GameApiResult>;
  runUseRareItem: (type: string) => Promise<GameApiResult>;
  runSummonBeast: () => Promise<GameApiResult>;
  runSelectHero: (key: string) => Promise<GameApiResult>;
  runLoadShop: () => Promise<GameApiResult>;
  runBuyShopItem: (key: string) => Promise<GameApiResult>;
  runBuildArmory: (type: string, amount: number) => Promise<GameApiResult>;
  runUpgradeArmory: (type: string) => Promise<GameApiResult>;
  runResetGame: () => Promise<GameApiResult>;
  runNextMap: () => Promise<GameApiResult>;
  runClearLog: () => Promise<GameApiResult>;
};

const parseState = (data: GameApiResult): GameState | null => {
  if (data && typeof data === "object" && "state" in data) {
    return data.state as GameState | null;
  }
  return data as GameState | null;
};

const createStore: StateCreator<GameStore> = (set, get) => {
      const updateFrom = (data: GameApiResult): GameState | null => {
        if (data && typeof data === "object" && "msg" in data && data.msg && `${data.msg}`.toLowerCase().includes("não autenticado")) {
          set({ state: null });
          return null;
        }
        const next = parseState(data) ?? null;
        set({ state: next });
        return next;
      };

      const runWithState = async (fn: () => Promise<ApiResponse<GameState>>): Promise<GameApiResult> => {
        set({ loading: true });
        try {
          const data = await fn();
          updateFrom(data);
          return data;
        } finally {
          set({ loading: false });
        }
      };

      return {
        state: null,
        token: typeof localStorage !== "undefined" ? localStorage.getItem("kingshot-token") : null,
        loading: false,
        setToken: (token: string | null) => {
          if (token) {
            localStorage.setItem("kingshot-token", token);
          } else {
            localStorage.removeItem("kingshot-token");
          }
          set({ token });
        },
        logout: () => {
          localStorage.removeItem("kingshot-token");
          localStorage.removeItem("kingshot-save");
          set({ token: null, state: null });
        },
        loadSaved: (requireToken: boolean = false) => {
          const { token, state } = get();
          if (requireToken && !token) return null;
          return state;
        },
        loadStatus: async () => {
          await runWithState(() => getStatus());
        },
        runStartGame: async (difficulty?: string) => runWithState(() => startGame(difficulty)),
        runNextTurn: async () => runWithState(() => nextTurn()),
        runUpgradeTower: async (id: number) => runWithState(() => upgradeTower(id)),
        runTrainTroops: async (type: string, amount: number) => runWithState(() => trainTroops(type, amount)),
        runUpgradeTroops: async (type: string) => runWithState(() => upgradeTroops(type)),
        runUpgradeResearch: async (type: string) => runWithState(() => upgradeResearch(type)),
        runCollect: async () => runWithState(() => collectResources()),
        runCollectBuilders: async () => runWithState(() => collectBuilders()),
        runHireBuilders: async (amount: number = 1) => runWithState(() => hireBuilders(amount)),
        runAddTower: async () => runWithState(() => addTower()),
        runUpgradeWall: async () => runWithState(() => upgradeWall()),
        runHealCastle: async () => runWithState(() => healCastle()),
        runCastSpell: async (type: string) => runWithState(() => castSpell(type)),
        runApplyRune: async (type: string) => runWithState(() => applyRune(type)),
        runCollectTreasure: async () => runWithState(() => collectTreasure()),
        runUsePotion: async (type: string) => runWithState(() => consumePotion(type)),
        runUseRareItem: async (type: string) => runWithState(() => consumeRareItem(type)),
        runSummonBeast: async () => runWithState(() => summonBeast()),
        runSelectHero: async (key: string) => runWithState(() => selectHero(key)),
        runLoadShop: async () => runWithState(() => getShop()),
        runBuyShopItem: async (key: string) => runWithState(() => buyFromShop(key)),
        runBuildArmory: async (type: string, amount: number) => runWithState(() => buildArmory(type, amount)),
        runUpgradeArmory: async (type: string) => runWithState(() => upgradeArmory(type)),
        runResetGame: async () => runWithState(() => resetGame()),
        runNextMap: async () => runWithState(() => nextMap()),
        runClearLog: async () => runWithState(() => clearLog()),
      };
    };

export const useGameStore = create<GameStore>()(
  persist<GameStore>(createStore, {
    name: "kingshot-store",
    partialize: (state) => ({ state: state.state, token: state.token })
  })
);
