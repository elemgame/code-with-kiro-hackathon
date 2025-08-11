import React from 'react';
import { RARITIES, getNextRarity } from '../gameLogic';

const ElementalUpgrade = ({ 
  currentRarity, 
  currentMana, 
  onUpgrade, 
  playerName = "Player" 
}) => {
  const nextRarity = getNextRarity(currentRarity);
  const canUpgrade = nextRarity && currentMana >= nextRarity.upgradeCost;

  return (
    <div className="elemental-upgrade">
      <h3>{playerName} Elemental</h3>
      
      <div className="current-rarity">
        <div className="rarity-info">
          <span className="rarity-name">{currentRarity.name}</span>
          <span className="protection-rate">
            Protects {(currentRarity.protection * 100).toFixed(0)}% of wagered Mana
          </span>
        </div>
      </div>
      
      {nextRarity ? (
        <div className="upgrade-section">
          <div className="next-rarity">
            <h4>Upgrade Available</h4>
            <div className="upgrade-info">
              <span className="next-rarity-name">{nextRarity.name}</span>
              <span className="next-protection">
                Protects {(nextRarity.protection * 100).toFixed(0)}% of wagered Mana
              </span>
              <span className="upgrade-cost">Cost: {nextRarity.upgradeCost} Mana</span>
            </div>
          </div>
          
          <button
            className={`upgrade-button ${canUpgrade ? 'available' : 'unavailable'}`}
            onClick={onUpgrade}
            disabled={!canUpgrade}
            aria-label={`Upgrade elemental to ${nextRarity.name}`}
          >
            {canUpgrade ? `Upgrade to ${nextRarity.name}` : 'Insufficient Mana'}
          </button>
        </div>
      ) : (
        <div className="max-rarity">
          <p>🏆 Maximum rarity achieved!</p>
        </div>
      )}
    </div>
  );
};

export default ElementalUpgrade;