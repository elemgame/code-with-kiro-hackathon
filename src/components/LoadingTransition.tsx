import React, { useEffect, useState } from 'react';

interface LoadingTransitionProps {
  onComplete: () => void;
}

const LoadingTransition: React.FC<LoadingTransitionProps> = ({
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    '🔥 Choose elements strategically!',
    '💎 Collect rare elementals!',
    '⚡ Study opponent weaknesses!',
    '🎯 Develop your elementals!',
    '💰 Manage mana wisely!',
  ];

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            onComplete();
          }, 500);
          return 100;
        }
        return prev + Math.random() * 3 + 1;
      });
    }, 50);

    // Tips rotation
    const tipsInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % tips.length);
    }, 1500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(tipsInterval);
    };
  }, [onComplete, tips.length]);

  return (
    <div className='loading-transition'>
      {/* Background particles */}
      <div className='loading-particles'>
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className='loading-particle'
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Logo container */}
      <div className='loading-logo-container'>
        <img
          src='/resources/logo.svg'
          alt='Loading...'
          className='loading-logo'
        />
      </div>

      {/* Loading text */}
      <div className='loading-text'>
        <h2>Loading game...</h2>
        <div className='loading-subtitle'>Prepare for epic battles!</div>
      </div>

      {/* Progress bar */}
      <div className='loading-progress-container'>
        <div className='loading-progress-bar'>
          <div
            className='loading-progress-fill'
            style={{ width: `${progress}%` }}
          />
          <div className='loading-progress-glow' />
        </div>
        <div className='loading-progress-text'>{Math.round(progress)}%</div>
      </div>

      {/* Rotating tips */}
      <div className='loading-tips'>
        <div className='loading-tip' key={currentTip}>
          {tips[currentTip]}
        </div>
      </div>

      {/* Spinner */}
      <div className='loading-spinner'>
        <div className='loading-spinner-ring'></div>
        <div className='loading-spinner-ring'></div>
        <div className='loading-spinner-ring'></div>
      </div>
    </div>
  );
};

export default LoadingTransition;
