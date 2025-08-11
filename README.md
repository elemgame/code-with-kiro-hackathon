# Elemental Game - Frontend Prototype

A competitive element-based strategy game built with React, featuring rock-paper-scissors mechanics with mana wagering and elemental upgrades.

## Design & UX Notes

### Key Design Decisions

**Visual Theme**
- Modern gradient background (purple to blue) for mystical feel
- Clean white cards with subtle shadows for component separation
- Element-specific colors: Earth (brown), Water (blue), Fire (orange/red)
- Consistent 12px border radius for modern, friendly appearance

**User Flow**
1. **Setup Phase**: Players configure wagers and upgrade elementals
2. **Selection Phase**: Players choose elements for each round
3. **Battle Phase**: Animated results with clear winner indication
4. **Match Progression**: Best-of-3 or best-of-5 with running scoreboard

**Accessibility Features**
- ARIA labels on interactive elements
- High contrast mode support
- Reduced motion preferences respected
- Keyboard navigation support
- Clear focus indicators
- Semantic HTML structure

**Responsive Design**
- Mobile-first approach with breakpoints at 768px and 480px
- Grid layouts that stack on mobile
- Touch-friendly button sizes (minimum 44px)
- Readable font sizes across devices

### Component Architecture

**ElementSelector**
- Visual feedback with hover/selection states
- Element-specific styling with emojis and colors
- Disabled state for game flow control

**ManaDisplay**
- Real-time mana tracking with visual progress bar
- Clear breakdown of wagered vs protected mana
- Color-coded risk indicators

**WagerSlider**
- Range input with quick-select buttons
- Real-time validation against available mana
- Visual feedback for current selection

**ElementalUpgrade**
- Clear upgrade path visualization
- Cost/benefit analysis display
- Disabled state when insufficient mana

**GameBoard**
- Central battle arena with animated results
- Round history tracking
- Match progression indicators

## Code Skeleton

### Core Game Logic (`gameLogic.js`)

```javascript
// Element relationships and rarity system
export const ELEMENTS = { EARTH, WATER, FIRE };
export const RARITIES = { COMMON, RARE, LEGENDARY, IMMORTAL };
export const getWinner = (element1, element2) => // Rock-paper-scissors logic
export const calculateProtectedMana = (wager, rarity) => // Mana protection
```

### State Management

**Player State Structure**
```javascript
{
  mana: number,           // Current mana pool
  wager: number,          // Amount wagered for current match
  selectedElement: string, // Current round selection
  elementalRarity: object  // Current elemental upgrade level
}
```

**Game State Structure**
```javascript
{
  gamePhase: 'setup' | 'selection' | 'result',
  currentRound: number,
  roundResults: array,    // History of round outcomes
  matchScore: object,     // Running win count
  matchType: 'best-of-3' | 'best-of-5'
}
```

### Key Features Implemented

**Game Mechanics**
- ✅ Element selection with rock-paper-scissors resolution
- ✅ Mana wagering with protection calculation
- ✅ Elemental upgrade system (Common → Rare → Legendary → Immortal)
- ✅ Best-of-3 and best-of-5 match formats
- ✅ Round progression with automatic advancement

**UI Components**
- ✅ Responsive element selection buttons
- ✅ Interactive mana wagering sliders
- ✅ Real-time mana display with protection breakdown
- ✅ Elemental upgrade interface
- ✅ Battle arena with animated results
- ✅ Match scoreboard and round history

**User Experience**
- ✅ Smooth transitions between game phases
- ✅ Visual feedback for all interactions
- ✅ Clear win/loss indicators
- ✅ Mobile-responsive design
- ✅ Accessibility compliance

### Optional Enhancements (Not Implemented)

**Animations**
- Element icons shaking on selection
- Particle effects during battles
- Smooth mana transfer animations
- Victory celebrations

**Audio**
- Element selection sounds
- Battle clash effects
- Win/lose feedback
- Background ambient music

**Advanced Features**
- AI opponent mode
- Tournament brackets
- Leaderboards
- Custom elemental abilities
- Multiplayer networking

## Installation & Setup

```bash
npm install
npm start
```

The application will run on `http://localhost:3000`

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Performance Considerations

- Functional components with React hooks for optimal re-rendering
- Memoized callbacks to prevent unnecessary updates
- CSS transitions instead of JavaScript animations
- Minimal bundle size with no external dependencies beyond React

## Testing Strategy

**Unit Tests** (Recommended)
- Game logic functions (element resolution, mana calculations)
- Component rendering with various props
- User interaction handlers

**Integration Tests** (Recommended)
- Complete game flow from setup to match completion
- Mana transfer accuracy
- Round progression logic

**Accessibility Tests** (Recommended)
- Screen reader compatibility
- Keyboard navigation
- Color contrast ratios
- Focus management