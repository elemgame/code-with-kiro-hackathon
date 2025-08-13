import React from 'react';
import { PlayerStats } from '../types';
import { getAchievementDefinitions, getAchievementProgress } from '../gameLogic';

interface ProfileTabProps {
  player: PlayerStats;
  rank: string;
  title: string;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ player, rank, title }) => {
  const expNeeded = player.level * 1000;
  const expPercent = (player.experience / expNeeded) * 100;
  
  const winRate = player.totalBattles > 0 ? 
    Math.round((player.wins / player.totalBattles) * 100) : 0;
  
  const lossRate = player.totalBattles > 0 ? 
    Math.round((player.losses / player.totalBattles) * 100) : 0;

  const achievementDefinitions = getAchievementDefinitions();
  const unlockedAchievements = achievementDefinitions.filter(a => 
    player.achievements.includes(a.id)
  );
  const lockedAchievements = achievementDefinitions.filter(a => 
    !player.achievements.includes(a.id)
  );
  
  const displayAchievements = [
    ...unlockedAchievements.slice(-3),
    ...lockedAchievements.slice(0, 2)
  ];

  return (
    <main style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-ring">
              <div className="avatar-inner">⚔️</div>
            </div>
            <div className="rank-badge">{rank}</div>
          </div>
          <div className="profile-info">
            <div className="player-name">{player.name}</div>
            <div className="player-title">{title}</div>
            <div className="experience-bar">
              <div className="exp-fill" style={{ width: `${expPercent}%` }}></div>
              <span className="exp-text">{player.experience} / {expNeeded} XP</span>
            </div>
          </div>
        </div>

        <div className="enhanced-stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-value">{player.mana}</div>
              <div className="stat-label">Mana</div>
              <div className={`stat-change ${player.lastManaChange < 0 ? 'negative' : ''}`}>
                {player.lastManaChange > 0 ? '+' : ''}{player.lastManaChange}
              </div>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <div className="stat-value">{player.wins}</div>
              <div className="stat-label">Victories</div>
              <div className="stat-subtext">{winRate}% Win Rate</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <div className="stat-value">{player.winStreak}</div>
              <div className="stat-label">Streak</div>
              <div className="stat-subtext">
                {player.winStreak === 0 ? 'No streak' : 
                 player.winStreak === 1 ? '1 win in a row' : 
                 `${player.winStreak} wins in a row`}
              </div>
            </div>
          </div>

          <div className="stat-card danger">
            <div className="stat-icon">💀</div>
            <div className="stat-content">
              <div className="stat-value">{player.losses}</div>
              <div className="stat-label">Defeats</div>
              <div className="stat-subtext">{lossRate}% Loss Rate</div>
            </div>
          </div>
        </div>

        <div className="achievements-section">
          <div className="section-title">Recent Achievements</div>
          <div className="achievements-list">
            {displayAchievements.map(achievement => {
              const isUnlocked = player.achievements.includes(achievement.id);
              const progress = getAchievementProgress(achievement, player);
              
              return (
                <div key={achievement.id} className={`achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`}>
                  <div className="achievement-icon">
                    {isUnlocked ? achievement.icon : '🔒'}
                  </div>
                  <div className="achievement-text">
                    <div className="achievement-name">{achievement.name}</div>
                    <div className="achievement-desc">{achievement.desc}</div>
                    {!isUnlocked && progress && (
                      <div className="achievement-progress">{progress}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="quick-stats">
          <div className="quick-stat">
            <span className="quick-stat-label">Total Battles:</span>
            <span className="quick-stat-value">{player.totalBattles}</span>
          </div>
          <div className="quick-stat">
            <span className="quick-stat-label">Best Streak:</span>
            <span className="quick-stat-value">{player.bestStreak}</span>
          </div>
          <div className="quick-stat">
            <span className="quick-stat-label">Favorite Element:</span>
            <span className="quick-stat-value">{player.favoriteElement || 'None'}</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfileTab;