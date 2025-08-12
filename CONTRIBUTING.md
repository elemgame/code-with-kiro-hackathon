# Contributing to Elemental Arena

## Maintaining the Changelog

### When to update CHANGELOG.md

Update CHANGELOG.md for every significant change:

- ✅ New features
- ✅ Game mechanics changes
- ✅ Bug fixes
- ✅ UI/UX changes
- ❌ Minor code refactoring without functional impact
- ❌ Comment updates

### How to add entries

1. Add changes to the `[Unreleased]` section
2. Use the correct categories:

   - **Added** - new features
   - **Changed** - changes to existing features
   - **Fixed** - bug fixes
   - **Technical** - technical changes

3. Write clear descriptions:

   ```markdown
   ### Added

   - Location selection system with three wager options

   ### Fixed

   - Fixed incorrect mana change display on victory
   ```

### Creating a release

1. Move changes from `[Unreleased]` to a new version
2. Update version in `package.json`
3. Add release date
4. Create a new empty `[Unreleased]` section

### Example structure

```markdown
## [Unreleased]

### Added

- New feature (in development)

## [1.1.0] - 2024-12-20

### Added

- Elemental system
- Battle location selection

### Fixed

- Fixed mana calculation logic

## [1.0.0] - 2024-12-15

### Added

- Basic game mechanics
```

## Testing Changes

Before adding to changelog, ensure that:

1. Feature works correctly
2. Existing functionality is not broken
3. Changes tested on mobile devices
4. Documentation updated (if needed)

## Commits

Use clear commit messages:

- `feat: add elemental system`
- `fix: correct battle result display`
- `refactor: optimize mana calculation function`
- `docs: update changelog`

## Questions

If you have questions about maintaining the changelog or development process, contact the team.
