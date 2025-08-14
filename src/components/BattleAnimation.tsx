import React, { useEffect, useState } from 'react';
import { ELEMENTS, getElementalData } from '../gameLogic';
import { Element, GameState } from '../types';

interface BattleAnimationProps {
  gameState: GameState;
  opponentElement: Element;
  onAnimationComplete: () => void;
}

const BattleAnimation: React.FC<BattleAnimationProps> = ({
  gameState,
  opponentElement,
  onAnimationComplete,
}) => {
  const [phase, setPhase] = useState<
    'intro' | 'elements' | 'elementals' | 'clash' | 'result'
  >('intro');
  const [showPlayerElement, setShowPlayerElement] = useState(false);
  const [showOpponentElement, setShowOpponentElement] = useState(false);
  const [showPlayerElemental, setShowPlayerElemental] = useState(false);
  const [showOpponentElemental, setShowOpponentElemental] = useState(false);
  const [showClash, setShowClash] = useState(false);

  const { player, currentOpponent } = gameState;
  const playerElement = player.selectedElement as Element;
  const playerElemental = player.selectedElemental
    ? getElementalData(playerElement, player.selectedElemental)
    : null;
  const opponentElemental = currentOpponent?.elemental
    ? getElementalData(opponentElement, currentOpponent.elemental)
    : null;

  useEffect(() => {
    const timeline = [
      // Intro phase - show opponents
      { delay: 500, action: () => setPhase('intro') },

      // Elements phase
      { delay: 2000, action: () => setPhase('elements') },
      { delay: 2500, action: () => setShowPlayerElement(true) },
      { delay: 3000, action: () => setShowOpponentElement(true) },

      // Elementals phase
      { delay: 4000, action: () => setPhase('elementals') },
      { delay: 4500, action: () => setShowPlayerElemental(true) },
      { delay: 5000, action: () => setShowOpponentElemental(true) },

      // Clash phase
      { delay: 6000, action: () => setPhase('clash') },
      { delay: 6500, action: () => setShowClash(true) },

      // Complete
      { delay: 8000, action: onAnimationComplete },
    ];

    const timeouts = timeline.map(({ delay, action }) =>
      setTimeout(action, delay)
    );

    return () => timeouts.forEach(clearTimeout);
  }, [onAnimationComplete]);

  return (
    <div className='battle-animation'>
      <div className='battle-arena'>
        {/* Background Effects */}
        <div className='battle-bg-effects'>
          <div className='energy-particles'></div>
          <div className='magic-circles'></div>
        </div>

        {/* Intro Phase - Show Opponents */}
        {phase === 'intro' && (
          <div className='battle-intro'>
            <div className='opponent-profiles'>
              <div className='player-profile slide-in-left'>
                <div className='profile-avatar'>👤</div>
                <div className='profile-info'>
                  <div className='profile-name'>{player.name}</div>
                  <div className='profile-level'>Level {player.level}</div>
                </div>
              </div>

              <div className='vs-indicator pulse'>VS</div>

              <div className='opponent-profile slide-in-right'>
                <div className='profile-avatar'>{currentOpponent?.avatar}</div>
                <div className='profile-info'>
                  <div className='profile-name'>{currentOpponent?.name}</div>
                  <div className='profile-level'>
                    Level {currentOpponent?.level}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Elements Phase */}
        {phase === 'elements' && (
          <div className='elements-battle'>
            <div className='battle-title fade-in'>Element Battle!</div>
            <div className='elements-arena'>
              <div
                className={`element-fighter player ${showPlayerElement ? 'enter-battle' : ''}`}
              >
                <div
                  className='element-orb'
                  style={{
                    background: `radial-gradient(circle, ${ELEMENTS[playerElement].color}40, ${ELEMENTS[playerElement].color}80)`,
                    boxShadow: `0 0 30px ${ELEMENTS[playerElement].color}60`,
                  }}
                >
                  <span className='element-emoji'>
                    {ELEMENTS[playerElement].emoji}
                  </span>
                </div>
                <div className='element-name'>
                  {ELEMENTS[playerElement].name}
                </div>
              </div>

              <div className='battle-lightning'>⚡</div>

              <div
                className={`element-fighter opponent ${showOpponentElement ? 'enter-battle' : ''}`}
              >
                <div
                  className='element-orb'
                  style={{
                    background: `radial-gradient(circle, ${ELEMENTS[opponentElement].color}40, ${ELEMENTS[opponentElement].color}80)`,
                    boxShadow: `0 0 30px ${ELEMENTS[opponentElement].color}60`,
                  }}
                >
                  <span className='element-emoji'>
                    {ELEMENTS[opponentElement].emoji}
                  </span>
                </div>
                <div className='element-name'>
                  {ELEMENTS[opponentElement].name}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Elementals Phase */}
        {phase === 'elementals' && (
          <div className='elementals-battle'>
            <div className='battle-title fade-in'>Elemental Guardians!</div>
            <div className='elementals-arena'>
              <div
                className={`elemental-fighter player ${showPlayerElemental ? 'summon-elemental' : ''}`}
              >
                {playerElemental ? (
                  <>
                    <div className='elemental-aura player-aura'>
                      <span className='elemental-emoji'>
                        {playerElemental.emoji}
                      </span>
                    </div>
                    <div className='elemental-info'>
                      <div className='elemental-name'>
                        {playerElemental.name}
                      </div>
                      <div className='protection-bar'>
                        <div
                          className='protection-fill'
                          style={{
                            width: `${playerElemental.protection * 100}%`,
                          }}
                        ></div>
                        <span className='protection-text'>
                          {Math.round(playerElemental.protection * 100)}%
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className='no-elemental'>
                    <span className='no-protection-icon'>❌</span>
                    <div className='elemental-name'>No Guardian</div>
                  </div>
                )}
              </div>

              <div className='elemental-vs'>🛡️</div>

              <div
                className={`elemental-fighter opponent ${showOpponentElemental ? 'summon-elemental' : ''}`}
              >
                {opponentElemental ? (
                  <>
                    <div className='elemental-aura opponent-aura'>
                      <span className='elemental-emoji'>
                        {opponentElemental.emoji}
                      </span>
                    </div>
                    <div className='elemental-info'>
                      <div className='elemental-name'>
                        {opponentElemental.name}
                      </div>
                      <div className='protection-bar'>
                        <div
                          className='protection-fill opponent-fill'
                          style={{
                            width: `${opponentElemental.protection * 100}%`,
                          }}
                        ></div>
                        <span className='protection-text'>
                          {Math.round(opponentElemental.protection * 100)}%
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className='no-elemental'>
                    <span className='no-protection-icon'>❌</span>
                    <div className='elemental-name'>No Guardian</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Clash Phase */}
        {phase === 'clash' && (
          <div className='final-clash'>
            <div className={`clash-explosion ${showClash ? 'explode' : ''}`}>
              <div className='explosion-ring'></div>
              <div className='explosion-core'>💥</div>
              <div className='explosion-sparks'>
                <span>✨</span>
                <span>⭐</span>
                <span>💫</span>
                <span>🌟</span>
              </div>
            </div>
            <div className='clash-text fade-in-delayed'>Battle Complete!</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BattleAnimation;
