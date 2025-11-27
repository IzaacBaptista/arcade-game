const API_BASE = "http://localhost:8000";
const API_URL = `${API_BASE}/game`;
const AUTH_URL = `${API_BASE}/auth`;

function authHeaders() {
  const token = localStorage.getItem("kingshot-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getStatus() {
  const res = await fetch(`${API_URL}/status`, { headers: authHeaders() });
  return res.json();
}

export async function startGame() {
  const res = await fetch(`${API_URL}/start`, { method: "POST", headers: authHeaders() });
  return res.json();
}

export async function nextTurn() {
  const res = await fetch(`${API_URL}/turn`, { method: "POST", headers: authHeaders() });
  return res.json();
}

export async function upgradeTower(id) {
  const res = await fetch(`${API_URL}/tower/${id}/upgrade`, { method: "POST", headers: authHeaders() });
  return res.json();
}

export async function trainTroops(type, amount) {
  const res = await fetch(`${API_URL}/troops/train`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ type, amount }),
  });

  return res.json();
}

export async function upgradeTroops(type) {
  const res = await fetch(`${API_URL}/troops/upgrade`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ type }),
  });

  return res.json();
}

export async function collectResources() {
  const res = await fetch(`${API_URL}/collect`, { method: "POST", headers: authHeaders() });
  return res.json();
}

export async function collectBuilders() {
  const res = await fetch(`${API_URL}/builders/collect`, { method: "POST", headers: authHeaders() });
  return res.json();
}

export async function hireBuilders(amount = 1) {
  const res = await fetch(`${API_URL}/builders/hire`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ amount }),
  });
  return res.json();
}

export async function addTower() {
  const res = await fetch(`${API_URL}/tower/add`, { method: "POST", headers: authHeaders() });
  return res.json();
}

export async function upgradeWall() {
  const res = await fetch(`${API_URL}/castle/wall/upgrade`, { method: "POST", headers: authHeaders() });
  return res.json();
}

export async function upgradeResearch(type) {
  const res = await fetch(`${API_URL}/research/upgrade`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ type }),
  });
  return res.json();
}

export async function castSpell(type) {
  const res = await fetch(`${API_URL}/spell/cast`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ type }),
  });
  return res.json();
}

export async function applyRune(type) {
  const res = await fetch(`${API_URL}/rune/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ type }),
  });
  return res.json();
}

export async function collectTreasure() {
  const res = await fetch(`${API_URL}/vault/collect`, { method: "POST", headers: authHeaders() });
  return res.json();
}

export async function consumePotion(type) {
  const res = await fetch(`${API_URL}/vault/potion`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ type }),
  });
  return res.json();
}

export async function useRareItem(type) {
  const res = await fetch(`${API_URL}/vault/rare`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ type }),
  });
  return res.json();
}

export async function summonBeast() {
  const res = await fetch(`${API_URL}/hero/beast`, { method: "POST", headers: authHeaders() });
  return res.json();
}

export async function healCastle() {
  const res = await fetch(`${API_URL}/castle/heal`, { method: "POST", headers: authHeaders() });
  return res.json();
}

export async function buildArmory(type, amount) {
  const res = await fetch(`${API_URL}/armory/build`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ type, amount }),
  });
  return res.json();
}

export async function upgradeArmory(type) {
  const res = await fetch(`${API_URL}/armory/upgrade`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ type }),
  });
  return res.json();
}

export async function resetGame() {
  const res = await fetch(`${API_URL}/reset`, { method: "POST", headers: authHeaders() });
  return res.json();
}

export async function nextMap() {
  const res = await fetch(`${API_URL}/map/next`, { method: "POST", headers: authHeaders() });
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function register(email, password) {
  const res = await fetch(`${AUTH_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}
