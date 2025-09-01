import React from 'react';
import {
    ELEMENTS,
    LOCATIONS,
    canAffordLocation,
    formatCooldownTime,
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

  const renderLocationSelection = () => {
    return (
      <div className='battle-section'>
        <div className='battle-header'>
          <div className='battle-icon'>🏟️</div>
          <h3 className='battle-title'>Battle Arena</h3>
          <p className='battle-subtitle'>Choose Your Battle Location</p>

          <div className='battle-step-indicator'>
            <div className='step-dot active'></div>
            <div className='step-dot'></div>
            <div className='step-dot'></div>
          </div>
        </div>

        <div className='location-section'>
          <div className='location-grid'>
            {Object.entries(LOCATIONS).map(([key, location]) => (
              <div
                key={key}
                className={`location-btn ${player.selectedLocation === key ? 'selected' : ''}`}
                onClick={() =>
                  canAffordLocation(player.mana, key as Location) &&
                  onSelectLocation(key as Location)
                }
                style={{
                  opacity: canAffordLocation(player.mana, key as Location)
                    ? 1
                    : 0.5,
                  cursor: canAffordLocation(player.mana, key as Location)
                    ? 'pointer'
                    : 'not-allowed',
                }}
              >
                <span className='location-emoji'>{location.emoji}</span>
                <div className='location-name'>{location.name}</div>
                <div className='location-mana'>{location.mana} Mana</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderElementSelection = () => {
    const isFreeLocation = player.selectedLocation === 'free';

    return (
      <div className='battle-section'>
        <div className='battle-navigation'>
          <button className='back-btn' onClick={onReturnToLocationSelection}>
            ←
          </button>
          <div className='battle-progress'>
            {isFreeLocation ? 'Step 2 of 2' : 'Step 2 of 3'}
          </div>
        </div>

        <div className='battle-header'>
          <div className='battle-icon'>⚔️</div>
          <h3 className='battle-title'>Element</h3>
          <p className='battle-subtitle'>
            Choose the element that will guide your battle
          </p>

          <div className='battle-step-indicator'>
            <div className='step-dot completed'></div>
            <div className='step-dot active'></div>
            {!isFreeLocation && <div className='step-dot'></div>}
          </div>
        </div>

        <div className='element-grid'>
          {Object.entries(ELEMENTS).map(([key, element]) => (
            <div
              key={key}
              className={`element-btn ${player.selectedElement === key ? 'selected' : ''}`}
              onClick={() => onSelectElement(key as Element)}
            >
              <span className='element-emoji'>{element.emoji}</span>
              <div className='element-name'>{element.name}</div>
            </div>
          ))}
        </div>

        <button
          className='battle-btn'
          disabled={!player.selectedElement}
          onClick={onStartMatchmaking}
        >
          {isFreeLocation ? '⚔️ Start Battle' : '🌟 Select Elemental'}
        </button>
      </div>
    );
  };

  const renderElementalSelection = () => {
    if (!player.selectedElement) return null;
    const selectedElement = player.selectedElement;

    // Get owned elementals for the selected element
    const ownedElementals = Object.values(
      player.elementalCollection.elementals
    ).filter(e => e.isOwned && e.element === selectedElement);

    return (
      <div className='battle-section'>

        <div className='battle-navigation'>
          <button className='back-btn' onClick={onReturnToElementSelection}>
            ←
          </button>
          <div className='battle-progress'>Step 3 of 3</div>
        </div>

        <div className='battle-header'>
          <div className='battle-icon'>🌟</div>
          <h3 className='battle-title'>Elemental</h3>
          <p className='battle-subtitle'>
            Select a powerful elemental from your collection
          </p>

          <div className='battle-step-indicator'>
            <div className='step-dot completed'></div>
            <div className='step-dot completed'></div>
            <div className='step-dot active'></div>
          </div>
        </div>

        {ownedElementals.length > 0 ? (
          <div className='elemental-grid'>
            {ownedElementals.map(elemental => {
              const elementalData = getElementalData(
                selectedElement,
                elemental.rarity
              );
              const isSelected = player.selectedElemental === elemental.rarity;
              const isOnCooldown = isElementalOnCooldown(elemental);
              const cooldownRemaining =
                getElementalCooldownRemaining(elemental);
              const cooldownText = formatCooldownTime(cooldownRemaining);

              return (
                <div
                  key={elemental.id}
                  className={`elemental-btn ${elemental.rarity} ${isSelected ? 'selected' : ''} ${isOnCooldown ? 'on-cooldown' : ''}`}
                  onClick={() =>
                    !isOnCooldown && onSelectElemental(elemental.rarity)
                  }
                  style={{ cursor: isOnCooldown ? 'not-allowed' : 'pointer' }}
                >
                  <span className='elemental-emoji'>{elementalData.emoji}</span>
                  <div className='elemental-info'>
                    <div className='elemental-rarity-badge'>
                      {elementalData.rarity}
                    </div>
                    <div className='elemental-level'>Lv.{elemental.level}</div>
                    {isOnCooldown && (
                      <div className='cooldown-indicator'>
                        <span className='cooldown-text'>{cooldownText}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className='no-elementals'>
            <div className='no-elementals-icon'>📦</div>
            <h3>No Elementals Available</h3>
            <p>
              You don&apos;t have any {ELEMENTS[selectedElement].name}{' '}
              elementals in your collection.
            </p>
            <p>Win battles to collect more elementals!</p>
          </div>
        )}

        <button className='battle-btn' onClick={onStartBattle}>
          ⚔️ Start Battle
        </button>
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
