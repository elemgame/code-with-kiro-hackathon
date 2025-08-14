import React from 'react';

const RulesTab: React.FC = () => {
  return (
    <main style={{
      padding: '1rem',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      {/* Quick Start */}
      <div className="card">
        <div className="card-title">🚀 Quick Start</div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '1rem',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>1️⃣</div>
            <div style={{ color: 'var(--secondary-gold)', fontWeight: 600, marginBottom: '0.25rem' }}>Choose Location</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Pick your battle arena</div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '1rem',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>2️⃣</div>
            <div style={{ color: 'var(--secondary-gold)', fontWeight: 600, marginBottom: '0.25rem' }}>Select Element</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Choose your power</div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '1rem',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>3️⃣</div>
            <div style={{ color: 'var(--secondary-gold)', fontWeight: 600, marginBottom: '0.25rem' }}>Pick Elemental</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Get protection</div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '1rem',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>4️⃣</div>
            <div style={{ color: 'var(--secondary-gold)', fontWeight: 600, marginBottom: '0.25rem' }}>Battle!</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Win or lose</div>
          </div>
        </div>
      </div>

      {/* Element Battle System */}
      <div className="card">
        <div className="card-title">⚡ Element Battle System</div>

        {/* Battle Circle */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '2rem 0',
          position: 'relative'
        }}>
          <div style={{
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            border: '3px solid var(--secondary-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            background: 'rgba(218, 165, 32, 0.1)'
          }}>
            {/* Elements positioned around circle */}
            <div style={{
              position: 'absolute',
              top: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem' }}>🗿</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Earth</div>
            </div>

            <div style={{
              position: 'absolute',
              bottom: '-10px',
              right: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem' }}>💧</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Water</div>
            </div>

            <div style={{
              position: 'absolute',
              bottom: '-10px',
              left: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem' }}>🔥</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Fire</div>
            </div>

            {/* Arrows */}
            <div style={{
              position: 'absolute',
              top: '30px',
              right: '40px',
              fontSize: '1.5rem',
              color: 'var(--success)',
              transform: 'rotate(45deg)'
            }}>→</div>
            <div style={{
              position: 'absolute',
              bottom: '50px',
              right: '10px',
              fontSize: '1.5rem',
              color: 'var(--success)',
              transform: 'rotate(135deg)'
            }}>→</div>
            <div style={{
              position: 'absolute',
              bottom: '50px',
              left: '10px',
              fontSize: '1.5rem',
              color: 'var(--success)',
              transform: 'rotate(225deg)'
            }}>→</div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.9rem'
          }}>
            <span>🗿 beats 💧 beats 🔥 beats 🗿</span>
          </div>
        </div>
      </div>

      {/* Locations & Mana */}
      <div className="card">
        <div className="card-title">🏟️ Battle Locations</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '1rem',
            borderRadius: '12px'
          }}>
            <span style={{ fontSize: '2rem' }}>🐸</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Swamp</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Low risk, low reward</div>
            </div>
            <div style={{
              background: 'var(--primary-gold)',
              color: 'black',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 600
            }}>
              100 Mana
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '1rem',
            borderRadius: '12px'
          }}>
            <span style={{ fontSize: '2rem' }}>🏘️</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Village</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Medium risk, medium reward</div>
            </div>
            <div style={{
              background: 'var(--primary-gold)',
              color: 'black',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 600
            }}>
              300 Mana
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '1rem',
            borderRadius: '12px'
          }}>
            <span style={{ fontSize: '2rem' }}>🏰</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Castle</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>High risk, high reward</div>
            </div>
            <div style={{
              background: 'var(--primary-gold)',
              color: 'black',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 600
            }}>
              500 Mana
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: 'rgba(218, 165, 32, 0.1)',
          borderRadius: '12px',
          border: '1px solid var(--secondary-gold)'
        }}>
          <div style={{ color: 'var(--secondary-gold)', fontWeight: 600, marginBottom: '0.5rem' }}>
            💡 Mana System
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            • <strong>Win:</strong> Gain opponent's mana wager<br />
            • <strong>Lose:</strong> Lose your mana wager<br />
            • <strong>Tie:</strong> Keep your mana
          </div>
        </div>
      </div>

      {/* Elementals & Protection */}
      <div className="card">
        <div className="card-title">🛡️ Elemental Protection</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{
            background: 'rgba(136, 136, 136, 0.1)',
            padding: '1rem',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid #888'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💧</div>
            <div style={{ color: '#888', fontWeight: 600, marginBottom: '0.25rem' }}>Common</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>10% protection</div>
          </div>

          <div style={{
            background: 'rgba(0, 123, 255, 0.1)',
            padding: '1rem',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid #007bff'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🌊</div>
            <div style={{ color: '#007bff', fontWeight: 600, marginBottom: '0.25rem' }}>Rare</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>20% protection</div>
          </div>

          <div style={{
            background: 'rgba(168, 85, 247, 0.1)',
            padding: '1rem',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid #a855f7'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🌀</div>
            <div style={{ color: '#a855f7', fontWeight: 600, marginBottom: '0.25rem' }}>Epic</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>40% protection</div>
          </div>

          <div style={{
            background: 'rgba(255, 215, 0, 0.1)',
            padding: '1rem',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid #ffd700'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🐋</div>
            <div style={{ color: '#ffd700', fontWeight: 600, marginBottom: '0.25rem' }}>Immortal</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>80% protection</div>
          </div>
        </div>

        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: 'rgba(0, 255, 0, 0.1)',
          borderRadius: '12px',
          border: '1px solid var(--success)'
        }}>
          <div style={{ color: 'var(--success)', fontWeight: 600, marginBottom: '0.5rem' }}>
            🛡️ How Protection Works
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            When you lose, elementals protect a percentage of your mana:<br />
            • Lose 500 mana with Epic elemental → Keep 200 mana (40% protected)
          </div>
        </div>
      </div>

      {/* Progression */}
      <div className="card">
        <div className="card-title">📈 Progression System</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '1rem',
            borderRadius: '12px'
          }}>
            <span style={{ fontSize: '2rem' }}>⭐</span>
            <div>
              <div style={{ color: 'var(--secondary-gold)', fontWeight: 600 }}>Experience & Levels</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                Gain XP from battles • Level up for rewards • Unlock new titles
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '1rem',
            borderRadius: '12px'
          }}>
            <span style={{ fontSize: '2rem' }}>🏆</span>
            <div>
              <div style={{ color: 'var(--secondary-gold)', fontWeight: 600 }}>Achievements</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                Complete challenges • Unlock badges • Show your mastery
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '1rem',
            borderRadius: '12px'
          }}>
            <span style={{ fontSize: '2rem' }}>👑</span>
            <div>
              <div style={{ color: 'var(--secondary-gold)', fontWeight: 600 }}>Ranks & Titles</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                Novice → Adept → Expert → Master • Earn special titles
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RulesTab;