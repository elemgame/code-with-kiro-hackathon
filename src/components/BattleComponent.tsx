import React, { useCallback, useEffect, useState } from 'react';
import {
    ELEMENTS,
    LOCATIONS,
    canAffordLocation,
    formatCooldownTime,
    getElementalCooldownHours,
    getElementalCooldownRemaining,
    getElementalData,
    isElementalOnCooldown,
} from '../gameLogic';
import { Element, ElementalRarity, GameState, Location } from '../types';

interface BattleComponentProps {
  gameState: GameState;
  onSelectLocation: (location: Location) => void;
  onSelectElement: (element: Element) => void;
  onSelectElemental: (elemental: ElementalRarity) => void;
  onReturnToLocationSelection: () => void;
  onReturnToElementSelection: () => void;
  onStartMatchmaking: () => void; // Keep name for backward compatibility
  onStartBattle: () => void;
  onReturnToMenu: () => void;
}

const BattleComponent: React.FC<BattleComponentProps> = ({
  gameState,
  onSelectLocation,
  onSelectElement,
  onSelectElemental,
  onStartMatchmaking,
  onStartBattle,
  onReturnToMenu: _onReturnToMenu,
  onReturnToLocationSelection,
  onReturnToElementSelection,
}) => {
  const { player, gamePhase } = gameState;
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [cooldownUpdateTrigger, setCooldownUpdateTrigger] = useState(0);
  const [showFocusOutlines, setShowFocusOutlines] = useState<boolean>(true);

  // Real-time cooldown updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCooldownUpdateTrigger(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check tutorial completion status
  useEffect(() => {
    const tutorialSettings = localStorage.getItem('tutorialSettings');
    if (tutorialSettings) {
      try {
        const settings = JSON.parse(tutorialSettings);
        setShowFocusOutlines(!settings.hasSeenBattleTutorial);
      } catch (error) {
        // Keep default value if parsing fails
      }
    }
  }, []);

  // Listen for tutorial completion
  useEffect(() => {
    const handleTutorialComplete = () => {
      setShowFocusOutlines(false);
    };

    window.addEventListener('battleTutorialCompleted', handleTutorialComplete);
    return () => window.removeEventListener('battleTutorialCompleted', handleTutorialComplete);
  }, []);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: KeyboardEvent, items: any[], onSelect: (item: any) => void, onBack?: () => void) => {
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => Math.max(0, prev - 1));
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => Math.min(items.length - 1, prev + 1));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (items[focusedIndex]) {
          onSelect(items[focusedIndex]);
        }
        break;
      case 'Backspace':
        e.preventDefault();
        if (onBack) {
          onBack();
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowTooltip(null);
        break;
    }
  }, [focusedIndex]);

  // Element descriptions for better UX
  const getElementDescription = (element: Element): string => {
    const descriptions = {
      earth: 'Strong against Water. Absorbs and neutralizes liquid attacks with solid defense.',
      water: 'Strong against Fire. Extinguishes flames and provides fluid adaptability.',
      fire: 'Strong against Earth. Burns through solid defenses with intense heat.',
    };
    return descriptions[element];
  };

  // Location tooltips
  const getLocationTooltip = (location: Location): string => {
    const tooltips = {
      free: 'Practice battles with no mana cost. Great for beginners!',
      swamp: 'Moderate difficulty. Decent rewards for experienced players.',
      village: 'Challenging battles with good mana rewards.',
      castle: 'Elite battles for masters. High risk, high reward!',
    };
    return tooltips[location];
  };

  // Location selection keyboard handler
  useEffect(() => {
    if (gamePhase === 'menu') {
      const locations = Object.entries(LOCATIONS);
      const handleKeyboardNav = (e: KeyboardEvent) =>
        handleKeyDown(e, locations, ([key]) => {
          if (canAffordLocation(player.mana, key as Location)) {
            onSelectLocation(key as Location);
          }
        });

      document.addEventListener('keydown', handleKeyboardNav);
      return () => document.removeEventListener('keydown', handleKeyboardNav);
    }
    return undefined;
  }, [gamePhase, handleKeyDown, onSelectLocation, player.mana]);

  const renderLocationSelection = () => {
    const locations = Object.entries(LOCATIONS);

    return (
      <div className='battle-section' role="main" aria-labelledby="battle-title">
        <div className='battle-header'>
          <div className='battle-icon' aria-hidden="true">🏟️</div>
          <h3 id="battle-title" className='battle-title'>Battle Arena</h3>
          <p className='battle-subtitle'>Choose Your Battle Location</p>

          <div className='battle-step-indicator' role="progressbar" aria-valuenow={1} aria-valuemin={1} aria-valuemax={3} aria-label="Step 1 of 3: Location Selection">
            <div className='step-dot active' aria-label="Current step: Location"></div>
            <div className='step-dot' aria-label="Next: Element"></div>
            <div className='step-dot' aria-label="Final: Elemental"></div>
          </div>
        </div>

        <div className='location-section'>
          <div className='location-grid' role="group" aria-label="Battle locations">
            {locations.map(([key, location], index) => {
              const isAffordable = canAffordLocation(player.mana, key as Location);
              const isSelected = player.selectedLocation === key;
              const isFocused = focusedIndex === index;

              return (
                <button
                  key={key}
                  className={`location-btn ${isSelected ? 'selected' : ''} ${isFocused && showFocusOutlines ? 'focused' : ''}`}
                  data-location={key}
                  onClick={() => isAffordable && onSelectLocation(key as Location)}
                  onMouseEnter={() => setShowTooltip(key)}
                  onMouseLeave={() => setShowTooltip(null)}
                  onFocus={() => setFocusedIndex(index)}
                  disabled={!isAffordable}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isSelected}
                  aria-label={`${location.name} location, ${location.mana} mana cost${!isAffordable ? ', insufficient mana' : ''}${isSelected ? ', currently selected' : ''}`}
                  aria-describedby={showTooltip === key ? `tooltip-${key}` : undefined}
                  style={{
                    opacity: isAffordable ? 1 : 0.5,
                    cursor: isAffordable ? 'pointer' : 'not-allowed',
                    transform: isFocused && showFocusOutlines ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                    outline: isFocused && showFocusOutlines ? '2px solid var(--secondary-gold)' : 'none',
                    outlineOffset: isFocused && showFocusOutlines ? '2px' : '0',
                  }}
                >
                  <span className='location-emoji' aria-hidden="true">{location.emoji}</span>
                  <div className='location-name'>{location.name}</div>
                  <div className='location-mana'>{location.mana} Mana</div>

                  {!isAffordable && (
                    <div className="insufficient-mana-indicator" aria-label="Insufficient mana">
                      <span>💰</span>
                      <small>Need {location.mana - player.mana} more mana</small>
                    </div>
                  )}

                  {showTooltip === key && (
                    <div
                      id={`tooltip-${key}`}
                      className="location-tooltip"
                      role="tooltip"
                      aria-live="polite"
                    >
                      {getLocationTooltip(key as Location)}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="keyboard-hint" aria-live="polite">
            <small>💡 Use arrow keys to navigate, Enter to select, or click with mouse</small>
          </div>
        </div>
      </div>
    );
  };

  // Element selection keyboard handler
  useEffect(() => {
    if (gamePhase === 'elementSelection') {
      setFocusedIndex(2); // Focus on Fire element (third element) by default

      const elements = Object.entries(ELEMENTS);
      const handleKeyboardNav = (e: KeyboardEvent) =>
        handleKeyDown(e, elements, ([key]) => {
          onSelectElement(key as Element);
          onStartMatchmaking();
        }, onReturnToLocationSelection);

      document.addEventListener('keydown', handleKeyboardNav);
      return () => document.removeEventListener('keydown', handleKeyboardNav);
    }
    return undefined;
  }, [gamePhase, handleKeyDown, onSelectElement, onReturnToLocationSelection, onStartMatchmaking]);

  const renderElementSelection = () => {
    const isFreeLocation = player.selectedLocation === 'free';
    const elements = Object.entries(ELEMENTS);

    return (
      <div className='battle-section' role="main" aria-labelledby="element-title">
        <div className='battle-navigation'>
          <button
            className='back-btn'
            onClick={onReturnToLocationSelection}
            aria-label="Return to location selection"
            tabIndex={0}
          >
            ← Back
          </button>
          <div className='battle-progress' aria-live="polite">
            {isFreeLocation ? 'Step 2 of 2' : 'Step 2 of 3'}
          </div>
        </div>

        <div className='battle-header'>
          <div className='battle-icon' aria-hidden="true">⚔️</div>
          <h3 id="element-title" className='battle-title'>Element Selection</h3>
          <p className='battle-subtitle'>
            Choose the element that will guide your battle
          </p>

          <div className='battle-step-indicator' role="progressbar"
               aria-valuenow={2} aria-valuemin={1}
               aria-valuemax={3}
               aria-label="Step 2 of 3: Element Selection">
            <div className='step-dot completed' aria-label="Completed: Location"></div>
            <div className='step-dot active' aria-label="Current step: Element"></div>
            <div className='step-dot' aria-label="Next: Elemental"></div>
          </div>
        </div>

        <div className='element-grid' role="group" aria-label="Battle elements">
          {elements.map(([key, element], index) => {
            const isSelected = player.selectedElement === key;
            const isFocused = focusedIndex === index;

            return (
              <button
                key={key}
                className={`element-btn ${isSelected ? 'selected' : ''} ${isFocused ? 'focused' : ''}`}
                data-element={key}
                onClick={() => {
                  onSelectElement(key as Element);
                  onStartMatchmaking();
                }}
                onMouseEnter={() => setShowTooltip(key)}
                onMouseLeave={() => setShowTooltip(null)}
                onFocus={() => setFocusedIndex(index)}
                tabIndex={0}
                role="button"
                aria-pressed={isSelected}
                aria-label={`${element.name} element${isSelected ? ', currently selected' : ''}`}
                aria-describedby={showTooltip === key ? `element-tooltip-${key}` : undefined}
                style={{
                  transform: isFocused ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.2s ease',
                  outline: isFocused ? '2px solid var(--secondary-gold)' : 'none',
                  outlineOffset: isFocused ? '2px' : '0',
                }}
              >
                <span className='element-emoji' aria-hidden="true">{element.emoji}</span>
                <div className='element-name'>{element.name}</div>

                {showTooltip === key && (
                  <div
                    id={`element-tooltip-${key}`}
                    className="element-tooltip"
                    role="tooltip"
                    aria-live="polite"
                  >
                    <strong>{element.name} Element</strong>
                    <p>{getElementDescription(key as Element)}</p>
                  </div>
                )}
              </button>
            );
          })}
        </div>


        <div className="keyboard-hint" aria-live="polite">
          <small>💡 Arrow keys to navigate, Enter to select, Backspace to go back</small>
        </div>
      </div>
    );
  };

  // Elemental selection keyboard handler
  useEffect(() => {
    if (gamePhase === 'elementalSelection' && player.selectedElement) {
      setFocusedIndex(0); // Reset focus when entering this phase
      const selectedElement = player.selectedElement;
      const ownedElementals = Object.values(
        player.elementalCollection.elementals
      ).filter(e => e.isOwned && e.element === selectedElement);

      const handleKeyboardNav = (e: KeyboardEvent) =>
        handleKeyDown(e, ownedElementals, (elemental) => {
          if (!isElementalOnCooldown(elemental)) {
            onSelectElemental(elemental.rarity);
          }
        }, onReturnToElementSelection);

      document.addEventListener('keydown', handleKeyboardNav);
      return () => document.removeEventListener('keydown', handleKeyboardNav);
    }
    return undefined;
  }, [gamePhase, player.selectedElement, player.elementalCollection.elementals, handleKeyDown, onSelectElemental]);

  const renderElementalSelection = () => {
    if (!player.selectedElement) return null;
    const selectedElement = player.selectedElement;

    // Get owned elementals for the selected element
    const ownedElementals = Object.values(
      player.elementalCollection.elementals
    ).filter(e => e.isOwned && e.element === selectedElement);

    return (
      <div className='battle-section' role="main" aria-labelledby="elemental-title">
        <div className='battle-navigation'>
          <button
            className='back-btn'
            onClick={onReturnToElementSelection}
            aria-label="Return to element selection"
            tabIndex={0}
          >
            ← Back
          </button>
          <div className='battle-progress' aria-live="polite">Step 3 of 3</div>
        </div>

        <div className='battle-header'>
          <div className='battle-icon' aria-hidden="true">🌟</div>
          <h3 id="elemental-title" className='battle-title'>Elemental Selection</h3>
          <p className='battle-subtitle'>
            Select a powerful elemental from your {ELEMENTS[selectedElement].name} collection
          </p>

          <div className='battle-step-indicator' role="progressbar"
               aria-valuenow={3} aria-valuemin={1} aria-valuemax={3}
               aria-label="Step 3 of 3: Elemental Selection">
            <div className='step-dot completed' aria-label="Completed: Location"></div>
            <div className='step-dot completed' aria-label="Completed: Element"></div>
            <div className='step-dot active' aria-label="Current step: Elemental"></div>
          </div>
        </div>

        {ownedElementals.length > 0 ? (
          <div className='elemental-grid' role="group" aria-label={`${ELEMENTS[selectedElement].name} elementals`}>
            {ownedElementals.map((elemental, index) => {
              const elementalData = getElementalData(selectedElement, elemental.rarity);
              const isSelected = player.selectedElemental === elemental.rarity;
              const isOnCooldown = isElementalOnCooldown(elemental);
              const cooldownRemaining = getElementalCooldownRemaining(elemental);
              const cooldownText = formatCooldownTime(cooldownRemaining);
              const isFocused = focusedIndex === index;
              const protection = Math.round(elementalData.protection * 100);

              // Force re-render for real-time cooldown updates
              void cooldownUpdateTrigger;

              return (
                <button
                  key={`${elemental.id}-${cooldownUpdateTrigger}`}
                  className={`elemental-btn ${elemental.rarity} ${isSelected ? 'selected' : ''} ${isOnCooldown ? 'on-cooldown' : ''} ${isFocused && showFocusOutlines ? 'focused' : ''}`}
                  data-elemental={elemental.rarity}
                  onClick={() => !isOnCooldown && onSelectElemental(elemental.rarity)}
                  onFocus={() => setFocusedIndex(index)}
                  disabled={isOnCooldown}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isSelected}
                  aria-label={`
                    ${elementalData.name},
                    ${elementalData.rarity} rarity,
                    level ${elemental.level},
                    ${protection}% protection,
                    ${isOnCooldown ? `on cooldown for ${cooldownText}` : 'available'},
                    ${isSelected ? 'currently selected' : ''}
                  `.trim().replace(/\s+/g, ' ')}
                  aria-describedby={`elemental-stats-${elemental.id}`}
                  style={{
                    cursor: isOnCooldown ? 'not-allowed' : 'pointer',
                    transform: isFocused && showFocusOutlines ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                    outline: isFocused && showFocusOutlines ? '2px solid var(--secondary-gold)' : 'none',
                    outlineOffset: isFocused && showFocusOutlines ? '2px' : '0',
                  }}
                >
                  <span className='elemental-emoji' aria-hidden="true">{elementalData.emoji}</span>
                  <div className='elemental-info'>
                    <div className='elemental-rarity-badge' aria-label={`${elementalData.rarity} rarity`}>
                      {elementalData.rarity}
                    </div>
                    <div className='elemental-level' aria-label={`Level ${elemental.level}`}>
                      Lv.{elemental.level}
                    </div>
                    <div className='elemental-protection' aria-label={`${protection}% protection`}>
                      🛡️ {protection}%
                    </div>
                    <div className='elemental-usage' aria-label={`Used ${elemental.timesUsed} times`}>
                      ⚔️ {elemental.timesUsed}
                    </div>

                    {isOnCooldown && (
                      <div className='cooldown-indicator' aria-live="polite">
                        <span className='cooldown-icon' aria-hidden="true">⏱️</span>
                        <span className='cooldown-text' aria-label={`Cooldown remaining: ${cooldownText}`}>
                          {cooldownText}
                        </span>
                        <div
                          className="cooldown-progress-bar"
                          role="progressbar"
                          aria-valuenow={Math.round((1 - cooldownRemaining / (getElementalCooldownHours(elemental.rarity) * 60 * 60 * 1000)) * 100)}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label="Cooldown progress"
                        >
                          <div
                            className="cooldown-progress-fill"
                            style={{
                              width: `${Math.round((1 - cooldownRemaining / (getElementalCooldownHours(elemental.rarity) * 60 * 60 * 1000)) * 100)}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div id={`elemental-stats-${elemental.id}`} className="sr-only">
                    Detailed stats: {elementalData.name}, {elementalData.rarity} rarity,
                    Level {elemental.level}, {protection}% damage protection,
                    Used in {elemental.timesUsed} battles
                    {isOnCooldown && `, cooldown expires in ${cooldownText}`}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className='no-elementals' role="alert" aria-live="polite">
            <div className='no-elementals-icon' aria-hidden="true">📦</div>
            <h3>No {ELEMENTS[selectedElement].name} Elementals Available</h3>
            <p>
              You don&apos;t have any {ELEMENTS[selectedElement].name}{' '}
              elementals in your collection yet.
            </p>
            <p>💡 <strong>Tip:</strong> Win battles to collect more elementals, or try a different element!</p>
            <button
              className="secondary-btn"
              onClick={onReturnToElementSelection}
              aria-label="Choose a different element"
            >
              🔄 Choose Different Element
            </button>
          </div>
        )}

        <button
          className='battle-btn'
          onClick={onStartBattle}
          aria-label="Start battle with selected elemental"
          tabIndex={0}
        >
          ⚔️ Start Battle
        </button>

        <div className="keyboard-hint" aria-live="polite">
          <small>💡 Arrow keys to navigate, Enter to select, Backspace to go back | Elementals on cooldown will recover over time</small>
        </div>
      </div>
    );
  };

  return (
    <>
      {gamePhase === 'menu' && renderLocationSelection()}
      {gamePhase === 'elementSelection' && renderElementSelection()}
      {gamePhase === 'elementalSelection' && renderElementalSelection()}

      {/* Fallback for unknown phases */}
      {!['menu', 'elementSelection', 'elementalSelection', 'result'].includes(
        gamePhase
      ) && (
        <div style={{ textAlign: 'center', color: 'var(--error)' }}>
          Unknown game phase: {gamePhase}
        </div>
      )}

      {/* Modals */}
    </>
  );
};

export default BattleComponent;
