export interface Troop {
  qty: number;
  attack: number;
  hp: number;
  level: number;
  crit?: number;
  armor?: number;
  speed?: number;
  pen?: number;
  critDmg?: number;
}

export interface Tower {
  id: number;
  level: number;
  damage: number;
  rune_power?: number;
  rune_guard?: number;
  name?: string;
}

export type EnemyRole = "normal" | "tank" | "flyer" | "support" | "boss";

export interface Enemy {
  id: string;
  hp: number;
  attack: number;
  boss?: boolean;
  speed: number;
  role: EnemyRole;
  distance?: number;
  max_hp?: number;
  reward?: number;
  icon?: string;
  name?: string;
  shieldReady?: boolean;
  resist?: Record<string, number | boolean>;
}

export interface HeroSummary {
  key: string;
  name: string;
  role?: string;
  icon?: string;
  xp?: number;
  level?: number;
  charges?: number;
}

export interface ShopItem {
  key: string;
  name: string;
  desc: string;
  cost: { coins?: number; gold?: number };
  type: string;
  payload?: any;
  owned?: boolean;
  affordable?: boolean;
}

export interface GameState {
  map: number;
  maxStage: number;
  status: string;
  stage: number;
  turn: number;
  difficulty: string;
  towers: Tower[];
  troops: Record<string, Troop>;
  enemies: Enemy[];
  heroRoster: HeroSummary[];
  hero: HeroSummary & { beast?: { unlocked?: boolean; ready?: boolean; activeTurns?: number } };
  resources: Record<string, number>;
  castle: { hp: number; max_hp: number; wall_level: number; defense_bonus: number };
  shop?: { items: ShopItem[] };
}
