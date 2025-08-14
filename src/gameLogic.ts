import { Element, ElementData, LocationData, ElementalData, ElementalRarity, Location, PlayerStats, Opponent, Achievement, BattleResult } from './types';

// Game constants
export const ELEMENTS: Record<Element, ElementData> = {
  earth: { name: 'Earth', emoji: '🗿', color: '#A8A8A8' },
  water: { name: 'Water', emoji: '💧', color: '#00AFFF' },
  fire: { name: 'Fire', emoji: '🔥', color: '#FF4500' }
};

export const LOCATIONS: Record<Location, LocationData> = {
  swamp: { name: 'Swamp', emoji: '🐸', mana: 100 },
  village: { name: 'Village', emoji: '🏘️', mana: 300 },
  castle: { name: 'Castle', emoji: '🏰', mana: 500 }
};

export const ELEMENTAL_TYPES: Record<Element, Record<ElementalRarity, ElementalData>> = {
  earth: {
    common: { name: 'Earth Golem', emoji: '🗿', rarity: 'Common', protection: 0.1 },
    rare: { name: 'Stone Guardian', emoji: '🏔️', rarity: 'Rare', protection: 0.2 },
    epic: { name: 'Mountain Lord', emoji: '⛰️', rarity: 'Epic', protection: 0.4 },
    immortal: { name: 'Earth Titan', emoji: '🌋', rarity: 'Immortal', protection: 0.8 }
  },
  water: {
    common: { name: 'Water Nymph', emoji: '💧', rarity: 'Common', protection: 0.1 },
    rare: { name: 'Sea Sprite', emoji: '🌊', rarity: 'Rare', protection: 0.2 },
    epic: { name: 'Ocean Master', emoji: '🌀', rarity: 'Epic', protection: 0.4 },
    immortal: { name: 'Leviathan', emoji: '🐋', rarity: 'Immortal', protection: 0.8 }
  },
  fire: {
    common: { name: 'Fire Sprite', emoji: '🔥', rarity: 'Common', protection: 0.1 },
    rare: { name: 'Flame Dancer', emoji: '🔥', rarity: 'Rare', protection: 0.2 },
    epic: { name: 'Inferno Lord', emoji: '🌋', rarity: 'Epic', protection: 0.4 },
    immortal: { name: 'Phoenix King', emoji: '🔥', rarity: 'Immortal', protection: 0.8 }
  }
};

export const OPPONENT_NAMES = [
  'DragonSlayer', 'MysticMage', 'ElementMaster', 'StormBringer', 'EarthShaker',
  'FlameWarden', 'WaterSpirit', 'CrystalGuard', 'ShadowHunter', 'LightBringer'
];

export const OPPONENT_AVATARS = ['🐉', '🧙‍♂️', '⚔️', '🛡️', '🔥', '💧', '🗿', '⚡', '🌟', '👑'];

// Battle logic: Earth > Water > Fire > Earth
export const getWinner = (element1: Element, element2: Element): BattleResult => {
  if (element1 === element2) return 'draw';
  
  const winConditions: Record<Element, Element> = {
    earth: 'water',  // Earth absorbs Water
    water: 'fire',   // Water extinguishes Fire
    fire: 'earth'    // Fire burns Earth
  };
  
  return winConditions[element1] === element2 ? 'player' : 'opponent';
};

// Generate random opponent based on location
export const generateOpponent = (location: Location): Opponent => {
  const name = OPPONENT_NAMES[Math.floor(Math.random() * OPPONENT_NAMES.length)];
  const avatar = OPPONENT_AVATARS[Math.floor(Math.random() * OPPONENT_AVATARS.length)];
  const level = Math.floor(Math.random() * 10) + 1;
  const rarities = ['Common', 'Rare', 'Epic', 'Immortal'];
  const rarity = rarities[Math.floor(Math.random() * rarities.length)];
  const locationData = LOCATIONS[location];
  
  // Generate opponent's element and elemental (50% chance to have elemental)
  const element = getRandomElement();
  const elementalRarities: ElementalRarity[] = ['common', 'rare', 'epic', 'immortal'];
  const elemental = Math.random() < 0.5 ? elementalRarities[Math.floor(Math.random() * elementalRarities.length)] : undefined;
  
  return {
    name,
    avatar,
    level,
    rarity,
    wager: locationData.mana,
    element,
    elemental
  };
};

// Get random element for opponent
export const getRandomElement = (): Element => {
  const elements: Element[] = ['earth', 'water', 'fire'];
  return elements[Math.floor(Math.random() * elements.length)];
};

// Player rank system
export const getRank = (level: number): string => {
  if (level >= 10) return 'Master';
  if (level >= 5) return 'Expert';
  if (level >= 3) return 'Adept';
  return 'Novice';
};

// Player title system
export const getTitle = (wins: number, winStreak: number): string => {
  if (winStreak >= 5) return 'Unstoppable Force';
  if (wins >= 10) return 'Battle Veteran';
  if (wins >= 5) return 'Skilled Warrior';
  return 'Elemental Seeker';
};

// Achievement definitions
export const getAchievementDefinitions = (): Achievement[] => [
  // Victories
  { id: 'first_victory', icon: '🏆', name: 'First Victory', desc: 'Win your first battle', condition: p => p.wins >= 1 },
  { id: 'veteran', icon: '⚔️', name: 'Veteran', desc: 'Win 5 battles', condition: p => p.wins >= 5 },
  { id: 'champion', icon: '👑', name: 'Champion', desc: 'Win 10 battles', condition: p => p.wins >= 10 },
  { id: 'legend', icon: '🌟', name: 'Legend', desc: 'Win 25 battles', condition: p => p.wins >= 25 },
  { id: 'immortal', icon: '💫', name: 'Immortal', desc: 'Win 50 battles', condition: p => p.wins >= 50 },

  // Win streaks
  { id: 'win_streak_3', icon: '🔥', name: 'Triple Threat', desc: 'Win 3 battles in a row', condition: p => p.winStreak >= 3 },
  { id: 'win_streak_5', icon: '🔥🔥', name: 'Unstoppable', desc: 'Win 5 battles in a row', condition: p => p.winStreak >= 5 },
  { id: 'win_streak_10', icon: '🔥🔥🔥', name: 'Dominator', desc: 'Win 10 battles in a row', condition: p => p.winStreak >= 10 },

  // Mana
  { id: 'mana_master', icon: '💎', name: 'Mana Master', desc: 'Accumulate 1000 mana', condition: p => p.mana >= 1000 },
  { id: 'mana_lord', icon: '💎💎', name: 'Mana Lord', desc: 'Accumulate 2500 mana', condition: p => p.mana >= 2500 },
  { id: 'mana_god', icon: '💎💎💎', name: 'Mana God', desc: 'Accumulate 5000 mana', condition: p => p.mana >= 5000 },

  // Elements
  { id: 'fire_master', icon: '🔥', name: 'Fire Master', desc: 'Win 10 battles with Fire', condition: p => p.elementStats.fire >= 10 },
  { id: 'water_master', icon: '💧', name: 'Water Master', desc: 'Win 10 battles with Water', condition: p => p.elementStats.water >= 10 },
  { id: 'earth_master', icon: '🗿', name: 'Earth Master', desc: 'Win 10 battles with Earth', condition: p => p.elementStats.earth >= 10 },
  { id: 'elemental_master', icon: '🌈', name: 'Elemental Master', desc: 'Master all elements', condition: p => p.elementStats.fire >= 10 && p.elementStats.water >= 10 && p.elementStats.earth >= 10 },

  // Experience and level
  { id: 'experienced', icon: '📚', name: 'Experienced', desc: 'Reach level 5', condition: p => p.level >= 5 },
  { id: 'expert', icon: '🎓', name: 'Expert', desc: 'Reach level 10', condition: p => p.level >= 10 },
  { id: 'master', icon: '🧙‍♂️', name: 'Master', desc: 'Reach level 15', condition: p => p.level >= 15 },

  // Battles
  { id: 'warrior', icon: '⚔️', name: 'Warrior', desc: 'Fight 25 battles', condition: p => p.totalBattles >= 25 },
  { id: 'gladiator', icon: '🛡️', name: 'Gladiator', desc: 'Fight 50 battles', condition: p => p.totalBattles >= 50 },
  { id: 'arena_master', icon: '🏟️', name: 'Arena Master', desc: 'Fight 100 battles', condition: p => p.totalBattles >= 100 },

  // Special achievements
  { id: 'perfectionist', icon: '💯', name: 'Perfectionist', desc: 'Win 10 battles without losing', condition: p => p.wins >= 10 && p.losses === 0 },
  { id: 'comeback_king', icon: '🔄', name: 'Comeback King', desc: 'Win after losing 5 in a row', condition: p => p.winStreak >= 1 && p.maxLossStreak >= 5 },
  { id: 'high_roller', icon: '🎰', name: 'High Roller', desc: 'Win a battle with 500+ mana wager', condition: p => p.maxWager >= 500 },
];

// Get available elementals for a given element
export const getAvailableElementals = (element: Element): ElementalRarity[] => {
  return Object.keys(ELEMENTAL_TYPES[element]) as ElementalRarity[];
};

// Get elemental data
export const getElementalData = (element: Element, rarity: ElementalRarity): ElementalData => {
  return ELEMENTAL_TYPES[element][rarity];
};

// Calculate protected mana based on elemental
export const calculateProtectedMana = (wager: number, element: Element | null, elementalRarity: ElementalRarity | null): number => {
  if (!element || !elementalRarity) return 0;
  const elemental = getElementalData(element, elementalRarity);
  return Math.floor(wager * elemental.protection);
};

// Calculate draw result when same elements are used
export const calculateDrawResult = (
  baseWager: number,
  playerElement: Element,
  playerElemental: ElementalRarity | null,
  opponentElement: Element,
  opponentElemental: ElementalRarity | null
): { playerManaChange: number; opponentManaChange: number; winner: BattleResult } => {
  // Get protection percentages
  const playerProtection = playerElemental ? getElementalData(playerElement, playerElemental).protection : 0;
  const opponentProtection = opponentElemental ? getElementalData(opponentElement, opponentElemental).protection : 0;
  
  if (playerProtection === opponentProtection) {
    // Equal protection - true draw
    return {
      playerManaChange: 0, // Keep original wager
      opponentManaChange: 0,
      winner: 'draw'
    };
  } else if (playerProtection > opponentProtection) {
    // Player has stronger elemental
    const advantage = playerProtection - opponentProtection;
    const manaToTake = Math.floor(baseWager * advantage);
    return {
      playerManaChange: manaToTake, // Gain from opponent
      opponentManaChange: -manaToTake,
      winner: 'player'
    };
  } else {
    // Opponent has stronger elemental
    const advantage = opponentProtection - playerProtection;
    const manaToLose = Math.floor(baseWager * advantage);
    return {
      playerManaChange: -manaToLose, // Lose to opponent
      opponentManaChange: manaToLose,
      winner: 'opponent'
    };
  }
};

// Check if player can afford location
export const canAffordLocation = (playerMana: number, location: Location): boolean => {
  return playerMana >= LOCATIONS[location].mana;
};

// Get achievement progress text
export const getAchievementProgress = (achievement: Achievement, player: PlayerStats): string | null => {
  if (achievement.id.includes('wins') || achievement.id === 'veteran' || achievement.id === 'champion' || achievement.id === 'legend' || achievement.id === 'immortal') {
    const target = achievement.id === 'veteran' ? 5 : achievement.id === 'champion' ? 10 : achievement.id === 'legend' ? 25 : achievement.id === 'immortal' ? 50 : 1;
    return `${player.wins}/${target}`;
  }
  
  if (achievement.id.includes('streak')) {
    const target = achievement.id === 'win_streak_3' ? 3 : achievement.id === 'win_streak_5' ? 5 : 10;
    return `${player.winStreak}/${target}`;
  }
  
  if (achievement.id.includes('mana')) {
    const target = achievement.id === 'mana_master' ? 1000 : achievement.id === 'mana_lord' ? 2500 : 5000;
    return `${player.mana}/${target}`;
  }
  
  if (achievement.id.includes('_master') && !achievement.id.includes('mana')) {
    const element = achievement.id.split('_')[0] as Element;
    return `${player.elementStats[element] || 0}/10`;
  }
  
  if (achievement.id.includes('level') || achievement.id === 'experienced' || achievement.id === 'expert' || achievement.id === 'master') {
    const target = achievement.id === 'experienced' ? 5 : achievement.id === 'expert' ? 10 : 15;
    return `Level ${player.level}/${target}`;
  }
  
  if (achievement.id.includes('battles') || achievement.id === 'warrior' || achievement.id === 'gladiator' || achievement.id === 'arena_master') {
    const target = achievement.id === 'warrior' ? 25 : achievement.id === 'gladiator' ? 50 : 100;
    return `${player.totalBattles}/${target}`;
  }
  
  return null;
};