export type ActiveTab = 'game' | 'map' | 'missions' | 'arena' | 'ramen';

export interface BossConfig {
  id: number;
  name: string;
  title: string;
  subtitle: string;
  avatar: string;
  color: string;
  maxHp: number;
  speed: number;
  attackCooldown: number;
  signatureJutsu: string;
  arenaTheme: 'forest' | 'bridge' | 'desert' | 'water' | 'valley' | 'sky' | 'ruins' | 'training';
  quote: string;
  specialMechanic: 'sharingan' | 'hidden_mist' | 'snakes' | 'sand_shield' | 'scalpel' | 'shark_wave' | 'amaterasu' | 'curse_mark' | 'clay_bombs' | 'shinra_tensei';
}

export interface LevelConfig {
  levelNum: number;
  title: string;
  location: string;
  stageWidth: number;
  boss: BossConfig;
  description: string;
  minionType: 'sound_ninja' | 'mist_rogue' | 'sand_puppet' | 'clay_crawler' | 'akatsuki_scout';
  platforms: Array<{ x: number; y: number; width: number; height: number; oneWay?: boolean; breakable?: boolean }>;
  ramenPickups: Array<{ x: number; y: number }>;
  scrollPickups: Array<{ x: number; y: number; id: number }>;
  crates: Array<{ x: number; y: number; content: 'chakra' | 'health' | 'ramen' }>;
  hazards: Array<{ x: number; y: number; width: number; type: 'spikes' | 'quicksand' | 'acid' }>;
}

export interface PlayerStats {
  hp: number;
  maxHp: number;
  chakra: number;
  maxChakra: number;
  ryo: number;
  scrolls: number;
  activeBuff?: {
    name: string;
    description: string;
    duration: number;
    atkMultiplier: number;
    speedBoost: number;
    chakraRegen: number;
  };
}

export interface SkillUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  unlocked: boolean;
  tier: number;
  statBonus: string;
}

export interface Mission {
  id: string;
  rank: 'D' | 'C' | 'B' | 'A' | 'S';
  title: string;
  location: string;
  client: string;
  rewardRyo: number;
  rewardScrolls: number;
  description: string;
  status: 'available' | 'in_progress' | 'completed';
  assignedShinobi: string[];
  durationSeconds: number;
  progressSeconds: number;
}
