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
  const [showElementsTitle, setShowElementsTitle] = useState(false);
  const [showElementalsTitle, setShowElementalsTitle] = useState(false);
  const [showClashTitle, setShowClashTitle] = useState(false);

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
      // Intro phase - show opponents (более длительное знакомство)
      { delay: 800, action: () => setPhase('intro') },

      // Elements phase (поэтапное появление)
      { delay: 3500, action: () => setPhase('elements') },
      { delay: 4000, action: () => setShowElementsTitle(true) },
      { delay: 5000, action: () => setShowPlayerElement(true) },
      { delay: 6500, action: () => setShowOpponentElement(true) },

      // Пауза для восприятия элементов
      {
        delay: 8500,
        action: () => {
          /* Пауза для восприятия элементов */
        },
      },

      // Elementals phase (более драматично)
      { delay: 9000, action: () => setPhase('elementals') },
      { delay: 9500, action: () => setShowElementalsTitle(true) },
      { delay: 10500, action: () => setShowPlayerElemental(true) },
      { delay: 12000, action: () => setShowOpponentElemental(true) },

      // Пауза перед финальным столкновением
      {
        delay: 14000,
        action: () => {
          /* Пауза перед финальным столкновением */
        },
      },

      // Clash phase (более эпично)
      { delay: 14500, action: () => setPhase('clash') },
      { delay: 15000, action: () => setShowClashTitle(true) },
      { delay: 15500, action: () => setShowClash(true) },

      // Больше времени на финальный эффект
      { delay: 18000, action: onAnimationComplete },
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
                  <div className='profile-elemental'>
                    {playerElemental ? (
                      <div
                        className={`elemental-card-compact rarity-${playerElemental.rarity.toLowerCase()}`}
                      >
                        <div className='elemental-protection'>
                          Protection{' '}
                          {Math.round(playerElemental.protection * 100)}%
                        </div>
                      </div>
                    ) : (
                      <div className='no-elemental-card'>
                        <div className='no-protection-text'>No Protection</div>
                      </div>
                    )}
                  </div>
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
                  <div className='profile-elemental'>
                    {opponentElemental ? (
                      <div
                        className={`elemental-card-compact rarity-${opponentElemental.rarity.toLowerCase()}`}
                      >
                        <div className='elemental-protection'>
                          Protection{' '}
                          {Math.round(opponentElemental.protection * 100)}%
                        </div>
                      </div>
                    ) : (
                      <div className='no-elemental-card'>
                        <div className='no-protection-text'>No Protection</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Elements Phase */}
        {phase === 'elements' && (
          <div className='elements-battle'>
            <div
              className={`battle-title ${showElementsTitle ? 'fade-in' : ''}`}
            >
              ⚔️ Element Battle! ⚔️
            </div>
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
            <div
              className={`battle-title ${showElementalsTitle ? 'fade-in' : ''}`}
            >
              🛡️ Elemental Guardians! 🛡️
            </div>
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
            <div
              className={`clash-text ${showClashTitle ? 'fade-in-delayed' : ''}`}
            >
              💥 Battle Complete! 💥
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BattleAnimation;
