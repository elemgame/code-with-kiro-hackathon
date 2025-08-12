// Game constants and logic
export const ELEMENTS = {
  EARTH: 'earth',
  WATER: 'water',
  FIRE: 'fire'
};

export const RARITIES = {
  COMMON: { name: 'Common', protection: 0.1, upgradeCost: 100 },
  RARE: { name: 'Rare', protection: 0.2, upgradeCost: 250 },
  LEGENDARY: { name: 'Legendary', protection: 0.4, upgradeCost: 500 },
  IMMORTAL: { name: 'Immortal', protection: 0.8, upgradeCost: null }
};

export const ELEMENTALS = {
  [ELEMENTS.EARTH]: { name: 'Earth Golem', emoji: '🗿', color: '#8B4513' },
  [ELEMENTS.WATER]: { name: 'Water Nymph', emoji: '💧', color: '#4169E1' },
  [ELEMENTS.FIRE]: { name: 'Fire Sprite', emoji: '🔥', color: '#FF4500' }
};

// Rock-paper-scissors logic: Fire > Earth > Water > Fire
export const getWinner = (element1, element2) => {
  if (element1 === element2) return 'tie';
  
  const winConditions = {
    [ELEMENTS.FIRE]: ELEMENTS.EARTH,    // Fire melts/burns Earth
    [ELEMENTS.EARTH]: ELEMENTS.WATER,   // Earth absorbs Water
    [ELEMENTS.WATER]: ELEMENTS.FIRE     // Water extinguishes Fire
  };
  
  return winConditions[element1] === element2 ? 'player1' : 'player2';
};

// Calculate protected mana based on elemental rarity
export const calculateProtectedMana = (wager, rarity) => {
  return Math.floor(wager * rarity.protection);
};

// Get next rarity for upgrades
export const getNextRarity = (currentRarity) => {
  const rarityOrder = ['COMMON', 'RARE', 'LEGENDARY', 'IMMORTAL'];
  const currentIndex = rarityOrder.findIndex(r => RARITIES[r] === currentRarity);
  return currentIndex < rarityOrder.length - 1 ? RARITIES[rarityOrder[currentIndex + 1]] : null;
};