export interface HeroPassive {
  castleDefense?: number;
  troopHpPercent?: number;
  towerDamagePercent?: number;
  energyBonus?: number;
  goldBonus?: number;
  woodBonus?: number;
  researchDiscount?: number;
  beastAvailableAlways?: boolean;
  beastDamagePercent?: number;
  troopAtkPercent?: number;
}

export interface HeroSkill {
  name: string;
  key: string;
  cooldown?: number;
  [key: string]: unknown;
}

export interface Hero {
  id: string;
  name: string;
  passive: HeroPassive;
  activeSkill: HeroSkill;
  icon?: string;
  description?: string;
}
