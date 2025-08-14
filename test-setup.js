#!/usr/bin/env node

/**
 * Simple script for testing code quality setup
 */

/* eslint-disable @typescript-eslint/no-var-requires, no-console */
const { execSync } = require('child_process');

console.log('🧪 Testing code quality setup...\n');

const tests = [
  {
    name: 'TypeScript compilation',
    command: 'npm run type-check',
    emoji: '🔍',
  },
  {
    name: 'ESLint check',
    command: 'npm run lint',
    emoji: '🧹',
  },
  {
    name: 'Prettier formatting',
    command: 'npm run format',
    emoji: '💅',
  },
  {
    name: 'Tests',
    command: 'npm test -- --watchAll=false --passWithNoTests',
    emoji: '🧪',
  },
  {
    name: 'Build',
    command: 'npm run build',
    emoji: '🏗️',
  },
];

let passed = 0;
let failed = 0;

for (const test of tests) {
  try {
    console.log(`${test.emoji} Running: ${test.name}...`);
    execSync(test.command, { stdio: 'pipe' });
    console.log(`✅ ${test.name} - PASSED\n`);
    passed++;
  } catch (error) {
    console.log(`❌ ${test.name} - FAILED`);
    console.log(`   Error: ${error.message.split('\n')[0]}\n`);
    failed++;
  }
}

console.log('📊 Results:');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);

if (failed === 0) {
  console.log('\n🎉 All quality checks passed successfully!');
  console.log('Setup is ready to use.');
} else {
  console.log('\n⚠️  Some checks failed.');
  console.log('Run npm run quality:fix to fix issues.');
  process.exit(1);
}
