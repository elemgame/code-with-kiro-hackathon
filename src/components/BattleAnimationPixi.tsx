import * as PIXI from 'pixi.js';
import React, { useEffect, useRef, useState } from 'react';
import { Element, GameState, Opponent, PlayerStats } from '../types';

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
    'intro' | 'cards' | 'elements' | 'elementals' | 'clash' | 'result'
  >('intro');

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
        resolution: window.devicePixelRatio || 1,
      });

      if (app.view && app.view instanceof HTMLCanvasElement) {
        canvasRef.current.appendChild(app.view);
      }

      appRef.current = app;

      // Create particle system
      const particles = new PIXI.Container();
      app.stage.addChild(particles);
      particlesRef.current = particles;

      // Create magic particles
      for (let i = 0; i < 100; i++) {
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
  }, []);

  // Animation timeline
  useEffect(() => {
    const timeoutIds: NodeJS.Timeout[] = [];

    const timeline = [
      { delay: 1000, action: () => setPhase('intro') },
      { delay: 3000, action: () => setPhase('cards') },
      { delay: 6000, action: () => setPhase('elements') },
      { delay: 9000, action: () => setPhase('elementals') },
      { delay: 12000, action: () => setPhase('clash') },
      { delay: 15000, action: () => setPhase('result') },
      { delay: 18000, action: onAnimationComplete },
    ];

    timeline.forEach(({ delay, action }) => {
      const timeoutId = setTimeout(action, delay);
      timeoutIds.push(timeoutId);
    });

    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, [onAnimationComplete]);

  // Create user card component
  const UserCard: React.FC<{
    player: PlayerStats | Opponent;
    element: Element;
    isAnimating?: boolean;
  }> = ({ player, element, isAnimating = false }) => {
    const elementInfo = elementData[element];

    return (
      <div
        className={`user-card ${isAnimating ? 'card-animate' : ''}`}
        style={{
          background: `linear-gradient(135deg, ${elementInfo.color}20 0%, ${elementInfo.color}10 100%)`,
          border: `1.5px solid ${elementInfo.color}`,
          borderRadius: '10px',
          padding: '10px',
          width: '140px',
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
            padding: '8px',
            borderRadius: '8px',
            marginBottom: '8px',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '5px' }}>
            {elementInfo.emoji}
          </div>
          <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
            {elementInfo.name}
          </div>
        </div>

        {/* Stats */}
        {'mana' in player && (
          <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>
            Mana: {player.mana}
          </div>
        )}
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
        isActive={phase === 'clash' || phase === 'elementals'}
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
          width: '300px',
          height: '300px',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          animation: 'rotate 20s linear infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '250px',
          height: '250px',
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
                fontSize: '2.5rem',
                marginBottom: '1.5rem',
                textShadow: '0 0 20px rgba(255, 255, 255, 0.8)',
                background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ⚔️ EPIC BATTLE ⚔️
            </h1>
            <div style={{ fontSize: '1rem', opacity: 0.8 }}>
              Prepare for the ultimate elemental clash!
            </div>
          </div>
        )}

        {phase === 'cards' && (
          <div style={{ animation: 'fadeIn 1s ease-in' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>
              Champions Enter the Arena!
            </h2>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '2.5rem',
                flexWrap: 'wrap',
              }}
            >
              <UserCard
                player={gameState.player}
                element={gameState.player.selectedElement || 'fire'}
                isAnimating={true}
              />

              <div
                style={{
                  fontSize: '2rem',
                  animation: 'pulse 1s ease-in-out infinite',
                  textShadow: '0 0 15px rgba(255, 255, 255, 0.8)',
                }}
              >
                ⚔️
              </div>

              <UserCard
                player={
                  gameState.currentOpponent || {
                    name: 'Mysterious Opponent',
                    avatar: '👤',
                    level: 1,
                    rarity: 'common',
                    wager: 0,
                  }
                }
                element={opponentElement}
                isAnimating={true}
              />
            </div>
          </div>
        )}

        {phase === 'elements' && (
          <div style={{ animation: 'fadeIn 1s ease-in' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>
              Elements Awaken!
            </h2>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '4rem',
                fontSize: '4rem',
              }}
            >
              <div
                style={{
                  animation: 'elementFloat 2s ease-in-out infinite',
                  filter: 'drop-shadow(0 0 15px rgba(255, 107, 107, 0.8))',
                }}
              >
                {elementData[gameState.player.selectedElement || 'fire'].emoji}
              </div>
              <div
                style={{
                  fontSize: '2rem',
                  animation: 'shake 0.5s ease-in-out infinite',
                  color: '#ff6b6b',
                }}
              >
                VS
              </div>
              <div
                style={{
                  animation: 'elementFloat 2s ease-in-out infinite 1s',
                  filter: 'drop-shadow(0 0 15px rgba(55, 66, 250, 0.8))',
                }}
              >
                {elementData[opponentElement].emoji}
              </div>
            </div>
          </div>
        )}

        {phase === 'elementals' && (
          <div style={{ animation: 'fadeIn 1s ease-in' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>
              Elementals Summoned!
            </h2>
            <div
              style={{
                fontSize: '5rem',
                animation: 'elementalSummon 3s ease-in-out infinite',
                filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.9))',
              }}
            >
              ✨
            </div>
            <div
              style={{ fontSize: '1rem', marginTop: '1.5rem', opacity: 0.8 }}
            >
              The ancient spirits answer the call!
            </div>
          </div>
        )}

        {phase === 'clash' && (
          <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
            <div
              style={{
                animation: 'epicClash 2s ease-in-out infinite',
                fontSize: '3rem',
                color: '#ff6b6b',
                textShadow: '0 0 25px rgba(255, 107, 107, 1)',
              }}
            >
              💥 EPIC CLASH! 💥
            </div>
            <div
              style={{
                fontSize: '2rem',
                marginTop: '1.5rem',
                animation: 'shake 0.2s ease-in-out infinite',
              }}
            >
              ⚡⚡⚡
            </div>
          </div>
        )}

        {phase === 'result' && (
          <div style={{ animation: 'fadeIn 1s ease-in' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>
              Battle Complete!
            </h2>
            <div
              style={{
                fontSize: '4rem',
                animation: 'resultPulse 3s ease-in-out infinite',
                filter: battleResult === 'player'
                  ? 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.8))'
                  : battleResult === 'opponent'
                  ? 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.8))'
                  : 'drop-shadow(0 0 20px rgba(218, 165, 32, 0.8))',
              }}
            >
              {battleResult === 'player' ? '🏆' : battleResult === 'opponent' ? '💀' : '🤝'}
            </div>
            <div
              style={{
                fontSize: '1rem',
                marginTop: '1.5rem',
                opacity: 0.8,
                color: battleResult === 'player'
                  ? '#10b981'
                  : battleResult === 'opponent'
                  ? '#ef4444'
                  : '#daa520'
              }}
            >
              {battleResult === 'player'
                ? 'Victory! You have emerged triumphant!'
                : battleResult === 'opponent'
                ? 'Defeat! The opponent was stronger this time.'
                : 'Draw! The battle ended in a stalemate.'
              }
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
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.1); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }

        @keyframes elementalSummon {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
          100% { transform: scale(1) rotate(360deg); opacity: 1; }
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
