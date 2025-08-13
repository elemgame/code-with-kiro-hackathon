import React from 'react';
import { GameState, Element, Location, ElementalRarity } from '../types';
import { ELEMENTS, LOCATIONS, canAffordLocation, getAvailableElementals, getElementalData } from '../gameLogic';
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
  onReturnToMenu,
  onReturnToLocationSelection
}) => {
  const { player, currentOpponent, opponentElement, gamePhase } = gameState;
  
  // Debug logs
  console.log('BattleComponent render:', {
    gamePhase,
    selectedLocation: player.selectedLocation,
    selectedElement: player.selectedElement,
    mana: player.mana
  });

  const renderLocationSelection = () => (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        display: 'inline-block',
        fontSize: '12rem',
        marginTop: '0.25rem',
        marginBottom: '3rem',
        opacity: 0.8,
        padding: '0.1rem',
        lineHeight: 0.8
      }}>🏟️</div>
      <h3 style={{ color: 'var(--secondary-gold)', marginBottom: '0.75rem' }}>
        Ready for Battle
      </h3>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          fontSize: '0.9rem',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          textAlign: 'center',
          marginBottom: '1rem'
        }}>
          Choose Your Battle Location
        </div>
        <div className="location-grid">
          {Object.entries(LOCATIONS).map(([key, location]) => (
            <div
              key={key}
              className={`location-btn ${player.selectedLocation === key ? 'selected' : ''}`}
              onClick={() => canAffordLocation(player.mana, key as Location) && onSelectLocation(key as Location)}
              style={{
                opacity: canAffordLocation(player.mana, key as Location) ? 1 : 0.5,
                cursor: canAffordLocation(player.mana, key as Location) ? 'pointer' : 'not-allowed'
              }}
            >
              <span className="location-emoji">{location.emoji}</span>
              <div className="location-name">{location.name}</div>
              <div className="location-mana">{location.mana} Mana</div>
            </div>
          ))}
        </div>
      </div>

      <button
        className="btn-primary"
        disabled={true}
      >
        🔮 Choose Location First
      </button>
    </div>
  );

  const renderElementSelection = () => (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem',
        position: 'relative'
      }}>
        <button
          onClick={onReturnToLocationSelection}
          style={{
            position: 'absolute',
            left: 0,
            background: 'transparent',
            border: '1px solid var(--text-muted)',
            color: 'var(--text-muted)',
            padding: '0.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            transition: 'all 0.3s ease'
          }}
        >
          ← Back
        </button>
        <div style={{
          fontSize: '0.9rem',
          fontWeight: 600,
          color: 'var(--text-secondary)'
        }}>
          Choose Your Element
        </div>
      </div>

      <div className="element-grid" style={{ marginBottom: '2rem' }}>
        {Object.entries(ELEMENTS).map(([key, element]) => (
          <div
            key={key}
            className={`element-btn ${player.selectedElement === key ? 'selected' : ''}`}
            onClick={() => onSelectElement(key as Element)}
          >
            <span className="element-emoji">{element.emoji}</span>
            <div className="element-name">{element.name}</div>
          </div>
        ))}
      </div>

      <button
        className="btn-primary"
        onClick={onStartMatchmaking}
        disabled={!player.selectedElement}
      >
        {player.selectedElement && player.selectedLocation ?
          `🔮 Seek Challenger (${LOCATIONS[player.selectedLocation].mana} mana)` :
          '🔮 Choose Element First'}
      </button>
    </div>
  );

  const renderBattleDisplay = () => (
    <div style={{ textAlign: 'center' }}>
      <div className="battle-display">
        <div className="battle-choice">
          <div className="battle-emoji">
            {player.selectedElement ? ELEMENTS[player.selectedElement].emoji : '❓'}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>You</div>
        </div>
        <div className="battle-vs">VS</div>
        <div className="battle-choice">
          <div className="battle-emoji">
            {opponentElement ? ELEMENTS[opponentElement].emoji : '❓'}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
            {currentOpponent?.name || 'Opponent'}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <main style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Quick Stats Bar */}
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>💰</span>
              <div>
                <div style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase'
                }}>
                  Mana
                </div>
                <div style={{ fontWeight: 600, color: 'var(--secondary-gold)' }}>
                  {player.mana}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🏆</span>
              <div>
                <div style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase'
                }}>
                  Wins
                </div>
                <div style={{ fontWeight: 600, color: 'var(--success)' }}>
                  {player.wins}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🔥</span>
              <div>
                <div style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase'
                }}>
                  Streak
                </div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {player.winStreak}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>💀</span>
              <div>
                <div style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase'
                }}>
                  Defeats
                </div>
                <div style={{ fontWeight: 600, color: 'var(--error)' }}>
                  {player.losses}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Battle Arena Card */}
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="card-title">⚔️ Battle Arena</div>
          
          {/* Debug Info */}
          <div style={{ 
            fontSize: '0.8rem', 
            color: 'var(--text-muted)', 
            textAlign: 'center',
            marginBottom: '1rem',
            padding: '0.5rem',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '8px'
          }}>
            Phase: {gamePhase} | Location: {player.selectedLocation || 'none'} | Element: {player.selectedElement || 'none'}
          </div>

          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            {gamePhase === 'menu' && renderLocationSelection()}
            {gamePhase === 'elementSelection' && renderElementSelection()}
            {(gamePhase === 'battle' || gamePhase === 'result') && renderBattleDisplay()}
            
            {/* Fallback for unknown phases */}
            {!['menu', 'elementSelection', 'battle', 'result', 'matchmaking'].includes(gamePhase) && (
              <div style={{ textAlign: 'center', color: 'var(--error)' }}>
                Unknown game phase: {gamePhase}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <Modal
        isOpen={gamePhase === 'matchmaking'}
        onClose={() => { }}
        title="🔮 Seeking Opponent"
      >
        <div className="loading-spinner"></div>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <div style={{ marginBottom: '0.5rem' }}>Consulting the mystical orb...</div>
          <div style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>
            Finding a worthy challenger
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={gamePhase === 'elementalSelection' && currentOpponent !== null}
        onClose={() => { }}
        title="⚔️ Challenger Found"
      >
        {currentOpponent && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-gold))',
                border: '2px solid var(--secondary-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                margin: '0 auto 0.75rem',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)'
              }}>
                {currentOpponent.avatar}
              </div>
              <div style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '1.1rem',
                fontWeight: 600,
                color: 'var(--secondary-gold)',
                marginBottom: '0.25rem',
                textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)'
              }}>
                {currentOpponent.name}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                Level {currentOpponent.level} • {currentOpponent.rarity} Elemental
              </div>
            </div>

            {/* Elemental Selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                textAlign: 'center',
                marginBottom: '1rem'
              }}>
                Choose Your {player.selectedElement ? ELEMENTS[player.selectedElement].name : ''} Elemental
              </div>
              {player.selectedElement && (
                <div className="elemental-grid">
                  {getAvailableElementals(player.selectedElement).map(rarity => {
                    const elemental = getElementalData(player.selectedElement!, rarity);
                    return (
                      <button
                        key={rarity}
                        className={`elemental-btn ${rarity} ${player.selectedElemental === rarity ? 'selected' : ''}`}
                        onClick={() => onSelectElemental(rarity)}
                      >
                        <div className="elemental-emoji">{elemental.emoji}</div>
                        <div className="elemental-name">{elemental.name}</div>
                        <div className="elemental-rarity">
                          {elemental.rarity} ({Math.round(elemental.protection * 100)}% protection)
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              className="btn-primary"
              onClick={onStartBattle}
              disabled={!player.selectedElemental}
              style={{ width: '100%', marginBottom: '0.75rem' }}
            >
              {player.selectedElemental ? '⚔️ Enter Battle' : '🔮 Choose Elemental'}
            </button>

            <button
              className="btn-secondary"
              onClick={() => {
                onSelectElemental('common');
                setTimeout(onStartBattle, 100);
              }}
              style={{ width: '100%' }}
            >
              ⚡ Fight Without Protection
            </button>
          </>
        )}
      </Modal>

      <Modal
        isOpen={gamePhase === 'battle'}
        onClose={() => { }}
        title="⚔️ Battle"
      >
        <div className="battle-display">
          <div className="battle-choice">
            <div className="battle-emoji">
              {player.selectedElement ? ELEMENTS[player.selectedElement].emoji : '❓'}
            </div>
            <div style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--secondary-gold)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              You
            </div>
          </div>
          <div className="battle-vs">VS</div>
          <div className="battle-choice">
            <div className="battle-emoji">
              {opponentElement ? ELEMENTS[opponentElement].emoji : '❓'}
            </div>
            <div style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--secondary-gold)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {currentOpponent?.name || 'Opponent'}
            </div>
          </div>
        </div>
        <div className="progress-dots">
          <div className="progress-dot active"></div>
          <div className="progress-dot active"></div>
          <div className="progress-dot active"></div>
        </div>
      </Modal>

      <Modal
        isOpen={gamePhase === 'result'}
        onClose={() => { }}
        title="⚔️ Battle Result"
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            {player.lastManaChange > 0 ? '🎉' : player.lastManaChange < 0 ? '💀' : '🤝'}
          </div>
          <div style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '1.8rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
            color: player.lastManaChange > 0 ? 'var(--success)' :
              player.lastManaChange < 0 ? 'var(--error)' : 'var(--text-primary)'
          }}>
            {player.lastManaChange > 0 ? 'Victory!' :
              player.lastManaChange < 0 ? 'Defeat!' : 'Draw!'}
          </div>
          <div style={{
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
            fontStyle: 'italic'
          }}>
            {player.lastManaChange > 0 ? `You defeated ${currentOpponent?.name}` :
              player.lastManaChange < 0 ? `${currentOpponent?.name} defeated you` :
                `You tied with ${currentOpponent?.name}`}
          </div>

          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Mana Change:</span>
              <span style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 600,
                color: player.lastManaChange > 0 ? 'var(--success)' :
                  player.lastManaChange < 0 ? 'var(--error)' : 'var(--text-primary)'
              }}>
                {player.lastManaChange > 0 ? '+' : ''}{player.lastManaChange}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>New Total:</span>
              <span style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                {player.mana}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Victory Streak:</span>
              <span style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 600,
                color: 'var(--secondary-gold)'
              }}>
                {player.winStreak}
              </span>
            </div>
          </div>

          <button className="btn-primary" onClick={onReturnToMenu} style={{ width: '100%' }}>
            🏰 Continue
          </button>
        </div>
      </Modal>
    </>
  );
};

export default BattleComponent;