import React from 'react';

const RulesTab: React.FC = () => {
  return (
    <main className='rules-container'>
      {/* Game Overview */}
      <div className='rules-card'>
        <div className='rules-card-header'>
          <div className='rules-card-icon'>🎮</div>
          <h2 className='rules-card-title'>Game Overview</h2>
        </div>
        <div className='game-overview'>
          <div className='overview-item'>
            <span className='overview-label'>Objective:</span>
            <span className='overview-value'>
              Master elements, collect elementals, become the ultimate champion!
            </span>
          </div>
          <div className='overview-item'>
            <span className='overview-label'>Core Loop:</span>
            <span className='overview-value'>
              Battle → Win Mana → Collect Elementals → Level Up → Repeat
            </span>
          </div>
          <div className='overview-item'>
            <span className='overview-label'>Progression:</span>
            <span className='overview-value'>
              Experience → Levels → Achievements → Titles → Mastery
            </span>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className='rules-card'>
        <div className='rules-card-header'>
          <div className='rules-card-icon'>⚡</div>
          <h2 className='rules-card-title'>Quick Start Guide</h2>
        </div>
        <div className='rules-steps-grid'>
          <div className='rules-step-card'>
            <div className='step-number'>1</div>
            <div className='step-icon'>🏟️</div>
            <h3 className='step-title'>Choose Arena</h3>
            <p className='step-description'>
              Select battle location & wager mana
            </p>
          </div>
          <div className='rules-step-card'>
            <div className='step-number'>2</div>
            <div className='step-icon'>🔥</div>
            <h3 className='step-title'>Pick Element</h3>
            <p className='step-description'>Choose your elemental power</p>
          </div>
          <div className='rules-step-card'>
            <div className='step-number'>3</div>
            <div className='step-icon'>🛡️</div>
            <h3 className='step-title'>Summon Guardian</h3>
            <p className='step-description'>Select elemental for protection</p>
          </div>
          <div className='rules-step-card'>
            <div className='step-number'>4</div>
            <div className='step-icon'>⚔️</div>
            <h3 className='step-title'>Engage Battle</h3>
            <p className='step-description'>Fight & claim your rewards</p>
          </div>
        </div>
      </div>

      {/* Element Battle System */}
      <div className='rules-card'>
        <div className='rules-card-header'>
          <div className='rules-card-icon'>⚔️</div>
          <h2 className='rules-card-title'>Element Combat System</h2>
        </div>

        <div className='element-system'>
          <div className='element-cycle-display'>
            <div className='cycle-ring'>
              <div className='element-node earth'>
                <div className='element-emoji'>🗿</div>
                <div className='element-name'>Earth</div>
                <div className='element-power'>beats Water</div>
              </div>
              <div className='element-node water'>
                <div className='element-emoji'>💧</div>
                <div className='element-name'>Water</div>
                <div className='element-power'>beats Fire</div>
              </div>
              <div className='element-node fire'>
                <div className='element-emoji'>🔥</div>
                <div className='element-name'>Fire</div>
                <div className='element-power'>beats Earth</div>
              </div>
            </div>
            <div className='cycle-info'>
              <div className='cycle-badge'>
                <span className='cycle-text'>🗿 → 💧 → 🔥 → 🗿</span>
              </div>
              <p className='cycle-description'>
                Each element has an advantage over another in a
                rock-paper-scissors cycle
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Battle Arenas & Economy */}
      <div className='rules-card'>
        <div className='rules-card-header'>
          <div className='rules-card-icon'>🏟️</div>
          <h2 className='rules-card-title'>Battle Arenas & Economy</h2>
        </div>

        <div className='arenas-grid'>
          <div className='arena-card beginner'>
            <div className='arena-icon'>🐸</div>
            <div className='arena-info'>
              <h3 className='arena-name'>Swamp Arena</h3>
              <div className='arena-stats'>
                <span className='risk-level'>Risk: Low</span>
                <span className='mana-wager'>Wager: 100 Mana</span>
              </div>
            </div>
          </div>

          <div className='arena-card intermediate'>
            <div className='arena-icon'>🏘️</div>
            <div className='arena-info'>
              <h3 className='arena-name'>Village Arena</h3>
              <div className='arena-stats'>
                <span className='risk-level'>Risk: Medium</span>
                <span className='mana-wager'>Wager: 300 Mana</span>
              </div>
            </div>
          </div>

          <div className='arena-card expert'>
            <div className='arena-icon'>🏰</div>
            <div className='arena-info'>
              <h3 className='arena-name'>Castle Arena</h3>
              <div className='arena-stats'>
                <span className='risk-level'>Risk: High</span>
                <span className='mana-wager'>Wager: 500 Mana</span>
              </div>
            </div>
          </div>
        </div>

        <div className='economy-rules'>
          <div className='economy-header'>
            <span className='economy-icon'>💰</span>
            <h3 className='economy-title'>Mana Economy Rules</h3>
          </div>
          <div className='economy-rules-grid'>
            <div className='economy-rule'>
              <span className='rule-icon'>✅</span>
              <span className='rule-text'>
                Victory: Claim opponent&apos;s wager
              </span>
            </div>
            <div className='economy-rule'>
              <span className='rule-icon'>❌</span>
              <span className='rule-text'>Defeat: Lose your wager</span>
            </div>
            <div className='economy-rule'>
              <span className='rule-icon'>🤝</span>
              <span className='rule-text'>Draw: Keep your wager</span>
            </div>
          </div>
        </div>
      </div>

      {/* Elemental Guardians */}
      <div className='rules-card'>
        <div className='rules-card-header'>
          <div className='rules-card-icon'>🛡️</div>
          <h2 className='rules-card-title'>Elemental Guardians</h2>
        </div>

        <div className='elementals-grid'>
          <div className='rules-elemental-card common'>
            <div className='elemental-info'>
              <h3 className='elemental-name'>Common</h3>
              <div className='protection-value'>10% protection</div>
            </div>
          </div>

          <div className='rules-elemental-card rare'>
            <div className='elemental-info'>
              <h3 className='elemental-name'>Rare</h3>
              <div className='protection-value'>20% protection</div>
            </div>
          </div>

          <div className='rules-elemental-card epic'>
            <div className='elemental-info'>
              <h3 className='elemental-name'>Epic</h3>
              <div className='protection-value'>40% protection</div>
            </div>
          </div>

          <div className='rules-elemental-card immortal'>
            <div className='elemental-info'>
              <h3 className='elemental-name'>Immortal</h3>
              <div className='protection-value'>80% protection</div>
            </div>
          </div>
        </div>

        <div className='protection-mechanics'>
          <div className='mechanics-header'>
            <span className='mechanics-icon'>🛡️</span>
            <h3 className='mechanics-title'>How Protection Works</h3>
          </div>
          <div className='mechanics-example'>
            <div className='example-scenario'>
              <span className='scenario-label'>Example:</span>
              <span className='scenario-text'>
                Lose 500 mana with Epic elemental → Keep 200 mana (40%
                protected)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progression */}
      <div className='rules-card'>
        <div className='rules-card-header'>
          <div className='rules-card-icon'>📈</div>
          <h2 className='rules-card-title'>Progression System</h2>
        </div>

        <div className='progression-grid'>
          <div className='progression-card'>
            <div className='progression-icon'>⭐</div>
            <div className='progression-content'>
              <h3 className='progression-title'>Experience & Levels</h3>
              <p className='progression-description'>
                Gain XP from battles • Level up for rewards • Unlock new titles
              </p>
            </div>
          </div>

          <div className='progression-card'>
            <div className='progression-icon'>🏆</div>
            <div className='progression-content'>
              <h3 className='progression-title'>Achievements</h3>
              <p className='progression-description'>
                Complete challenges • Unlock badges • Show your mastery
              </p>
            </div>
          </div>

          <div className='progression-card'>
            <div className='progression-icon'>👑</div>
            <div className='progression-content'>
              <h3 className='progression-title'>Ranks & Titles</h3>
              <p className='progression-description'>
                Novice → Adept → Expert → Master • Earn special titles
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RulesTab;
