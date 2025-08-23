import React, { useEffect, useRef, useState } from 'react';
import {
  canLevelUpElemental,
  ELEMENTAL_TYPES,
  formatCooldownTime,
  getElementalCooldownRemaining,
  getElementalProtection,
  getLevelUpCost,
  getMaxLevelForRarity,
  getRarityUpgradeCost,
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
      default:
        return 'Common';
    }
  };

  const MarqueeText: React.FC<{ text: string; className: string }> = ({
    text,
    className,
  }) => {
    const textRef = useRef<HTMLDivElement>(null);
    const [needsMarquee, setNeedsMarquee] = useState(false);

    useEffect(() => {
      if (textRef.current) {
        const element = textRef.current;
        const isOverflowing = element.scrollWidth > element.clientWidth;
        setNeedsMarquee(isOverflowing);
      }
    }, [text]);

    return (
      <div
        ref={textRef}
        className={className}
        data-text={text}
        data-overflow={needsMarquee}
      >
        {text}
      </div>
    );
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

    return {
      currentName: elementalData.name,
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

      {/* Modern Elementals Grid */}
      <div className='elementals-grid-modern'>
        {filteredElementals.map(elemental => {
          const displayData = getElementalDisplayData(elemental);
          const maxLevel = getMaxLevelForRarity(elemental.rarity);
          // Show level progress instead of experience progress
          const levelProgress = (elemental.level / maxLevel) * 100;

          return (
            <div
              key={elemental.id}
              className='elemental-card-modern'
              style={
                {
                  '--rarity-color': getRarityColor(elemental.rarity),
                  '--rarity-glow': `${getRarityColor(elemental.rarity)}40`,
                } as React.CSSProperties
              }
            >
              {/* Modern Elemental Header */}
              <div className='elemental-header-modern'>
                <div className='elemental-emoji-modern'>
                  {displayData.currentEmoji}
                </div>
                <div className='elemental-info-modern'>
                  <MarqueeText
                    text={displayData.currentName}
                    className='elemental-name-modern'
                  />
                  <div className='elemental-rarity-modern'>
                    {getRarityName(elemental.rarity)}
                  </div>
                </div>
                <div className='elemental-level-modern'>
                  <span>Lv.{elemental.level}</span>
                </div>
              </div>

              {/* Modern Elemental Stats */}
              <div className='elemental-stats-modern'>
                <div className='stat-item-modern'>
                  <div className='stat-icon'>🛡️</div>
                  <div className='stat-content'>
                    <div className='stat-value'>
                      {(displayData.currentProtection * 100).toFixed(0)}%
                    </div>
                    <div className='stat-label'>Protection</div>
                  </div>
                </div>
                <div
                  className={`cooldown-indicator-modern ${isElementalOnCooldown(elemental) ? 'active' : 'inactive'}`}
                >
                  <div className='cooldown-icon'>⏰</div>
                  <div className='cooldown-text'>
                    {isElementalOnCooldown(elemental)
                      ? formatCooldownTime(
                          getElementalCooldownRemaining(elemental)
                        )
                      : '0h 0m'}
                  </div>
                </div>
              </div>

              {/* Modern Level Progress Bar */}
              <div className='level-progress-modern'>
                <div className='progress-bar-modern'>
                  <div
                    className='progress-fill-modern'
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
                <div className='progress-text'>Level Progress</div>
              </div>

              {/* Modern Action Buttons */}
              <div className='elemental-actions-modern'>
                {displayData.isImmortal ? (
                  <button
                    className='action-btn-modern max-level-btn-modern'
                    disabled
                  >
                    <span className='btn-icon'>🏆</span>
                    <span className='btn-text'>MAX LVL</span>
                    <span className='btn-cost'>Immortal</span>
                  </button>
                ) : displayData.canLevelUp ? (
                  <button
                    className={`action-btn-modern ${displayData.canUpgradeRarity ? 'upgrade-btn-modern' : 'level-up-btn-modern'}`}
                    onClick={() => onLevelUpElemental(elemental.id)}
                  >
                    <span className='btn-icon'>⚡</span>
                    <span className='btn-text'>
                      {displayData.canUpgradeRarity ? 'Upgrade' : 'Level Up'}
                    </span>
                    <span className='btn-cost'>
                      {displayData.levelUpCost} Mana
                    </span>
                  </button>
                ) : null}
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
    </main>
  );
};

export default CollectionTab;
