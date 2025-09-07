import React, { useCallback, useEffect, useState } from 'react';

export interface TutorialStep {
  id: string;
  targetSelector: string; // CSS selector for the element to highlight
  title: string;
  description: string;
  phase: 'menu' | 'elementSelection' | 'elementalSelection'; // Which game phase this step belongs to
  position?: 'top' | 'bottom' | 'left' | 'right'; // Tooltip position relative to target
  actionRequired?: boolean; // Whether user must perform an action to continue
  triggerNext?: 'click' | 'auto'; // How to proceed to next step
}

interface StepByStepTutorialProps {
  isActive: boolean;
  currentPhase: string;
  steps: TutorialStep[];
  onComplete: () => void;
  onSkip: () => void;
}

const StepByStepTutorial: React.FC<StepByStepTutorialProps> = ({
  isActive,
  currentPhase,
  steps,
  onComplete,
  onSkip,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [highlightPosition, setHighlightPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    borderRadius: '8px',
  });

  // Find steps for current phase
  const currentPhaseSteps = steps.filter(step => step.phase === currentPhase);
  const currentStep = currentPhaseSteps[currentStepIndex];

  // Function to update all positions based on target element
  const updateAllPositions = useCallback(
    (element: HTMLElement) => {
      if (!element || !currentStep) return;

      const rect = element.getBoundingClientRect();
      const position = currentStep.position || 'bottom';

      // Update highlight position
      const computedStyle = getComputedStyle(element);
      const borderRadius =
        computedStyle.borderRadius ||
        computedStyle.borderTopLeftRadius ||
        '8px';

      setHighlightPosition({
        top: rect.top - 6,
        left: rect.left - 6,
        width: rect.width + 12,
        height: rect.height + 12,
        borderRadius,
      });

      // Update tooltip position
      let top = 0;
      let left = 0;

      const tooltipWidth = 280;
      const tooltipHeight = 160;

      switch (position) {
        case 'top':
          top = rect.top - tooltipHeight - 40;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
        case 'bottom':
          top = rect.bottom + 40;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.left - tooltipWidth - 40;
          break;
        case 'right':
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.right + 40;
          break;
      }

      // Smart positioning for responsive behavior
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const padding = 20;
      top = Math.max(
        padding,
        Math.min(top, viewportHeight - tooltipHeight - padding)
      );
      left = Math.max(
        padding,
        Math.min(left, viewportWidth - tooltipWidth - padding)
      );

      const wouldOverlap =
        left < rect.right + 20 &&
        left + tooltipWidth > rect.left - 20 &&
        top < rect.bottom + 20 &&
        top + tooltipHeight > rect.top - 20;

      if (wouldOverlap) {
        if (rect.left > viewportWidth - rect.right) {
          left = rect.left - tooltipWidth - 40;
        } else {
          left = rect.right + 40;
        }
      }

      setTooltipPosition({ top, left });
    },
    [currentStep]
  );

  // Debug logging (removed for production)

  // Update target element when step changes
  useEffect(() => {
    if (!isActive || !currentStep) {
      setTargetElement(null);
      document.body.classList.remove('tutorial-active');
      document.querySelectorAll('.tutorial-target').forEach(el => {
        el.classList.remove('tutorial-target');
      });
      return;
    }

    const findTarget = () => {
      let element: HTMLElement | null = null;

      // Special handling for elemental selection - find first available (non-disabled) elemental
      if (currentStep.id === 'elemental-select') {
        // Wait for elemental grid to be fully rendered
        const elementalGrid = document.querySelector('.elemental-grid');
        if (!elementalGrid) {
          return; // Grid not ready yet, will retry
        }

        const elementalButtons = document.querySelectorAll('.elemental-grid .elemental-btn:not([disabled])');
        element = elementalButtons[0] as HTMLElement;

        // If no non-disabled elementals, fall back to first elemental (tutorial will enable it)
        if (!element) {
          element = document.querySelector('.elemental-grid .elemental-btn') as HTMLElement;
        }

        // Additional check: make sure the element is actually visible and has content
        if (element && (element.offsetWidth === 0 || element.offsetHeight === 0)) {
          element = null; // Element not fully rendered yet
          return;
        }
      } else {
        element = document.querySelector(currentStep.targetSelector) as HTMLElement;
      }

      if (element) {
        document.body.classList.add('tutorial-active');
        document.querySelectorAll('.tutorial-target').forEach(el => {
          el.classList.remove('tutorial-target');
        });
        element.classList.add('tutorial-target');

        setTargetElement(element);
        updateAllPositions(element);

        // Auto-proceed for steps that don't require user action
        if (currentStep.triggerNext === 'auto') {
          // Use a separate useEffect for auto-proceeding to avoid dependency issues
        }
      }
    };

    const isElementalStep = currentStep.id === 'elemental-select';

    // For elemental selection, add initial delay to let elements render
    const initialDelay = isElementalStep ? 200 : 0;

    const startSearch = () => {
      findTarget();

      // For elemental selection, we need more aggressive searching since elements might render later
      const searchInterval = isElementalStep ? 50 : 100;
      const maxAttempts = isElementalStep ? 20 : 5; // Up to 1 second for elemental step

      let attempts = 0;
      return setInterval(() => {
        attempts++;
        if (attempts >= maxAttempts) {
          return;
        }

        // Only search again if we haven't found the target yet
        if (!targetElement) {
          findTarget();
        }
      }, searchInterval);
    };

    let searchTimer: NodeJS.Timeout;
    const initialTimer = setTimeout(() => {
      searchTimer = startSearch();
    }, initialDelay);

    return () => {
      clearTimeout(initialTimer);
      if (searchTimer) {
        clearInterval(searchTimer);
      }
    };
  }, [isActive, currentStep, updateAllPositions, targetElement]);

  // Listen for elemental selection ready event
  useEffect(() => {
    if (currentStep?.id === 'elemental-select' && !targetElement) {
      const handleElementalReady = () => {
        // Retry finding target when elemental selection is ready
        setTimeout(() => {
          const element = document.querySelector('.elemental-grid .elemental-btn:not([disabled])') as HTMLElement ||
            document.querySelector('.elemental-grid .elemental-btn') as HTMLElement;

          if (element) {
            document.body.classList.add('tutorial-active');
            document.querySelectorAll('.tutorial-target').forEach(el => {
              el.classList.remove('tutorial-target');
            });
            element.classList.add('tutorial-target');

            setTargetElement(element);
            updateAllPositions(element);
          }
        }, 50);
      };

      window.addEventListener('elementalSelectionReady', handleElementalReady);
      return () => window.removeEventListener('elementalSelectionReady', handleElementalReady);
    }
    // Always return cleanup function or undefined
    return undefined;
  }, [currentStep, targetElement, updateAllPositions]);

  // Continuous position updates with ResizeObserver and requestAnimationFrame
  useEffect(() => {
    if (!targetElement) return;

    let animationFrameId: number;
    let resizeObserver: ResizeObserver;

    // Throttled continuous updates - only update if position actually changed
    let lastRect = targetElement.getBoundingClientRect();
    let lastViewportWidth = window.innerWidth;
    let lastViewportHeight = window.innerHeight;

    const continuousUpdate = () => {
      const currentRect = targetElement.getBoundingClientRect();
      const currentViewportWidth = window.innerWidth;
      const currentViewportHeight = window.innerHeight;

      // Only update if position, size, or viewport changed
      if (
        currentRect.top !== lastRect.top ||
        currentRect.left !== lastRect.left ||
        currentRect.width !== lastRect.width ||
        currentRect.height !== lastRect.height ||
        currentViewportWidth !== lastViewportWidth ||
        currentViewportHeight !== lastViewportHeight
      ) {
        updateAllPositions(targetElement);
        lastRect = currentRect;
        lastViewportWidth = currentViewportWidth;
        lastViewportHeight = currentViewportHeight;
      }

      animationFrameId = requestAnimationFrame(continuousUpdate);
    };

    // Start continuous updates
    animationFrameId = requestAnimationFrame(continuousUpdate);

    // Setup ResizeObserver for element size changes
    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(() => {
        updateAllPositions(targetElement);
      });
      resizeObserver.observe(targetElement);
      resizeObserver.observe(document.body); // Watch for layout changes
    }

    // Handle window resize and scroll
    const handleWindowChange = () => updateAllPositions(targetElement);
    window.addEventListener('resize', handleWindowChange, { passive: true });
    window.addEventListener('scroll', handleWindowChange, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', handleWindowChange);
      window.removeEventListener('scroll', handleWindowChange);
    };
  }, [targetElement, updateAllPositions]);

  const nextStep = useCallback(() => {
    // Find current step in overall tutorial
    const currentOverallIndex = steps.findIndex(s => s.id === currentStep?.id);

    if (currentOverallIndex < steps.length - 1) {
      // Move to next step in the overall tutorial
      const nextStepData = steps[currentOverallIndex + 1];

      if (nextStepData) {
        // If we're moving to a different phase, reset step index to 0
        if (nextStepData.phase !== currentPhase) {
          setCurrentStepIndex(0);
        } else {
          // Same phase, increment step index

          setCurrentStepIndex(currentStepIndex + 1);
        }
      }
    } else {
      // Tutorial complete

      onComplete();
    }
  }, [currentStepIndex, currentStep, currentPhase, steps, onComplete]);

  // Auto-proceed for steps that don't require user action
  useEffect(() => {
    if (!isActive || !currentStep || !targetElement) return undefined;

    if (currentStep.triggerNext === 'auto') {
      const autoTimer = setTimeout(() => {
        nextStep();
      }, 2000); // Show for 2 seconds then auto-proceed

      return () => clearTimeout(autoTimer);
    }

    return undefined;
  }, [isActive, currentStep, targetElement, nextStep]);

  // Handle clicking on target element - only validate clicks on the correct element
  useEffect(() => {
    if (!targetElement || !currentStep?.actionRequired) return;

    const handleTargetClick = (_event: Event) => {
      if (currentStep.triggerNext === 'click') {
        // Temporarily remove pointer-events blocking to ensure click works
        document.body.classList.remove('tutorial-active');

        // Allow the original click to proceed, then move to next step
        setTimeout(() => {
          nextStep();

          // Re-add blocking for next step after a brief delay
          setTimeout(() => {
            if (document.querySelector('.tutorial-step-tooltip')) {
              document.body.classList.add('tutorial-active');
            }
          }, 100);
        }, 50);
      }
    };

    // Add click listener specifically to the target element
    targetElement.addEventListener('click', handleTargetClick, false);

    return () => {
      targetElement.removeEventListener('click', handleTargetClick, false);
    };
  }, [targetElement, currentStep, nextStep, currentPhase, currentStepIndex]);

  // Reset step index when phase changes
  useEffect(() => {
    setCurrentStepIndex(0);
  }, [currentPhase]);

  // Cleanup when tutorial ends
  useEffect(() => {
    if (!isActive) {
      document.body.classList.remove('tutorial-active');
      document.querySelectorAll('.tutorial-target').forEach(el => {
        el.classList.remove('tutorial-target');
      });
    }
  }, [isActive]);

  if (!isActive || !currentStep || !targetElement) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div className='tutorial-backdrop-step' />

      {/* Highlight ring around target element */}
      <div
        className='tutorial-highlight-ring'
        style={{
          position: 'fixed',
          top: `${highlightPosition.top}px`,
          left: `${highlightPosition.left}px`,
          width: `${highlightPosition.width}px`,
          height: `${highlightPosition.height}px`,
          borderRadius: highlightPosition.borderRadius,
          pointerEvents: 'none',
          zIndex: 10001,
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      />

      {/* Tooltip */}
      <div
        className='tutorial-step-tooltip'
        style={{
          position: 'fixed',
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          zIndex: 10002,
        }}
        role='dialog'
        aria-labelledby='tutorial-step-title'
        aria-describedby='tutorial-step-description'
      >
        <div className='tutorial-step-header'>
          <h3 id='tutorial-step-title' className='tutorial-step-title'>
            {currentStep.title}
          </h3>
          <button
            className='tutorial-step-close'
            onClick={onSkip}
            aria-label='Skip tutorial'
          >
            ✕
          </button>
        </div>

        <div id='tutorial-step-description' className='tutorial-step-content'>
          <p>{currentStep.description}</p>
        </div>

        <div className='tutorial-step-footer'>
          <div className='tutorial-step-progress'>
            <span className='tutorial-step-counter'>
              Step {steps.findIndex(s => s.id === currentStep.id) + 1} of{' '}
              {steps.length}
            </span>
            <div className='tutorial-step-progress-bar'>
              <div
                className='tutorial-step-progress-fill'
                style={{
                  width: `${((steps.findIndex(s => s.id === currentStep.id) + 1) / steps.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className='tutorial-step-actions'>
            {currentStep.triggerNext === 'auto' ? (
              <span className='tutorial-step-instruction'>
                ⏳ Auto-proceeding...
              </span>
            ) : (
              <span className='tutorial-step-instruction'>
                👆 Click the highlighted element to continue
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Battle tutorial steps - simplified to one step per phase
export const BATTLE_TUTORIAL_STEPS: TutorialStep[] = [
  // Step 1: Location selection
  {
    id: 'location-select',
    targetSelector: '.location-btn[data-location="free"]',
    title: 'Step 1: Choose Location',
    description:
      'Click on "Free Practice" to start your first battle. This location costs no mana and is perfect for learning!',
    phase: 'menu',
    position: 'bottom',
    actionRequired: true,
    triggerNext: 'click',
  },

  // Step 2: Element selection
  {
    id: 'element-select',
    targetSelector: '.element-grid .element-btn.focused', // Focused Fire element button
    title: 'Step 2: Choose Element',
    description:
      'Fire element is recommended for beginners. Click on Fire to select it! Fire is strong against Earth but weak against Water.',
    phase: 'elementSelection',
    position: 'bottom',
    actionRequired: true,
    triggerNext: 'click',
  },

  // Step 3: Elemental selection
  {
    id: 'elemental-select',
    targetSelector: '.elemental-grid .elemental-btn:first-child',
    title: 'Step 3: Choose Fighter',
    description:
      'Click on your elemental to select it for battle. During this tutorial, cooldowns are disabled so you can practice freely!',
    phase: 'elementalSelection',
    position: 'bottom',
    actionRequired: true,
    triggerNext: 'click',
  },
];

export default StepByStepTutorial;
