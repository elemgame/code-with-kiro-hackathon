import {
  calculateBattleResult,
  ELEMENTS,
  generateOpponent,
  getElementalData,
  getRandomElement,
  getWinner,
  LOCATIONS,
} from './gameLogic';
import { Element } from './types';

describe('Battle Logic Tests', () => {
  describe('getWinner - Element Battle Logic', () => {
    test('should return draw when same elements are used', () => {
      expect(getWinner('earth', 'earth')).toBe('draw');
      expect(getWinner('water', 'water')).toBe('draw');
      expect(getWinner('fire', 'fire')).toBe('draw');
    });

    test('should follow rock-paper-scissors logic: Earth > Water > Fire > Earth', () => {
      // Earth beats Water
      expect(getWinner('earth', 'water')).toBe('player');
      expect(getWinner('water', 'earth')).toBe('opponent');

      // Water beats Fire
      expect(getWinner('water', 'fire')).toBe('player');
      expect(getWinner('fire', 'water')).toBe('opponent');

      // Fire beats Earth
      expect(getWinner('fire', 'earth')).toBe('player');
      expect(getWinner('earth', 'fire')).toBe('opponent');
    });
  });

  describe('calculateBattleResult - Complete Battle Logic', () => {
    const baseWager = 100;

    describe('Element-based victories (no elementals)', () => {
      test('player wins by element advantage', () => {
        const result = calculateBattleResult(
          baseWager,
          'earth', // player
          null,
          'water', // opponent
          null
        );

        expect(result.winner).toBe('player');
        expect(result.playerManaChange).toBe(100);
        expect(result.opponentManaChange).toBe(-100);
        expect(result.protectionSaved).toBe(0);
      });

      test('opponent wins by element advantage', () => {
        const result = calculateBattleResult(
          baseWager,
          'water', // player
          null,
          'earth', // opponent
          null
        );

        expect(result.winner).toBe('opponent');
        expect(result.playerManaChange).toBe(-100);
        expect(result.opponentManaChange).toBe(100);
        expect(result.protectionSaved).toBe(0);
      });

      test('draw with same elements and no elementals', () => {
        const result = calculateBattleResult(
          baseWager,
          'fire',
          null,
          'fire',
          null
        );

        expect(result.winner).toBe('draw');
        expect(result.playerManaChange).toBe(0);
        expect(result.opponentManaChange).toBe(0);
        expect(result.protectionSaved).toBe(0);
      });
    });

    describe('Elemental protection mechanics', () => {
      test('opponent elemental protects when player wins by element', () => {
        const result = calculateBattleResult(
          baseWager,
          'earth', // player wins
          null,
          'water', // opponent loses
          'rare' // 20% protection
        );

        expect(result.winner).toBe('player');
        expect(result.playerManaChange).toBe(80); // 100 - 20% protection
        expect(result.opponentManaChange).toBe(-80);
        expect(result.protectionSaved).toBe(0); // Player doesn't need protection when winning
      });

      test('player elemental protects when opponent wins by element', () => {
        const result = calculateBattleResult(
          baseWager,
          'water', // player loses
          'epic', // 40% protection
          'earth', // opponent wins
          null
        );

        expect(result.winner).toBe('opponent');
        expect(result.playerManaChange).toBe(-60); // -100 + 40% protection
        expect(result.opponentManaChange).toBe(60);
        expect(result.protectionSaved).toBe(40); // Player saved 40 mana
      });
    });

    describe('Same element battles - elemental power decides', () => {
      test('player wins with stronger elemental', () => {
        const result = calculateBattleResult(
          baseWager,
          'fire',
          'epic', // 40% power
          'fire',
          'rare' // 20% power
        );

        expect(result.winner).toBe('player');
        expect(result.playerManaChange).toBe(20); // (40% - 20%) * 100
        expect(result.opponentManaChange).toBe(-20);
        expect(result.protectionSaved).toBe(0);
      });

      test('opponent wins with stronger elemental', () => {
        const result = calculateBattleResult(
          baseWager,
          'water',
          'common', // 10% power
          'water',
          'immortal' // 80% power
        );

        expect(result.winner).toBe('opponent');
        expect(result.playerManaChange).toBe(-70); // -(80% - 10%) * 100
        expect(result.opponentManaChange).toBe(70);
        expect(result.protectionSaved).toBe(10); // Player's elemental provides some protection
      });

      test('true draw with equal elemental power', () => {
        const result = calculateBattleResult(
          baseWager,
          'earth',
          'rare', // 20% power
          'earth',
          'rare' // 20% power
        );

        expect(result.winner).toBe('draw');
        expect(result.playerManaChange).toBe(0);
        expect(result.opponentManaChange).toBe(0);
        expect(result.protectionSaved).toBe(0);
      });
    });

    describe('Edge cases and high-value battles', () => {
      test('high wager battle with protection', () => {
        const highWager = 500;
        const result = calculateBattleResult(
          highWager,
          'fire', // player loses
          'immortal', // 80% protection
          'water', // opponent wins
          null
        );

        expect(result.winner).toBe('opponent');
        expect(result.playerManaChange).toBe(-100); // -500 + 80% protection = -100
        expect(result.opponentManaChange).toBe(100);
        expect(result.protectionSaved).toBe(400); // Saved 400 mana
      });

      test('minimum wager battle', () => {
        const minWager = 1;
        const result = calculateBattleResult(
          minWager,
          'earth', // player loses (Fire beats Earth)
          'epic', // 40% protection
          'fire', // opponent wins
          null
        );

        expect(result.winner).toBe('opponent');
        expect(result.playerManaChange).toBe(-1); // -1 + 40% protection = -1 (rounded)
        expect(result.opponentManaChange).toBe(1);
      });
    });
  });

  describe('getElementalData', () => {
    test('should return correct protection values for all rarities', () => {
      expect(getElementalData('earth', 'common').protection).toBe(0.1);
      expect(getElementalData('water', 'rare').protection).toBe(0.2);
      expect(getElementalData('fire', 'epic').protection).toBe(0.4);
      expect(getElementalData('earth', 'immortal').protection).toBe(0.8);
    });

    test('should return correct names and emojis', () => {
      const earthCommon = getElementalData('earth', 'common');
      expect(earthCommon.name).toBe('Earth Golem');
      expect(earthCommon.emoji).toBe('🗿');
      expect(earthCommon.rarity).toBe('Common');

      const waterImmortal = getElementalData('water', 'immortal');
      expect(waterImmortal.name).toBe('Leviathan');
      expect(waterImmortal.protection).toBe(0.8);
    });
  });

  describe('generateOpponent', () => {
    test('should generate opponent with correct wager based on location', () => {
      const swampOpponent = generateOpponent('swamp');
      expect(swampOpponent.wager).toBe(100);

      const villageOpponent = generateOpponent('village');
      expect(villageOpponent.wager).toBe(300);

      const castleOpponent = generateOpponent('castle');
      expect(castleOpponent.wager).toBe(500);
    });

    test('should generate opponent with valid properties', () => {
      const opponent = generateOpponent('village');

      expect(typeof opponent.name).toBe('string');
      expect(opponent.name.length).toBeGreaterThan(0);
      expect(typeof opponent.avatar).toBe('string');
      expect(opponent.level).toBeGreaterThanOrEqual(1);
      expect(opponent.level).toBeLessThanOrEqual(10);
      expect(typeof opponent.rarity).toBe('string');
      expect(opponent.wager).toBe(300);
    });

    test('should generate opponent with valid element', () => {
      const opponent = generateOpponent('castle');
      const validElements: Element[] = ['earth', 'water', 'fire'];

      expect(validElements).toContain(opponent.element);
    });

    test('should sometimes generate opponent with elemental (50% chance)', () => {
      // Run multiple times to test randomness
      const opponents = Array.from({ length: 20 }, () =>
        generateOpponent('swamp')
      );
      const withElementals = opponents.filter(op => op.elemental);
      const withoutElementals = opponents.filter(op => !op.elemental);

      // Should have some with and some without (not a strict test due to randomness)
      expect(withElementals.length + withoutElementals.length).toBe(20);
      expect(withElementals.length).toBeGreaterThan(0);
      expect(withoutElementals.length).toBeGreaterThan(0);
    });
  });

  describe('getRandomElement', () => {
    test('should return valid element', () => {
      const element = getRandomElement();
      const validElements: Element[] = ['earth', 'water', 'fire'];
      expect(validElements).toContain(element);
    });

    test('should return different elements over multiple calls', () => {
      const elements = Array.from({ length: 10 }, () => getRandomElement());
      const uniqueElements = new Set(elements);

      // Should get at least 2 different elements in 10 calls (very likely)
      expect(uniqueElements.size).toBeGreaterThan(1);
    });
  });

  describe('Game Constants', () => {
    test('ELEMENTS should have correct structure', () => {
      expect(ELEMENTS.earth.name).toBe('Earth');
      expect(ELEMENTS.water.name).toBe('Water');
      expect(ELEMENTS.fire.name).toBe('Fire');

      expect(ELEMENTS.earth.emoji).toBe('🗿');
      expect(ELEMENTS.water.emoji).toBe('💧');
      expect(ELEMENTS.fire.emoji).toBe('🔥');
    });

    test('LOCATIONS should have correct mana values', () => {
      expect(LOCATIONS.swamp.mana).toBe(100);
      expect(LOCATIONS.village.mana).toBe(300);
      expect(LOCATIONS.castle.mana).toBe(500);
    });
  });

  describe('Battle Scenarios - Integration Tests', () => {
    test('complete battle scenario: player wins with protection', () => {
      // Scenario: Player (Earth + Epic) vs Opponent (Water + Rare)
      // Player should win by element, opponent gets protection
      const result = calculateBattleResult(
        300, // village wager
        'earth', // player element (wins vs water)
        'epic', // player elemental (40% - not used for protection since player wins)
        'water', // opponent element (loses to earth)
        'rare' // opponent elemental (20% protection)
      );

      expect(result.winner).toBe('player');
      expect(result.playerManaChange).toBe(240); // 300 - (300 * 0.2) = 240
      expect(result.opponentManaChange).toBe(-240);
      expect(result.protectionSaved).toBe(0); // Player doesn't need protection
    });

    test('complete battle scenario: elemental power battle', () => {
      // Scenario: Both use Fire, Immortal vs Epic elementals
      const result = calculateBattleResult(
        500, // castle wager
        'fire', // same element
        'epic', // 40% power
        'fire', // same element
        'immortal' // 80% power - opponent wins
      );

      expect(result.winner).toBe('opponent');
      expect(result.playerManaChange).toBe(-200); // -(80% - 40%) * 500 = -200
      expect(result.opponentManaChange).toBe(200);
      expect(result.protectionSaved).toBe(200); // Player's epic elemental provides some protection
    });
  });
});
