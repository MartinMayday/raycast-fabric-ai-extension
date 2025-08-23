# Technology Stack

## Framework & Platform
- **Raycast Extension**: Built for the Raycast productivity platform
- **React**: UI components using React with TypeScript
- **TypeScript**: Strict typing with ES2020 target

## Dependencies
- **@raycast/api**: Core Raycast API (v1.30.0)
- **Node.js**: Runtime environment with child_process for external command execution

## Development Tools
- **ESLint**: Code linting with @raycast/eslint-config
- **Jest**: Testing framework with React Testing Library
- **Prettier**: Code formatting
- **TypeScript**: Type checking and compilation

## Build System
- **Raycast CLI**: Uses `ray` commands for building and development

## Common Commands

### Development
```bash
npm run dev          # Start development mode with hot reload
npm run build        # Build extension for production
npm run lint         # Run ESLint checks
npm run fix-lint     # Auto-fix linting issues
```

### Testing
```bash
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run test:ci      # Run tests for CI environment
```

### Publishing
```bash
npm run publish      # Publish extension to Raycast store
```

## External Dependencies
- **Fabric AI**: External CLI tool for AI pattern processing
  - Installed via pip: `pip install fabric-ai`
  - Executed via child_process using shell commands
  - Configurable installation path through preferences

## Configuration
- Extension preferences managed through Raycast's preference system
- TypeScript configuration targets ES2020 with React JSX
- Jest configured for React component testing with jsdom environment