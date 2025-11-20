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
