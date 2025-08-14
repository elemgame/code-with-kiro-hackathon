import React from 'react';
import { getAchievementDefinitions } from '../gameLogic';
import { PlayerStats } from '../types';

interface ProfileTabProps {
  player: PlayerStats;
  rank: string;
  title: string;
}

const ProfileTab: React.FC<ProfileTabProps> = ({
  player,
  rank,
  title: _title,
}) => {
  const expNeeded = player.level * 1000;
  const expPercent = (player.experience / expNeeded) * 100;

  const winRate =
    player.totalBattles > 0
      ? Math.round((player.wins / player.totalBattles) * 100)
      : 0;

  const achievementDefinitions = getAchievementDefinitions();
  const unlockedAchievements = achievementDefinitions.filter(a =>
    player.achievements.includes(a.id)
  );
  const lockedAchievements = achievementDefinitions.filter(
    a => !player.achievements.includes(a.id)
  );

  const displayAchievements = [
    ...unlockedAchievements.slice(-3),
    ...lockedAchievements.slice(0, 2),
  ];

  return (
    <main className='profile-container'>
      {/* Hero Section */}
      <div className='profile-hero'>
        <div className='hero-background'>
          <div className='hero-gradient'></div>
          <div className='hero-pattern'></div>
        </div>

        <div className='hero-content'>
          <div className='profile-avatar-modern'>
            <div className='avatar-glow'></div>
            <div className='avatar-circle'>
              <span className='avatar-emoji'>⚔️</span>
            </div>
          </div>

          <div className='profile-identity'>
            <h1 className='player-name-modern'>{player.name}</h1>
            <div className='player-title-modern'>{rank}</div>
          </div>
        </div>

        {/* Experience Progress */}
        <div className='experience-section'>
          <div className='exp-header'>
            <span className='exp-label'>Experience</span>
            <span className='exp-values'>
              {player.experience} / {expNeeded} XP
            </span>
          </div>
          <div className='exp-bar-modern'>
            <div
              className='exp-fill-modern'
              style={{ width: `${expPercent}%` }}
            >
              <div className='exp-shine'></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='stats-grid-modern'>
        <div className='stat-card-modern'>
          <div className='stat-value-modern'>
            {player.mana.toLocaleString()}
          </div>
          <div className='stat-label-modern'>Mana</div>
        </div>

        <div className='stat-card-modern'>
          <div className='stat-value-modern'>{player.wins}</div>
          <div className='stat-label-modern'>Victories</div>
        </div>

        <div className='stat-card-modern'>
          <div className='stat-value-modern'>{player.winStreak}</div>
          <div className='stat-label-modern'>Streak</div>
        </div>

        <div className='stat-card-modern'>
          <div className='stat-value-modern'>{player.totalBattles}</div>
          <div className='stat-label-modern'>Battles</div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className='achievements-modern'>
        <div className='section-header-modern'>
          <h2 className='section-title-modern'>
            <span className='section-icon'>🏅</span>
            Achievements
          </h2>
          <div className='achievements-count'>
            {unlockedAchievements.length} / {achievementDefinitions.length}
          </div>
        </div>

        <div className='achievements-grid'>
          {displayAchievements.map(achievement => {
            const isUnlocked = player.achievements.includes(achievement.id);

            return (
              <div
                key={achievement.id}
                className={`achievement-card-modern ${isUnlocked ? 'unlocked' : 'locked'}`}
              >
                <div className='achievement-icon-modern'>
                  {isUnlocked ? achievement.icon : '🔒'}
                </div>
                <div className='achievement-content'>
                  <div className='achievement-name-modern'>
                    {achievement.name}
                  </div>
                  <div className='achievement-desc-modern'>
                    {achievement.desc}
                  </div>
                </div>
                {isUnlocked && <div className='achievement-glow'></div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Stats */}
      <div className='additional-stats'>
        <div className='stats-row'>
          <div className='mini-stat'>
            <div className='mini-stat-icon'>🎯</div>
            <div className='mini-stat-content'>
              <div className='mini-stat-value'>{winRate}%</div>
              <div className='mini-stat-label'>Win Rate</div>
            </div>
          </div>

          <div className='mini-stat'>
            <div className='mini-stat-icon'>💎</div>
            <div className='mini-stat-content'>
              <div className='mini-stat-value'>
                {player.totalManaWon.toLocaleString()}
              </div>
              <div className='mini-stat-label'>Mana Won</div>
            </div>
          </div>

          <div className='mini-stat'>
            <div className='mini-stat-icon'>🌟</div>
            <div className='mini-stat-content'>
              <div className='mini-stat-value'>
                {player.favoriteElement || 'None'}
              </div>
              <div className='mini-stat-label'>Element</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfileTab;
