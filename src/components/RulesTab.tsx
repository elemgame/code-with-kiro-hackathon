import React from 'react';

const RulesTab: React.FC = () => {
  return (
    <main style={{
      padding: '1rem',
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div className="card">
        <div className="card-title">📜 Game Rules</div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{
            color: 'var(--secondary-gold)',
            fontSize: '1rem',
            marginBottom: '0.75rem'
          }}>
            🎯 How to Play
          </h3>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            lineHeight: 1.6
          }}>
            Choose your element and challenge opponents in strategic battles. Each element has unique
            strengths and weaknesses.
          </p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{
            color: 'var(--secondary-gold)',
            fontSize: '1rem',
            marginBottom: '0.75rem'
          }}>
            ⚡ Elements
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🗿</span>
              <div>
                <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Earth</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  Strong against Water, weak against Fire
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>💧</span>
              <div>
                <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Water</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  Strong against Fire, weak against Earth
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🔥</span>
              <div>
                <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Fire</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  Strong against Earth, weak against Water
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{
            color: 'var(--secondary-gold)',
            fontSize: '1rem',
            marginBottom: '0.75rem'
          }}>
            💰 Mana System
          </h3>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            lineHeight: 1.6
          }}>
            Wager mana in battles. Win to gain mana, lose to forfeit your wager. Higher stakes, greater
            rewards!
          </p>
        </div>

        <div>
          <h3 style={{
            color: 'var(--secondary-gold)',
            fontSize: '1rem',
            marginBottom: '0.75rem'
          }}>
            🏆 Progression
          </h3>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            lineHeight: 1.6
          }}>
            Gain experience through battles, unlock achievements, and climb the ranks from Novice to
            Master.
          </p>
        </div>
      </div>
    </main>
  );
};

export default RulesTab;