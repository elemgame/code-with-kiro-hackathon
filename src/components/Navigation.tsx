import React from 'react';

interface NavigationProps {
  activeTab: 'profile' | 'battle' | 'collection' | 'settings';
  onTabChange: (tab: 'profile' | 'battle' | 'collection' | 'settings') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const handleTabClick = (
    tab: 'profile' | 'battle' | 'collection' | 'settings'
  ) => {
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

        <div
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => handleTabClick('settings')}
        >
          <div className='nav-icon'>⚙️</div>
          <div className='nav-label'>Settings</div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
