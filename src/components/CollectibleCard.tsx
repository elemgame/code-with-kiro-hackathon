import React from 'react';
import {
  canLevelUpElemental,
  ELEMENTAL_TYPES,
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
  ElementalDisplayData,
  ElementalRarity,
} from '../types';

interface CollectibleCardProps {
  elemental: CollectedElemental;
  onLevelUpClick: (
    elemental: CollectedElemental,
    displayData: ElementalDisplayData
  ) => void;
  playerMana: number;
}

const CollectibleCard: React.FC<CollectibleCardProps> = ({
  elemental,
  onLevelUpClick,
  playerMana,
}) => {
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
        return '#059669';
      case 'water':
        return '#0ea5e9';
      case 'fire':
        return '#dc2626';
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

  const getStableCharacterName = (
    element: string,
    rarity: string,
    elementalId: string
  ): string => {
    const hash = elementalId.split('').reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    const elementThemes = {
      earth: {
        adjectives: [
          'Ancient',
          'Mighty',
          'Solid',
          'Eternal',
          'Granite',
          'Mossy',
          'Stony',
          'Earthen',
          'Mountainous',
          'Rocky',
          'Dense',
          'Heavy',
          'Buried',
          'Deep',
          'Solid',
          'Unbreakable',
          'Timeless',
          'Enduring',
          'Stable',
          'Grounded',
          'Terrestrial',
          'Mineral',
          'Crystalline',
          'Basaltic',
          'Sedimentary',
          'Igneous',
          'Metamorphic',
          'Bedrock',
          'Foundation',
          'Core',
        ],
        nouns: [
          'Guardian',
          'Sentinel',
          'Protector',
          'Defender',
          'Shield',
          'Wall',
          'Barrier',
          'Fortress',
          'Citadel',
          'Tower',
          'Monolith',
          'Pillar',
          'Column',
          'Foundation',
          'Bedrock',
          'Boulder',
          'Stone',
          'Rock',
          'Crystal',
          'Gem',
          'Ore',
          'Mineral',
          'Mountain',
          'Hill',
          'Cliff',
          'Ridge',
          'Summit',
          'Peak',
          'Crag',
          'Bluff',
        ],
      },
      water: {
        adjectives: [
          'Flowing',
          'Deep',
          'Clear',
          'Pure',
          'Mystic',
          'Ancient',
          'Eternal',
          'Boundless',
          'Fluid',
          'Liquid',
          'Transparent',
          'Reflective',
          'Mirror',
          'Crystal',
          'Azure',
          'Sapphire',
          'Turquoise',
          'Aqua',
          'Marine',
          'Oceanic',
          'Abyssal',
          'Pelagic',
          'Tidal',
          'Wavy',
          'Rippling',
          'Cascading',
          'Flowing',
          'Streaming',
          'Gushing',
        ],
        nouns: [
          'Guardian',
          'Spirit',
          'Essence',
          'Force',
          'Power',
          'Energy',
          'Flow',
          'Stream',
          'River',
          'Ocean',
          'Sea',
          'Lake',
          'Pond',
          'Spring',
          'Well',
          'Fountain',
          'Cascade',
          'Waterfall',
          'Rapids',
          'Current',
          'Tide',
          'Wave',
          'Ripple',
          'Drop',
          'Bubble',
          'Mist',
          'Vapor',
          'Dew',
          'Rain',
          'Storm',
        ],
      },
      fire: {
        adjectives: [
          'Burning',
          'Blazing',
          'Flaming',
          'Fiery',
          'Scorching',
          'Searing',
          'Intense',
          'Fierce',
          'Wild',
          'Untamed',
          'Eternal',
          'Everlasting',
          'Unquenchable',
          'Consuming',
          'Devouring',
          'Raging',
          'Furious',
          'Violent',
          'Explosive',
          'Volcanic',
          'Magmatic',
          'Incandescent',
          'Luminous',
          'Radiant',
          'Glowing',
          'Bright',
          'Brilliant',
          'Dazzling',
          'Blinding',
          'Illuminating',
        ],
        nouns: [
          'Guardian',
          'Spirit',
          'Essence',
          'Force',
          'Power',
          'Energy',
          'Flame',
          'Fire',
          'Blaze',
          'Inferno',
          'Conflagration',
          'Bonfire',
          'Pyre',
          'Hearth',
          'Furnace',
          'Forge',
          'Kiln',
          'Oven',
          'Stove',
          'Torch',
          'Lamp',
          'Lantern',
          'Beacon',
          'Signal',
          'Light',
          'Glow',
          'Spark',
          'Ember',
          'Ash',
          'Smoke',
        ],
      },
    };

    const theme = elementThemes[element as keyof typeof elementThemes];
    if (!theme) return 'Unknown';

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

    const cost = canUpgradeRarity
      ? getRarityUpgradeCost(elemental.rarity)
      : getLevelUpCost(elemental);

    const elementName =
      elemental.element.charAt(0).toUpperCase() + elemental.element.slice(1);
    const rarityName =
      elemental.rarity.charAt(0).toUpperCase() + elemental.rarity.slice(1);
    const displayName = `${elementName}_${rarityName}`;

    return {
      currentName: displayName,
      currentEmoji: elementalData.emoji,
      currentProtection: protection,
      canLevelUp: canLevelUpElemental(elemental, playerMana),
      levelUpCost: cost,
      maxLevel,
      canUpgradeRarity,
      isImmortal: elemental.rarity === 'immortal',
    };
  };

  const displayData = getElementalDisplayData(elemental);

  return (
    <div
      className={`collectible-card ${getRarityClass(elemental.rarity)} element-${elemental.element}`}
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
        <div
          className={`artwork-container ${isElementalOnCooldown(elemental) ? 'on-cooldown' : ''}`}
        >
          <img
            className='artwork-image'
            src={`${process.env.PUBLIC_URL}/resources/elmental/${encodeURIComponent(displayData.currentName)}.png`}
            alt={displayData.currentName}
            onError={e => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const emojiDiv = target.nextElementSibling as HTMLDivElement;
              if (emojiDiv) {
                emojiDiv.classList.add('show');
              }
            }}
            onLoad={e => {
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
          <div
            className={`artwork-rarity-indicator rarity-${elemental.rarity}`}
          >
            {elemental.rarity.toUpperCase()}
          </div>

          {/* Cooldown Indicator - Top Center */}
          {isElementalOnCooldown(elemental) && (
            <div className='cooldown-indicator'>
              <div className='cooldown-timer'>
                <div className='cooldown-time-unit'>
                  <span className='time-value'>
                    {Math.floor(
                      getElementalCooldownRemaining(elemental) /
                        (1000 * 60 * 60)
                    )
                      .toString()
                      .padStart(2, '0')}
                  </span>
                </div>
                <div className='cooldown-separator'>:</div>
                <div className='cooldown-time-unit'>
                  <span className='time-value'>
                    {Math.floor(
                      (getElementalCooldownRemaining(elemental) %
                        (1000 * 60 * 60)) /
                        (1000 * 60)
                    )
                      .toString()
                      .padStart(2, '0')}
                  </span>
                </div>
                <div className='cooldown-separator'>:</div>
                <div className='cooldown-time-unit'>
                  <span className='time-value'>
                    {Math.floor(
                      (getElementalCooldownRemaining(elemental) % (1000 * 60)) /
                        1000
                    )
                      .toString()
                      .padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Compact Action Button inside Artwork */}
          <button
            className={`compact-action-btn ${displayData.canUpgradeRarity ? 'upgrade' : 'level-up'} ${!displayData.canLevelUp ? 'disabled' : ''}`}
            onClick={() =>
              displayData.canLevelUp && onLevelUpClick(elemental, displayData)
            }
            disabled={!displayData.canLevelUp}
            title={
              displayData.isImmortal &&
              elemental.level >= getMaxLevelForRarity(elemental.rarity)
                ? 'Maximum Level Reached'
                : displayData.canUpgradeRarity
                  ? 'Upgrade Rarity'
                  : 'Level Up'
            }
          >
            {displayData.isImmortal &&
            elemental.level >= getMaxLevelForRarity(elemental.rarity)
              ? 'MAX'
              : displayData.canUpgradeRarity
                ? 'Upgrade'
                : 'LVL UP'}
          </button>
        </div>
      </div>

      {/* Character Name Block */}
      <div className='character-name-block'>
        <div className='character-name-text'>
          {getStableCharacterName(
            elemental.element,
            elemental.rarity,
            elemental.id
          )}
        </div>
        <div className='character-divider'></div>
        <div className='character-description-text'>
          {elemental.element === 'earth' ? (
            <>
              A mighty guardian of stone and soil, protecting allies with{' '}
              <strong>
                {(displayData.currentProtection * 100).toFixed(0)}%
              </strong>{' '}
              defense.
            </>
          ) : elemental.element === 'water' ? (
            <>
              A flowing spirit of healing and purification, restoring strength
              with{' '}
              <strong>
                {(displayData.currentProtection * 100).toFixed(0)}%
              </strong>{' '}
              protection.
            </>
          ) : (
            <>
              A fierce warrior of flame and destruction, burning through enemies
              with{' '}
              <strong>
                {(displayData.currentProtection * 100).toFixed(0)}%
              </strong>{' '}
              power.
            </>
          )}
        </div>
        <div className='character-divider'></div>
        <div className='level-text-description'>LVL {elemental.level}</div>
      </div>
    </div>
  );
};

export default CollectibleCard;
