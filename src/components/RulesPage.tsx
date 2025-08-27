import React from 'react';
import RulesTab from './RulesTab';

interface RulesPageProps {
  onBackToSettings: () => void;
}

const RulesPage: React.FC<RulesPageProps> = ({ onBackToSettings }) => {
  return (
    <div className='rules-page'>
      <div className='rules-page-header'>
        <h1 className='rules-page-title'>Game Rules</h1>
        <button className='close-rules-button' onClick={onBackToSettings}>
          <span className='close-icon'>✕</span>
        </button>
      </div>

      <div className='rules-scroll-container'>
        <RulesTab />
      </div>
    </div>
  );
};

export default RulesPage;
