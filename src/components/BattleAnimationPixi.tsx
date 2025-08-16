import React, { useEffect, useState } from 'react';
import { Element, GameState } from '../types';

interface BattleAnimationPixiProps {
  gameState: GameState;
  opponentElement: Element;
  onAnimationComplete: () => void;
}

const BattleAnimationPixi: React.FC<BattleAnimationPixiProps> = ({
  gameState: _gameState,
  opponentElement: _opponentElement,
  onAnimationComplete,
}) => {
  const [phase, setPhase] = useState<
    'intro' | 'elements' | 'elementals' | 'clash' | 'result'
  >('intro');

  useEffect(() => {
    const timeoutIds: NodeJS.Timeout[] = [];

    // Animation sequence
    const timeline = [
      { delay: 800, action: () => setPhase('intro') },
      { delay: 2000, action: () => setPhase('elements') },
      { delay: 4000, action: () => setPhase('elementals') },
      { delay: 6000, action: () => setPhase('clash') },
      { delay: 8000, action: () => setPhase('result') },
      { delay: 10000, action: onAnimationComplete },
    ];

    timeline.forEach(({ delay, action }) => {
      const timeoutId = setTimeout(action, delay);
      timeoutIds.push(timeoutId);
    });

    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, [onAnimationComplete]);

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
      {/* Animated background particles */}
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
          width: '400px',
          height: '400px',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          animation: 'rotate 20s linear infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
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
        }}
      >
        {phase === 'intro' && (
          <div style={{ animation: 'fadeIn 1s ease-in' }}>
            <h1
              style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
              }}
            >
              ⚔️ BATTLE BEGINS ⚔️
            </h1>
          </div>
        )}

        {phase === 'elements' && (
          <div style={{ animation: 'fadeIn 1s ease-in' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>
              Elements Clash!
            </h2>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '4rem',
                fontSize: '4rem',
              }}
            >
              <div style={{ animation: 'bounce 1s ease-in-out infinite' }}>
                🔥
              </div>
              <div style={{ fontSize: '2rem', alignSelf: 'center' }}>VS</div>
              <div style={{ animation: 'bounce 1s ease-in-out infinite 0.5s' }}>
                💧
              </div>
            </div>
          </div>
        )}

        {phase === 'elementals' && (
          <div style={{ animation: 'fadeIn 1s ease-in' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>
              Elementals Awaken!
            </h2>
            <div
              style={{
                fontSize: '6rem',
                animation: 'glow 2s ease-in-out infinite',
              }}
            >
              ✨
            </div>
          </div>
        )}

        {phase === 'clash' && (
          <div style={{ animation: 'shake 0.5s ease-in-out infinite' }}>
            <h2 style={{ fontSize: '2.5rem', color: '#ff6b6b' }}>
              💥 CLASH! 💥
            </h2>
          </div>
        )}

        {phase === 'result' && (
          <div style={{ animation: 'fadeIn 1s ease-in' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              Battle Complete!
            </h2>
            <div
              style={{
                fontSize: '4rem',
                animation: 'victory 2s ease-in-out infinite',
              }}
            >
              🏆
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
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

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-30px); }
          60% { transform: translateY(-15px); }
        }

        @keyframes glow {
          0%, 100% { text-shadow: 0 0 20px rgba(255, 255, 255, 0.5); }
          50% { text-shadow: 0 0 40px rgba(255, 255, 255, 1), 0 0 60px rgba(255, 255, 255, 0.8); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes victory {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.2) rotate(10deg); }
        }
      `}</style>
    </div>
  );
};

export default BattleAnimationPixi;
