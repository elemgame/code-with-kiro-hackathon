import React from 'react';
import { RARITIES, calculateProtectedMana } from '../gameLogic';

const ManaDisplay = ({ 
  currentMana, 
  wager, 
  elementalRarity, 
  playerName = "Player" 
}) => {
  const protectedMana = calculateProtectedMana(wager, elementalRarity);
  const potentialLoss = wager - protectedMana;

  return (
    <div className="mana-display">
      <h3>{playerName} Mana Status</h3>
      
      <div className="mana-stats">
        <div className="stat-item">
          <span className="stat-label">Current Mana:</span>
          <span className="stat-value current-mana">{currentMana}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Wagered:</span>
          <span className="stat-value wagered-mana">{wager}</span>
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