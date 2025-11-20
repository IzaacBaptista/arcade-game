import { useEffect, useState } from "react";
import {
  getStatus,
  nextTurn,
  upgradeTower,
  trainTroops,
} from "../api/gameApi";

export function useGame() {
  const [state, setState] = useState(null);
  const [loading] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  async function loadStatus() {
    const data = await getStatus();
    setState(data);
  }

  async function runNextTurn() {
    const data = await nextTurn();
    setState(data);
  }

  async function runUpgradeTower(id) {
    const data = await upgradeTower(id);
    setState(data.state);
  }

  async function runTrainTroops(type, amount) {
    const data = await trainTroops(type, amount);
    setState(data.state);
  }

  return {
    state,
    loading,
    runNextTurn,
    runUpgradeTower,
    runTrainTroops,
  };
}
