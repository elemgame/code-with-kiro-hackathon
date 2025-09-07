import React, { useEffect, useState } from 'react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetSelector?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'hover' | 'focus';
}

interface TutorialTooltipProps {
  steps: TutorialStep[];
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const TutorialTooltip: React.FC<TutorialTooltipProps> = ({
  steps,
  isActive,
  onComplete,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isActive && steps.length > 0) {
      setIsVisible(true);
      setCurrentStep(0);
    } else {
      setIsVisible(false);
    }
  }, [isActive, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsVisible(false);
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    onSkip();
  };

  const step = steps[currentStep];

  if (!isVisible || !step) {
    return null;
  }

  return (
    <div
      className="tutorial-overlay"
      role="dialog"
      aria-labelledby="tutorial-title"
      aria-describedby="tutorial-description"
      aria-modal="true"
    >
      <div className="tutorial-backdrop" onClick={handleSkip} />

      <div className="tutorial-tooltip">
        <div className="tutorial-header">
          <h3 id="tutorial-title" className="tutorial-title">
            {step.title}
          </h3>
          <button
            className="tutorial-close"
            onClick={handleSkip}
            aria-label="Skip tutorial"
          >
            ✕
          </button>
        </div>

        <div id="tutorial-description" className="tutorial-content">
          <p>{step.description}</p>
        </div>

        <div className="tutorial-footer">
          <div className="tutorial-progress">
            <span className="tutorial-step-counter">
              {currentStep + 1} of {steps.length}
            </span>
            <div className="tutorial-progress-bar">
              <div
                className="tutorial-progress-fill"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="tutorial-buttons">
            {currentStep > 0 && (
              <button
                className="tutorial-btn tutorial-btn-secondary"
                onClick={handlePrevious}
                aria-label="Previous step"
              >
                ← Previous
              </button>
            )}

            <button
              className="tutorial-btn tutorial-btn-primary"
              onClick={handleNext}
              aria-label={currentStep === steps.length - 1 ? "Complete tutorial" : "Next step"}
            >
              {currentStep === steps.length - 1 ? 'Complete' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Pre-defined tutorial steps for different sections
export const BATTLE_TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: '🎮 Welcome to Elemental Arena!',
    description: 'Learn how to battle with elemental forces! This tutorial will guide you through the battle process step by step.',
  },
  {
    id: 'location-selection',
    title: '🏟️ Choose Your Battlefield',
    description: 'First, select a battle location. Free battles cost no mana and are perfect for practice. Paid locations offer better rewards but require mana.',
    targetSelector: '.location-grid',
  },
  {
    id: 'element-selection',
    title: '⚔️ Select Your Element',
    description: 'Choose your battle element wisely! Earth beats Water, Water beats Fire, and Fire beats Earth. Each element has unique strengths.',
    targetSelector: '.element-grid',
  },
  {
    id: 'elemental-selection',
    title: '🌟 Pick Your Elemental',
    description: 'Elementals provide protection against damage. Higher rarity elementals offer better protection but have longer cooldowns after use.',
    targetSelector: '.elemental-grid',
  },
  {
    id: 'keyboard-navigation',
    title: '⌨️ Keyboard Navigation',
    description: 'You can use arrow keys to navigate, Enter to select, and Tab to move between sections. This makes the game accessible for all players!',
  },
  {
    id: 'complete',
    title: '🏆 Ready to Battle!',
    description: 'You\'re all set! Remember: practice with free battles first, collect elementals by winning, and upgrade them in your collection. Good luck!',
  },
];

export const COLLECTION_TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'collection-welcome',
    title: '📦 Your Elemental Collection',
    description: 'Here you can view, organize, and upgrade all your collected elementals. Each elemental is unique with its own level and stats.',
  },
  {
    id: 'filters',
    title: '🔍 Filtering Your Collection',
    description: 'Use the filters to find specific elementals by element type or rarity. This helps you quickly locate the elemental you want to use or upgrade.',
    targetSelector: '.collection-filters-modern',
  },
  {
    id: 'elemental-cards',
    title: '🎴 Elemental Cards',
    description: 'Each card shows your elemental\'s stats: rarity, level, protection percentage, and usage count. Click to upgrade when you have enough mana!',
    targetSelector: '.collectible-cards-grid',
  },
  {
    id: 'upgrading',
    title: '⬆️ Upgrading Elementals',
    description: 'Level up elementals to increase their power. At max level, you can upgrade their rarity for even better protection and new abilities!',
  },
];

export default TutorialTooltip;
