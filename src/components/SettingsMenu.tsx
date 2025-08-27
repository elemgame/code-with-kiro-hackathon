import React, { useEffect, useState } from 'react';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  musicVolume: number;
  onMusicVolumeChange: (volume: number) => void;
  onOpenRules?: () => void;
  onResetCache: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({
  isOpen,
  onClose,
  musicVolume,
  onMusicVolumeChange,
  onOpenRules,
  onResetCache,
}) => {
  const [previousVolume, setPreviousVolume] = useState<number>(musicVolume);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  const handleVolumeClick = () => {
    if (isMuted) {
      // Restore previous volume
      onMusicVolumeChange(previousVolume);
      setIsMuted(false);
    } else {
      // Save current volume and mute
      setPreviousVolume(musicVolume);
      onMusicVolumeChange(0);
      setIsMuted(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='settings-overlay' onClick={onClose}>
      <div className='settings-menu' onClick={e => e.stopPropagation()}>
        <div className='settings-header'>
          <h2>Settings</h2>
          <button className='close-button' onClick={onClose}>
            ✕
          </button>
        </div>

        <div className='settings-content'>
          {/* Music Settings */}
          <div className='setting-group'>
            <div className='setting-header'>
              <span className='setting-icon'>🎵</span>
              <span className='setting-label'>Music Volume</span>
            </div>

            <div className='slider-container'>
              <input
                type='range'
                min='0'
                max='100'
                step='1'
                value={Math.round(musicVolume * 100)}
                onChange={e => {
                  const newVolume = parseInt(e.target.value) / 100;
                  onMusicVolumeChange(newVolume);
                  // Update muted state when slider is moved
                  if (newVolume > 0 && isMuted) {
                    setIsMuted(false);
                  }
                }}
                className='volume-slider'
              />
              <span
                className='volume-value'
                onClick={handleVolumeClick}
                style={{ cursor: 'pointer' }}
              >
                {Math.round(musicVolume * 100)}%
              </span>
            </div>
          </div>

          {/* Rules Button */}
          {onOpenRules && (
            <button className='rules-button' onClick={onOpenRules}>
              <span className='rules-icon'>📖</span>
              <span>View Game Rules</span>
            </button>
          )}

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
                onClose();
              }
            }}
          >
            <span className='reset-icon'>🔄</span>
            <span>Reset Game Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsMenu;
