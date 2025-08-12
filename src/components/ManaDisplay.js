import React from 'react';
import { RARITIES, calculateProtectedMana } from '../gameLogic';

const ManaDisplay = ({ 
  currentMana = 0, 
  wager = 0, 
  elementalRarity = RARITIES.COMMON, 
  playerName = "Player" 
}) => {
  const protectedMana = calculateProtectedMana(wager, elementalRarity);
  const potentialLoss = Math.max(0, wager - protectedMana);
  const isLowMana = currentMana < 100;
  const canAffordWager = currentMana >= wager;

  return (
    <div className="mana-display">
      <h3>{playerName} Mana Status</h3>
      
      <div className="mana-stats">
        <div className={`stat-item ${isLowMana ? 'warning' : ''}`}>
          <span className="stat-label">Current Mana:</span>
          <span className={`stat-value current-mana ${isLowMana ? 'low' : ''}`}>
            {currentMana} {isLowMana && '⚠️'}
          </span>
        </div>
        
        <div className={`stat-item ${!canAffordWager ? 'error' : ''}`}>
          <span className="stat-label">Wagered:</span>
          <span className={`stat-value wagered-mana ${!canAffordWager ? 'invalid' : ''}`}>
            {wager} {!canAffordWager && '❌'}
          </span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Protected ({elementalRarity.name}):</span>
          <span className="stat-value protected-mana">{protectedMana}</span>
        </div>
        
        <div className="stat-item risk">
          <span className="stat-label">At Risk:</span>
          <span className="stat-value risk-mana">{potentialLoss}</span>
        </div>
      </div>
      
      <div className="mana-bar">
        <div 
          className="mana-fill"
          style={{ width: `${Math.min((currentMana / 1000) * 100, 100)}%` }}
        />
        <span className="mana-bar-text">{currentMana} / 1000</span>
      </div>
    </div>
  );
};

export default ManaDisplay;