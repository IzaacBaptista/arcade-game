const API_URL = "http://localhost:8000/game";

export async function getStatus() {
  const res = await fetch(`${API_URL}/status`);
  return res.json();
}

export async function startGame() {
  const res = await fetch(`${API_URL}/start`, { method: "POST" });
  return res.json();
}

export async function nextTurn() {
  const res = await fetch(`${API_URL}/turn`, { method: "POST" });
  return res.json();
}

export async function upgradeTower(id) {
  const res = await fetch(`${API_URL}/tower/${id}/upgrade`, { method: "POST" });
  return res.json();
}

export async function trainTroops(type, amount) {
  const res = await fetch(`${API_URL}/troops/train`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, amount }),
  });

  return res.json();
}

export async function upgradeTroops(type) {
  const res = await fetch(`${API_URL}/troops/upgrade`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type }),
  });

  return res.json();
}

export async function collectResources() {
  const res = await fetch(`${API_URL}/collect`, { method: "POST" });
  return res.json();
}

export async function collectBuilders() {
  const res = await fetch(`${API_URL}/builders/collect`, { method: "POST" });
  return res.json();
}

export async function hireBuilders(amount = 1) {
  const res = await fetch(`${API_URL}/builders/hire`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });
  return res.json();
}

export async function addTower() {
  const res = await fetch(`${API_URL}/tower/add`, { method: "POST" });
  return res.json();
}

export async function upgradeWall() {
  const res = await fetch(`${API_URL}/castle/wall/upgrade`, { method: "POST" });
  return res.json();
}

export async function healCastle() {
  const res = await fetch(`${API_URL}/castle/heal`, { method: "POST" });
  return res.json();
}

export async function buildArmory(type, amount) {
  const res = await fetch(`${API_URL}/armory/build`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, amount }),
  });
  return res.json();
}

export async function upgradeArmory(type) {
  const res = await fetch(`${API_URL}/armory/upgrade`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type }),
  });
  return res.json();
}

export async function resetGame() {
  const res = await fetch(`${API_URL}/reset`, { method: "POST" });
  return res.json();
}

export async function nextMap() {
  const res = await fetch(`${API_URL}/map/next`, { method: "POST" });
  return res.json();
}
