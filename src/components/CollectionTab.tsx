import React, { useEffect, useState } from 'react';
import {
    canLevelUpElemental,
    ELEMENTAL_TYPES,
    getElementalCooldownRemaining,
    getElementalProtection,
    getLevelUpCost,
    getMaxLevelForRarity,
    getRarityUpgradeCost,
    isElementalOnCooldown
} from '../gameLogic';
import {
    CollectedElemental,
    Element,
    ElementalRarity,
    PlayerStats,
} from '../types';

interface CollectionTabProps {
  player: PlayerStats;
  onLevelUpElemental: (elementalId: string) => void;
}

const CollectionTab: React.FC<CollectionTabProps> = ({
  player,
  onLevelUpElemental,
}) => {
  const [selectedElement, setSelectedElement] = useState<Element | 'all'>(
    'all'
  );
  const [selectedRarity, setSelectedRarity] = useState<ElementalRarity | 'all'>(
    'all'
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedElemental, setSelectedElemental] = useState<CollectedElemental | null>(null);
  const [selectedDisplayData, setSelectedDisplayData] = useState<any>(null);
  const [, forceUpdate] = useState(0);
  // Update time every second for cooldown timers
  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [forceUpdate]);

  const ownedElementals = Object.values(
    player.elementalCollection.elementals
  ).filter(e => e.isOwned);

  const filteredElementals = ownedElementals.filter(elemental => {
    if (selectedElement !== 'all' && elemental.element !== selectedElement)
      return false;
    if (selectedRarity !== 'all' && elemental.rarity !== selectedRarity)
      return false;
    return true;
  });

  const getRarityColor = (rarity: ElementalRarity): string => {
    switch (rarity) {
      case 'common':
        return '#9ca3af';
      case 'rare':
        return '#3b82f6';
      case 'epic':
        return '#8b5cf6';
      case 'immortal':
        return '#f59e0b';
      default:
        return '#9ca3af';
    }
  };



  const getElementColor = (element: Element): string => {
    switch (element) {
      case 'earth':
        return '#059669'; // Green
      case 'water':
        return '#0ea5e9'; // Blue
      case 'fire':
        return '#dc2626'; // Red
      default:
        return '#6b7280';
    }
  };



  const getRarityClass = (rarity: ElementalRarity): string => {
    switch (rarity) {
      case 'common':
        return 'rarity-common';
      case 'rare':
        return 'rarity-rare';
      case 'epic':
        return 'rarity-epic';
      case 'immortal':
        return 'rarity-immortal';
      default:
        return 'rarity-common';
    }
  };



  const handleLevelUpClick = (elemental: CollectedElemental, displayData: any) => {
    setSelectedElemental(elemental);
    setSelectedDisplayData(displayData);
    setShowConfirmModal(true);
  };

  const handleConfirmLevelUp = () => {
    if (selectedElemental && selectedDisplayData) {
      onLevelUpElemental(selectedElemental.id);
      setShowConfirmModal(false);
      setSelectedElemental(null);
      setSelectedDisplayData(null);
    }
  };

  const handleCancelLevelUp = () => {
    setShowConfirmModal(false);
    setSelectedElemental(null);
    setSelectedDisplayData(null);
  };

  const getStableCharacterName = (element: string, rarity: string, elementalId: string): string => {
    // Используем ID элементаля для генерации стабильного имени
    // Это обеспечивает, что имя не будет меняться при каждом рендере
    const hash = elementalId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);

    const elementThemes = {
      earth: {
        adjectives: [
          'Ancient', 'Mighty', 'Solid', 'Eternal', 'Granite', 'Mossy', 'Stony', 'Earthen',
          'Mountainous', 'Rocky', 'Dense', 'Heavy', 'Buried', 'Deep', 'Solid', 'Unbreakable',
          'Timeless', 'Enduring', 'Stable', 'Grounded', 'Terrestrial', 'Mineral', 'Crystalline',
          'Basaltic', 'Sedimentary', 'Igneous', 'Metamorphic', 'Bedrock', 'Foundation', 'Core'
        ],
        nouns: [
          'Guardian', 'Sentinel', 'Protector', 'Defender', 'Shield', 'Wall', 'Barrier',
          'Fortress', 'Citadel', 'Tower', 'Monolith', 'Pillar', 'Column', 'Foundation',
          'Bedrock', 'Boulder', 'Stone', 'Rock', 'Crystal', 'Gem', 'Ore', 'Mineral',
          'Mountain', 'Hill', 'Cliff', 'Ridge', 'Summit', 'Peak', 'Crag', 'Bluff'
        ]
      },
      water: {
        adjectives: [
          'Flowing', 'Deep', 'Clear', 'Pure', 'Mystic', 'Ancient', 'Eternal', 'Boundless',
          'Fluid', 'Liquid', 'Transparent', 'Reflective', 'Mirror', 'Crystal', 'Azure',
          'Sapphire', 'Turquoise', 'Aqua', 'Marine', 'Oceanic', 'Abyssal', 'Pelagic',
          'Tidal', 'Wavy', 'Rippling', 'Cascading', 'Flowing', 'Streaming', 'Gushing'
        ],
        nouns: [
          'Guardian', 'Spirit', 'Essence', 'Force', 'Power', 'Energy', 'Flow', 'Stream',
          'River', 'Ocean', 'Sea', 'Lake', 'Pond', 'Spring', 'Well', 'Fountain',
          'Cascade', 'Waterfall', 'Rapids', 'Current', 'Tide', 'Wave', 'Ripple',
          'Drop', 'Bubble', 'Mist', 'Vapor', 'Dew', 'Rain', 'Storm'
        ]
      },
      fire: {
        adjectives: [
          'Burning', 'Blazing', 'Flaming', 'Fiery', 'Scorching', 'Searing', 'Intense',
          'Fierce', 'Wild', 'Untamed', 'Eternal', 'Everlasting', 'Unquenchable',
          'Consuming', 'Devouring', 'Raging', 'Furious', 'Violent', 'Explosive',
          'Volcanic', 'Magmatic', 'Incandescent', 'Luminous', 'Radiant', 'Glowing',
          'Bright', 'Brilliant', 'Dazzling', 'Blinding', 'Illuminating'
        ],
        nouns: [
          'Guardian', 'Spirit', 'Essence', 'Force', 'Power', 'Energy', 'Flame',
          'Fire', 'Blaze', 'Inferno', 'Conflagration', 'Bonfire', 'Pyre', 'Hearth',
          'Furnace', 'Forge', 'Kiln', 'Oven', 'Stove', 'Torch', 'Lamp', 'Lantern',
          'Beacon', 'Signal', 'Light', 'Glow', 'Spark', 'Ember', 'Ash', 'Smoke'
        ]
      }
    };

    const theme = elementThemes[element as keyof typeof elementThemes];
    if (!theme) return 'Unknown';

    // Используем хеш для выбора стабильного индекса
    const adjectiveIndex = Math.abs(hash) % theme.adjectives.length;
    const nounIndex = Math.abs(hash + rarity.length) % theme.nouns.length;

    const adjective = theme.adjectives[adjectiveIndex];
    const noun = theme.nouns[nounIndex];

    return `${adjective} ${noun}`;
  };



  const getElementalDisplayData = (elemental: CollectedElemental) => {
    const elementalData = ELEMENTAL_TYPES[elemental.element][elemental.rarity];
    const protection = getElementalProtection(elemental);
    const maxLevel = getMaxLevelForRarity(elemental.rarity);
    const canUpgradeRarity =
      elemental.level >= maxLevel && elemental.rarity !== 'immortal';

    // Determine the correct cost based on upgrade type
    const cost = canUpgradeRarity
      ? getRarityUpgradeCost(elemental.rarity)
      : getLevelUpCost(elemental);

    // Create name in format: Element_Rarity
    const elementName = elemental.element.charAt(0).toUpperCase() + elemental.element.slice(1);
    const rarityName = elemental.rarity.charAt(0).toUpperCase() + elemental.rarity.slice(1);
    const displayName = `${elementName}_${rarityName}`;



    return {
      currentName: displayName,
      currentEmoji: elementalData.emoji,
      currentProtection: protection,
      canLevelUp: canLevelUpElemental(elemental, player.mana),
      levelUpCost: cost,
      maxLevel,
      canUpgradeRarity,
      isImmortal: elemental.rarity === 'immortal',
    };
  };

  return (
    <main className='collection-container-modern'>
      {/* Modern Header */}
      <div className='collection-header-modern'>
        <div className='collection-title-modern'>
          <div className='title-icon'>📚</div>
          <div className='title-content'>
            <h1>Elemental Collection</h1>
          </div>
        </div>
        <div className='collection-stats-modern'>
          <div className='stat-card compact'>
            <div className='stat-icon'>🎯</div>
            <div className='stat-content'>
              <div className='stat-value'>
                {player.totalElementalsCollected}
              </div>
              <div className='stat-label'>Owned</div>
            </div>
          </div>
          <div className='stat-card epic compact'>
            <div className='stat-icon'>⭐</div>
            <div className='stat-content'>
              <div className='stat-value'>{player.epicElementalsOwned}</div>
              <div className='stat-label'>Epic</div>
            </div>
          </div>
          <div className='stat-card immortal compact'>
            <div className='stat-icon'>🌋</div>
            <div className='stat-content'>
              <div className='stat-value'>{player.immortalElementalsOwned}</div>
              <div className='stat-label'>Immortal</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Filters */}
      <div className='collection-filters-modern'>
        <div className='filter-section'>
          <div className='filter-label'>Filter by Element</div>
          <div className='filter-buttons'>
            <button
              className={`filter-btn ${selectedElement === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedElement('all')}
            >
              🌈 All
            </button>
            <button
              className={`filter-btn ${selectedElement === 'earth' ? 'active' : ''}`}
              onClick={() => setSelectedElement('earth')}
            >
              🗿 Earth
            </button>
            <button
              className={`filter-btn ${selectedElement === 'water' ? 'active' : ''}`}
              onClick={() => setSelectedElement('water')}
            >
              💧 Water
            </button>
            <button
              className={`filter-btn ${selectedElement === 'fire' ? 'active' : ''}`}
              onClick={() => setSelectedElement('fire')}
            >
              🔥 Fire
            </button>
          </div>
        </div>

        <div className='filter-section'>
          <div className='filter-label'>Filter by Rarity</div>
          <div className='filter-buttons'>
            <button
              className={`filter-btn ${selectedRarity === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedRarity('all')}
            >
              ✨ All
            </button>
            <button
              className={`filter-btn rarity-common ${selectedRarity === 'common' ? 'active' : ''}`}
              onClick={() => setSelectedRarity('common')}
            >
              Common
            </button>
            <button
              className={`filter-btn rarity-rare ${selectedRarity === 'rare' ? 'active' : ''}`}
              onClick={() => setSelectedRarity('rare')}
            >
              Rare
            </button>
            <button
              className={`filter-btn rarity-epic ${selectedRarity === 'epic' ? 'active' : ''}`}
              onClick={() => setSelectedRarity('epic')}
            >
              Epic
            </button>
            <button
              className={`filter-btn rarity-immortal ${selectedRarity === 'immortal' ? 'active' : ''}`}
              onClick={() => setSelectedRarity('immortal')}
            >
              Immortal
            </button>
          </div>
        </div>
      </div>

      {/* Collectible Cards Grid */}
      <div className='collectible-cards-grid'>
        {filteredElementals.map(elemental => {
          const displayData = getElementalDisplayData(elemental);

          return (
            <div
              key={elemental.id}
              className={`collectible-card ${getRarityClass(elemental.rarity)}`}
              style={
                {
                  '--rarity-color': getRarityColor(elemental.rarity),
                  '--rarity-glow': `${getRarityColor(elemental.rarity)}40`,
                  '--element-color': getElementColor(elemental.element),
                } as React.CSSProperties
              }
            >


              {/* Artwork Area - Main Focus */}
              <div className='card-artwork'>
                <div className={`artwork-container ${isElementalOnCooldown(elemental) ? 'on-cooldown' : ''}`}>
                  <img
                    className='artwork-image'
                    src={`${process.env.PUBLIC_URL}/resources/elmental/${encodeURIComponent(displayData.currentName)}.png`}
                    alt={displayData.currentName}
                    onError={(e) => {
                      // Fallback to emoji if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const emojiDiv = target.nextElementSibling as HTMLDivElement;
                      if (emojiDiv) {
                        emojiDiv.classList.add('show');
                      }
                    }}
                    onLoad={(e) => {
                      // Hide emoji when image loads successfully
                      const target = e.target as HTMLImageElement;
                      const emojiDiv = target.nextElementSibling as HTMLDivElement;
                      if (emojiDiv) {
                        emojiDiv.classList.remove('show');
                      }
                    }}

                  />
                  <div className='artwork-emoji'>{displayData.currentEmoji}</div>
                  <div className='artwork-background'></div>

                  {/* Rarity Indicator - Bottom Left */}
                  <div className={`artwork-rarity-indicator rarity-${elemental.rarity}`}>
                    {elemental.rarity.toUpperCase()}
                  </div>

                  {/* Cooldown Indicator - Top Center */}
                  {isElementalOnCooldown(elemental) && (
                    <div className='cooldown-indicator'>
                      <div className='cooldown-timer'>
                        <div className='cooldown-time-unit'>
                          <span className='time-value'>{Math.floor(getElementalCooldownRemaining(elemental) / (1000 * 60 * 60)).toString().padStart(2, '0')}</span>
                        </div>
                        <div className='cooldown-separator'>:</div>
                        <div className='cooldown-time-unit'>
                          <span className='time-value'>{Math.floor((getElementalCooldownRemaining(elemental) % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0')}</span>
                        </div>
                        <div className='cooldown-separator'>:</div>
                        <div className='cooldown-time-unit'>
                          <span className='time-value'>{Math.floor((getElementalCooldownRemaining(elemental) % (1000 * 60)) / 1000).toString().padStart(2, '0')}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Compact Action Button inside Artwork */}
                  <button
                    className={`compact-action-btn ${displayData.canUpgradeRarity ? 'upgrade' : 'level-up'} ${!displayData.canLevelUp ? 'disabled' : ''}`}
                    onClick={() => displayData.canLevelUp && handleLevelUpClick(elemental, displayData)}
                    disabled={!displayData.canLevelUp}
                    title={
                      displayData.isImmortal && elemental.level >= getMaxLevelForRarity(elemental.rarity)
                        ? 'Maximum Level Reached'
                        : displayData.canUpgradeRarity
                          ? 'Upgrade Rarity'
                          : 'Level Up'
                    }
                  >
                    {displayData.isImmortal && elemental.level >= getMaxLevelForRarity(elemental.rarity)
                      ? 'MAX'
                      : displayData.canUpgradeRarity
                        ? 'Upgrade'
                        : 'LVL UP'}
                  </button>
                </div>
              </div>

              {/* Character Name Block */}
              <div className='character-name-block'>
                <div className='character-name-text'>{getStableCharacterName(elemental.element, elemental.rarity, elemental.id)}</div>
                <div className='character-divider'></div>
                <div className='character-description-text'>
                  {elemental.element === 'earth' ?
                    `A mighty guardian of stone and soil, protecting allies with ${(displayData.currentProtection * 100).toFixed(0)}% defense.` :
                   elemental.element === 'water' ?
                    `A flowing spirit of healing and purification, restoring strength with ${(displayData.currentProtection * 100).toFixed(0)}% protection.` :
                    `A fierce warrior of flame and destruction, burning through enemies with ${(displayData.currentProtection * 100).toFixed(0)}% power.`}
                </div>
                <div className='character-divider'></div>
                <div className='level-text-description'>LVL {elemental.level}</div>
              </div>





            </div>
          );
        })}
      </div>

      {/* Modern Empty State */}
      {filteredElementals.length === 0 && (
        <div className='empty-collection-modern'>
          <div className='empty-icon-modern'>📦</div>
          <h3>No Elementals Found</h3>
          <p>
            Try adjusting your filters or win battles to collect more
            elementals!
          </p>
          <div className='empty-actions'>
            <button
              className='empty-action-btn'
              onClick={() => setSelectedElement('all')}
            >
              Show All Elements
            </button>
            <button
              className='empty-action-btn'
              onClick={() => setSelectedRarity('all')}
            >
              Show All Rarities
            </button>
          </div>
        </div>
              )}

        {/* Confirmation Modal */}
        {showConfirmModal && selectedElemental && selectedDisplayData && (
          <div className="modal-overlay active" onClick={handleCancelLevelUp}>
            <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Confirm {selectedDisplayData.canUpgradeRarity ? 'Upgrade' : 'Level Up'}</h3>
                <button className="modal-close" onClick={handleCancelLevelUp}>×</button>
              </div>

              <div className="modal-content">
                <div className="elemental-info">
                  <div className="elemental-name">{getStableCharacterName(selectedElemental.element, selectedElemental.rarity, selectedElemental.id)}</div>
                  <div className="elemental-details">
                    <span>Level {selectedElemental.level} → {selectedElemental.level + 1}</span>
                    {selectedDisplayData.canUpgradeRarity && (
                      <span className="rarity-upgrade">
                        {selectedElemental.rarity.charAt(0).toUpperCase() + selectedElemental.rarity.slice(1)} →
                        {selectedElemental.rarity === 'common' ? ' Rare' :
                         selectedElemental.rarity === 'rare' ? ' Epic' :
                         selectedElemental.rarity === 'epic' ? ' Immortal' : ''}
                      </span>
                    )}
                  </div>
                </div>

                <div className="cost-info">
                  <div className="cost-amount">
                    <span className="cost-label">Cost:</span>
                    <span className="cost-value">{selectedDisplayData.levelUpCost} Mana</span>
                  </div>
                  <div className="balance-info">
                    <span className="balance-label">Your Balance:</span>
                    <span className="balance-value">{player.mana} Mana</span>
                  </div>
                  <div className="remaining-balance">
                    <span className="remaining-label">Remaining:</span>
                    <span className={`remaining-value ${player.mana - selectedDisplayData.levelUpCost < 100 ? 'warning' : ''}`}>
                      {player.mana - selectedDisplayData.levelUpCost} Mana
                    </span>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="cancel-btn"
                  onClick={handleCancelLevelUp}
                >
                  Cancel
                </button>
                <button
                  className={`confirm-btn ${selectedDisplayData.canUpgradeRarity ? 'upgrade' : ''} ${player.mana - selectedDisplayData.levelUpCost < 100 ? 'disabled' : ''}`}
                  onClick={handleConfirmLevelUp}
                  disabled={player.mana - selectedDisplayData.levelUpCost < 100}
                >
                  {selectedDisplayData.canUpgradeRarity ? 'Upgrade' : 'Level Up'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    );
  };

export default CollectionTab;
