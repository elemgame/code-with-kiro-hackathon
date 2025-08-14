import React, { useEffect, useState } from 'react';
import { Achievement } from '../types';

interface AchievementNotificationProps {
  achievement: Achievement;
  onDismiss: () => void;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onDismiss,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show notification
    const showTimer = setTimeout(() => setIsVisible(true), 100);

    // Hide notification after 4 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 500);
    }, 4000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [onDismiss]);

  return (
    <div className={`achievement-notification ${isVisible ? 'show' : ''}`}>
      <div className='achievement-popup'>
        <div className='achievement-popup-icon'>{achievement.icon}</div>
        <div className='achievement-popup-text'>
          <div className='achievement-popup-title'>Achievement Unlocked!</div>
          <div className='achievement-popup-name'>{achievement.name}</div>
          <div className='achievement-popup-desc'>{achievement.desc}</div>
        </div>
      </div>
    </div>
  );
};

export default AchievementNotification;
