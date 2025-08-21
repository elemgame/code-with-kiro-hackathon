import React, { useState } from 'react';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  musicVolume: number;
  onMusicVolumeChange: (volume: number) => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({
  isOpen,
  onClose,
  musicVolume,
  onMusicVolumeChange,
}) => {
  const [previousVolume, setPreviousVolume] = useState<number>(musicVolume);
  const [isMuted, setIsMuted] = useState<boolean>(false);

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
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-menu" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="settings-content">
          {/* Music Settings */}
          <div className="setting-group">
            <div className="setting-header">
              <span className="setting-icon">🎵</span>
              <span className="setting-label">Music Volume</span>
            </div>

            <div className="slider-container">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={Math.round(musicVolume * 100)}
                onChange={(e) => {
                  const newVolume = parseInt(e.target.value) / 100;
                  onMusicVolumeChange(newVolume);
                  // Update muted state when slider is moved
                  if (newVolume > 0 && isMuted) {
                    setIsMuted(false);
                  }
                }}
                className="volume-slider"
              />
              <span
                className="volume-value"
                onClick={handleVolumeClick}
                style={{ cursor: 'pointer' }}
              >
                {Math.round(musicVolume * 100)}%
              </span>
            </div>

          </div>



          {/* Additional Settings */}
          <div className="setting-group">
            <div className="setting-header">
              <span className="setting-icon">🎮</span>
              <span className="setting-label">Graphics</span>
            </div>

            <div className="setting-item">
              <span>Animations</span>
              <div className="toggle-switch">
                <input type="checkbox" id="animations" defaultChecked />
                <label htmlFor="animations"></label>
              </div>
            </div>

            <div className="setting-item">
              <span>Particles</span>
              <div className="toggle-switch">
                <input type="checkbox" id="particles" defaultChecked />
                <label htmlFor="particles"></label>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default SettingsMenu;
