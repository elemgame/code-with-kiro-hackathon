import {
  Achievement,
  BattleResult,
  CollectedElemental,
  Element,
  ElementalCollection,
  ElementalData,
  ElementalRarity,
  ElementData,
  EvolutionData,
  Location,
  LocationData,
  Opponent,
} from './types';

// Game constants
export const ELEMENTS: Record<Element, ElementData> = {
  earth: { name: 'Earth', emoji: '🗿', color: '#A8A8A8' },
  water: { name: 'Water', emoji: '💧', color: '#00AFFF' },
  fire: { name: 'Fire', emoji: '🔥', color: '#FF4500' },
};

export const LOCATIONS: Record<Location, LocationData> = {
  free: { name: 'Free', emoji: '🎯', mana: 0 },
  swamp: { name: 'Swamp', emoji: '🐸', mana: 100 },
  village: { name: 'Village', emoji: '🏘️', mana: 300 },
  castle: { name: 'Castle', emoji: '🏰', mana: 500 },
};

// Enhanced elemental types with evolution data
export const ELEMENTAL_TYPES: Record<
  Element,
  Record<ElementalRarity, ElementalData>
> = {
  earth: {
    common: {
      name: 'Earth Golem',
      emoji: '🗿',
      rarity: 'Common',
      protection: 0.1,
      evolutionCost: 50,
    },
    rare: {
      name: 'Stone Guardian',
      emoji: '🏔️',
      rarity: 'Rare',
      protection: 0.2,
      evolutionCost: 150,
    },
    epic: {
      name: 'Mountain Lord',
      emoji: '⛰️',
      rarity: 'Epic',
      protection: 0.4,
      evolutionCost: 500,
    },
    immortal: {
      name: 'Earth Titan',
      emoji: '🌋',
      rarity: 'Immortal',
      protection: 0.8,
      evolutionCost: 1000,
    },
    legendary: {
      name: 'Ancient Earth Dragon',
      emoji: '🐉',
      rarity: 'Legendary',
      protection: 1.0,
      evolutionCost: 2500,
      legendary: true,
    },
  },
  water: {
    common: {
      name: 'Water Nymph',
      emoji: '💧',
      rarity: 'Common',
      protection: 0.1,
      evolutionCost: 50,
    },
    rare: {
      name: 'Sea Sprite',
      emoji: '🌊',
      rarity: 'Rare',
      protection: 0.2,
      evolutionCost: 150,
    },
    epic: {
      name: 'Ocean Master',
      emoji: '🌀',
      rarity: 'Epic',
      protection: 0.4,
      evolutionCost: 500,
    },
    immortal: {
      name: 'Leviathan',
      emoji: '🐋',
      rarity: 'Immortal',
      protection: 0.8,
      evolutionCost: 1000,
    },
    legendary: {
      name: "Poseidon's Avatar",
      emoji: '🌊',
      rarity: 'Legendary',
      protection: 1.0,
      evolutionCost: 2500,
      legendary: true,
    },
  },
  fire: {
    common: {
      name: 'Fire Sprite',
      emoji: '🔥',
      rarity: 'Common',
      protection: 0.1,
      evolutionCost: 50,
    },
    rare: {
      name: 'Flame Dancer',
      emoji: '🔥',
      rarity: 'Rare',
      protection: 0.2,
      evolutionCost: 150,
    },
    epic: {
      name: 'Inferno Lord',
      emoji: '🌋',
      rarity: 'Epic',
      protection: 0.4,
      evolutionCost: 500,
    },
    immortal: {
      name: 'Phoenix King',
      emoji: '🔥',
      rarity: 'Immortal',
      protection: 0.8,
      evolutionCost: 1000,
    },
    legendary: {
      name: 'Solar Flare',
      emoji: '☀️',
      rarity: 'Legendary',
      protection: 1.0,
      evolutionCost: 2500,
      legendary: true,
    },
  },
};

// Evolution stages for each elemental (max 4 levels)
export const EVOLUTION_STAGES: Record<
  Element,
  Record<ElementalRarity, EvolutionData[]>
> = {
  earth: {
    common: [
      {
        stage: 0,
        name: 'Earth Golem',
        emoji: '🗿',
        protection: 0.1,
        cost: 0,
        requiredLevel: 1,
      },
      {
        stage: 1,
        name: 'Stone Warrior',
        emoji: '🗿',
        protection: 0.15,
        cost: 50,
        requiredLevel: 2,
      },
      {
        stage: 2,
        name: 'Crystal Guardian',
        emoji: '💎',
        protection: 0.2,
        cost: 100,
        requiredLevel: 3,
      },
      {
        stage: 3,
        name: 'Ancient Guardian',
        emoji: '🗿',
        protection: 0.25,
        cost: 200,
        requiredLevel: 4,
      },
    ],
    rare: [
      {
        stage: 0,
        name: 'Stone Guardian',
        emoji: '🏔️',
        protection: 0.2,
        cost: 0,
        requiredLevel: 1,
      },
      {
        stage: 1,
        name: 'Mountain Sentinel',
        emoji: '🏔️',
        protection: 0.25,
        cost: 150,
        requiredLevel: 2,
      },
      {
        stage: 2,
        name: 'Crystal Sentinel',
        emoji: '💎',
        protection: 0.3,
        cost: 300,
        requiredLevel: 3,
      },
      {
        stage: 3,
        name: 'Ancient Sentinel',
        emoji: '🏔️',
        protection: 0.35,
        cost: 600,
        requiredLevel: 4,
      },
    ],
    epic: [
      {
        stage: 0,
        name: 'Mountain Lord',
        emoji: '⛰️',
        protection: 0.4,
        cost: 0,
        requiredLevel: 1,
      },
      {
        stage: 1,
        name: 'Volcano Lord',
        emoji: '🌋',
        protection: 0.5,
        cost: 500,
        requiredLevel: 2,
      },
      {
        stage: 2,
        name: 'Crystal Lord',
        emoji: '💎',
        protection: 0.6,
        cost: 1000,
        requiredLevel: 3,
      },
      {
        stage: 3,
        name: 'Ancient Lord',
        emoji: '⛰️',
        protection: 0.7,
        cost: 2000,
        requiredLevel: 4,
      },
    ],
    immortal: [
      {
        stage: 0,
        name: 'Earth Titan',
        emoji: '🌋',
        protection: 0.8,
        cost: 0,
        requiredLevel: 1,
      },
      {
        stage: 1,
        name: 'Mountain Titan',
        emoji: '🏔️',
        protection: 0.85,
        cost: 1000,
        requiredLevel: 2,
      },
      {
        stage: 2,
        name: 'Crystal Titan',
        emoji: '💎',
        protection: 0.9,
        cost: 2000,
        requiredLevel: 3,
      },
      {
        stage: 3,
        name: 'Ancient Titan',
        emoji: '🌋',
        protection: 0.95,
        cost: 4000,
        requiredLevel: 4,
      },
    ],
    legendary: [
      {
        stage: 0,
        name: 'Ancient Earth Dragon',
        emoji: '🐉',
        protection: 1.0,
        cost: 0,
        requiredLevel: 1,
      },
      {
        stage: 1,
        name: 'Crystal Dragon',
        emoji: '💎',
        protection: 1.1,
        cost: 2500,
        requiredLevel: 2,
      },
      {
        stage: 2,
        name: 'Cosmic Dragon',
        emoji: '⭐',
        protection: 1.2,
        cost: 5000,
        requiredLevel: 3,
      },
      {
        stage: 3,
        name: 'Eternal Dragon',
        emoji: '🐉',
        protection: 1.3,
        cost: 10000,
        requiredLevel: 4,
      },
    ],
  },
  water: {
    common: [
      {
        stage: 0,
        name: 'Water Nymph',
        emoji: '💧',
        protection: 0.1,
        cost: 0,
        requiredLevel: 1,
      },
      {
        stage: 1,
        name: 'Water Spirit',
        emoji: '💧',
        protection: 0.15,
        cost: 50,
        requiredLevel: 2,
      },
      {
        stage: 2,
        name: 'Crystal Nymph',
        emoji: '💎',
        protection: 0.2,
        cost: 100,
        requiredLevel: 3,
      },
      {
        stage: 3,
        name: 'Ancient Nymph',
        emoji: '💧',
        protection: 0.25,
        cost: 200,
        requiredLevel: 4,
      },
    ],
    rare: [
      {
        stage: 0,
        name: 'Sea Sprite',
        emoji: '🌊',
        protection: 0.2,
        cost: 0,
        requiredLevel: 1,
      },
      {
        stage: 1,
        name: 'Ocean Sprite',
        emoji: '🌊',
        protection: 0.25,
        cost: 150,
        requiredLevel: 2,
      },
      {
        stage: 2,
        name: 'Crystal Sprite',
        emoji: '💎',
        protection: 0.3,
        cost: 300,
        requiredLevel: 3,
      },
      {
        stage: 3,
        name: 'Ancient Sprite',
        emoji: '🌊',
        protection: 0.35,
        cost: 600,
        requiredLevel: 4,
      },
    ],
    epic: [
      {
        stage: 0,
        name: 'Ocean Master',
        emoji: '🌀',
        protection: 0.4,
        cost: 0,
        requiredLevel: 1,
      },
      {
        stage: 1,
        name: 'Storm Master',
        emoji: '⚡',
        protection: 0.5,
        cost: 500,
        requiredLevel: 2,
      },
      {
        stage: 2,
        name: 'Crystal Master',
        emoji: '💎',
        protection: 0.6,
        cost: 1000,
        requiredLevel: 3,
      },
      {
        stage: 3,
        name: 'Ancient Master',
        emoji: '🌀',
        protection: 0.7,
        cost: 2000,
        requiredLevel: 4,
      },
    ],
    immortal: [
      {
        stage: 0,
        name: 'Leviathan',
        emoji: '🐋',
        protection: 0.8,
        cost: 0,
        requiredLevel: 1,
      },
      {
        stage: 1,
        name: 'Storm Leviathan',
        emoji: '⚡',
        protection: 0.85,
        cost: 1000,
        requiredLevel: 2,
      },
      {
        stage: 2,
        name: 'Crystal Leviathan',
        emoji: '💎',
        protection: 0.9,
        cost: 2000,
        requiredLevel: 3,
      },
      {
        stage: 3,
        name: 'Ancient Leviathan',
        emoji: '🐋',
        protection: 0.95,
        cost: 4000,
        requiredLevel: 4,
      },
    ],
    legendary: [
      {
        stage: 0,
        name: "Poseidon's Avatar",
        emoji: '🌊',
        protection: 1.0,
        cost: 0,
        requiredLevel: 1,
      },
      {
        stage: 1,
        name: 'Storm Avatar',
        emoji: '⚡',
        protection: 1.1,
        cost: 2500,
        requiredLevel: 2,
      },
      {
        stage: 2,
        name: 'Cosmic Avatar',
        emoji: '⭐',
        protection: 1.2,
        cost: 5000,
        requiredLevel: 3,
      },
      {
        stage: 3,
        name: 'Eternal Avatar',
        emoji: '🌊',
        protection: 1.3,
        cost: 10000,
        requiredLevel: 4,
      },
    ],
  },
  fire: {
    common: [
      {
        stage: 0,
        name: 'Fire Sprite',
        emoji: '🔥',
        protection: 0.1,
        cost: 0,
        requiredLevel: 1,
      },
      {
        stage: 1,
        name: 'Flame Spirit',
        emoji: '🔥',
        protection: 0.15,
        cost: 50,
        requiredLevel: 2,
      },
      {
        stage: 2,
        name: 'Crystal Sprite',
        emoji: '💎',
        protection: 0.2,
        cost: 100,
        requiredLevel: 3,
      },
      {
        stage: 3,
        name: 'Ancient Sprite',
        emoji: '🔥',
        protection: 0.25,
        cost: 200,
        requiredLevel: 4,
      },
    ],
    rare: [
      {
        stage: 0,
        name: 'Flame Dancer',
        emoji: '🔥',
        protection: 0.2,
        cost: 0,
        requiredLevel: 1,
      },
      {
        stage: 1,
        name: 'Inferno Dancer',
        emoji: '🔥',
        protection: 0.25,
        cost: 150,
        requiredLevel: 2,
      },
      {
        stage: 2,
        name: 'Crystal Dancer',
        emoji: '💎',
        protection: 0.3,
        cost: 300,
        requiredLevel: 3,
      },
      {
        stage: 3,
        name: 'Ancient Dancer',
        emoji: '🔥',
        protection: 0.35,
        cost: 600,
        requiredLevel: 4,
      },
    ],
    epic: [
      {
        stage: 0,
        name: 'Inferno Lord',
        emoji: '🌋',
        protection: 0.4,
        cost: 0,
        requiredLevel: 1,
      },
      {
        stage: 1,
        name: 'Volcano Lord',
        emoji: '🌋',
        protection: 0.5,
        cost: 500,
        requiredLevel: 2,
      },
      {
        stage: 2,
        name: 'Crystal Lord',
        emoji: '💎',
        protection: 0.6,
        cost: 1000,
        requiredLevel: 3,
      },
      {
        stage: 3,
        name: 'Ancient Lord',
        emoji: '🌋',
        protection: 0.7,
        cost: 2000,
        requiredLevel: 4,
      },
    ],
    immortal: [
      {
        stage: 0,
        name: 'Phoenix King',
        emoji: '🔥',
        protection: 0.8,
        cost: 0,
        requiredLevel: 1,
      },
      {
        stage: 1,
        name: 'Storm Phoenix',
        emoji: '⚡',
        protection: 0.85,
        cost: 1000,
        requiredLevel: 2,
      },
      {
        stage: 2,
        name: 'Crystal Phoenix',
        emoji: '💎',
        protection: 0.9,
        cost: 2000,
        requiredLevel: 3,
      },
      {
        stage: 3,
        name: 'Ancient Phoenix',
        emoji: '🔥',
        protection: 0.95,
        cost: 4000,
        requiredLevel: 4,
      },
    ],
    legendary: [
      {
        stage: 0,
        name: 'Solar Flare',
        emoji: '☀️',
        protection: 1.0,
        cost: 0,
        requiredLevel: 1,
      },
      {
        stage: 1,
        name: 'Nova Flare',
        emoji: '⭐',
        protection: 1.1,
        cost: 2500,
        requiredLevel: 2,
      },
      {
        stage: 2,
        name: 'Cosmic Flare',
        emoji: '⭐',
        protection: 1.2,
        cost: 5000,
        requiredLevel: 3,
      },
      {
        stage: 3,
        name: 'Eternal Flare',
        emoji: '☀️',
        protection: 1.3,
        cost: 10000,
        requiredLevel: 4,
      },
    ],
  },
};

// Collection system functions
export const generateElementalId = (
  element: Element,
  rarity: ElementalRarity
): string => {
  return `${element}_${rarity}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const createInitialCollection = (): ElementalCollection => {
  const elementals: Record<string, CollectedElemental> = {};

  // Add one free common elemental for each element
  Object.keys(ELEMENTS).forEach(element => {
    const elementalId = generateElementalId(element as Element, 'common');
    elementals[elementalId] = {
      id: elementalId,
      element: element as Element,
      rarity: 'common',
      level: 1,
      experience: 0,
      isOwned: true,
      timesUsed: 0,
    };
  });

  return {
    elementals,
    totalOwned: 3,
    totalLegendary: 0,
    collectionProgress: { earth: 1, water: 1, fire: 1 },
  };
};

export const getElementalProtection = (
  elemental: CollectedElemental
): number => {
  // Protection is fixed for each rarity and doesn't change with level
  return ELEMENTAL_TYPES[elemental.element][elemental.rarity].protection;
};

export const addExperienceToElemental = (
  elemental: CollectedElemental,
  exp: number
): CollectedElemental => {
  const expNeeded = elemental.level * 100;
  const newExperience = elemental.experience + exp;

  if (newExperience >= expNeeded) {
    return {
      ...elemental,
      level: elemental.level + 1,
      experience: newExperience - expNeeded,
    };
  }

  return {
    ...elemental,
    experience: newExperience,
  };
};

export const getLevelUpCost = (elemental: CollectedElemental): number => {
  return elemental.level * 25; // 25 mana per level
};

export const canLevelUpElemental = (
  elemental: CollectedElemental,
  playerMana: number
): boolean => {
  const cost = getLevelUpCost(elemental);
  const maxLevel = getMaxLevelForRarity(elemental.rarity);
  const canUpgradeRarity =
    elemental.level >= maxLevel && elemental.rarity !== 'legendary';

  return (elemental.level < maxLevel || canUpgradeRarity) && playerMana >= cost;
};

export const getMaxLevelForRarity = (_rarity: ElementalRarity): number => {
  return 4; // All rarities can reach level 4 before upgrading
};

export const levelUpElemental = (
  elemental: CollectedElemental
): CollectedElemental => {
  const newLevel = elemental.level + 1;
  const maxLevel = getMaxLevelForRarity(elemental.rarity);

  // If reaching max level, upgrade rarity and create new elemental with new ID
  // New elemental starts with no cooldown (cooldown reset as reward for rarity upgrade)
  if (newLevel > maxLevel) {
    const newRarity = getNextRarity(elemental.rarity);
    const newElementalId = generateElementalId(elemental.element, newRarity);

    return {
      id: newElementalId,
      element: elemental.element,
      rarity: newRarity,
      level: 1,
      experience: 0,
      isOwned: true,
      timesUsed: 0,
    };
  }

  // Normal level up - cooldown remains active (no reset)
  return {
    ...elemental,
    level: newLevel,
    experience: 0,
  };
};

export const getNextRarity = (
  currentRarity: ElementalRarity
): ElementalRarity => {
  switch (currentRarity) {
    case 'common':
      return 'rare';
    case 'rare':
      return 'epic';
    case 'epic':
      return 'immortal';
    case 'immortal':
      return 'legendary';
    case 'legendary':
      return 'legendary'; // Legendary stays legendary
    default:
      return 'common';
  }
};

// Cooldown system functions
export const getElementalCooldownHours = (level: number): number => {
  switch (level) {
    case 1:
      return 2; // Level 1: 2 hours
    case 2:
      return 4; // Level 2: 4 hours
    case 3:
      return 8; // Level 3: 8 hours
    case 4:
      return 16; // Level 4: 16 hours
    default:
      return 2; // Default for any other level
  }
};

export const setElementalCooldown = (
  elemental: CollectedElemental
): CollectedElemental => {
  const cooldownHours = getElementalCooldownHours(elemental.level);
  const cooldownEndTime = Date.now() + cooldownHours * 60 * 60 * 1000; // Convert hours to milliseconds

  return {
    ...elemental,
    cooldownEndTime,
    lastUsed: Date.now(),
  };
};

export const isElementalOnCooldown = (
  elemental: CollectedElemental
): boolean => {
  if (!elemental.cooldownEndTime) return false;
  return Date.now() < elemental.cooldownEndTime;
};

export const getElementalCooldownRemaining = (
  elemental: CollectedElemental
): number => {
  if (!elemental.cooldownEndTime) return 0;
  const remaining = elemental.cooldownEndTime - Date.now();
  return Math.max(0, remaining);
};

export const formatCooldownTime = (milliseconds: number): string => {
  if (milliseconds <= 0) return 'Ready';

  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

export const getElementalCooldownProgress = (
  elemental: CollectedElemental
): number => {
  if (!elemental.cooldownEndTime || !elemental.lastUsed) return 0;

  const totalCooldown = elemental.cooldownEndTime - elemental.lastUsed;
  const elapsed = Date.now() - elemental.lastUsed;

  return Math.min(100, Math.max(0, (elapsed / totalCooldown) * 100));
};

export const getRandomElementalReward = (): {
  element: Element;
  rarity: ElementalRarity;
} => {
  const elements: Element[] = ['earth', 'water', 'fire'];
  const rarities: ElementalRarity[] = [
    'common',
    'rare',
    'epic',
    'immortal',
    'legendary',
  ];

  // Weighted probabilities (increased chances for better rarities)
  const weights = {
    common: 0.4,
    rare: 0.35,
    epic: 0.2,
    immortal: 0.04,
    legendary: 0.01,
  };

  const random = Math.random();
  let cumulativeWeight = 0;
  let selectedRarity: ElementalRarity = 'common';

  for (const rarity of rarities) {
    cumulativeWeight += weights[rarity];
    if (random <= cumulativeWeight) {
      selectedRarity = rarity;
      break;
    }
  }

  const element =
    elements[Math.floor(Math.random() * elements.length)] || 'earth';

  return { element, rarity: selectedRarity };
};

export const addElementalToCollection = (
  collection: ElementalCollection,
  element: Element,
  rarity: ElementalRarity
): ElementalCollection => {
  const elementalId = generateElementalId(element, rarity);
  const newElemental: CollectedElemental = {
    id: elementalId,
    element,
    rarity,
    level: 1,
    experience: 0,
    isOwned: true,
    timesUsed: 0,
  };

  const newElementals = {
    ...collection.elementals,
    [elementalId]: newElemental,
  };
  const totalOwned = Object.values(newElementals).filter(e => e.isOwned).length;
  const totalLegendary = Object.values(newElementals).filter(
    e => e.isOwned && e.rarity === 'legendary'
  ).length;

  // Update collection progress
  const elementCount = Object.values(newElementals).filter(
    e => e.isOwned && e.element === element
  ).length;
  const newProgress = {
    ...collection.collectionProgress,
    [element]: elementCount,
  };

  return {
    elementals: newElementals,
    totalOwned,
    totalLegendary,
    collectionProgress: newProgress,
  };
};

export const OPPONENT_NAMES = [
  'DragonSlayer',
  'MysticMage',
  'ElementMaster',
  'StormBringer',
  'EarthShaker',
  'FlameWarden',
  'WaterSpirit',
  'CrystalGuard',
  'ShadowHunter',
  'LightBringer',
];

export const OPPONENT_AVATARS = [
  '🐉',
  '🧙‍♂️',
  '⚔️',
  '🛡️',
  '🔥',
  '💧',
  '🗿',
  '⚡',
  '🌟',
  '👑',
];

// Battle logic: Earth > Water > Fire > Earth
export const getWinner = (
  element1: Element,
  element2: Element
): BattleResult => {
  if (element1 === element2) return 'draw';

  const winConditions: Record<Element, Element> = {
    earth: 'water', // Earth absorbs Water
    water: 'fire', // Water extinguishes Fire
    fire: 'earth', // Fire burns Earth
  };

  return winConditions[element1] === element2 ? 'player' : 'opponent';
};

// Generate random opponent based on location
export const generateOpponent = (location: Location): Opponent => {
  const name =
    OPPONENT_NAMES[Math.floor(Math.random() * OPPONENT_NAMES.length)] ||
    'Unknown';
  const avatar =
    OPPONENT_AVATARS[Math.floor(Math.random() * OPPONENT_AVATARS.length)] ||
    '👤';
  const level = Math.floor(Math.random() * 10) + 1;
  const rarities = ['Common', 'Rare', 'Epic', 'Immortal'];
  const rarity =
    rarities[Math.floor(Math.random() * rarities.length)] || 'Common';
  const locationData = LOCATIONS[location];

  // Generate opponent's element and elemental (50% chance to have elemental)
  const element = getRandomElement();
  const elementalRarities: ElementalRarity[] = [
    'common',
    'rare',
    'epic',
    'immortal',
  ];
  const elemental =
    Math.random() < 0.5
      ? elementalRarities[Math.floor(Math.random() * elementalRarities.length)]
      : undefined;

  return {
    name,
    avatar,
    level,
    rarity,
    wager: locationData.mana,
    element,
    ...(elemental && { elemental }),
  };
};

// Get random element for opponent
export const getRandomElement = (): Element => {
  const elements: Element[] = ['earth', 'water', 'fire'];
  return elements[Math.floor(Math.random() * elements.length)] || 'earth';
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
  {
    id: 'first_victory',
    icon: '🏆',
    name: 'First Victory',
    desc: 'Win your first battle',
    condition: p => p.wins >= 1,
  },
  {
    id: 'veteran',
    icon: '⚔️',
    name: 'Veteran',
    desc: 'Win 5 battles',
    condition: p => p.wins >= 5,
  },
  {
    id: 'champion',
    icon: '👑',
    name: 'Champion',
    desc: 'Win 10 battles',
    condition: p => p.wins >= 10,
  },
  {
    id: 'legend',
    icon: '🌟',
    name: 'Legend',
    desc: 'Win 25 battles',
    condition: p => p.wins >= 25,
  },
  {
    id: 'immortal',
    icon: '💫',
    name: 'Immortal',
    desc: 'Win 50 battles',
    condition: p => p.wins >= 50,
  },

  // Win streaks
  {
    id: 'win_streak_3',
    icon: '🔥',
    name: 'Triple Threat',
    desc: 'Win 3 battles in a row',
    condition: p => p.winStreak >= 3,
  },
  {
    id: 'win_streak_5',
    icon: '🔥🔥',
    name: 'Unstoppable',
    desc: 'Win 5 battles in a row',
    condition: p => p.winStreak >= 5,
  },
  {
    id: 'win_streak_10',
    icon: '🔥🔥🔥',
    name: 'Dominator',
    desc: 'Win 10 battles in a row',
    condition: p => p.winStreak >= 10,
  },

  // Mana
  {
    id: 'mana_master',
    icon: '💎',
    name: 'Mana Master',
    desc: 'Accumulate 2000 mana',
    condition: p => p.mana >= 2000,
  },
  {
    id: 'mana_lord',
    icon: '💎💎',
    name: 'Mana Lord',
    desc: 'Accumulate 2500 mana',
    condition: p => p.mana >= 2500,
  },
  {
    id: 'mana_god',
    icon: '💎💎💎',
    name: 'Mana God',
    desc: 'Accumulate 5000 mana',
    condition: p => p.mana >= 5000,
  },

  // Elements
  {
    id: 'fire_master',
    icon: '🔥',
    name: 'Fire Master',
    desc: 'Win 10 battles with Fire',
    condition: p => p.elementStats.fire >= 10,
  },
  {
    id: 'water_master',
    icon: '💧',
    name: 'Water Master',
    desc: 'Win 10 battles with Water',
    condition: p => p.elementStats.water >= 10,
  },
  {
    id: 'earth_master',
    icon: '🗿',
    name: 'Earth Master',
    desc: 'Win 10 battles with Earth',
    condition: p => p.elementStats.earth >= 10,
  },
  {
    id: 'elemental_master',
    icon: '🌈',
    name: 'Elemental Master',
    desc: 'Master all elements',
    condition: p =>
      p.elementStats.fire >= 10 &&
      p.elementStats.water >= 10 &&
      p.elementStats.earth >= 10,
  },

  // Experience and level
  {
    id: 'experienced',
    icon: '📚',
    name: 'Experienced',
    desc: 'Reach level 5',
    condition: p => p.level >= 5,
  },
  {
    id: 'expert',
    icon: '🎓',
    name: 'Expert',
    desc: 'Reach level 10',
    condition: p => p.level >= 10,
  },
  {
    id: 'master',
    icon: '🧙‍♂️',
    name: 'Master',
    desc: 'Reach level 15',
    condition: p => p.level >= 15,
  },

  // Battles
  {
    id: 'warrior',
    icon: '⚔️',
    name: 'Warrior',
    desc: 'Fight 25 battles',
    condition: p => p.totalBattles >= 25,
  },
  {
    id: 'gladiator',
    icon: '🛡️',
    name: 'Gladiator',
    desc: 'Fight 50 battles',
    condition: p => p.totalBattles >= 50,
  },
  {
    id: 'arena_master',
    icon: '🏟️',
    name: 'Arena Master',
    desc: 'Fight 100 battles',
    condition: p => p.totalBattles >= 100,
  },

  // Special achievements
  {
    id: 'perfectionist',
    icon: '💯',
    name: 'Perfectionist',
    desc: 'Win 10 battles without losing',
    condition: p => p.wins >= 10 && p.losses === 0,
  },
  {
    id: 'comeback_king',
    icon: '🔄',
    name: 'Comeback King',
    desc: 'Win after losing 5 in a row',
    condition: p => p.winStreak >= 1 && p.maxLossStreak >= 5,
  },

  // Collection achievements
  {
    id: 'collector',
    icon: '📦',
    name: 'Collector',
    desc: 'Own 10 elementals',
    condition: p => p.totalElementalsCollected >= 10,
  },
  {
    id: 'elemental_master',
    icon: '🌟',
    name: 'Elemental Master',
    desc: 'Own 25 elementals',
    condition: p => p.totalElementalsCollected >= 25,
  },
  {
    id: 'legendary_hunter',
    icon: '🐉',
    name: 'Legendary Hunter',
    desc: 'Own a legendary elemental',
    condition: p => p.legendaryElementalsOwned >= 1,
  },
  {
    id: 'legendary_collector',
    icon: '🐉🐉',
    name: 'Legendary Collector',
    desc: 'Own 3 legendary elementals',
    condition: p => p.legendaryElementalsOwned >= 3,
  },
  {
    id: 'level_master',
    icon: '✨',
    name: 'Level Master',
    desc: 'Level up an elemental to max level',
    condition: p => {
      const maxLevelElementals = Object.values(
        p.elementalCollection.elementals
      ).filter(e => e.level >= 4);
      return maxLevelElementals.length >= 1;
    },
  },
];

// Get available elementals for a given element
export const getAvailableElementals = (element: Element): ElementalRarity[] => {
  return Object.keys(ELEMENTAL_TYPES[element]) as ElementalRarity[];
};

// Get elemental data
export const getElementalData = (
  element: Element,
  rarity: ElementalRarity
): ElementalData => {
  return ELEMENTAL_TYPES[element][rarity];
};

// Calculate protected mana based on elemental
export const calculateProtectedMana = (
  wager: number,
  element: Element | null,
  elementalRarity: ElementalRarity | null
): number => {
  if (!element || !elementalRarity) return 0;
  const elemental = getElementalData(element, elementalRarity);
  return Math.floor(wager * elemental.protection);
};

// Get elemental protection from collection
export const getElementalProtectionFromCollection = (
  collection: ElementalCollection,
  element: Element,
  rarity: ElementalRarity
): number => {
  const elemental = Object.values(collection.elementals).find(
    e => e.isOwned && e.element === element && e.rarity === rarity
  );

  if (!elemental) return 0;

  return getElementalProtection(elemental);
};

// Calculate battle result with elementals protecting the losing side
export const calculateBattleResult = (
  baseWager: number,
  playerElement: Element,
  playerElemental: ElementalRarity | null,
  opponentElement: Element,
  opponentElemental: ElementalRarity | null,
  playerCollection?: ElementalCollection
): {
  playerManaChange: number;
  opponentManaChange: number;
  winner: BattleResult;
  protectionSaved: number;
} => {
  // Special handling for zero wager battles (Free location)
  if (baseWager === 0) {
    // For zero wager battles, we only determine winner/loser/draw, no mana changes
    const elementWinner = getWinner(playerElement, opponentElement);

    if (elementWinner === 'player') {
      return {
        playerManaChange: 0,
        opponentManaChange: 0,
        winner: 'player',
        protectionSaved: 0,
      };
    } else if (elementWinner === 'opponent') {
      return {
        playerManaChange: 0,
        opponentManaChange: 0,
        winner: 'opponent',
        protectionSaved: 0,
      };
    } else {
      // Same elements - elementals decide the outcome
      const playerProtection = playerElemental
        ? getElementalData(playerElement, playerElemental).protection
        : 0;
      const opponentProtection = opponentElemental
        ? getElementalData(opponentElement, opponentElemental).protection
        : 0;

      if (playerProtection === opponentProtection) {
        return {
          playerManaChange: 0,
          opponentManaChange: 0,
          winner: 'draw',
          protectionSaved: 0,
        };
      } else if (playerProtection > opponentProtection) {
        return {
          playerManaChange: 0,
          opponentManaChange: 0,
          winner: 'player',
          protectionSaved: 0,
        };
      } else {
        return {
          playerManaChange: 0,
          opponentManaChange: 0,
          winner: 'opponent',
          protectionSaved: 0,
        };
      }
    }
  }

  // First determine element winner
  const elementWinner = getWinner(playerElement, opponentElement);

  // Get protection percentages
  let playerProtection = 0;
  if (playerElemental && playerCollection) {
    playerProtection = getElementalProtectionFromCollection(
      playerCollection,
      playerElement,
      playerElemental
    );
  } else if (playerElemental) {
    playerProtection = getElementalData(
      playerElement,
      playerElemental
    ).protection;
  }

  const opponentProtection = opponentElemental
    ? getElementalData(opponentElement, opponentElemental).protection
    : 0;

  if (elementWinner === 'player') {
    // Player wins by elements - opponent's elemental protects opponent's loss
    const opponentSaved = Math.floor(baseWager * opponentProtection);
    const playerGain = baseWager - opponentSaved;
    return {
      playerManaChange: playerGain,
      opponentManaChange: -playerGain,
      winner: 'player',
      protectionSaved: 0, // Player doesn't need protection when winning
    };
  } else if (elementWinner === 'opponent') {
    // Opponent wins by elements - player's elemental protects player's loss
    const playerSaved = Math.floor(baseWager * playerProtection);
    const playerLoss = baseWager - playerSaved;
    return {
      playerManaChange: -playerLoss,
      opponentManaChange: playerLoss,
      winner: 'opponent',
      protectionSaved: playerSaved,
    };
  } else {
    // Same elements - elementals decide the outcome
    if (playerProtection === opponentProtection) {
      // Equal protection - true draw, both keep their wagers
      return {
        playerManaChange: 0,
        opponentManaChange: 0,
        winner: 'draw',
        protectionSaved: 0,
      };
    } else if (playerProtection > opponentProtection) {
      // Player has stronger elemental - player wins
      const advantage = playerProtection - opponentProtection;
      const manaToTake = Math.floor(baseWager * advantage);
      return {
        playerManaChange: manaToTake,
        opponentManaChange: -manaToTake,
        winner: 'player',
        protectionSaved: 0,
      };
    } else {
      // Opponent has stronger elemental - opponent wins
      const advantage = opponentProtection - playerProtection;
      const manaToLose = Math.floor(baseWager * advantage);
      const playerSaved = Math.floor(baseWager * playerProtection);
      return {
        playerManaChange: -manaToLose,
        opponentManaChange: manaToLose,
        winner: 'opponent',
        protectionSaved: playerSaved,
      };
    }
  }
};

// Check if player can afford location
export const canAffordLocation = (
  playerMana: number,
  location: Location
): boolean => {
  return playerMana >= LOCATIONS[location].mana;
};

// Get available mana after location cost
export const getAvailableMana = (
  playerMana: number,
  selectedLocation: Location | null
): number => {
  if (!selectedLocation) return playerMana;
  return playerMana - LOCATIONS[selectedLocation].mana;
};
