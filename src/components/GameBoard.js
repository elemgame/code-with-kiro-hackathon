import React from 'react';
import { ELEMENTALS } from '../gameLogic';

const GameBoard = ({
    gameState,
    onStartRound,
    matchType = 'best-of-3'
}) => {
    const {
        player1,
        player2,
        currentRound,
        roundResults,
        matchScore,
        gamePhase,
        roundWinner
    } = gameState;

    const maxRounds = matchType === 'best-of-3' ? 3 : 5;
    const winsNeeded = Math.ceil(maxRounds / 2);

    const renderRoundResult = (result, index) => {
        if (!result) return null;

        const { player1Element, player2Element, winner } = result;

        return (
            <div key={index} className={`round-result round-${index + 1}`}>
                <div className="round-header">Round {index + 1}</div>
                <div className="round-matchup">
                    <div className={`player-choice ${winner === 'player1' ? 'winner' : winner === 'player2' ? 'loser' : 'tie'}`}>
                        <span>{ELEMENTALS[player1Element].emoji}</span>
                        <span>Player 1</span>
                    </div>
                    <div className="vs">VS</div>
                    <div className={`player-choice ${winner === 'player2' ? 'winner' : winner === 'player1' ? 'loser' : 'tie'}`}>
                        <span>{ELEMENTALS[player2Element].emoji}</span>
                        <span>Player 2</span>
                    </div>
                </div>
                <div className="round-winner">
                    {winner === 'tie' ? 'Tie!' : `${winner === 'player1' ? 'Player 1' : 'Player 2'} Wins!`}
                </div>
            </div>
        );
    };

    const isMatchComplete = Math.max(matchScore.player1, matchScore.player2) >= winsNeeded;
    const matchWinner = matchScore.player1 >= winsNeeded ? 'Player 1' :
        matchScore.player2 >= winsNeeded ? 'Player 2' : null;

    return (
        <div className="game-board">
            <div className="match-header">
                <h2>Elemental Battle Arena</h2>
                <div className="match-info">
                    <span className="match-type">{matchType.toUpperCase()}</span>
                    <span className="round-counter">Round {currentRound} of {maxRounds}</span>
                </div>
            </div>

            <div className="scoreboard">
                <div className="score-item">
                    <span className="player-name">Player 1</span>
                    <span className="score">{matchScore.player1}</span>
                </div>
                <div className="score-divider">-</div>
                <div className="score-item">
                    <span className="player-name">Player 2</span>
                    <span className="score">{matchScore.player2}</span>
                </div>
            </div>

            {gamePhase === 'selection' && (
                <div className="current-selections">
                    <div className="selection-status">
                        <div className="player-status">
                            Player 1: {player1.selectedElement ?
                                `${ELEMENTALS[player1.selectedElement].emoji} Ready` : 'Selecting...'}
                        </div>
                        <div className="player-status">
                            Player 2: {player2.selectedElement ?
                                `${ELEMENTALS[player2.selectedElement].emoji} Ready` : 'Selecting...'}
                        </div>
                    </div>

                    {player1.selectedElement && player2.selectedElement && (
                        <button
                            className="start-round-btn"
                            onClick={onStartRound}
                        >
                            Start Round {currentRound}!
                        </button>
                    )}
                </div>
            )}

            {gamePhase === 'result' && roundWinner && (
                <div className="round-result-display">
                    <div className="battle-animation">
                        <div className="player1-element">
                            {ELEMENTALS[player1.selectedElement].emoji}
                        </div>
                        <div className="battle-effects">⚡</div>
                        <div className="player2-element">
                            {ELEMENTALS[player2.selectedElement].emoji}
                        </div>
                    </div>
                    <div className="winner-announcement">
                        {roundWinner === 'tie' ?
                            "It's a tie! No one wins this round." :
                            `${roundWinner === 'player1' ? 'Player 1' : 'Player 2'} wins the round!`
                        }
                    </div>
                </div>
            )}

            <div className="round-history">
                <h3>Round History</h3>
                <div className="rounds-grid">
                    {Array.from({ length: maxRounds }, (_, i) =>
                        renderRoundResult(roundResults[i], i)
                    )}
                </div>
            </div>

            {isMatchComplete && (
                <div className="match-complete">
                    <h2>🏆 Match Complete!</h2>
                    <p className="match-winner">{matchWinner} Wins the Match!</p>
                    <div className="final-score">
                        Final Score: {matchScore.player1} - {matchScore.player2}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameBoard;