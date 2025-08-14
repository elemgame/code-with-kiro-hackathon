---
inclusion: always
---

# Project Structure & Architecture Guidelines

## File Organization Rules
- **Components**: Place all React components in `src/components/` with PascalCase naming
- **Business Logic**: Keep game mechanics in `src/gameLogic.ts` as pure functions
- **Types**: Centralize all TypeScript interfaces in `src/types.ts`
- **Styles**: Use `App.css` for global styles and CSS custom properties
- **Assets**: Static files go in `public/`, component-specific assets in `src/`

## Component Architecture Patterns
- **Single Responsibility**: Each component handles one specific UI concern
- **State Lifting**: Game state lives in `App.tsx`, passed down via props
- **Pure Functions**: All game logic calculations in `gameLogic.ts` must be pure
- **Type Safety**: Every component must have proper TypeScript interfaces

## Key Component Responsibilities
- **App.tsx**: Central state management, routing, localStorage persistence
- **BattleComponent.tsx**: Battle flow orchestration (selection → matchmaking → battle)
- **Navigation.tsx**: Tab switching and active state management
- **Modal.tsx**: Reusable overlay component for dialogs and notifications

## Naming Conventions (Strictly Enforce)
- **Components**: `PascalCase.tsx` (e.g., `BattleComponent.tsx`)
- **Types/Interfaces**: `PascalCase` (e.g., `PlayerStats`, `GameState`)
- **Functions**: `camelCase` with verb-noun pattern (e.g., `calculateWinner`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `BATTLE_LOCATIONS`)
- **CSS Classes**: `kebab-case` with BEM methodology where applicable

## State Management Rules
- **Centralized State**: All game state in `App.tsx` using `useState`
- **Prop Drilling**: Pass state and setters as props (no context for this small app)
- **Persistence**: Auto-save to localStorage on state changes
- **Immutability**: Always create new objects/arrays when updating state
- **Pure Calculations**: Use `gameLogic.ts` functions for state transformations

## File Modification Guidelines
- **New Components**: Must follow existing patterns and be placed in `src/components/`
- **Game Logic**: Add new mechanics to `gameLogic.ts`, never inline in components
- **Types**: Update `types.ts` when adding new data structures
- **Styles**: Use CSS custom properties defined in `App.css` for consistency