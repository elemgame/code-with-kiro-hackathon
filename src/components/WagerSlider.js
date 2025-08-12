import React from 'react';

const WagerSlider = ({ 
  wager = 10, 
  onWagerChange, 
  maxWager = 100, 
  disabled = false,
  playerName = "Player" 
}) => {
  const safeMaxWager = Math.max(10, maxWager);
  const safeWager = Math.max(10, Math.min(wager, safeMaxWager));
  return (
    <div className="wager-slider">
      <h3>{playerName} - Set Your Wager</h3>
      
      <div className="slider-container">
        <input
          type="range"
          min="10"
          max={safeMaxWager}
          step="10"
          value={safeWager}
          onChange={(e) => onWagerChange(parseInt(e.target.value))}
          disabled={disabled}
          className="wager-input"
          aria-label={`${playerName} wager amount`}
        />
        
        <div className="slider-labels">
          <span>10</span>
          <span className="current-wager">{safeWager} Mana</span>
          <span>{safeMaxWager}</span>
        </div>
      </div>
      
      <div className="quick-wager-buttons">
        {[25, 50, 100, 200].filter(amount => amount <= safeMaxWager).map(amount => (
          <button
            key={amount}
            className="quick-wager-btn"
            onClick={() => onWagerChange(amount)}
            disabled={disabled}
          >
            {amount}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WagerSlider;