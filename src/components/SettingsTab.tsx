import React from 'react';

interface SettingsTabProps {
  musicVolume: number;
  onMusicVolumeChange: (volume: number) => void;
  onOpenRules?: () => void;
  onResetCache: () => void;
  onShowBattleTutorial?: () => void;
  onShowCollectionTutorial?: () => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  musicVolume,
  onMusicVolumeChange,
  onOpenRules,
  onResetCache,
  onShowBattleTutorial,
  onShowCollectionTutorial,
}) => {
  return (
    <div className='settings-tab'>
      <div className='settings-container'>
        <div className='settings-header'>
          <h2>Settings</h2>
        </div>

        <div className='settings-content'>
          {/* Music Settings */}

          <div className='music-volume-container'>
            <div className='music-volume-slider-wrapper'>
              <input
                type='range'
                min='0'
                max='100'
                step='1'
                value={Math.round(musicVolume * 100)}
                onChange={e => {
                  const newVolume = parseInt(e.target.value) / 100;
                  onMusicVolumeChange(newVolume);
                }}
                className='music-volume-slider'
                style={{
                  background: `linear-gradient(to right, var(--primary-gold) 0%, var(--primary-gold) ${Math.round(musicVolume * 100)}%, rgba(255, 255, 255, 0.1) ${Math.round(musicVolume * 100)}%, rgba(255, 255, 255, 0.1) 100%)`,
                }}
              />
              <div className='music-volume-label'>
                <span className='music-icon'>🎵</span>
                <span className='music-text'>Music Volume</span>
                <span className='music-percentage'>
                  {Math.round(musicVolume * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Rules Button */}
          {onOpenRules && (
            <button className='rules-button' onClick={onOpenRules}>
              <span className='rules-icon'>📖</span>
              <span className='span-text'>View Game Rules</span>
            </button>
          )}

          {/* Tutorial Buttons */}
          <div className='tutorial-section'>
            <h3 className='tutorial-section-title'>
              <span>🎓</span>
              <span>Tutorials & Help</span>
            </h3>

            {onShowBattleTutorial && (
              <button className='tutorial-button battle-tutorial' onClick={onShowBattleTutorial}>
                <span className='tutorial-icon'>⚔️</span>
                <div className='tutorial-content'>
                  <span className='tutorial-title'>Battle Tutorial</span>
                  <span className='tutorial-description'>Learn how to battle and select elementals</span>
                </div>
              </button>
            )}

            {onShowCollectionTutorial && (
              <button className='tutorial-button collection-tutorial' onClick={onShowCollectionTutorial}>
                <span className='tutorial-icon'>📦</span>
                <div className='tutorial-content'>
                  <span className='tutorial-title'>Collection Tutorial</span>
                  <span className='tutorial-description'>Discover how to manage and upgrade elementals</span>
                </div>
              </button>
            )}
          </div>

          {/* Cache Reset */}
          <button
            className='reset-cache-button'
            onClick={() => {
              if (
                onResetCache &&
                window.confirm(
                  'Are you sure you want to reset all game data? This will restore the game to its initial state and cannot be undone.'
                )
              ) {
                onResetCache();
              }
            }}
          >
            <span className='reset-icon'>🔄</span>
            <span className='span-text'>Reset Game Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
