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
    wood: 50
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

  enemies: [],

  log: []
};

// estado mutável da aplicação
let gameState = JSON.parse(JSON.stringify(initialState));

module.exports = {
  gameState,
  initialState
};
