import React from 'react';

interface NavigationProps {
  activeTab: 'profile' | 'battle' | 'collection';
  onTabChange: (tab: 'profile' | 'battle' | 'collection') => void;
  onOpenSettings?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  onOpenSettings,
}) => {
  const handleTabClick = (tab: 'profile' | 'battle' | 'collection') => {
    onTabChange(tab);

    // Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  return (
    <nav className='mobile-nav'>
      <div className='nav-container'>
        <div
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => handleTabClick('profile')}
        >
          <div className='nav-icon'>👤</div>
          <div className='nav-label'>Profile</div>
        </div>
        <div
          className={`nav-item ${activeTab === 'battle' ? 'active' : ''}`}
          onClick={() => handleTabClick('battle')}
        >
          <div className='nav-icon'>⚔️</div>
          <div className='nav-label'>Battle</div>
        </div>

        <div
          className={`nav-item ${activeTab === 'collection' ? 'active' : ''}`}
          onClick={() => handleTabClick('collection')}
        >
          <div className='nav-icon'>📦</div>
          <div className='nav-label'>Collection</div>
        </div>

        {onOpenSettings && (
          <div className='nav-item' onClick={onOpenSettings}>
            <div className='nav-icon'>⚙️</div>
            <div className='nav-label'>Settings</div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
