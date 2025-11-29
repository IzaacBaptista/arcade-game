const heroesData = require("./heroes");

const initialState = {
  map: 1,
  maxStage: 3,
  status: "ongoing",
  stage: 1,
  turn: 1,
  difficulty: "medium",

  castle: {
    hp: 1000,
    max_hp: 1000,
    wall_level: 1,
    defense_bonus: 5
  },

  resources: {
    gold: 100,
    wood: 50,
    energy: 30,
    food: 70,
    stone: 40,
    iron: 20,
    population: 20
  },

  xp: 0,

  builders: {
    qty: 3,
    efficiency: 1,
    workers: []
  },

  runes: {
    power: 0,
    guard: 0
  },

  research: {
    tower: 0,
    troop: 0,
    siege: 0,
    defense: 0
  },

  heroRoster: heroesData.map(h => ({
    ...h,
    key: h.id,
    xp: 0,
    level: 1,
    charges: h.charges || 2
  })),

  hero: (() => {
    const first = heroesData[0] || { id: "hero", name: "Herói", icon: "🛡️", role: "Guardião" };
    return {
      key: first.id,
      name: first.name,
      role: first.role || "Herói",
      icon: first.icon || "🛡️",
      xp: 0,
      level: 1,
      charges: first.charges || 2,
      cooldown: 0,
      beast: { unlocked: false, ready: true, activeTurns: 0 }
    };
  })(),

  effects: {
    castleShield: 0,
    enemyWeakTurns: 0,
    ringPowerTurns: 0,
    bookTurns: 0,
    armorTurns: 0,
    hasteTurns: 0
  },

  achievements: {
    winStreak: 0,
    noDamageClear: false,
    totalWins: 0,
    totalLosses: 0,
    daily: { collectGoal: 3, collectProgress: 0, completed: false }
  },

  vault: {
    jewels: 50,
    artifacts: [],
    potions: { heal: 2, energy: 2, loot: 1 },
    rare: [
      { key: "ring", label: "Anel de Poder", icon: "💍", desc: "+20% atk torres por 3 turnos", unlocked: false, activeTurns: 0 },
      { key: "book", label: "Grimório", icon: "📜", desc: "+15% atk tropas por 3 turnos", unlocked: false, activeTurns: 0 },
      { key: "armor", label: "Armadura Sagrada", icon: "🛡️", desc: "+10 DEF castelo por 3 turnos", unlocked: false, activeTurns: 0 },
      { key: "haste", label: "Relógio Arcano", icon: "⏳", desc: "-15% dano inimigo por 2 turnos", unlocked: false, activeTurns: 0 }
    ]
  },

  mapLayout: {
    name: "Vale Sereno",
    paths: 2,
    effects: { enemySlow: 0.08, towerBuff: 0.05, obstacles: ["lama", "pedras"] }
  },

  builderTiles: [
    { id: 1, type: "wood", richness: 1.0, assigned: 0 },
    { id: 2, type: "gold", richness: 0.9, assigned: 0 },
    { id: 3, type: "food", richness: 1.1, assigned: 0 },
    { id: 4, type: "stone", richness: 0.8, assigned: 0 },
    { id: 5, type: "iron", richness: 0.7, assigned: 0 },
    { id: 6, type: "energy", richness: 0.6, assigned: 0 }
  ],

  techTree: {
    ferro: 0,
    pedra: 0,
    agricultura: 0,
    engenharia: 0
  },

  lastEvent: null,

  actionLocks: {
    lastCollectTurn: 0,
    lastBuilderCollectTurn: 0
  },

  towers: [
    {
      id: 1,
      name: "Torre Arqueira",
      level: 1,
      damage: 12,
      rune_power: 0,
      rune_guard: 0
    }
  ],

  troops: {
    soldiers: { level: 1, qty: 10, attack: 2, hp: 10, speed: 5, crit: 5, critDmg: 150, armor: 2, pen: 1 },
    archers: { level: 1, qty: 5, attack: 4, hp: 6, speed: 7, crit: 10, critDmg: 170, armor: 1, pen: 2 },
    lancers: { level: 1, qty: 3, attack: 6, hp: 8, speed: 6, crit: 7, critDmg: 160, armor: 3, pen: 1 },
    assassins: { level: 1, qty: 2, attack: 8, hp: 5, speed: 9, crit: 15, critDmg: 200, armor: 1, pen: 3 },
    berserkers: { level: 1, qty: 1, attack: 10, hp: 12, speed: 4, crit: 5, critDmg: 150, armor: 4, pen: 2 },
    giants: { level: 1, qty: 0, attack: 15, hp: 20, speed: 2, crit: 3, critDmg: 130, armor: 5, pen: 3 },
    elephants: { level: 1, qty: 0, attack: 18, hp: 25, speed: 2, crit: 2, critDmg: 120, armor: 6, pen: 4 },
    imps: { level: 1, qty: 0, attack: 5, hp: 4, speed: 8, crit: 12, critDmg: 180, armor: 1, pen: 2 }
  },

  armory: {
    catapults: { level: 1, qty: 0, attack: 28, role: "cerco" },
    cannons: { level: 1, qty: 0, attack: 24, role: "cerco" },
    horses: { level: 1, qty: 0, attack: 6, role: "mobilidade" },
    cavalry: { level: 1, qty: 0, attack: 14, role: "carga" },
    shields: { level: 1, qty: 0, defense: 8, role: "defesa" },
    spears: { level: 1, qty: 0, attack: 10, role: "infantaria" }
  },

  enemies: [],

  castleDamageThisMap: 0,

  log: []
};

let gameState = JSON.parse(JSON.stringify(initialState));

module.exports = {
  gameState,
  initialState
};
