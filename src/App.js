import React, { useState, useCallback, useMemo } from 'react';
import ElementSelector from './components/ElementSelector';
import ManaDisplay from './components/ManaDisplay';
import WagerSlider from './components/WagerSlider';
import ElementalUpgrade from './components/ElementalUpgrade';
import GameBoard from './components/GameBoard';
import { RARITIES, getWinner, calculateProtectedMana, getNextRarity } from './gameLogic';
import './App.css';

const App = () => {
  // Player states
  const [player1, setPlayer1] = useState({
    mana: 500,
    wager: 50,
    selectedElement: null,
    elementalRarity: RARITIES.COMMON
  });

  const [player2, setPlayer2] = useState({
    mana: 500,
    wager: 50,
    selectedElement: null,
    elementalRarity: RARITIES.COMMON
  });

  // Game states
  const [gamePhase, setGamePhase] = useState('setup'); // setup, selection, result
  const [currentRound, setCurrentRound] = useState(1);
  const [roundResults, setRoundResults] = useState([]);
  const [matchScore, setMatchScore] = useState({ player1: 0, player2: 0 });
  const [roundWinner, setRoundWinner] = useState(null);
  const [matchType, setMatchType] = useState('best-of-3');

  // Element selection handlers
  const handlePlayer1ElementSelect = useCallback((element) => {
    setPlayer1(prev => ({ ...prev, selectedElement: element }));
  }, []);

  const handlePlayer2ElementSelect = useCallback((element) => {
    setPlayer2(prev => ({ ...prev, selectedElement: element }));
  }, []);

  // Wager handlers with validation
  const handlePlayer1WagerChange = useCallback((wager) => {
    setPlayer1(prev => ({ 
      ...prev, 
      wager: Math.max(10, Math.min(wager, prev.mana)) 
    }));
  }, []);

  const handlePlayer2WagerChange = useCallback((wager) => {
    setPlayer2(prev => ({ 
      ...prev, 
      wager: Math.max(10, Math.min(wager, prev.mana)) 
    }));
  }, []);

  // Upgrade handlers
  const handlePlayer1Upgrade = useCallback(() => {
    const nextRarity = getNextRarity(player1.elementalRarity);
    if (nextRarity && player1.mana >= nextRarity.upgradeCost) {
      setPlayer1(prev => ({
        ...prev,
        mana: prev.mana - nextRarity.upgradeCost,
        elementalRarity: nextRarity
      }));
    }
  }, [player1.elementalRarity, player1.mana]);

  const handlePlayer2Upgrade = useCallback(() => {
    const nextRarity = getNextRarity(player2.elementalRarity);
    if (nextRarity && player2.mana >= nextRarity.upgradeCost) {
      setPlayer2(prev => ({
        ...prev,
        mana: prev.mana - nextRarity.upgradeCost,
        elementalRarity: nextRarity
      }));
    }
  }, [player2.elementalRarity, player2.mana]);

  // Game flow handlers
  const startMatch = useCallback(() => {
    setGamePhase('selection');
    setCurrentRound(1);
    setRoundResults([]);
    setMatchScore({ player1: 0, player2: 0 });
  }, []);

  const startRound = useCallback(() => {
    if (!player1.selectedElement || !player2.selectedElement) return;
    if (player1.mana < player1.wager || player2.mana < player2.wager) {
      console.error('Insufficient mana for wager');
      return;
    }

    const winner = getWinner(player1.selectedElement, player2.selectedElement);
    
    // Update round results
    const newRoundResult = {
      player1Element: player1.selectedElement,
      player2Element: player2.selectedElement,
      winner
    };
    
    setRoundResults(prev => [...prev, newRoundResult]);
    setRoundWinner(winner);
    
    // Update match score
    if (winner !== 'tie') {
      setMatchScore(prev => ({
        ...prev,
        [winner]: prev[winner] + 1
      }));
    }

    // Handle mana transfer
    if (winner !== 'tie') {
      const loser = winner === 'player1' ? 'player2' : 'player1';
      const winnerPlayer = winner === 'player1' ? player1 : player2;
      const loserPlayer = winner === 'player1' ? player2 : player1;
      
      const protectedMana = calculateProtectedMana(loserPlayer.wager, loserPlayer.elementalRarity);
      const lostMana = loserPlayer.wager - protectedMana;
      const totalPot = player1.wager + player2.wager;
      
      if (winner === 'player1') {
        setPlayer1(prev => ({ ...prev, mana: prev.mana + totalPot - prev.wager }));
        setPlayer2(prev => ({ ...prev, mana: prev.mana - lostMana }));
      } else {
        setPlayer2(prev => ({ ...prev, mana: prev.mana + totalPot - prev.wager }));
        setPlayer1(prev => ({ ...prev, mana: prev.mana - lostMana }));
      }
    }

    setGamePhase('result');
    
    // Auto-advance to next round after delay
    setTimeout(() => {
      const maxRounds = matchType === 'best-of-3' ? 3 : 5;
      const winsNeeded = Math.ceil(maxRounds / 2);
      const newMatchScore = winner !== 'tie' ? {
        ...matchScore,
        [winner]: matchScore[winner] + 1
      } : matchScore;
      
      if (Math.max(newMatchScore.player1, newMatchScore.player2) >= winsNeeded) {
        // Match complete
        return;
      }
      
      if (currentRound < maxRounds) {
        setCurrentRound(prev => prev + 1);
        setGamePhase('selection');
        setPlayer1(prev => ({ ...prev, selectedElement: null }));
        setPlayer2(prev => ({ ...prev, selectedElement: null }));
        setRoundWinner(null);
      }
    }, 3000);
  }, [player1, player2, currentRound, matchScore, matchType]);

  const resetGame = useCallback(() => {
    setPlayer1({
      mana: 500,
      wager: 50,
      selectedElement: null,
      elementalRarity: RARITIES.COMMON
    });
    setPlayer2({
      mana: 500,
      wager: 50,
      selectedElement: null,
      elementalRarity: RARITIES.COMMON
    });
    setGamePhase('setup');
    setCurrentRound(1);
    setRoundResults([]);
    setMatchScore({ player1: 0, player2: 0 });
    setRoundWinner(null);
  }, []);

  const gameState = {
    player1,
    player2,
    currentRound,
    roundResults,
    matchScore,
    gamePhase,
    roundWinner
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>⚡ Elemental Game ⚡</h1>
        <p>Choose your element, wager your mana, and battle for supremacy!</p>
      </header>

      <main className="game-container">
        {gamePhase === 'setup' && (
          <div className="setup-phase">
            <div className="match-setup">
              <h2>Match Setup</h2>
              <div className="match-type-selector">
                <label>
                  <input
                    type="radio"
                    value="best-of-3"
                    checked={matchType === 'best-of-3'}
                    onChange={(e) => setMatchType(e.target.value)}
                  />
                  Best of 3
                </label>
                <label>
                  <input
                    type="radio"
                    value="best-of-5"
                    checked={matchType === 'best-of-5'}
                    onChange={(e) => setMatchType(e.target.value)}
                  />
                  Best of 5
                </label>
              </div>
              <button className="start-match-btn" onClick={startMatch}>
                Start Match
              </button>
            </div>

            <div className="players-setup">
              <div className="player-setup">
                <h2>Player 1 Setup</h2>
                <ManaDisplay
                  currentMana={player1.mana}
                  wager={player1.wager}
                  elementalRarity={player1.elementalRarity}
                  playerName="Player 1"
                />
                <WagerSlider
                  wager={player1.wager}
                  onWagerChange={handlePlayer1WagerChange}
                  maxWager={player1.mana}
                  playerName="Player 1"
                />
                <ElementalUpgrade
                  currentRarity={player1.elementalRarity}
                  currentMana={player1.mana}
                  onUpgrade={handlePlayer1Upgrade}
                  playerName="Player 1"
                />
              </div>

              <div className="player-setup">
                <h2>Player 2 Setup</h2>
                <ManaDisplay
                  currentMana={player2.mana}
                  wager={player2.wager}
                  elementalRarity={player2.elementalRarity}
                  playerName="Player 2"
                />
                <WagerSlider
                  wager={player2.wager}
                  onWagerChange={handlePlayer2WagerChange}
                  maxWager={player2.mana}
                  playerName="Player 2"
                />
                <ElementalUpgrade
                  currentRarity={player2.elementalRarity}
                  currentMana={player2.mana}
                  onUpgrade={handlePlayer2Upgrade}
                  playerName="Player 2"
                />
              </div>
            </div>
          </div>
        )}

        {(gamePhase === 'selection' || gamePhase === 'result') && (
          <div className="battle-phase">
            <GameBoard
              gameState={gameState}
              onStartRound={startRound}
              matchType={matchType}
            />

            {gamePhase === 'selection' && (
              <div className="selection-phase">
                <div className="player-selections">
                  <ElementSelector
                    selectedElement={player1.selectedElement}
                    onElementSelect={handlePlayer1ElementSelect}
                    playerName="Player 1"
                    showSelection={false}
                  />
                  <ElementSelector
                    selectedElement={player2.selectedElement}
                    onElementSelect={handlePlayer2ElementSelect}
                    playerName="Player 2"
                    showSelection={false}
                  />
                </div>
              </div>
            )}

            <div className="game-controls">
              <button className="reset-btn" onClick={resetGame}>
                New Game
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;