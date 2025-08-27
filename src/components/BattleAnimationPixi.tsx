import * as PIXI from 'pixi.js';
import React, { useEffect, useRef, useState } from 'react';
import { Element, GameState } from '../types';

import BattleEffects from './BattleEffects';

interface BattleAnimationPixiProps {
  gameState: GameState;
  opponentElement: Element;
  onAnimationComplete: () => void;
  battleResult?: 'player' | 'opponent' | 'draw' | undefined;
}

const BattleAnimationPixi: React.FC<BattleAnimationPixiProps> = ({
  gameState,
  opponentElement,
  onAnimationComplete,
  battleResult,
}) => {
  const [phase, setPhase] = useState<
    'intro' | 'cards' | 'elementals' | 'result'
  >('intro');
  const [elementalPhase, setElementalPhase] = useState<
    'player' | 'opponent' | 'battle' | 'winner'
  >('player');
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const particlesRef = useRef<PIXI.Container | null>(null);

  // Element data
  const elementData = {
    fire: { emoji: '🔥', color: '#ff4757', name: 'Fire' },
    water: { emoji: '💧', color: '#3742fa', name: 'Water' },
    earth: { emoji: '🌍', color: '#2ed573', name: 'Earth' },
  };

  // Initialize PIXI application
  useEffect(() => {
    if (!canvasRef.current || !PIXI) return undefined;

    try {
      const app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x0a0a0a,
        antialias: true,
        resolution: Math.min(window.devicePixelRatio || 1, 2), // Limit resolution for performance
      });

      if (app.view && app.view instanceof HTMLCanvasElement) {
        canvasRef.current.appendChild(app.view);
      }

      appRef.current = app;

      // Create particle system
      const particles = new PIXI.Container();
      app.stage.addChild(particles);
      particlesRef.current = particles;

      // Create magic particles (reduced for mobile performance)
      const particleCount = isMobile ? 50 : 100;
      for (let i = 0; i < particleCount; i++) {
        const particle = new PIXI.Sprite(PIXI.Texture.WHITE);
        particle.width = particle.height = Math.random() * 2 + 0.5;
        particle.x = Math.random() * app.screen.width;
        particle.y = Math.random() * app.screen.height;
        particle.alpha = Math.random() * 0.5 + 0.1;
        particle.tint = 0xffffff;
        particles.addChild(particle);
      }

      // Animate particles
      const animateParticles = () => {
        particles.children.forEach(particle => {
          if (particle instanceof PIXI.Sprite) {
            particle.y -= 0.5;
            particle.alpha =
              Math.sin(Date.now() * 0.001 + particle.x * 0.01) * 0.3 + 0.2;

            if (particle.y < -10) {
              particle.y = app.screen.height + 10;
            }
          }
        });
      };

      app.ticker.add(animateParticles);

      return () => {
        if (app) {
          app.destroy(true);
        }
      };
    } catch (_error) {
      return undefined;
    }
  }, [isMobile]);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation timeline
  useEffect(() => {
    const timeoutIds: NodeJS.Timeout[] = [];

    // Check if both player and opponent have elementals
    const hasPlayerElemental = gameState.player.selectedElemental;
    const hasOpponentElemental = gameState.currentOpponent?.elemental;
    const shouldShowElementals = hasPlayerElemental && hasOpponentElemental;

    const timeline = [
      { delay: 2000, action: () => setPhase('intro') },
      { delay: 5000, action: () => setPhase('cards') },
      ...(shouldShowElementals
        ? [
            { delay: 9000, action: () => setPhase('elementals') },
            { delay: 21000, action: () => setPhase('result') },
            { delay: 25000, action: onAnimationComplete },
          ]
        : [
            { delay: 9000, action: () => setPhase('result') },
            { delay: 13000, action: onAnimationComplete },
          ]),
    ];

    timeline.forEach(({ delay, action }) => {
      const timeoutId = setTimeout(action, delay);
      timeoutIds.push(timeoutId);
    });

    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, [
    onAnimationComplete,
    gameState.player.selectedElemental,
    gameState.currentOpponent?.elemental,
  ]);

  // Elemental sub-phase timeline
  useEffect(() => {
    if (phase !== 'elementals') {
      setElementalPhase('player');
      return;
    }

    // Check if both player and opponent have elementals
    const hasPlayerElemental = gameState.player.selectedElemental;
    const hasOpponentElemental = gameState.currentOpponent?.elemental;
    const shouldShowElementals = hasPlayerElemental && hasOpponentElemental;

    if (!shouldShowElementals) {
      return;
    }

    const timeoutIds: NodeJS.Timeout[] = [];

    const elementalTimeline = [
      { delay: 0, action: () => setElementalPhase('player') },
      { delay: 2000, action: () => setElementalPhase('opponent') },
      { delay: 4000, action: () => setElementalPhase('battle') },
      { delay: 6000, action: () => setElementalPhase('winner') },
    ];

    elementalTimeline.forEach(({ delay, action }) => {
      const timeoutId = setTimeout(action, delay);
      timeoutIds.push(timeoutId);
    });

    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, [
    phase,
    gameState.player.selectedElemental,
    gameState.currentOpponent?.elemental,
  ]);

  // Create user card component
  const UserCard: React.FC<{
    element: Element;
    isAnimating?: boolean;
  }> = ({ element, isAnimating = false }) => {
    const elementInfo = elementData[element];

    return (
      <div
        className={`user-card ${isAnimating ? 'card-animate' : ''}`}
        style={{
          background: `linear-gradient(135deg, ${elementInfo.color}20 0%, ${elementInfo.color}10 100%)`,
          borderRadius: '10px',
          padding: isMobile ? '8px' : '10px',
          width: isMobile ? '120px' : '140px',
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Card glow effect */}
        <div
          className='card-glow'
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at center, ${elementInfo.color}30 0%, transparent 70%)`,
            borderRadius: '10px',
            animation: isAnimating
              ? 'glowPulse 1s ease-in-out infinite'
              : 'none',
          }}
        />

        {/* Element info */}
        <div
          style={{
            background: `${elementInfo.color}30`,
            padding: isMobile ? '6px' : '8px',
            borderRadius: '8px',
          }}
        >
          <div
            style={{
              fontSize: isMobile ? '1.5rem' : '2rem',
              marginBottom: '5px',
            }}
          >
            {elementInfo.emoji}
          </div>
          <div
            style={{ fontSize: isMobile ? '0.7rem' : '0.8rem', opacity: 0.9 }}
          >
            {elementInfo.name}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 10000,
        background:
          'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* PIXI Canvas */}
      <div ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />

      {/* Battle Effects */}
      <BattleEffects
        isActive={phase === 'elementals'}
        element={gameState.player.selectedElement || 'fire'}
      />

      {/* Animated background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)
          `,
          animation: 'pulse 4s ease-in-out infinite',
        }}
      />

      {/* Magic circles */}
      <div
        style={{
          position: 'absolute',
          width: isMobile ? '200px' : '300px',
          height: isMobile ? '200px' : '300px',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          animation: 'rotate 20s linear infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: isMobile ? '150px' : '250px',
          height: isMobile ? '150px' : '250px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '50%',
          animation: 'rotate 15s linear infinite reverse',
        }}
      />

      {/* Battle content */}
      <div
        style={{
          textAlign: 'center',
          color: 'white',
          zIndex: 1,
          width: '100%',
          maxWidth: '800px',
        }}
      >
        {phase === 'intro' && (
          <div style={{ animation: 'fadeIn 1s ease-in' }}>
            <h1
              style={{
                fontSize: isMobile ? '1.8rem' : '2.5rem',
                marginBottom: isMobile ? '1rem' : '1.5rem',
                textShadow: '0 0 20px rgba(255, 255, 255, 0.8)',
                background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                padding: isMobile ? '0 1rem' : '0',
              }}
            >
              ⚔️ BATTLE ⚔️
            </h1>
            <div
              style={{
                fontSize: isMobile ? '0.9rem' : '1rem',
                opacity: 0.8,
                padding: isMobile ? '0 1rem' : '0',
              }}
            >
              Prepare for the ultimate elemental clash!
            </div>
          </div>
        )}

        {phase === 'cards' && (
          <div style={{ animation: 'fadeIn 1s ease-in' }}>
            <h2
              style={{
                fontSize: isMobile ? '1.4rem' : '1.8rem',
                marginBottom: isMobile ? '1.5rem' : '2rem',
                padding: isMobile ? '0 1rem' : '0',
              }}
            >
              Champions Enter the Arena!
            </h2>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: isMobile ? '1.5rem' : '2.5rem',
                flexWrap: 'wrap',
                padding: isMobile ? '0 1rem' : '0',
              }}
            >
              <UserCard
                element={gameState.player.selectedElement || 'fire'}
                isAnimating={true}
              />

              <div
                style={{
                  fontSize: isMobile ? '1.5rem' : '2rem',
                  animation: 'pulse 1s ease-in-out infinite',
                  textShadow: '0 0 15px rgba(255, 255, 255, 0.8)',
                }}
              >
                ⚔️
              </div>

              <UserCard element={opponentElement} isAnimating={true} />
            </div>
          </div>
        )}

        {phase === 'elementals' && (
          <div style={{ animation: 'fadeIn 1s ease-in' }}>
            <h2
              style={{
                fontSize: isMobile ? '1.4rem' : '1.8rem',
                marginBottom: isMobile ? '1.5rem' : '2rem',
                padding: isMobile ? '0 1rem' : '0',
              }}
            >
              {elementalPhase === 'player' && 'Your Elemental Appears!'}
              {elementalPhase === 'opponent' && "Opponent's Elemental Appears!"}
              {elementalPhase === 'battle' && 'Elementals Battle!'}
              {elementalPhase === 'winner' && 'Battle Result!'}
            </h2>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: isMobile ? '1.5rem' : '3rem',
                flexWrap: 'wrap',
                padding: isMobile ? '0 1rem' : '0',
              }}
            >
              {/* Player's Elemental Card */}
              {gameState.player.selectedElemental && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '1rem',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(20px)',
                    animation:
                      elementalPhase === 'player'
                        ? 'elementalSummon 1s ease-in-out'
                        : elementalPhase === 'battle'
                          ? 'playerBattle 0.25s ease-in-out infinite'
                          : elementalPhase === 'winner'
                            ? battleResult === 'player'
                              ? 'winnerScale 1s ease-in-out'
                              : battleResult === 'opponent'
                                ? 'loserScale 1s ease-in-out'
                                : 'drawScale 1s ease-in-out'
                            : 'none',
                    width: isMobile ? '120px' : '160px',
                    height: isMobile ? '150px' : '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    opacity:
                      elementalPhase === 'player' ||
                      elementalPhase === 'battle' ||
                      elementalPhase === 'winner'
                        ? 1
                        : 0.3,
                    transform:
                      elementalPhase === 'player' ? 'scale(0)' : 'scale(1)',
                  }}
                >
                  {/* Win/Lose indicator */}
                  {elementalPhase === 'winner' && (
                    <div
                      style={{
                        position: 'absolute',
                        top: isMobile ? '-30px' : '-40px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: isMobile ? '1rem' : '1.2rem',
                        fontWeight: 'bold',
                        color:
                          battleResult === 'player'
                            ? '#10b981'
                            : battleResult === 'opponent'
                              ? '#ef4444'
                              : '#daa520',
                        textShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
                        animation: 'fadeIn 0.5s ease-in-out',
                        zIndex: 10,
                      }}
                    >
                      {battleResult === 'player'
                        ? 'WIN!'
                        : battleResult === 'opponent'
                          ? 'LOSE!'
                          : 'DRAW!'}
                    </div>
                  )}

                  {/* Rarity glow effect */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `radial-gradient(circle at center, ${
                        gameState.player.selectedElemental === 'common'
                          ? '#9ca3af40'
                          : gameState.player.selectedElemental === 'rare'
                            ? '#3b82f640'
                            : gameState.player.selectedElemental === 'epic'
                              ? '#8b5cf640'
                              : '#f59e0b40'
                      } 0%, transparent 70%)`,
                      borderRadius: '16px',
                    }}
                  />

                  {/* Elemental image */}
                  <img
                    src={`${process.env.PUBLIC_URL}/resources/elmental/${gameState.player.selectedElement || 'fire'}_${gameState.player.selectedElemental?.charAt(0).toUpperCase() + gameState.player.selectedElemental?.slice(1) || 'Common'}.png`}
                    alt={`${gameState.player.selectedElement || 'fire'} ${gameState.player.selectedElemental || 'common'}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.8))',
                      zIndex: 1,
                      position: 'absolute',
                      top: 0,
                      left: 0,
                    }}
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const emojiDiv =
                        target.nextElementSibling as HTMLDivElement;
                      if (emojiDiv) {
                        emojiDiv.style.display = 'block';
                      }
                    }}
                  />
                  <div
                    style={{
                      fontSize: isMobile ? '2rem' : '3rem',
                      marginBottom: isMobile ? '0.5rem' : '1rem',
                      filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.8))',
                      zIndex: 1,
                      display: 'none',
                    }}
                  >
                    {(() => {
                      const element =
                        gameState.player.selectedElement || 'fire';
                      const rarity = gameState.player.selectedElemental;
                      const elementalData = {
                        fire: {
                          common: '🔥',
                          rare: '🔥',
                          epic: '🔥',
                          immortal: '🔥',
                        },
                        water: {
                          common: '💧',
                          rare: '💧',
                          epic: '💧',
                          immortal: '💧',
                        },
                        earth: {
                          common: '🌍',
                          rare: '🌍',
                          epic: '🌍',
                          immortal: '🌍',
                        },
                      };
                      return elementalData[element][rarity];
                    })()}
                  </div>

                  {/* Rarity badge */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: isMobile ? '8px' : '12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      background:
                        gameState.player.selectedElemental === 'common'
                          ? '#9ca3af'
                          : gameState.player.selectedElemental === 'rare'
                            ? '#3b82f6'
                            : gameState.player.selectedElemental === 'epic'
                              ? '#8b5cf6'
                              : '#f59e0b',
                      color: 'white',
                      zIndex: 2,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    {gameState.player.selectedElemental}
                  </div>
                </div>
              )}

              {/* VS indicator */}
              <div
                style={{
                  fontSize: isMobile ? '1.5rem' : '2rem',
                  animation: 'pulse 1s ease-in-out infinite',
                  textShadow: '0 0 15px rgba(255, 255, 255, 0.8)',
                  color: '#ff6b6b',
                }}
              >
                ⚔️
              </div>

              {/* Opponent's Elemental Card */}
              {gameState.currentOpponent?.elemental && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '1rem',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(20px)',
                    animation:
                      elementalPhase === 'opponent'
                        ? 'elementalSummon 1s ease-in-out'
                        : elementalPhase === 'battle'
                          ? 'opponentBattle 0.25s ease-in-out infinite'
                          : elementalPhase === 'winner'
                            ? battleResult === 'opponent'
                              ? 'winnerScale 1s ease-in-out'
                              : battleResult === 'player'
                                ? 'loserScale 1s ease-in-out'
                                : 'drawScale 1s ease-in-out'
                            : 'none',
                    width: isMobile ? '120px' : '160px',
                    height: isMobile ? '150px' : '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    opacity:
                      elementalPhase === 'opponent' ||
                      elementalPhase === 'battle' ||
                      elementalPhase === 'winner'
                        ? 1
                        : 0.3,
                    transform:
                      elementalPhase === 'opponent' ? 'scale(0)' : 'scale(1)',
                  }}
                >
                  {/* Win/Lose indicator */}
                  {elementalPhase === 'winner' && (
                    <div
                      style={{
                        position: 'absolute',
                        top: isMobile ? '-30px' : '-40px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: isMobile ? '1rem' : '1.2rem',
                        fontWeight: 'bold',
                        color:
                          battleResult === 'opponent'
                            ? '#10b981'
                            : battleResult === 'player'
                              ? '#ef4444'
                              : '#daa520',
                        textShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
                        animation: 'fadeIn 0.5s ease-in-out',
                        zIndex: 10,
                      }}
                    >
                      {battleResult === 'opponent'
                        ? 'WIN!'
                        : battleResult === 'player'
                          ? 'LOSE!'
                          : 'DRAW!'}
                    </div>
                  )}

                  {/* Rarity glow effect */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `radial-gradient(circle at center, ${
                        gameState.currentOpponent.elemental === 'common'
                          ? '#9ca3af40'
                          : gameState.currentOpponent.elemental === 'rare'
                            ? '#3b82f640'
                            : gameState.currentOpponent.elemental === 'epic'
                              ? '#8b5cf640'
                              : '#f59e0b40'
                      } 0%, transparent 70%)`,
                      borderRadius: '16px',
                    }}
                  />

                  {/* Elemental image */}
                  <img
                    src={`${process.env.PUBLIC_URL}/resources/elmental/${opponentElement}_${gameState.currentOpponent.elemental?.charAt(0).toUpperCase() + gameState.currentOpponent.elemental?.slice(1) || 'Common'}.png`}
                    alt={`${opponentElement} ${gameState.currentOpponent.elemental || 'common'}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.8))',
                      zIndex: 1,
                      position: 'absolute',
                      top: 0,
                      left: 0,
                    }}
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const emojiDiv =
                        target.nextElementSibling as HTMLDivElement;
                      if (emojiDiv) {
                        emojiDiv.style.display = 'block';
                      }
                    }}
                  />
                  <div
                    style={{
                      fontSize: '3rem',
                      marginBottom: '1rem',
                      filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.8))',
                      zIndex: 1,
                      display: 'none',
                    }}
                  >
                    {(() => {
                      const element = opponentElement;
                      const rarity = gameState.currentOpponent.elemental;
                      const elementalData = {
                        fire: {
                          common: '🔥',
                          rare: '🔥',
                          epic: '🔥',
                          immortal: '🔥',
                        },
                        water: {
                          common: '💧',
                          rare: '💧',
                          epic: '💧',
                          immortal: '💧',
                        },
                        earth: {
                          common: '🌍',
                          rare: '🌍',
                          epic: '🌍',
                          immortal: '🌍',
                        },
                      };
                      return elementalData[element][rarity];
                    })()}
                  </div>

                  {/* Rarity badge */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: isMobile ? '8px' : '12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      background:
                        gameState.currentOpponent.elemental === 'common'
                          ? '#9ca3af'
                          : gameState.currentOpponent.elemental === 'rare'
                            ? '#3b82f6'
                            : gameState.currentOpponent.elemental === 'epic'
                              ? '#8b5cf6'
                              : '#f59e0b',
                      color: 'white',
                      zIndex: 2,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    {gameState.currentOpponent.elemental}
                  </div>
                </div>
              )}
            </div>
            <div
              style={{
                fontSize: isMobile ? '0.9rem' : '1rem',
                marginTop: isMobile ? '1rem' : '1.5rem',
                opacity: 0.8,
                padding: isMobile ? '0 1rem' : '0',
              }}
            >
              The ancient spirits answer the call!
            </div>
          </div>
        )}

        {phase === 'result' && (
          <div style={{ animation: 'fadeIn 1s ease-in' }}>
            <h2
              style={{
                fontSize: isMobile ? '1.4rem' : '1.8rem',
                marginBottom: isMobile ? '1rem' : '1.5rem',
                padding: isMobile ? '0 1rem' : '0',
              }}
            >
              Battle Complete!
            </h2>

            {/* Show elemental card in center for player victory */}
            {battleResult === 'player' &&
              gameState.player.selectedElemental && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: isMobile ? '1rem' : '1.5rem',
                    position: 'relative',
                  }}
                >
                  {/* WIN! indicator above the card */}
                  <div
                    style={{
                      position: 'absolute',
                      top: isMobile ? '-30px' : '-40px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: isMobile ? '1rem' : '1.2rem',
                      fontWeight: 'bold',
                      color: '#10b981',
                      textShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
                      animation: 'fadeIn 0.5s ease-in-out',
                      zIndex: 10,
                    }}
                  >
                    WIN!
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '1rem',
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                      backdropFilter: 'blur(20px)',
                      animation: 'winnerScale 2s ease-in-out infinite',
                      width: isMobile ? '120px' : '160px',
                      height: isMobile ? '150px' : '200px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Rarity glow effect */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `radial-gradient(circle at center, ${
                          gameState.player.selectedElemental === 'common'
                            ? '#9ca3af40'
                            : gameState.player.selectedElemental === 'rare'
                              ? '#3b82f640'
                              : gameState.player.selectedElemental === 'epic'
                                ? '#8b5cf640'
                                : '#f59e0b40'
                        } 0%, transparent 70%)`,
                        borderRadius: '16px',
                      }}
                    />

                    {/* Elemental image */}
                    <img
                      src={`${process.env.PUBLIC_URL}/resources/elmental/${gameState.player.selectedElement || 'fire'}_${gameState.player.selectedElemental?.charAt(0).toUpperCase() + gameState.player.selectedElemental?.slice(1) || 'Common'}.png`}
                      alt={`${gameState.player.selectedElement || 'fire'} ${gameState.player.selectedElemental || 'common'}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '12px',
                        filter:
                          'drop-shadow(0 0 15px rgba(255, 255, 255, 0.8))',
                        zIndex: 1,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                      }}
                      onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const emojiDiv =
                          target.nextElementSibling as HTMLDivElement;
                        if (emojiDiv) {
                          emojiDiv.style.display = 'block';
                        }
                      }}
                    />
                    <div
                      style={{
                        fontSize: isMobile ? '2rem' : '3rem',
                        marginBottom: isMobile ? '0.5rem' : '1rem',
                        filter:
                          'drop-shadow(0 0 15px rgba(255, 255, 255, 0.8))',
                        zIndex: 1,
                        display: 'none',
                      }}
                    >
                      {(() => {
                        const element =
                          gameState.player.selectedElement || 'fire';
                        const rarity = gameState.player.selectedElemental;
                        const elementalData = {
                          fire: {
                            common: '🔥',
                            rare: '🔥',
                            epic: '🔥',
                            immortal: '🔥',
                          },
                          water: {
                            common: '💧',
                            rare: '💧',
                            epic: '💧',
                            immortal: '💧',
                          },
                          earth: {
                            common: '🌍',
                            rare: '🌍',
                            epic: '🌍',
                            immortal: '🌍',
                          },
                        };
                        return elementalData[element][rarity];
                      })()}
                    </div>

                    {/* Rarity badge */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: isMobile ? '8px' : '12px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        background:
                          gameState.player.selectedElemental === 'common'
                            ? '#9ca3af'
                            : gameState.player.selectedElemental === 'rare'
                              ? '#3b82f6'
                              : gameState.player.selectedElemental === 'epic'
                                ? '#8b5cf6'
                                : '#f59e0b',
                        color: 'white',
                        zIndex: 2,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      {gameState.player.selectedElemental}
                    </div>
                  </div>
                </div>
              )}

            {/* Show result icon only for defeat and draw */}
            {(battleResult === 'opponent' || battleResult === 'draw') && (
              <div
                style={{
                  fontSize: isMobile ? '3rem' : '4rem',
                  animation: 'resultPulse 3s ease-in-out infinite',
                  filter:
                    battleResult === 'opponent'
                      ? 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.8))'
                      : 'drop-shadow(0 0 20px rgba(218, 165, 32, 0.8))',
                }}
              >
                {battleResult === 'opponent' ? '💀' : '🤝'}
              </div>
            )}

            <div
              style={{
                fontSize: isMobile ? '0.9rem' : '1rem',
                marginTop: isMobile ? '1rem' : '1.5rem',
                opacity: 0.8,
                color:
                  battleResult === 'player'
                    ? '#10b981'
                    : battleResult === 'opponent'
                      ? '#ef4444'
                      : '#daa520',
                padding: isMobile ? '0 1rem' : '0',
              }}
            >
              {battleResult === 'player'
                ? 'Victory! You have emerged triumphant!'
                : battleResult === 'opponent'
                  ? 'Defeat! The opponent was stronger this time.'
                  : 'Draw! The battle ended in a stalemate.'}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        @keyframes elementFloat {
           0%, 100% { transform: translateY(0) scale(1); opacity: 0.8; }
           50% { transform: translateY(-10px) scale(1.02); opacity: 1; }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }

        @keyframes elementalSummon {
           0% { transform: scale(0); opacity: 0; }
           50% { transform: scale(1.1); opacity: 1; }
           100% { transform: scale(1); opacity: 1; }
          }

         @keyframes playerBattle {
           0%, 100% { transform: translateX(0); }
           50% { transform: translateX(10px); }
          }

                   @keyframes opponentBattle {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(-10px); }
          }

          @keyframes winnerScale {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1.1); }
          }

                     @keyframes loserScale {
             0% { transform: scale(1); }
             50% { transform: scale(0.9); }
             100% { transform: scale(0.9); }
         }

           @keyframes drawScale {
             0% { transform: scale(1); }
             50% { transform: scale(1.05); }
             100% { transform: scale(1.05); }
        }

        @keyframes epicClash {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }

        @keyframes victoryDance {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(5deg); }
          50% { transform: scale(1.2) rotate(0deg); }
          75% { transform: scale(1.1) rotate(-5deg); }
        }

        @keyframes resultPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .user-card {
          transition: all 0.3s ease;
        }

        .card-animate {
          animation: cardEntrance 1s ease-out;
        }

        @keyframes cardEntrance {
          0% {
            transform: translateY(100px) scale(0.8);
            opacity: 0;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default BattleAnimationPixi;
