const https = require("https");

const defaultModel = process.env.OPENAI_MODEL || "gpt-4o-mini";

function buildSummary(state) {
  if (!state) return "Sem dados de jogo.";
  const resources = state.resources || {};
  const troops = state.troops || {};
  const towers = state.towers || [];
  const enemies = state.enemies || [];
  const hero = state.hero || {};

  const troopSummary = Object.keys(troops)
    .map(k => `${k}: qty ${troops[k].qty || 0} atk ${troops[k].attack || 0}`)
    .join("; ");

  const enemySummary = enemies.slice(0, 5).map(e => `${e.name || "Inimigo"} hp ${e.hp} atk ${e.attack}`).join("; ");

  return [
    `Mapa ${state.map} Fase ${state.stage} Turno ${state.turn} Status ${state.status}`,
    `Recursos: ouro ${resources.gold || 0}, madeira ${resources.wood || 0}, energia ${resources.energy || 0}, comida ${resources.food || 0}, pedra ${resources.stone || 0}, ferro ${resources.iron || 0}, moedas raras ${resources.coins || 0}`,
    `Torres: ${towers.length}`,
    `Tropas: ${troopSummary || "nenhuma"}`,
    `Inimigos: ${enemies.length} (${enemySummary || "nenhum"})`,
    `Herói: ${hero.name || "Herói"} lvl ${hero.level || 1} xp ${hero.xp || 0}`
  ].join(" | ");
}

async function callOpenAI(messages) {
  if (!process.env.OPENAI_API_KEY) {
    return { error: "OPENAI_API_KEY não configurada no servidor." };
  }
  if (typeof fetch !== "function") {
    return { error: "fetch não disponível no runtime Node. Atualize para Node 18+." };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: defaultModel,
        messages,
        max_tokens: 180,
        temperature: 0.5
      }),
      agent: new https.Agent({ keepAlive: true })
    });

    if (!res.ok) {
      const text = await res.text();
      return { error: `OpenAI respondeu com erro ${res.status}: ${text}` };
    }
    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content?.trim();
    return { content: content || "Sem resposta." };
  } catch (err) {
    return { error: `Falha ao chamar OpenAI: ${err.message}` };
  } finally {
    clearTimeout(timer);
  }
}

async function generateTips(state) {
  const summary = buildSummary(state);
  const messages = [
    {
      role: "system",
      content:
        "Você é um assistente de estratégia para um jogo tower defense. Responda em português com 3 dicas breves separadas por quebras de linha. Foque em ações concretas no próximo turno ou duas."
    },
    { role: "user", content: summary }
  ];
  return callOpenAI(messages);
}

module.exports = { generateTips };
