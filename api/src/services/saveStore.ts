import type { GameState } from "../types/GameState";
const db = require("../db") as typeof import("../db");
const { initialState } = require("../data/gameState");

async function getSave(userId: number): Promise<GameState | null> {
  const res = await db.query<{state: GameState}>("SELECT state FROM saves WHERE user_id = $1", [userId]);
  if (res.rows.length === 0) return null;
  return res.rows[0].state;
}

async function saveState(userId: number, state: GameState): Promise<void> {
  await db.query(
    `INSERT INTO saves (user_id, state, updated_at) VALUES ($1, $2, NOW())
     ON CONFLICT (user_id) DO UPDATE SET state = EXCLUDED.state, updated_at = NOW()`,
    [userId, state]
  );
}

function freshState(): GameState {
  return JSON.parse(JSON.stringify(initialState));
}

module.exports = {
  getSave,
  saveState,
  freshState
};
