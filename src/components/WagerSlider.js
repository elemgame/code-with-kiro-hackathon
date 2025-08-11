import React from 'react';

const WagerSlider = ({ 
  wager, 
  onWagerChange, 
  maxWager, 
  disabled = false,
  playerName = "Player" 
}) => {
  return (
    <div className="wager-slider">
      <h3>{playerName} - Set Your Wager</h3>
      
      <div className="slider-container">
        <input
          type="range"
          min="10"
          max={maxWager}
          step="10"
          value={wager}
          onChange={(e) => onWagerChange(parseInt(e.target.value))}
          disabled={disabled}
          className="wager-input"
          aria-label={`${playerName} wager amount`}
        />
        
        <div className="slider-labels">
          <span>10</span>
          <span className="current-wager">{wager} Mana</span>
          <span>{maxWager}</span>
        </div>
      </div>
      
      <div className="quick-wager-buttons">
        {[25, 50, 100, 200].filter(amount => amount <= maxWager).map(amount => (
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