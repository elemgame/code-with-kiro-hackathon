import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import AchievementNotification from './components/AchievementNotification';
import AudioPlayer from './components/AudioPlayer';
import BattleAnimationPixi from './components/BattleAnimationPixi';
import BattleComponent from './components/BattleComponent';
import BattleResultPage from './components/BattleResultPage';
import CollectionTab from './components/CollectionTab';
import Navigation from './components/Navigation';
import ProfileTab from './components/ProfileTab';
import RulesPage from './components/RulesPage';
import SettingsMenu from './components/SettingsMenu';
import {
  ELEMENTAL_TYPES,
  ELEMENTS,
  LOCATIONS,
  addElementalToCollection,
  addExperienceToElemental,
  calculateBattleResult,
  canAffordLocation,
  canLevelUpElemental,
  createInitialCollection,
  generateOpponent,
  getAchievementDefinitions,
  getLevelUpCost,
  getMaxLevelForRarity,
  getRandomElement,
  getRandomElementalReward,
  getRank,
  getRarityUpgradeCost,
  getTitle,
  levelUpElemental,
  setElementalCooldown,
} from './gameLogic';
import {
  Element,
  ElementalRarity,
  GameState,
  Location,
  PlayerStats,
} from './types';

const INITIAL_PLAYER: PlayerStats = {
  name: 'Warrior',
  mana: 1600,
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
  experience: 0,
  level: 1,
  favoriteElement: null,
  elementStats: { earth: 0, water: 0, fire: 0 },
  achievements: [],
  lastManaChange: 0,
  totalManaWon: 0,
  totalManaLost: 0,
  elementalCollection: createInitialCollection(),
  totalElementalsCollected: 3,
  immortalElementalsOwned: 0,
  epicElementalsOwned: 0,
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'profile' | 'battle' | 'collection'
  >('battle');
  const [gameState, setGameState] = useState<GameState>({
    player: INITIAL_PLAYER,
    currentOpponent: null,
    opponentElement: null,
    gamePhase: 'menu',
    battleLog: null,
  });
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const [newElementalReward, setNewElementalReward] = useState<{
    element: Element;
    rarity: ElementalRarity;
    name: string;
    emoji: string;
  } | null>(null);
  const [musicEnabled, setMusicEnabled] = useState(false); // Начинаем с выключенной
  const [userInteracted, setUserInteracted] = useState(false); // Флаг пользовательского взаимодействия

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [rulesPageOpen, setRulesPageOpen] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.2);

  // Load game state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('elementalGameState');
    if (saved) {
      try {
        const savedPlayer = JSON.parse(saved);
        setGameState(prev => ({
          ...prev,
          player: { ...INITIAL_PLAYER, ...savedPlayer },
        }));
      } catch (error) {
        // Failed to load saved game state - using defaults
      }
    }

    // Load audio settings from localStorage
    const savedAudioSettings = localStorage.getItem('audioSettings');
    if (savedAudioSettings) {
      try {
        const settings = JSON.parse(savedAudioSettings);
        if (settings.musicVolume !== undefined)
          setMusicVolume(settings.musicVolume);
      } catch (error) {
        // Failed to load audio settings - using defaults
      }
    }
  }, []);

  // Save game state to localStorage whenever player data changes
  useEffect(() => {
    localStorage.setItem(
      'elementalGameState',
      JSON.stringify(gameState.player)
    );
  }, [gameState.player]);

  // Save audio settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      'audioSettings',
      JSON.stringify({
        musicVolume,
      })
    );
  }, [musicVolume]);

  // Manage modal-open class for rules page
  useEffect(() => {
    if (rulesPageOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [rulesPageOpen]);

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
      if (
        updates.winStreak !== undefined &&
        updates.winStreak > newPlayer.bestStreak
      ) {
        newPlayer.bestStreak = updates.winStreak;
      }

      // Update experience and level
      if (updates.wins !== undefined && updates.wins > prev.player.wins) {
        // Victory gives more XP, bonus for win streaks
        let xpGain = 150;
        if (newPlayer.winStreak >= 5) {
          xpGain += 50; // Bonus for 5+ win streak
        } else if (newPlayer.winStreak >= 3) {
          xpGain += 25; // Bonus for 3+ win streak
        }
        newPlayer.experience += xpGain;
      } else if (
        updates.losses !== undefined &&
        updates.losses > prev.player.losses
      ) {
        // Defeat still gives some XP
        newPlayer.experience += 50;
      }

      // Check for level up
      if (updates.wins !== undefined || updates.losses !== undefined) {
        const oldLevel = newPlayer.level;
        const expNeeded = newPlayer.level * 1000;
        while (newPlayer.experience >= expNeeded) {
          newPlayer.level++;
          newPlayer.experience -= expNeeded;
          // Recalculate expNeeded for next level
          const nextExpNeeded = newPlayer.level * 1000;
          if (newPlayer.experience < nextExpNeeded) break;
        }

        // Show level up notification
        if (newPlayer.level > oldLevel) {
          setLevelUp(newPlayer.level);
          // Auto-dismiss after 3 seconds
          setTimeout(() => setLevelUp(null), 3000);
        }
      }

      // Update favorite element
      if (newPlayer.selectedElement) {
        newPlayer.elementStats[newPlayer.selectedElement]++;
        const mostUsed = Object.entries(newPlayer.elementStats).reduce(
          (a, b) => (a[1] > b[1] ? a : b)
        );
        if (mostUsed[1] > 0) {
          newPlayer.favoriteElement = ELEMENTS[mostUsed[0] as Element].name;
        }
      }

      // Update collection stats
      if (newPlayer.elementalCollection) {
        newPlayer.totalElementalsCollected =
          newPlayer.elementalCollection.totalOwned;
        newPlayer.immortalElementalsOwned =
          newPlayer.elementalCollection.totalImmortal;
        newPlayer.epicElementalsOwned = newPlayer.elementalCollection.totalEpic;
      }

      // Check achievements
      const achievementDefinitions = getAchievementDefinitions();
      const unlockedAchievements: string[] = [];

      achievementDefinitions.forEach(achievement => {
        if (
          !newPlayer.achievements.includes(achievement.id) &&
          achievement.condition(newPlayer)
        ) {
          unlockedAchievements.push(achievement.id);
        }
      });

      if (unlockedAchievements.length > 0) {
        newPlayer.achievements.push(...unlockedAchievements);
        setNewAchievements(unlockedAchievements);
      }

      return {
        ...prev,
        player: newPlayer,
      };
    });
  }, []);

  const selectLocation = useCallback(
    (location: Location) => {
      if (!canAffordLocation(gameState.player.mana, location)) return;

      updatePlayer({ selectedLocation: location });
      setGameState(prev => ({ ...prev, gamePhase: 'elementSelection' }));
    },
    [gameState.player.mana, updatePlayer]
  );

  const selectElement = useCallback(
    (element: Element) => {
      updatePlayer({ selectedElement: element });
      // Stay in elementSelection, just update state
    },
    [updatePlayer]
  );

  const selectElemental = useCallback(
    (elemental: ElementalRarity) => {
      updatePlayer({ selectedElemental: elemental });
    },
    [updatePlayer]
  );

  const returnToLocationSelection = useCallback(() => {
    updatePlayer({
      selectedLocation: null,
      selectedElement: null,
      selectedElemental: null,
    });
    setGameState(prev => ({ ...prev, gamePhase: 'menu' }));
  }, [updatePlayer]);

  const returnToElementSelection = useCallback(() => {
    updatePlayer({ selectedElement: null, selectedElemental: null });
    setGameState(prev => ({ ...prev, gamePhase: 'elementSelection' }));
  }, [updatePlayer]);

  const startBattleProcess = useCallback(() => {
    if (
      !gameState.player.selectedLocation ||
      !gameState.player.selectedElement
    ) {
      return;
    }

    const wager = LOCATIONS[gameState.player.selectedLocation].mana;
    if (gameState.player.mana < wager) {
      alert(
        `Not enough mana! You need ${wager} mana to play in ${
          LOCATIONS[gameState.player.selectedLocation].name
        }, but you only have ${gameState.player.mana}.`
      );
      return;
    }

    // Generate opponent immediately without matchmaking
    const opponent = generateOpponent(
      gameState.player.selectedLocation as Location
    );

    // For Free location, skip elemental selection and go directly to battle animation
    if (wager === 0) {
      const opponentElement = opponent.element || getRandomElement();
      const battleResult = calculateBattleResult(
        0, // baseWager is 0 for Free location
        gameState.player.selectedElement as Element,
        null, // no elemental for Free battles
        opponentElement,
        opponent.elemental || null,
        gameState.player.elementalCollection
      );

      setGameState(prev => ({
        ...prev,
        currentOpponent: opponent,
        opponentElement,
        initialBattleMana: prev.player.mana,
        battleResult: battleResult.winner,
        gamePhase: 'battleAnimation',
      }));
    } else {
      // For paid locations, show elemental selection
      setGameState(prev => ({
        ...prev,
        currentOpponent: opponent,
        gamePhase: 'elementalSelection',
      }));
    }
  }, [
    gameState.player.selectedLocation,
    gameState.player.selectedElement,
    gameState.player.mana,
    gameState.player.elementalCollection,
  ]);

  const startBattle = useCallback(() => {
    if (
      !gameState.player.selectedElement ||
      !gameState.currentOpponent ||
      !gameState.player.selectedLocation
    )
      return;

    // Get the wager amount
    const baseWager = gameState.currentOpponent.wager;
    const initialMana = gameState.player.mana;

    // Calculate battle result early
    const opponentElement =
      gameState.currentOpponent?.element || getRandomElement();

    const battleResult = calculateBattleResult(
      baseWager,
      gameState.player.selectedElement as Element,
      gameState.player.selectedElemental,
      opponentElement,
      gameState.currentOpponent?.elemental || null,
      gameState.player.elementalCollection
    );

    // Only subtract wager if it's greater than 0
    const newMana = baseWager > 0 ? initialMana - baseWager : initialMana;

    // Skip battle display and go directly to animation
    setGameState(prev => ({
      ...prev,
      opponentElement,
      initialBattleMana: initialMana,
      player: { ...prev.player, mana: newMana },
      battleResult: battleResult.winner,
      gamePhase: 'battleAnimation',
    }));
  }, [gameState.player, gameState.currentOpponent]);

  const onBattleAnimationComplete = useCallback(() => {
    if (
      !gameState.player.selectedElement ||
      !gameState.currentOpponent ||
      !gameState.player.selectedLocation ||
      !gameState.battleResult
    )
      return;

    const baseWager = gameState.currentOpponent.wager;
    const initialMana = gameState.initialBattleMana as number; // Use saved initial mana
    const opponentElement = gameState.opponentElement as Element;

    // Use the pre-calculated battle result
    const battleResult = calculateBattleResult(
      baseWager,
      gameState.player.selectedElement as Element,
      gameState.player.selectedElemental,
      opponentElement,
      gameState.currentOpponent?.elemental || null,
      gameState.player.elementalCollection
    );

    const finalManaChange = battleResult.playerManaChange;
    const actualWinner = gameState.battleResult; // Use pre-calculated result
    const protectionSaved = battleResult.protectionSaved;

    if (actualWinner === 'player') {
      // Player won
      updatePlayer({
        mana: initialMana + battleResult.playerManaChange,
        wins: gameState.player.wins + 1,
        winStreak: gameState.player.winStreak + 1,
        currentLossStreak: 0,
        totalManaWon:
          gameState.player.totalManaWon +
          Math.abs(battleResult.playerManaChange),
      });
    } else if (actualWinner === 'opponent') {
      // Player lost
      const newLossStreak = gameState.player.currentLossStreak + 1;
      updatePlayer({
        mana: initialMana + battleResult.playerManaChange, // playerManaChange is negative
        losses: gameState.player.losses + 1,
        winStreak: 0,
        currentLossStreak: newLossStreak,
        maxLossStreak: Math.max(gameState.player.maxLossStreak, newLossStreak),
        totalManaLost:
          gameState.player.totalManaLost +
          Math.abs(battleResult.playerManaChange),
      });
    } else {
      // True draw
      updatePlayer({
        mana: initialMana, // Return the wager
      });
    }

    // Create battle log
    const battleLog = {
      playerElement: gameState.player.selectedElement as Element,
      opponentElement,
      playerElemental: gameState.player.selectedElemental,
      opponentElemental: gameState.currentOpponent?.elemental || null,
      baseWager,
      protectionSaved,
      finalChange: finalManaChange,
      winner: actualWinner,
    };

    // Add experience to used elemental and chance to get new elemental
    let updatedCollection = gameState.player.elementalCollection;

    // Add experience to used elemental if one was used
    if (gameState.player.selectedElemental) {
      const usedElemental = Object.values(updatedCollection.elementals).find(
        e =>
          e.element === gameState.player.selectedElement &&
          e.rarity === gameState.player.selectedElemental
      );

      if (usedElemental) {
        const expGain = actualWinner === 'player' ? 50 : 25;
        const updatedElemental = addExperienceToElemental(
          usedElemental,
          expGain
        );
        updatedElemental.timesUsed += 1;
        const elementalWithCooldown = setElementalCooldown(updatedElemental);
        updatedCollection.elementals[usedElemental.id] = elementalWithCooldown;
      }
    }

    // Chance to get new elemental (higher chance for wins)
    const elementalChance = actualWinner === 'player' ? 0.6 : 0.3;
    if (Math.random() < elementalChance) {
      const reward = getRandomElementalReward();
      const elementalData = ELEMENTAL_TYPES[reward.element][reward.rarity];
      updatedCollection = addElementalToCollection(
        updatedCollection,
        reward.element,
        reward.rarity
      );

      // Show notification for new elemental
      setNewElementalReward({
        element: reward.element,
        rarity: reward.rarity,
        name: elementalData.name,
        emoji: elementalData.emoji,
      });
    }

    setGameState(prev => ({
      ...prev,
      battleLog,
      gamePhase: 'result',
      player: {
        ...prev.player,
        elementalCollection: updatedCollection,
      },
    }));
  }, [
    gameState.player.selectedElement,
    gameState.player.selectedLocation,
    gameState.player.selectedElemental,
    gameState.player.wins,
    gameState.player.winStreak,
    gameState.player.totalManaWon,
    gameState.player.currentLossStreak,
    gameState.player.losses,
    gameState.player.maxLossStreak,
    gameState.player.totalManaLost,
    gameState.currentOpponent,
    gameState.initialBattleMana,
    gameState.opponentElement,
    gameState.battleResult,
    gameState.player.elementalCollection,
    updatePlayer,
  ]);

  const returnToMenu = useCallback(() => {
    setActiveTab('battle'); // Switch to battle tab
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
        selectedElemental: null,
      },
    }));
  }, []);

  // Handle tab changes - if on result page, return to menu first
  const handleTabChange = useCallback(
    (tab: 'profile' | 'battle' | 'collection') => {
      if (gameState.gamePhase === 'result') {
        // If on result page, return to menu first
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
            selectedElemental: null,
          },
        }));
      }
      setActiveTab(tab);
    },
    [gameState.gamePhase]
  );

  const dismissAchievement = useCallback((achievementId: string) => {
    setNewAchievements(prev => prev.filter(id => id !== achievementId));
  }, []);

  const dismissElementalReward = useCallback(() => {
    setNewElementalReward(null);
  }, []);

  // Auto-dismiss elemental reward notification after 5 seconds
  useEffect(() => {
    if (newElementalReward) {
      const timer = setTimeout(() => {
        setNewElementalReward(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [newElementalReward]);

  const levelUpElementalById = useCallback((elementalId: string) => {
    setGameState(prev => {
      const elemental = prev.player.elementalCollection.elementals[elementalId];
      if (!elemental || !canLevelUpElemental(elemental, prev.player.mana))
        return prev;

      const maxLevel = getMaxLevelForRarity(elemental.rarity);
      const canUpgradeRarity =
        elemental.level >= maxLevel && elemental.rarity !== 'immortal';

      // Determine the correct cost based on upgrade type
      const cost = canUpgradeRarity
        ? getRarityUpgradeCost(elemental.rarity)
        : getLevelUpCost(elemental);

      const leveledElemental = levelUpElemental(elemental);

      // If rarity was upgraded, replace the old elemental with the new one
      if (leveledElemental.id !== elementalId) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [elementalId]: removed, ...remainingElementals } =
          prev.player.elementalCollection.elementals;
        const updatedElementals = {
          ...remainingElementals,
          [leveledElemental.id]: leveledElemental,
        };

        // Update collection statistics
        const totalOwned = Object.keys(updatedElementals).length;
        const immortalCount = Object.values(updatedElementals).filter(
          e => e.rarity === 'immortal'
        ).length;
        const epicCount = Object.values(updatedElementals).filter(
          e => e.rarity === 'epic'
        ).length;

        // Force React to re-render by creating a new object reference
        return {
          ...prev,
          player: {
            ...prev.player,
            mana: prev.player.mana - cost,
            totalElementalsCollected: totalOwned,
            immortalElementalsOwned: immortalCount,
            epicElementalsOwned: epicCount,
            elementalCollection: {
              ...prev.player.elementalCollection,
              elementals: updatedElementals,
              totalOwned,
              totalImmortal: immortalCount,
              totalEpic: epicCount,
            },
          },
        };
      }

      // Normal level up - just update the existing elemental
      const updatedElementals = {
        ...prev.player.elementalCollection.elementals,
        [elementalId]: leveledElemental,
      };

      // Update collection statistics
      const totalOwned = Object.keys(updatedElementals).length;
      const immortalCount = Object.values(updatedElementals).filter(
        e => e.rarity === 'immortal'
      ).length;

      return {
        ...prev,
        player: {
          ...prev.player,
          mana: prev.player.mana - cost,
          totalElementalsCollected: totalOwned,
          immortalElementalsOwned: immortalCount,
          elementalCollection: {
            ...prev.player.elementalCollection,
            elementals: updatedElementals,
            totalOwned,
            totalImmortal: immortalCount,
          },
        },
      };
    });
  }, []);

  // Reset cache and restore initial game state
  const resetGameCache = useCallback(() => {
    // Clear all localStorage data
    localStorage.removeItem('elementalGameState');
    localStorage.removeItem('audioSettings');

    // Reset game state to initial values
    setGameState({
      player: INITIAL_PLAYER,
      currentOpponent: null,
      opponentElement: null,
      gamePhase: 'menu',
      battleLog: null,
    });

    // Reset audio settings to defaults
    setMusicVolume(0.2);
    setMusicEnabled(false);
    setUserInteracted(false);

    // Reset other states
    setNewAchievements([]);
    setLevelUp(null);
    setNewElementalReward(null);
    setActiveTab('battle');
    setSettingsOpen(false);
    setRulesPageOpen(false);
  }, []);

  // Handle user interaction to enable music
  const handleUserInteraction = useCallback(() => {
    if (!userInteracted) {
      setUserInteracted(true);
      setMusicEnabled(true);
    }
  }, [userInteracted]);

  // Enable music after user interaction
  useEffect(() => {
    const handleKeyDown = () => {
      if (!userInteracted) {
        setUserInteracted(true);
        setMusicEnabled(true);
      }
    };

    if (!userInteracted) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('click', handleUserInteraction);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('click', handleUserInteraction);
      };
    }
    return undefined;
  }, [userInteracted, handleUserInteraction]);

  return (
    <>
      {/* Audio Player */}
      <AudioPlayer isPlaying={musicEnabled} volume={musicVolume} />

      {/* Settings Menu */}
      <SettingsMenu
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        musicVolume={musicVolume}
        onMusicVolumeChange={setMusicVolume}
        onOpenRules={() => {
          setSettingsOpen(false);
          setRulesPageOpen(true);
        }}
        onResetCache={resetGameCache}
      />

      {/* Rules Page */}
      {rulesPageOpen && (
        <RulesPage onBackToSettings={() => setRulesPageOpen(false)} />
      )}

      <div className='app' onClick={handleUserInteraction}>
        <div className='app-content'>
          {activeTab === 'profile' &&
            gameState.gamePhase !== 'result' &&
            gameState.gamePhase !== 'battleAnimation' && (
              <ProfileTab
                player={gameState.player}
                rank={getRank(gameState.player.level)}
                title={getTitle(
                  gameState.player.wins,
                  gameState.player.winStreak
                )}
              />
            )}

          {activeTab === 'battle' &&
            gameState.gamePhase !== 'result' &&
            gameState.gamePhase !== 'battleAnimation' && (
              <BattleComponent
                gameState={gameState}
                onSelectLocation={selectLocation}
                onSelectElement={selectElement}
                onSelectElemental={selectElemental}
                onReturnToLocationSelection={returnToLocationSelection}
                onReturnToElementSelection={returnToElementSelection}
                onStartMatchmaking={startBattleProcess}
                onStartBattle={startBattle}
                onReturnToMenu={returnToMenu}
              />
            )}

          {activeTab === 'collection' &&
            gameState.gamePhase !== 'result' &&
            gameState.gamePhase !== 'battleAnimation' && (
              <CollectionTab
                player={gameState.player}
                onLevelUpElemental={levelUpElementalById}
              />
            )}

          {gameState.gamePhase === 'battleAnimation' && (
            <BattleAnimationPixi
              gameState={gameState}
              opponentElement={gameState.opponentElement as Element}
              onAnimationComplete={onBattleAnimationComplete}
              battleResult={gameState.battleResult}
            />
          )}

          {gameState.gamePhase === 'result' && (
            <BattleResultPage
              gameState={gameState}
              onReturnToMenu={returnToMenu}
            />
          )}
        </div>

        {/* Achievement Notifications */}
        {newAchievements.map(achievementId => {
          const achievement = getAchievementDefinitions().find(
            a => a.id === achievementId
          );
          return achievement ? (
            <AchievementNotification
              key={achievementId}
              achievement={achievement}
              onDismiss={() => dismissAchievement(achievementId)}
            />
          ) : null;
        })}

        {/* Level Up Notification */}
        {levelUp && (
          <div className='achievement-notification show'>
            <div className='achievement-popup level-up'>
              <div className='achievement-popup-icon'>⭐</div>
              <div>
                <div className='achievement-popup-title'>Level Up!</div>
                <div className='achievement-popup-name'>Level {levelUp}</div>
                <div className='achievement-popup-desc'>
                  You&apos;ve gained a new level!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* New Elemental Reward Notification */}
        {newElementalReward && (
          <div className='achievement-notification show'>
            <div className='achievement-popup elemental-reward'>
              <div className='achievement-popup-icon'>
                {newElementalReward.emoji}
              </div>
              <div>
                <div className='achievement-popup-title'>New Elemental!</div>
                <div className='achievement-popup-name'>
                  {newElementalReward.name}
                </div>
                <div className='achievement-popup-desc'>
                  You&apos;ve found a new {newElementalReward.rarity} elemental!
                </div>
                <button
                  className='achievement-dismiss-btn'
                  onClick={dismissElementalReward}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation outside of app container */}
      <Navigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenSettings={() => setSettingsOpen(true)}
      />
    </>
  );
};

export default App;
