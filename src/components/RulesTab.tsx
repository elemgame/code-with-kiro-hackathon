import React from 'react';

const RulesTab: React.FC = () => {
  return (
    <main className='rules-container'>
      {/* Quick Start */}
      <div className='rules-card'>
        <div className='rules-card-header'>
          <div className='rules-card-icon'>🚀</div>
          <h2 className='rules-card-title'>Quick Start</h2>
        </div>
        <div className='rules-steps-grid'>
          <div className='rules-step-card'>
            <div className='step-number'>1</div>
            <div className='step-icon'>🏟️</div>
            <h3 className='step-title'>Choose Location</h3>
            <p className='step-description'>Pick your battle arena</p>
          </div>
          <div className='rules-step-card'>
            <div className='step-number'>2</div>
            <div className='step-icon'>⚡</div>
            <h3 className='step-title'>Select Element</h3>
            <p className='step-description'>Choose your power</p>
          </div>
          <div className='rules-step-card'>
            <div className='step-number'>3</div>
            <div className='step-icon'>🛡️</div>
            <h3 className='step-title'>Pick Elemental</h3>
            <p className='step-description'>Get protection</p>
          </div>
          <div className='rules-step-card'>
            <div className='step-number'>4</div>
            <div className='step-icon'>⚔️</div>
            <h3 className='step-title'>Battle!</h3>
            <p className='step-description'>Win or lose</p>
          </div>
        </div>
      </div>

      {/* Element Battle System */}
      <div className='rules-card'>
        <div className='rules-card-header'>
          <div className='rules-card-icon'>⚡</div>
          <h2 className='rules-card-title'>Element Battle System</h2>
        </div>

        <div className='element-system'>
          <div className='element-relationships'>
            <div className='element-card'>
              <div className='element-emoji'>🗿</div>
              <h3 className='element-name'>Earth</h3>
              <div className='element-advantage'>
                <span className='advantage-arrow'>→</span>
                <span className='advantage-text'>beats Water</span>
              </div>
            </div>

            <div className='element-card'>
              <div className='element-emoji'>💧</div>
              <h3 className='element-name'>Water</h3>
              <div className='element-advantage'>
                <span className='advantage-arrow'>→</span>
                <span className='advantage-text'>beats Fire</span>
              </div>
            </div>

            <div className='element-card'>
              <div className='element-emoji'>🔥</div>
              <h3 className='element-name'>Fire</h3>
              <div className='element-advantage'>
                <span className='advantage-arrow'>→</span>
                <span className='advantage-text'>beats Earth</span>
              </div>
            </div>
          </div>

          <div className='element-cycle-info'>
            <div className='cycle-badge'>
              <span className='cycle-text'>🗿 → 💧 → 🔥 → 🗿</span>
            </div>
            <p className='cycle-description'>
              Each element has an advantage over another in a rock-paper-scissors cycle
            </p>
          </div>
        </div>
      </div>

      {/* Locations & Mana */}
      <div className='rules-card'>
        <div className='rules-card-header'>
          <div className='rules-card-icon'>🏟️</div>
          <h2 className='rules-card-title'>Battle Locations</h2>
        </div>

        <div className='locations-grid'>
          <div className='location-card'>
            <div className='location-icon'>🐸</div>
            <div className='location-content'>
              <h3 className='location-name'>Swamp</h3>
              <p className='location-description'>Low risk, low reward</p>
              <div className='mana-badge'>100 Mana</div>
            </div>
          </div>

          <div className='location-card'>
            <div className='location-icon'>🏘️</div>
            <div className='location-content'>
              <h3 className='location-name'>Village</h3>
              <p className='location-description'>Medium risk, medium reward</p>
              <div className='mana-badge'>300 Mana</div>
            </div>
          </div>

          <div className='location-card'>
            <div className='location-icon'>🏰</div>
            <div className='location-content'>
              <h3 className='location-name'>Castle</h3>
              <p className='location-description'>High risk, high reward</p>
              <div className='mana-badge'>500 Mana</div>
            </div>
          </div>
        </div>

        <div className='mana-system-info'>
          <div className='info-header'>
            <span className='info-icon'>💡</span>
            <h3 className='info-title'>Mana System</h3>
          </div>
          <div className='info-content'>
            <div className='info-item'>
              <span className='info-label'>Win:</span>
              <span className='info-value'>Gain opponent's mana wager</span>
            </div>
            <div className='info-item'>
              <span className='info-label'>Lose:</span>
              <span className='info-value'>Lose your mana wager</span>
            </div>
            <div className='info-item'>
              <span className='info-label'>Draw:</span>
              <span className='info-value'>Keep your mana</span>
            </div>
          </div>
        </div>
      </div>

      {/* Elementals & Protection */}
      <div className='rules-card'>
        <div className='rules-card-header'>
          <div className='rules-card-icon'>🛡️</div>
          <h2 className='rules-card-title'>Elemental Protection</h2>
        </div>

        <div className='elementals-grid'>
          <div className='elemental-card common'>
            <div className='elemental-icon'>💧</div>
            <h3 className='elemental-name'>Common</h3>
            <div className='protection-value'>10% protection</div>
          </div>

          <div className='elemental-card rare'>
            <div className='elemental-icon'>🌊</div>
            <h3 className='elemental-name'>Rare</h3>
            <div className='protection-value'>20% protection</div>
          </div>

          <div className='elemental-card epic'>
            <div className='elemental-icon'>🌀</div>
            <h3 className='elemental-name'>Epic</h3>
            <div className='protection-value'>40% protection</div>
          </div>

          <div className='elemental-card immortal'>
            <div className='elemental-icon'>🐋</div>
            <h3 className='elemental-name'>Immortal</h3>
            <div className='protection-value'>80% protection</div>
          </div>
        </div>

        <div className='protection-info'>
          <div className='info-header'>
            <span className='info-icon'>🛡️</span>
            <h3 className='info-title'>How Protection Works</h3>
          </div>
          <div className='info-content'>
            <p className='protection-description'>
              When you lose, elementals protect a percentage of your mana:
            </p>
            <div className='protection-example'>
              <span className='example-text'>
                Lose 500 mana with Epic elemental → Keep 200 mana (40% protected)
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
