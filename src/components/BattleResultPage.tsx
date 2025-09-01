import React from 'react';
import { ELEMENTS, getElementalData } from '../gameLogic';
import { GameState } from '../types';

interface BattleResultPageProps {
  gameState: GameState;
  onReturnToMenu: () => void;
}

const BattleResultPage: React.FC<BattleResultPageProps> = ({
  gameState,
  onReturnToMenu,
}) => {
  const { player, currentOpponent, battleLog } = gameState;

  // Component should only render when battle data is available
  if (!battleLog || !currentOpponent) {
    return null;
  }

  const isVictory = battleLog.winner === 'player';
  const isDefeat = battleLog.winner === 'opponent';

  // Get elemental data for display
  const playerElemental = battleLog.playerElemental
    ? getElementalData(battleLog.playerElement, battleLog.playerElemental)
    : null;

  const opponentElemental = battleLog.opponentElemental
    ? getElementalData(battleLog.opponentElement, battleLog.opponentElemental)
    : null;

  return (
    <div id='resultsTab' className='tab-content'>
      <main
        style={{
          padding: '1rem',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: '#18182C',
        }}
      >
        {/* Result Header Card */}
        <div className='card'>
          <div className='results-header'>
            <div
              className={`results-title ${isVictory ? 'victory' : isDefeat ? 'defeat' : 'draw'}`}
            >
              <span className='results-icon'>
                {isVictory ? '🎉' : isDefeat ? '💀' : '🤝'}
              </span>
              {isVictory ? 'Victory!' : isDefeat ? 'Defeat!' : 'Draw!'}
            </div>
            <div className='results-subtitle'>
              {isVictory
                ? `You defeated ${currentOpponent.name}`
                : isDefeat
                  ? `${currentOpponent.name} defeated you`
                  : `You drew with ${currentOpponent.name}`}
            </div>
          </div>

          {/* Result Stats */}
          <div className='results-stats'>
            <div className='results-stats-header'>
              <span className='results-stats-title'>Battle Summary</span>
            </div>
            <div className='results-stat-row'>
              <span className='results-stat-label'>Mana Change:</span>
              <span
                className={`results-stat-value ${isVictory ? 'victory' : isDefeat ? 'defeat' : 'primary'}`}
              >
                {battleLog.baseWager === 0
                  ? 'No change (free)'
                  : `${battleLog.finalChange > 0 ? '+' : ''}${battleLog.finalChange}`}
              </span>
            </div>
            <div className='results-stat-row'>
              <span className='results-stat-label'>New Total:</span>
              <span className='results-stat-value primary'>{player.mana}</span>
            </div>
            <div className='results-stat-row'>
              <span className='results-stat-label'>Victory Streak:</span>
              <span className='results-stat-value gold'>
                {player.winStreak}
              </span>
            </div>
          </div>

          {/* Battle Again Button */}
          <div className='results-battle-again'>
            <button className='btn-primary' onClick={onReturnToMenu}>
              ⚔️ Battle Again
            </button>
          </div>
        </div>

        {/* Battle Log Card */}
        <div className='card'>
          {/* Battle Log Header */}
          <div className='battle-log-header'>⚔️ Battle Log</div>

          <div className='results-battle-log'>
            {/* Element Battle */}
            <div className='element-battle-section'>
              <div className='element-battle-title'>Element Battle:</div>
              <div className='element-battle-display'>
                <div className='element-battle-choice'>
                  <div
                    className='element-battle-emoji'
                    style={{
                      color:
                        ELEMENTS[battleLog.playerElement].color || '#00AFFF',
                    }}
                  >
                    {ELEMENTS[battleLog.playerElement].emoji}
                  </div>
                  <div className='element-battle-name'>
                    {ELEMENTS[battleLog.playerElement].name}
                  </div>
                </div>
                <div className='element-battle-vs'>VS</div>
                <div className='element-battle-choice'>
                  <div
                    className='element-battle-emoji'
                    style={{
                      color:
                        ELEMENTS[battleLog.opponentElement].color || '#A8A8A8',
                    }}
                  >
                    {ELEMENTS[battleLog.opponentElement].emoji}
                  </div>
                  <div className='element-battle-name'>
                    {ELEMENTS[battleLog.opponentElement].name}
                  </div>
                </div>
              </div>
              <div className='element-battle-result'>
                {battleLog.playerElement === battleLog.opponentElement
                  ? `Same elements - ${battleLog.winner === 'player' ? 'You Win!' : battleLog.winner === 'opponent' ? 'You Lose!' : 'Draw!'}`
                  : `${ELEMENTS[battleLog.playerElement].name} ${
                      battleLog.winner === 'player'
                        ? 'beats'
                        : battleLog.winner === 'opponent'
                          ? 'loses to'
                          : 'draws with'
                    } ${ELEMENTS[battleLog.opponentElement].name} - ${
                      battleLog.winner === 'player'
                        ? 'You Win!'
                        : battleLog.winner === 'opponent'
                          ? 'You Lose!'
                          : 'Draw!'
                    }`}
              </div>
            </div>

            {/* Elementals Used */}
            <div className='elementals-used-section'>
              <div className='elementals-used-title'>Elementals Used:</div>
              <div className='elementals-used-display'>
                {/* Player Elemental */}
                <div
                  className={`elemental-used-card ${playerElemental ? 'player' : 'opponent'}`}
                >
                  <div className='elemental-used-emoji'>
                    {playerElemental ? playerElemental.emoji : '❌'}
                  </div>
                  <div className='elemental-used-name'>
                    {playerElemental ? playerElemental.name : 'No Protection'}
                  </div>
                  <div
                    className={`elemental-used-protection ${playerElemental ? 'player' : 'opponent'}`}
                  >
                    {playerElemental
                      ? `${Math.round(playerElemental.protection * 100)}% protection`
                      : '0% protection'}
                  </div>
                </div>

                {/* Opponent Elemental */}
                <div className='elemental-used-card opponent'>
                  <div
                    className='elemental-used-emoji'
                    style={{ color: opponentElemental ? '#FFD700' : '#FF4C4C' }}
                  >
                    {opponentElemental ? opponentElemental.emoji : '❌'}
                  </div>
                  <div className='elemental-used-name'>
                    {opponentElemental
                      ? opponentElemental.name
                      : 'No Protection'}
                  </div>
                  <div className='elemental-used-protection opponent'>
                    {opponentElemental
                      ? `${Math.round(opponentElemental.protection * 100)}% protection`
                      : '0% protection'}
                  </div>
                </div>
              </div>
            </div>

            {/* Final Calculation */}
            <div className='final-calculation-section'>
              <div className='final-calculation-title'>Final Calculation:</div>
              <div className='final-calculation-row'>
                <span className='final-calculation-label'>Base wager:</span>
                <span className='final-calculation-value'>
                  {battleLog.baseWager === 0
                    ? 'Free battle (0 mana)'
                    : `${battleLog.baseWager} mana`}
                </span>
              </div>
              {battleLog.protectionSaved > 0 && (
                <div className='final-calculation-row'>
                  <span className='final-calculation-label'>
                    Protection saved:
                  </span>
                  <span className='final-calculation-value'>
                    {battleLog.protectionSaved} mana
                  </span>
                </div>
              )}
              <div className='final-calculation-row total'>
                <span className='final-calculation-label total'>
                  Final {isVictory ? 'gain' : isDefeat ? 'loss' : 'change'}:
                </span>
                <span
                  className={`final-calculation-value total ${isVictory ? 'victory' : isDefeat ? 'defeat' : ''}`}
                >
                  {battleLog.baseWager === 0
                    ? 'No mana change (free battle)'
                    : `${battleLog.finalChange > 0 ? '+' : ''}${battleLog.finalChange} mana`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BattleResultPage;
