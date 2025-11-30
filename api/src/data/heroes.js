module.exports = [
  {
    id: "aurora",
    name: "Aurora",
    icon: "☀️",
    description: "Paladina solar que cura e blinda o castelo.",
    passive: {
      castleDefense: 12,
      regenCastle: 0.08,
      troopHpPercent: 0.08
    },
    activeSkill: {
      name: "Luz Serena",
      key: "sunburst",
      baseShield: 140,
      scalePerLevel: 18,
      cooldown: 4
    }
  },
  {
    id: "boros",
    name: "Boros",
    icon: "🛡️",
    description: "Cavaleiro de muralha com defesa implacável.",
    passive: {
      castleDefense: 18,
      builderEfficiency: 0.05,
      towerBlock: 0.05
    },
    activeSkill: {
      name: "Baluarte",
      key: "bulwark",
      baseShield: 180,
      scalePerLevel: 22,
      cooldown: 4
    }
  },
  {
    id: "kael",
    name: "Kael",
    icon: "🔥",
    description: "Conjurador de fogo que amplia dano explosivo.",
    passive: {
      troopAtkPercent: 0.12,
      critChance: 0.05,
      energyBonus: 0.10
    },
    activeSkill: {
      name: "Cometa Ígneo",
      key: "fireorb",
      baseDamage: 40,
      scalePerLevel: 14,
      cooldown: 3
    }
  },
  {
    id: "lyra",
    name: "Lyra",
    icon: "❄️",
    description: "Maga glaciar que controla o campo e reduz dano.",
    passive: {
      enemySlow: 0.10,
      towerDamagePercent: 0.10,
      energyBonus: 0.08
    },
    activeSkill: {
      name: "Tempestade Gélida",
      key: "frostburst",
      bonusPercent: 0.25,
      duration: 2,
      cooldown: 4
    }
  }
];
