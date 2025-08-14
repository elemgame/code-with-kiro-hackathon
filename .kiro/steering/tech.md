# Technology Stack

## Core Technologies
- **React 18.2.0** - Frontend framework with functional components and hooks
- **TypeScript 4.9.5** - Type safety and enhanced developer experience
- **React Scripts 5.0.1** - Build tooling and development server
- **CSS3** - Custom properties (CSS variables) for theming
- **Telegram Mini App (TMA)** - Integration with Telegram Web App platform for seamless in-chat gaming experience

## Build System & Commands
```bash
# Development
npm start          # Start development server on localhost:3000
npm test           # Run test suite
npm run build      # Create production build
npm run release    # Deploy to GitHub Pages (release branch)
```

## Development Standards
- **Functional Components**: Use React hooks instead of class components
- **TypeScript**: Strict mode enabled, all components must be typed
- **State Management**: React hooks (useState, useEffect, useCallback) for local state
- **Persistence**: localStorage for game state persistence
- **Styling**: CSS modules with CSS custom properties for theming

## Code Quality
- **ESLint**: React app configuration with Jest support
- **Type Safety**: Strict TypeScript configuration with proper interface definitions
- **Performance**: useCallback for event handlers, memoization where appropriate
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation support

## Browser Support
- Modern browsers (Chrome 88+, Firefox 85+, Safari 14+, Edge 88+)
- **Telegram WebView** - Optimized for Telegram's built-in browser
- Mobile responsive design with touch-friendly interactions
- CSS Grid and Flexbox for layouts

## Deployment
- **GitHub Pages**: Automated deployment via gh-pages package
- **Telegram Mini App**: Hosted as web application accessible through Telegram bot
- **Build Output**: Static files in `/build` directory
- **Branch Strategy**: `release` branch for production deployments