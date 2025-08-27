// Game types
export type Element = 'earth' | 'water' | 'fire';
export type Location = 'swamp' | 'village' | 'castle' | 'free';
export type ElementalRarity = 'common' | 'rare' | 'epic' | 'immortal';

export interface ElementData {
  name: string;
  emoji: string;
  color?: string;
}

export interface LocationData {
  name: string;
  emoji: string;
  mana: number;
}

export interface ElementalData {
  name: string;
  emoji: string;
  rarity: string;
  protection: number;
  evolutionCost?: number;
  legendary?: boolean;
}

// New collection system types
export interface CollectedElemental {
  id: string;
  element: Element;
  rarity: ElementalRarity;
  level: number;
  experience: number;
  isOwned: boolean;
  lastUsed?: number;
  timesUsed: number;
  cooldownEndTime?: number; // Timestamp when cooldown ends
}

export interface ElementalCollection {
  elementals: Record<string, CollectedElemental>;
  totalOwned: number;
  totalImmortal: number;
  totalEpic: number;
  collectionProgress: Record<Element, number>;
}

export interface EvolutionData {
  stage: number;
  name: string;
  emoji: string;
  protection: number;
  cost: number;
  requiredLevel: number;
}

export interface PlayerStats {
  name: string;
  mana: number;
  wins: number;
  losses: number;
  selectedElement: Element | null;
  selectedLocation: Location | null;
  selectedElemental: ElementalRarity | null;
  winStreak: number;
  bestStreak: number;
  maxLossStreak: number;
  currentLossStreak: number;
  totalBattles: number;
  experience: number;
  level: number;
  favoriteElement: string | null;
  elementStats: Record<Element, number>;
  achievements: string[];
  lastManaChange: number;
  totalManaWon: number;
  totalManaLost: number;
  // New collection fields
  elementalCollection: ElementalCollection;
  totalElementalsCollected: number;
  immortalElementalsOwned: number;
  epicElementalsOwned: number;
}

export interface Opponent {
  name: string;
  avatar: string;
  level: number;
  rarity: string;
  wager: number;
  element?: Element;
  elemental?: ElementalRarity;
}

export interface ElementalDisplayData {
  currentName: string;
  currentEmoji: string;
  currentProtection: number;
  canLevelUp: boolean;
  levelUpCost: number;
  maxLevel: number;
  canUpgradeRarity: boolean;
  isImmortal: boolean;
}

export interface Achievement {
  id: string;
  icon: string;
  name: string;
  desc: string;
  condition: (player: PlayerStats) => boolean;
}

export interface BattleLog {
  playerElement: Element;
  opponentElement: Element;
  playerElemental: ElementalRarity | null;
  opponentElemental: ElementalRarity | null;
  baseWager: number;
  protectionSaved: number;
  finalChange: number;
  winner: BattleResult;
}

export type GamePhase =
  | 'menu'
  | 'locationSelection'
  | 'elementSelection'
  | 'elementalSelection'
  | 'battleAnimation'
  | 'result'
  | 'collection'; // New phase for collection view
export type BattleResult = 'player' | 'opponent' | 'draw';

export interface GameState {
  player: PlayerStats;
  currentOpponent: Opponent | null;
  opponentElement: Element | null;
  gamePhase: GamePhase;
  battleLog: BattleLog | null;
  initialBattleMana?: number;
  battleResult?: BattleResult;
}
