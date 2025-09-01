import React, { useEffect, useState } from 'react';
import { getAvailableMana } from '../gameLogic';
import { PlayerStats } from '../types';

interface ProfileHeaderProps {
  player: PlayerStats;
  onClick?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ player, onClick }) => {
  const [hideProgress, setHideProgress] = useState(0);

  // Smoothly fade and slightly translate the profile header as the user scrolls
  useEffect(() => {
    const container = document.querySelector('.app');
    if (!container) return undefined;

    const handleScroll = () => {
      const scrollTop = (container as HTMLElement).scrollTop || 0;
      // Map first 60px of scroll to 0..1 progress
      const progress = Math.max(0, Math.min(1, scrollTop / 60));
      setHideProgress(progress);
    };

    handleScroll();
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const style: React.CSSProperties = {
    opacity: 1 - hideProgress,
    transform: `translateY(${hideProgress * -6}px) scale(${1 - hideProgress * 0.02})`,
  };

  const avatarContent = player.avatar ? (
    <img className='ph-avatar-img' src={player.avatar} alt='Avatar' />
  ) : (
    <span className='ph-avatar'>⚔️</span>
  );

  const displayedMana = getAvailableMana(player.mana, player.selectedLocation);

  return (
    <div className='profile-header-modern' style={style}>
      <button className='ph-left' onClick={onClick} aria-label='Open profile'>
        <span className='ph-avatar-wrap'>{avatarContent}</span>
        <span className='ph-name'>{player.name}</span>
      </button>
      <div className='ph-right' title='Your mana'>
        <span className='ph-mana'>💎 {displayedMana}</span>
      </div>
    </div>
  );
};

export default ProfileHeader;
