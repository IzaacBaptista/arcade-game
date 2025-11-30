import type { ApiResponse } from "../types/ApiResponse";
import type { GameState } from "../types/GameState";

const API_BASE = "http://localhost:8000";
const API_URL = `${API_BASE}/game`;
const AUTH_URL = `${API_BASE}/auth`;

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("kingshot-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function jsonFetch<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(url, options);
    return res.json();
  } catch (err) {
    console.error("API error", err);
    return { msg: "Falha ao contactar servidor." } as unknown as T;
  }
}

export async function getStatus(): Promise<ApiResponse<GameState>> {
  return jsonFetch<ApiResponse<GameState>>(`${API_URL}/status`, { headers: authHeaders() });
}

export async function startGame(difficulty?: string): Promise<ApiResponse<GameState>> {
  return jsonFetch<ApiResponse<GameState>>(`${API_URL}/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ difficulty })
  });
}

export async function nextTurn(): Promise<ApiResponse<GameState>> {
  return jsonFetch<ApiResponse<GameState>>(`${API_URL}/turn`, { method: "POST", headers: authHeaders() });
}

export async function upgradeTower(id: number): Promise<ApiResponse<GameState>> {
  return jsonFetch<ApiResponse<GameState>>(`${API_URL}/tower/${id}/upgrade`, { method: "POST", headers: authHeaders() });
}

export async function trainTroops(type: string, amount?: number): Promise<ApiResponse<GameState>> {
  return jsonFetch<ApiResponse<GameState>>(`${API_URL}/troops/train`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ type, amount }),
  });
}

export async function upgradeTroops(type: string): Promise<ApiResponse<GameState>> {
  return jsonFetch<ApiResponse<GameState>>(`${API_URL}/troops/upgrade`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ type }),
  });
}

export async function collectResources(): Promise<ApiResponse<GameState>> {
  return jsonFetch<ApiResponse<GameState>>(`${API_URL}/collect`, { method: "POST", headers: authHeaders() });
}

export async function collectBuilders(): Promise<ApiResponse<GameState>> {
  return jsonFetch<ApiResponse<GameState>>(`${API_URL}/builders/collect`, { method: "POST", headers: authHeaders() });
}

export async function hireBuilders(type: string = "builder", amount = 1): Promise<ApiResponse<GameState>> {
  return jsonFetch<ApiResponse<GameState>>(`${API_URL}/builders/hire`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ type, amount }),
  });
}

export async function addTower(): Promise<ApiResponse<GameState>> {
  return jsonFetch<ApiResponse<GameState>>(`${API_URL}/tower/add`, { method: "POST", headers: authHeaders() });
}

export async function upgradeWall(): Promise<ApiResponse<GameState>> {
  return jsonFetch<ApiResponse<GameState>>(`${API_URL}/castle/wall/upgrade`, { method: "POST", headers: authHeaders() });
}

export async function upgradeResearch(type: string): Promise<ApiResponse<GameState>> {
  return jsonFetch<ApiResponse<GameState>>(`${API_URL}/research/upgrade`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ type }),
  });
}

export async function castSpell(type: string): Promise<ApiResponse<GameState>> {
  return jsonFetch<ApiResponse<GameState>>(`${API_URL}/spell/cast`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ type }),
  });
}

export async function applyRune(type: string): Promise<ApiResponse<GameState>> {
  return jsonFetch<ApiResponse<GameState>>(`${API_URL}/rune/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ type }),
  });
}

export async function collectTreasure(): Promise<ApiResponse<GameState>> {
  return jsonFetch<ApiResponse<GameState>>(`${API_URL}/vault/collect`, { method: "POST", headers: authHeaders() });
}

export async function consumePotion(type: string): Promise<ApiResponse<GameState>> {
  return jsonFetch<ApiResponse<GameState>>(`${API_URL}/vault/potion`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ type }),
  });
}

export async function useRareItem(type: string): Promise<ApiResponse<GameState>> {
  return jsonFetch<ApiResponse<GameState>>(`${API_URL}/vault/rare`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ type }),
  });
}

export async function buyRareItem(type: string): Promise<ApiResponse<GameState>> {
  return jsonFetch<ApiResponse<GameState>>(`${API_URL}/vault/rare/buy`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ type }),
  });
}

export async function summonBeast() {
  return jsonFetch<ApiResponse<GameState>>(`${API_URL}/hero/beast`, { method: "POST", headers: authHeaders() });
}

export async function selectHero(key: string): Promise<ApiResponse<GameState>> {
  return jsonFetch<ApiResponse<GameState>>(`${API_URL}/hero/select`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ key })
  });
}

export async function healCastle() {
  return jsonFetch<ApiResponse<GameState>>(`${API_URL}/castle/heal`, { method: "POST", headers: authHeaders() });
}

export async function buildArmory(type: string, amount: number): Promise<ApiResponse<GameState>> {
  return jsonFetch<ApiResponse<GameState>>(`${API_URL}/armory/build`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ type, amount }),
  });
}

export async function upgradeArmory(type: string): Promise<ApiResponse<GameState>> {
  return jsonFetch<ApiResponse<GameState>>(`${API_URL}/armory/upgrade`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ type }),
  });
}

export async function resetGame() {
  return jsonFetch<ApiResponse<GameState>>(`${API_URL}/reset`, { method: "POST", headers: authHeaders() });
}

export async function nextMap() {
  return jsonFetch<ApiResponse<GameState>>(`${API_URL}/map/next`, { method: "POST", headers: authHeaders() });
}

export async function clearLog() {
  return jsonFetch<ApiResponse<GameState>>(`${API_URL}/log/clear`, { method: "POST", headers: authHeaders() });
}

type AuthResponse = { token?: string; msg?: string };

export async function login(email: string, password: string): Promise<AuthResponse> {
  return jsonFetch<AuthResponse>(`${AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
}

export async function register(email: string, password: string): Promise<AuthResponse> {
  return jsonFetch<AuthResponse>(`${AUTH_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
}
