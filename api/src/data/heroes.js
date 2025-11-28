module.exports = [
  {
    id: "guardian",
    name: "Guardião Real",
    icon: "🛡️",
    description: "Herói focado em defesa e resistência.",
    passive: {
      castleDefense: 15,
      troopHpPercent: 0.10,
      builderEfficiency: 0.05
    },
    activeSkill: {
      name: "Murada de Ferro",
      key: "ironwall",
      baseShield: 150,
      scalePerLevel: 20,
      cooldown: 4
    }
  },
  {
    id: "archer",
    name: "Arqueira Élfica",
    icon: "🏹",
    description: "Especialista em torres rápidas e crítico.",
    passive: {
      towerDamagePercent: 0.15,
      critChance: 0.05
    },
    activeSkill: {
      name: "Chuva de Flechas",
      key: "arrowstorm",
      baseDamage: 30,
      scalePerLevel: 10,
      cooldown: 3
    }
  },
  {
    id: "alchemist",
    name: "Alquimista Arcano",
    icon: "🧪",
    description: "Especialista em economia e buffs temporários.",
    passive: {
      energyBonus: 0.20,
      goldBonus: 0.10,
      woodBonus: 0.10,
      researchDiscount: 0.10
    },
    activeSkill: {
      name: "Elixir Instável",
      key: "elixir",
      bonusPercent: 0.30,
      duration: 1,
      cooldown: 5
    }
  },
  {
    id: "beastmaster",
    name: "Mestre das Feras",
    icon: "🐺",
    description: "Controla feras e fortalece ataques físicos.",
    passive: {
      beastAvailableAlways: true,
      beastDamagePercent: 0.30,
      troopAtkPercent: 0.08
    },
    activeSkill: {
      name: "Chamado da Alcatéia",
      key: "wolfpack",
      wolfDamage: 20,
      wolfQty: 2,
      cooldown: 4
    }
  }
];
