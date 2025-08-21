import React from 'react';
import {
    ELEMENTS,
    LOCATIONS,
    canAffordLocation,
    getAvailableElementals,
    getAvailableMana,
    getElementalData,
} from '../gameLogic';
import { Element, ElementalRarity, GameState, Location } from '../types';
import Modal from './Modal';

interface BattleComponentProps {
  gameState: GameState;
  onSelectLocation: (location: Location) => void;
  onSelectElement: (element: Element) => void;
  onSelectElemental: (elemental: ElementalRarity) => void;
  onReturnToLocationSelection: () => void;
  onReturnToElementSelection: () => void;
  onStartMatchmaking: () => void;
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
  const { player, currentOpponent, opponentElement, gamePhase } = gameState;

  const renderLocationSelection = () => {
    return (
      <div className='battle-section'>
        <div className='mana-display'>
          <div className='mana-label'>Your Mana</div>
          <div className='mana-value'>
            {getAvailableMana(player.mana, player.selectedLocation)}
          </div>
        </div>

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
        <div className='mana-display'>
          <div className='mana-label'>Your Mana</div>
          <div className='mana-value'>
            {getAvailableMana(player.mana, player.selectedLocation)}
          </div>
        </div>

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
          {isFreeLocation ? '⚔️ Start Battle' : '🔮 Start Matchmaking'}
        </button>
      </div>
    );
  };

  const renderElementalSelection = () => {
    if (!player.selectedElement) return null;
    const availableElementals = getAvailableElementals(player.selectedElement);
    const selectedElement = player.selectedElement; // Сохраняем в переменную для TypeScript

    return (
      <div className='battle-section'>
        <div className='mana-display'>
          <div className='mana-label'>Your Mana</div>
          <div className='mana-value'>
            {getAvailableMana(player.mana, player.selectedLocation)}
          </div>
        </div>

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
            Select a powerful elemental to aid in battle
          </p>

          <div className='battle-step-indicator'>
            <div className='step-dot completed'></div>
            <div className='step-dot completed'></div>
            <div className='step-dot active'></div>
          </div>
        </div>

        <div className='elemental-grid'>
          {availableElementals.map(elemental => {
            const elementalData = getElementalData(selectedElement, elemental);
            return (
              <div
                key={elemental}
                className={`elemental-btn ${elemental} ${player.selectedElemental === elemental ? 'selected' : ''}`}
                onClick={() => onSelectElemental(elemental)}
              >
                <span className='elemental-emoji'>{elementalData.emoji}</span>
                <div className='elemental-rarity-badge'>
                  {elementalData.rarity}
                </div>
              </div>
            );
          })}
        </div>

        <button
          className='battle-btn'
          onClick={onStartBattle}
        >
          ⚔️ Start Battle
        </button>
      </div>
    );
  };

  const renderBattleDisplay = () => (
    <div className='battle-section'>
      <div className='mana-display'>
        <div className='mana-label'>Your Mana</div>
        <div className='mana-value'>
          {getAvailableMana(player.mana, player.selectedLocation)}
        </div>
      </div>

      <div className='battle-header'>
        <div className='battle-icon'>⚔️</div>
        <h3 className='battle-title'>Battle in Progress</h3>
        <p className='battle-subtitle'>
          Your elemental forces clash with the opponent
        </p>
      </div>

      <div className='battle-display'>
        <div className='battle-choice'>
          <div className='battle-emoji animate'>
            {player.selectedElement
              ? ELEMENTS[player.selectedElement].emoji
              : '❓'}
          </div>
          <div className='battle-player-name'>You</div>
        </div>
        <div className='battle-vs'>VS</div>
        <div className='battle-choice'>
          <div className='battle-emoji animate'>
            {opponentElement ? ELEMENTS[opponentElement].emoji : '❓'}
          </div>
          <div className='battle-player-name'>
            {currentOpponent?.name || 'Opponent'}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {gamePhase === 'menu' && renderLocationSelection()}
      {gamePhase === 'elementSelection' && renderElementSelection()}
      {gamePhase === 'elementalSelection' && renderElementalSelection()}
      {gamePhase === 'battle' && renderBattleDisplay()}

      {/* Fallback for unknown phases */}
      {![
        'menu',
        'elementSelection',
        'elementalSelection',
        'battle',
        'result',
        'matchmaking',
      ].includes(gamePhase) && (
        <div style={{ textAlign: 'center', color: 'var(--error)' }}>
          Unknown game phase: {gamePhase}
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={gamePhase === 'matchmaking'}
        onClose={() => {
          // Modal cannot be closed during matchmaking
        }}
        title='🔮 Seeking Opponent'
        className='loading-modal'
      >
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            Consulting the mystical orb...
          </div>
          <div style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>
            Finding a worthy challenger
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={gamePhase === 'battle'}
        onClose={() => {
          // Modal cannot be closed during battle
        }}
        title='⚔️ Battle'
      >
        <div className='battle-display'>
          <div className='battle-choice'>
            <div className='battle-emoji'>
              {player.selectedElement
                ? ELEMENTS[player.selectedElement].emoji
                : '❓'}
            </div>
            <div className='battle-player-name'>You</div>
          </div>
          <div className='battle-vs'>VS</div>
          <div className='battle-choice'>
            <div className='battle-emoji'>
              {opponentElement ? ELEMENTS[opponentElement].emoji : '❓'}
            </div>
            <div className='battle-player-name'>
              {currentOpponent?.name || 'Opponent'}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BattleComponent;
