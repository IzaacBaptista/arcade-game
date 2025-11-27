const initialState = {
  map: 1,
  maxStage: 3,
  status: "ongoing", // ongoing | over | won
  stage: 1,
  turn: 1,

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
    food: 70
  },

  builders: {
    qty: 3,
    efficiency: 1
  },

  actionLocks: {
    lastCollectTurn: 0,
    lastBuilderCollectTurn: 0
  },

  towers: [
    {
      id: 1,
      name: "Torre Arqueira",
      level: 1,
      damage: 12
    }
  ],

  troops: {
    soldiers: { level: 1, qty: 10, attack: 2, hp: 10 },
    archers: { level: 1, qty: 5, attack: 4, hp: 6 }
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

  log: []
};

// estado mutável da aplicação
let gameState = JSON.parse(JSON.stringify(initialState));

module.exports = {
  gameState,
  initialState
};
