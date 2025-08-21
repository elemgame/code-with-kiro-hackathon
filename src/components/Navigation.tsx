import React from 'react';

interface NavigationProps {
  activeTab: 'profile' | 'battle' | 'rules';
  onTabChange: (tab: 'profile' | 'battle' | 'rules') => void;
  onOpenSettings?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  onOpenSettings,
}) => {
  const handleTabClick = (tab: 'profile' | 'battle' | 'rules') => {
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
          className={`nav-item ${activeTab === 'rules' ? 'active' : ''}`}
          onClick={() => handleTabClick('rules')}
        >
          <div className='nav-icon'>📜</div>
          <div className='nav-label'>Rules</div>
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
