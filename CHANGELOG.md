# Changelog

All notable changes to the Elemental Arena project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Battle location selection system (Swamp - 100 mana, Village - 300 mana, Castle - 500 mana)
- Elemental system with 4 rarity levels:
  - Common elemental (10% protection)
  - Rare elemental (20% protection)
  - Epic elemental (40% protection)
  - Immortal elemental (80% protection)
- Option to play without elemental ("Fight Without Protection")
- Detailed battle log displaying:
  - Element battle with rule explanations
  - Elementals used by both sides
  - Final calculations including protection
- Opponent generation system with elementals (30% chance without elemental)

### Changed

- Winner determination logic:
  - Priority: elements first, then elementals
  - For different elements: standard rules (Earth > Water > Fire > Earth)
  - For same elements: elemental protection comparison
- Betting and payout system:
  - Both players wager the same amount of mana
  - Winner takes unprotected portion of opponent's wager
  - In elemental battles: winner takes protection difference
- Enhanced UI with responsive design
- Redesigned player statistics system

### Fixed

- Fixed mana change calculation logic
- Fixed battle result display
- Fixed element battle rules in log
- Fixed duplicate elements with same ID issue
- Fixed game state reset logic

### Technical

- Added developer debugging system
- Improved error handling and emergency reset
- Optimized UI update system
- Added data validation checks

## [1.0.0] - 2024-XX-XX

### Added

- Basic "rock-paper-scissors" game mechanics with elements
- Mana and betting system
- Basic UI with player profile
- Achievement system
- Mobile navigation
- Progress saving system in localStorage

### Game Rules

- **Elements**: Earth, Water, Fire
- **Battle Rules**:
  - Earth absorbs Water
  - Water extinguishes Fire
  - Fire melts Earth
- **Mana System**: Starting mana 500, wagers determine win/loss
- **Statistics**: Tracking wins, losses, win streaks

---

## How to read this changelog

- **Added** - new features
- **Changed** - changes in existing functionality
- **Deprecated** - features that will be removed soon
- **Removed** - removed features
- **Fixed** - bug fixes
- **Security** - security fixes
- **Technical** - technical changes not affecting users

## Versioning

- **Major** (X.0.0) - breaking changes, incompatible with previous versions
- **Minor** (0.X.0) - new features, compatible with previous versions
- **Patch** (0.0.X) - bug fixes and minor improvements
