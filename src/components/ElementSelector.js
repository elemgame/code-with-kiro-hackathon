import React from 'react';
import { ELEMENTS, ELEMENTALS } from '../gameLogic';

const ElementSelector = ({ 
  selectedElement, 
  onElementSelect, 
  disabled = false,
  playerName = "Player",
  showSelection = true 
}) => {
  return (
    <div className="element-selector">
      <h3>{playerName} - Choose Your Element</h3>
      <div className="element-buttons">
        {Object.values(ELEMENTS).map(element => {
          const elemental = ELEMENTALS[element];
          const isSelected = selectedElement === element;
          
          return (
            <button
              key={element}
              className={`element-button ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
              onClick={() => !disabled && onElementSelect(element)}
              disabled={disabled}
              aria-label={`Select ${elemental.name}`}
              style={{
                backgroundColor: isSelected ? elemental.color : 'transparent',
                borderColor: elemental.color,
                color: isSelected ? 'white' : elemental.color
              }}
            >
              <span className="element-emoji" role="img" aria-label={elemental.name}>
                {elemental.emoji}
              </span>
              <span className="element-name">{elemental.name}</span>
            </button>
          );
        })}
      </div>
      
      {showSelection && selectedElement && (
        <div className="selection-display">
          <p>Selected: {ELEMENTALS[selectedElement].name} {ELEMENTALS[selectedElement].emoji}</p>
        </div>
      )}
    </div>
  );
};

export default ElementSelector;