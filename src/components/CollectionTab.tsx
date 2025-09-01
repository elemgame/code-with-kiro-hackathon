import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import {
    CollectedElemental,
    ElementalDisplayData,
    PlayerStats,
} from '../types';
import CollectibleCard from './CollectibleCard';

interface CollectionTabProps {
  player: PlayerStats;
  onLevelUpElemental: (elementalId: string) => void;
}

const CollectionTab: React.FC<CollectionTabProps> = ({
  player,
  onLevelUpElemental,
}) => {
  const [selectedElement, setSelectedElement] = useState<
    'earth' | 'water' | 'fire' | 'all'
  >('all');
  const [selectedRarity, setSelectedRarity] = useState<
    'common' | 'rare' | 'epic' | 'immortal' | 'all'
  >('all');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedElemental, setSelectedElemental] =
    useState<CollectedElemental | null>(null);
  const [selectedDisplayData, setSelectedDisplayData] =
    useState<ElementalDisplayData | null>(null);
  const [, forceUpdate] = useState(0);
  // Update time every second for cooldown timers
  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [forceUpdate]);

  // Manage modal-open class for confirm modal
  useEffect(() => {
    if (showConfirmModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showConfirmModal]);

  // Handle escape key for modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showConfirmModal) {
        handleCancelLevelUp();
      }
    };

    if (showConfirmModal) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showConfirmModal]);

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

  const handleLevelUpClick = (
    elemental: CollectedElemental,
    displayData: ElementalDisplayData
  ) => {
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

      // Trigger vibration after confirmation
      setTimeout(() => {
        const windowWithVibration = window as Window & {
          triggerCardVibration?: Record<string, (isUpgrade?: boolean) => void>;
        };
        if (windowWithVibration.triggerCardVibration && selectedElemental) {
          const cardVibrationFunction = windowWithVibration.triggerCardVibration[selectedElemental.id];
          if (cardVibrationFunction) {
            cardVibrationFunction(selectedDisplayData.canUpgradeRarity);
          }
        }
      }, 100); // Small delay to ensure modal is closed
    }
  };

  const handleCancelLevelUp = () => {
    setShowConfirmModal(false);
    setSelectedElemental(null);
    setSelectedDisplayData(null);
  };

  return (
    <main className='collection-container-modern'>
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
        {filteredElementals.map(elemental => (
          <CollectibleCard
            key={elemental.id}
            elemental={elemental}
            onLevelUpClick={handleLevelUpClick}
            playerMana={player.mana}
          />
        ))}
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

      {/* Level Up Confirmation Modal */}
      {showConfirmModal &&
        selectedElemental &&
        selectedDisplayData &&
        ReactDOM.createPortal(
          <div
            className='level-up-modal-overlay active'
            onClick={handleCancelLevelUp}
          >
            <div
              className={`level-up-modal element-${selectedElemental.element}`}
              onClick={e => e.stopPropagation()}
            >
              <div className='level-up-modal-header'>
                <h3>
                  Confirm{' '}
                  {selectedDisplayData.canUpgradeRarity
                    ? 'Upgrade'
                    : 'Level Up'}
                </h3>
                <button
                  className='level-up-modal-close'
                  onClick={handleCancelLevelUp}
                >
                  ×
                </button>
              </div>

              <div className='level-up-modal-content'>
                <div className='level-up-elemental-info'>
                  <div className='level-up-elemental-details'>
                    <span>
                      Level {selectedElemental.level} →{' '}
                      {selectedElemental.level + 1}
                    </span>
                    {selectedDisplayData.canUpgradeRarity && (
                      <span className='level-up-rarity-upgrade'>
                        {selectedElemental.rarity.charAt(0).toUpperCase() +
                          selectedElemental.rarity.slice(1)}{' '}
                        →
                        {selectedElemental.rarity === 'common'
                          ? ' Rare'
                          : selectedElemental.rarity === 'rare'
                            ? ' Epic'
                            : selectedElemental.rarity === 'epic'
                              ? ' Immortal'
                              : ''}
                      </span>
                    )}
                  </div>
                </div>

                <div className='level-up-cost-info'>
                  <div className='level-up-cost-amount'>
                    <span className='level-up-cost-label'>Cost:</span>
                    <span className='level-up-cost-value'>
                      {selectedDisplayData.levelUpCost} Mana
                    </span>
                  </div>
                  <div className='level-up-balance-info'>
                    <span className='level-up-balance-label'>
                      Your Balance:
                    </span>
                    <span className='level-up-balance-value'>
                      {player.mana} Mana
                    </span>
                  </div>
                  <div className='level-up-remaining-balance'>
                    <span className='level-up-remaining-label'>Remaining:</span>
                    <span
                      className={`level-up-remaining-value ${player.mana - selectedDisplayData.levelUpCost < 100 ? 'warning' : ''}`}
                    >
                      {player.mana - selectedDisplayData.levelUpCost} Mana
                    </span>
                  </div>
                </div>
              </div>

              <div className='level-up-modal-actions'>
                <button
                  className='level-up-cancel-btn'
                  onClick={handleCancelLevelUp}
                >
                  Cancel
                </button>
                <button
                  className={`level-up-confirm-btn ${selectedDisplayData.canUpgradeRarity ? 'upgrade' : ''} ${player.mana - selectedDisplayData.levelUpCost < 100 ? 'disabled' : ''}`}
                  onClick={handleConfirmLevelUp}
                  disabled={player.mana - selectedDisplayData.levelUpCost < 100}
                >
                  {selectedDisplayData.canUpgradeRarity
                    ? 'Upgrade'
                    : 'Level Up'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </main>
  );
};

export default CollectionTab;
