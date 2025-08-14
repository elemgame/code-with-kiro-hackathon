import React, { useState, useEffect, useCallback } from 'react';
import { GameState, PlayerStats, Element, Location, ElementalRarity, Opponent, GamePhase, BattleResult } from './types';
import { 
  ELEMENTS, 
  LOCATIONS,
  generateOpponent, 
  getRandomElement, 
  getWinner, 
  getRank, 
  getTitle, 
  getAchievementDefinitions,
  getAchievementProgress,
  getAvailableElementals,
  getElementalData,
  calculateProtectedMana,
  canAffordLocation
} from './gameLogic';
import ProfileTab from './components/ProfileTab';
import BattleComponent from './components/BattleComponent';
import BattleResultPage from './components/BattleResultPage';
import RulesTab from './components/RulesTab';
import Navigation from './components/Navigation';
import Modal from './components/Modal';
import AchievementNotification from './components/AchievementNotification';
import './App.css';

const INITIAL_PLAYER: PlayerStats = {
  name: 'Warrior',
  mana: 500,
  wins: 0,
  losses: 0,
  selectedElement: null,
  selectedLocation: null,
  selectedElemental: null,
  winStreak: 0,
  bestStreak: 0,
  maxLossStreak: 0,
  currentLossStreak: 0,
  totalBattles: 0,
  experience: 350,
  level: 1,
  favoriteElement: null,
  elementStats: { earth: 0, water: 0, fire: 0 },
  achievements: [],
  lastManaChange: 0,
  maxWager: 0,
  totalManaWon: 0,
  totalManaLost: 0
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'battle' | 'rules'>('battle');
  const [gameState, setGameState] = useState<GameState>({
    player: INITIAL_PLAYER,
    currentOpponent: null,
    opponentElement: null,
    gamePhase: 'menu',
    battleLog: null
  });
  const [newAchievements, setNewAchievements] = useState<string[]>([]);

  // Load game state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('elementalGameState');
    if (saved) {
      try {
        const savedPlayer = JSON.parse(saved);
        setGameState(prev => ({
          ...prev,
          player: { ...INITIAL_PLAYER, ...savedPlayer }
        }));
      } catch (error) {
        console.error('Failed to load saved game state:', error);
      }
    }
  }, []);

  // Save game state to localStorage whenever player data changes
  useEffect(() => {
    localStorage.setItem('elementalGameState', JSON.stringify(gameState.player));
  }, [gameState.player]);

  const updatePlayer = useCallback((updates: Partial<PlayerStats>) => {
    setGameState(prev => {
      const oldMana = prev.player.mana;
      const newPlayer = { ...prev.player, ...updates };

      // Calculate mana change
      if (updates.mana !== undefined) {
        newPlayer.lastManaChange = newPlayer.mana - oldMana;
      }

      // Update total battles
      if (updates.wins !== undefined || updates.losses !== undefined) {
        newPlayer.totalBattles = newPlayer.wins + newPlayer.losses;
      }

      // Update best streak
      if (updates.winStreak !== undefined && updates.winStreak > newPlayer.bestStreak) {
        newPlayer.bestStreak = updates.winStreak;
      }

      // Update experience and level
      if (updates.wins !== undefined && updates.wins > prev.player.wins) {
        newPlayer.experience += 100;
        const expNeeded = newPlayer.level * 1000;
        if (newPlayer.experience >= expNeeded) {
          newPlayer.level++;
          newPlayer.experience -= expNeeded;
        }
      }

      // Update favorite element
      if (newPlayer.selectedElement) {
        newPlayer.elementStats[newPlayer.selectedElement]++;
        const mostUsed = Object.entries(newPlayer.elementStats)
          .reduce((a, b) => a[1] > b[1] ? a : b);
        if (mostUsed[1] > 0) {
          newPlayer.favoriteElement = ELEMENTS[mostUsed[0] as Element].name;
        }
      }

      // Check achievements
      const achievementDefinitions = getAchievementDefinitions();
      const unlockedAchievements: string[] = [];
      
      achievementDefinitions.forEach(achievement => {
        if (!newPlayer.achievements.includes(achievement.id) && achievement.condition(newPlayer)) {
          unlockedAchievements.push(achievement.id);
        }
      });

      if (unlockedAchievements.length > 0) {
        newPlayer.achievements.push(...unlockedAchievements);
        setNewAchievements(unlockedAchievements);
      }

      return {
        ...prev,
        player: newPlayer
      };
    });
  }, []);

  const selectLocation = useCallback((location: Location) => {
    if (!canAffordLocation(gameState.player.mana, location)) return;
    
    updatePlayer({ selectedLocation: location });
    setGameState(prev => ({ ...prev, gamePhase: 'elementSelection' }));
  }, [gameState.player.mana, updatePlayer]);

  const selectElement = useCallback((element: Element) => {
    updatePlayer({ selectedElement: element });
    // Остаемся в elementSelection, просто обновляем состояние
  }, [updatePlayer]);

  const selectElemental = useCallback((elemental: ElementalRarity) => {
    updatePlayer({ selectedElemental: elemental });
  }, [updatePlayer]);

  const returnToLocationSelection = useCallback(() => {
    updatePlayer({ selectedLocation: null, selectedElement: null, selectedElemental: null });
    setGameState(prev => ({ ...prev, gamePhase: 'menu' }));
  }, [updatePlayer]);

  const returnToElementSelection = useCallback(() => {
    updatePlayer({ selectedElement: null, selectedElemental: null });
    setGameState(prev => ({ ...prev, gamePhase: 'elementSelection' }));
  }, [updatePlayer]);

  const startMatchmaking = useCallback(() => {
    if (!gameState.player.selectedLocation || !gameState.player.selectedElement) {
      console.log('Missing location or element');
      return;
    }
    
    const wager = LOCATIONS[gameState.player.selectedLocation].mana;
    if (gameState.player.mana < wager) {
      alert(`Not enough mana! You need ${wager} mana to play in ${LOCATIONS[gameState.player.selectedLocation].name}, but you only have ${gameState.player.mana}.`);
      return;
    }
    
    console.log(`🔍 Starting matchmaking in ${LOCATIONS[gameState.player.selectedLocation].name} (${wager} mana wager)...`);
    setGameState(prev => ({ ...prev, gamePhase: 'matchmaking' }));
    
    // Simulate matchmaking delay
    setTimeout(() => {
      const opponent = generateOpponent(gameState.player.selectedLocation!);
      setGameState(prev => ({
        ...prev,
        currentOpponent: opponent,
        gamePhase: 'elementalSelection' // Показываем выбор элементала, а не сразу битву
      }));
    }, 2000 + Math.random() * 2000);
  }, [gameState.player.selectedLocation, gameState.player.selectedElement, gameState.player.mana]);

  const startBattle = useCallback(() => {
    if (!gameState.player.selectedElement || !gameState.currentOpponent || !gameState.player.selectedLocation) return;

    // Сначала вычитаем ставку из маны игрока
    const baseWager = gameState.currentOpponent.wager;
    const initialMana = gameState.player.mana;
    
    // Сохраняем начальную ману для расчетов
    setGameState(prev => ({ 
      ...prev, 
      gamePhase: 'battle',
      player: { ...prev.player, mana: prev.player.mana - baseWager }
    }));

    const opponentElement = getRandomElement();
    
    // Show battle animation
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        opponentElement,
        gamePhase: 'result'
      }));
    }, 1000);

    // Show result after battle animation
    setTimeout(() => {
      const winner = getWinner(gameState.player.selectedElement!, opponentElement);
      const protectedMana = calculateProtectedMana(
        baseWager, 
        gameState.player.selectedElement, 
        gameState.player.selectedElemental
      );
      
      let finalManaChange = 0;

      if (winner === 'player') {
        // Игрок выигрывает: получает обратно свою ставку + ставку противника
        finalManaChange = baseWager * 2;
        updatePlayer({
          mana: initialMana - baseWager + finalManaChange,
          wins: gameState.player.wins + 1,
          winStreak: gameState.player.winStreak + 1,
          currentLossStreak: 0,
          totalManaWon: gameState.player.totalManaWon + baseWager
        });
      } else if (winner === 'opponent') {
        // Игрок проигрывает: теряет ставку, но часть защищена элементалом
        const actualLoss = baseWager - protectedMana;
        finalManaChange = protectedMana; // Возвращаем защищенную часть
        const newLossStreak = gameState.player.currentLossStreak + 1;
        updatePlayer({
          mana: initialMana - actualLoss,
          losses: gameState.player.losses + 1,
          winStreak: 0,
          currentLossStreak: newLossStreak,
          maxLossStreak: Math.max(gameState.player.maxLossStreak, newLossStreak),
          totalManaLost: gameState.player.totalManaLost + actualLoss
        });
      } else {
        // Ничья: возвращаем ставку
        finalManaChange = baseWager;
        updatePlayer({
          mana: initialMana
        });
      }

      // Create battle log
      const battleLog = {
        playerElement: gameState.player.selectedElement!,
        opponentElement,
        playerElemental: gameState.player.selectedElemental,
        baseWager,
        protectionSaved: protectedMana,
        finalChange: winner === 'player' ? baseWager : winner === 'opponent' ? -Math.max(0, baseWager - protectedMana) : 0,
        winner
      };

      setGameState(prev => ({ ...prev, battleLog }));
    }, 3000);
  }, [gameState.player, gameState.currentOpponent, updatePlayer]);

  const returnToMenu = useCallback(() => {
    setActiveTab('battle'); // Переключаемся на вкладку battle
    setGameState(prev => ({
      ...prev,
      gamePhase: 'menu',
      currentOpponent: null,
      opponentElement: null,
      battleLog: null,
      player: { 
        ...prev.player, 
        selectedElement: null, 
        selectedLocation: null, 
        selectedElemental: null 
      }
    }));
  }, []);

  const dismissAchievement = useCallback((achievementId: string) => {
    setNewAchievements(prev => prev.filter(id => id !== achievementId));
  }, []);

  return (
    <>
      <div className="app">
        <div className="app-content">
          {activeTab === 'profile' && gameState.gamePhase !== 'result' && (
            <ProfileTab 
              player={gameState.player}
              rank={getRank(gameState.player.level)}
              title={getTitle(gameState.player.wins, gameState.player.winStreak)}
            />
          )}
          
          {activeTab === 'battle' && gameState.gamePhase !== 'result' && (
            <BattleComponent
              gameState={gameState}
              onSelectLocation={selectLocation}
              onSelectElement={selectElement}
              onSelectElemental={selectElemental}
              onReturnToLocationSelection={returnToLocationSelection}
              onReturnToElementSelection={returnToElementSelection}
              onStartMatchmaking={startMatchmaking}
              onStartBattle={startBattle}
              onReturnToMenu={returnToMenu}
            />
          )}
          
          {activeTab === 'rules' && gameState.gamePhase !== 'result' && <RulesTab />}
          
          {gameState.gamePhase === 'result' && (
            <BattleResultPage
              gameState={gameState}
              onReturnToMenu={returnToMenu}
            />
          )}
        </div>

        {/* Achievement Notifications */}
        {newAchievements.map(achievementId => {
          const achievement = getAchievementDefinitions().find(a => a.id === achievementId);
          return achievement ? (
            <AchievementNotification
              key={achievementId}
              achievement={achievement}
              onDismiss={() => dismissAchievement(achievementId)}
            />
          ) : null;
        })}
      </div>

      {/* Navigation outside of app container */}
      {gameState.gamePhase !== 'result' && (
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </>
  );
};

export default App;