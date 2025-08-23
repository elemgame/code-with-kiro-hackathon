import React, { useState } from 'react';
import {
  canLevelUpElemental,
  ELEMENTAL_TYPES,
  formatCooldownTime,
  getElementalCooldownRemaining,
  getElementalProtection,
  getLevelUpCost,
  getMaxLevelForRarity,
  getNextRarity,
  isElementalOnCooldown,
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
      case 'legendary':
        return '#ef4444';
      default:
        return '#9ca3af';
    }
  };

  const getRarityName = (rarity: ElementalRarity): string => {
    switch (rarity) {
      case 'common':
        return 'Common';
      case 'rare':
        return 'Rare';
      case 'epic':
        return 'Epic';
      case 'immortal':
        return 'Immortal';
      case 'legendary':
        return 'Legendary';
      default:
        return 'Common';
    }
  };

  const getElementalDisplayData = (elemental: CollectedElemental) => {
    const elementalData = ELEMENTAL_TYPES[elemental.element][elemental.rarity];
    const protection = getElementalProtection(elemental);
    const maxLevel = getMaxLevelForRarity(elemental.rarity);
    const canUpgradeRarity =
      elemental.level >= maxLevel && elemental.rarity !== 'legendary';
    const nextRarity = canUpgradeRarity
      ? getNextRarity(elemental.rarity)
      : null;
    const nextElementalData = nextRarity
      ? ELEMENTAL_TYPES[elemental.element][nextRarity]
      : null;

    return {
      currentName: elementalData.name,
      currentEmoji: elementalData.emoji,
      currentProtection: protection,
      canLevelUp: canLevelUpElemental(elemental, player.mana),
      levelUpCost: getLevelUpCost(elemental),
      maxLevel,
      canUpgradeRarity,
      nextRarity,
      nextName: nextElementalData?.name,
      nextEmoji: nextElementalData?.emoji,
    };
  };

  return (
    <main className='collection-container'>
      {/* Header */}
      <div className='collection-header'>
        <div className='collection-title'>
          <h1>Elemental Collection</h1>
          <div className='collection-stats'>
            <span>Owned: {player.totalElementalsCollected}</span>
            <span>Legendary: {player.legendaryElementalsOwned}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className='collection-filters'>
        <div className='filter-group'>
          <label>Element:</label>
          <select
            value={selectedElement}
            onChange={e =>
              setSelectedElement(e.target.value as Element | 'all')
            }
          >
            <option value='all'>All Elements</option>
            <option value='earth'>Earth</option>
            <option value='water'>Water</option>
            <option value='fire'>Fire</option>
          </select>
        </div>

        <div className='filter-group'>
          <label>Rarity:</label>
          <select
            value={selectedRarity}
            onChange={e =>
              setSelectedRarity(e.target.value as ElementalRarity | 'all')
            }
          >
            <option value='all'>All Rarities</option>
            <option value='common'>Common</option>
            <option value='rare'>Rare</option>
            <option value='epic'>Epic</option>
            <option value='immortal'>Immortal</option>
            <option value='legendary'>Legendary</option>
          </select>
        </div>
      </div>

      {/* Elementals Grid */}
      <div className='elementals-grid'>
        {filteredElementals.map(elemental => {
          const displayData = getElementalDisplayData(elemental);
          const expNeeded = elemental.level * 100;
          const maxLevel = getMaxLevelForRarity(elemental.rarity);
          // Show level progress instead of experience progress
          const levelProgress = (elemental.level / maxLevel) * 100;

          return (
            <div
              key={elemental.id}
              className='elemental-card'
              style={{ borderColor: getRarityColor(elemental.rarity) }}
            >
              {/* Elemental Header */}
              <div className='elemental-header'>
                <div className='elemental-emoji'>
                  {displayData.currentEmoji}
                </div>
                <div className='elemental-info'>
                  <h3 className='elemental-name'>{displayData.currentName}</h3>
                  <div
                    className='elemental-rarity'
                    style={{ color: getRarityColor(elemental.rarity) }}
                  >
                    {getRarityName(elemental.rarity)}
                  </div>
                </div>
                <div className='elemental-level'>
                  <span>Lv.{elemental.level}</span>
                </div>
              </div>

              {/* Elemental Stats */}
              <div className='elemental-stats'>
                <div className='stat-item'>
                  <span className='stat-label'>Protection:</span>
                  <span className='stat-value'>
                    {(displayData.currentProtection * 100).toFixed(0)}%
                  </span>
                </div>
                <div className='stat-item'>
                  <span className='stat-label'>Experience:</span>
                  <span className='stat-value'>
                    {elemental.experience}/{expNeeded}
                  </span>
                </div>
                <div className='stat-item'>
                  <span className='stat-label'>Times Used:</span>
                  <span className='stat-value'>{elemental.timesUsed}</span>
                </div>
                {isElementalOnCooldown(elemental) && (
                  <div className='stat-item cooldown-stat'>
                    <span className='stat-label'>Cooldown:</span>
                    <span className='stat-value cooldown-value'>
                      {formatCooldownTime(
                        getElementalCooldownRemaining(elemental)
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Level Progress Bar */}
              <div className='exp-bar'>
                <div
                  className='exp-fill'
                  style={{ width: `${levelProgress}%` }}
                />
              </div>

              {/* Rarity Upgrade Info */}
              {displayData.canUpgradeRarity && (
                <div className='rarity-upgrade-info'>
                  <div className='rarity-upgrade-preview'>
                    <span>
                      {displayData.currentEmoji} → {displayData.nextEmoji}
                    </span>
                    <span>
                      {displayData.currentName} → {displayData.nextName}
                    </span>
                    <span>
                      {getRarityName(elemental.rarity)} →{' '}
                      {getRarityName(displayData.nextRarity!)}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className='elemental-actions'>
                {displayData.canLevelUp && (
                  <button
                    className='action-btn level-up-btn'
                    onClick={() => onLevelUpElemental(elemental.id)}
                  >
                    {displayData.canUpgradeRarity
                      ? 'Upgrade Rarity'
                      : 'Level Up'}{' '}
                    ({displayData.levelUpCost} Mana)
                  </button>
                )}
              </div>

              {/* Max Level Indicator */}
              {elemental.level >= displayData.maxLevel && (
                <div className='max-level-badge'>MAX LEVEL</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredElementals.length === 0 && (
        <div className='empty-collection'>
          <div className='empty-icon'>📦</div>
          <h3>No Elementals Found</h3>
          <p>
            Try adjusting your filters or win battles to collect more
            elementals!
          </p>
        </div>
      )}
    </main>
  );
};

export default CollectionTab;
