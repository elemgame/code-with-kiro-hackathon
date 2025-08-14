# Product Overview

**Elemental Arena** is a strategic element-based battle game built with React and TypeScript. Players engage in rock-paper-scissors style combat using three elements (Earth, Water, Fire) with mana wagering mechanics and elemental upgrades.

## Core Gameplay
- **Element Combat**: Earth > Water > Fire > Earth cycle
- **Mana System**: Players wager mana in different battle locations (Swamp: 100, Village: 300, Castle: 500)
- **Elemental Protection**: Elementals provide mana protection (Common: 10%, Rare: 20%, Epic: 40%, Immortal: 80%)
- **Elemental Attack**: When players choose the same element, elemental attack power determines the winner based on rarity levels (Common < Rare < Epic < Immortal). If both players use elementals, the result is determined by the difference in their attack power
- **Progression**: Experience points, levels, achievements, and win streaks

## Key Features
- Location-based battles with different mana requirements
- Elemental companion system with rarity tiers
- Achievement system with 20+ unlockable achievements
- Player statistics tracking (wins, losses, streaks, element usage)
- Persistent game state via localStorage
- Responsive design for mobile and desktop

## Target Audience
Strategy game enthusiasts who enjoy risk/reward mechanics, progression systems, and competitive gameplay with mystical/fantasy themes.