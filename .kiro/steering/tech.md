# Technology Stack

## Framework & Platform
- **Raycast Extension**: Built for the Raycast productivity platform
- **React**: UI components using React with TypeScript
- **TypeScript**: Strict typing with ES2020 target
- **Node.js**: Runtime environment with child_process for external command execution

## Core Dependencies
- **@raycast/api**: Core Raycast API (v1.30.0)
- **Notion API**: Database integration for automated workflows
- **Fabric AI**: External CLI tool for AI pattern processing

## Pattern Creation Framework
- **TypeScript Classes**: 15+ specialized classes for pattern development
- **Jest Testing**: Comprehensive test suites for pattern validation
- **Template System**: Automated pattern generation and validation
- **Knowledge Base**: Searchable database with TypeScript interfaces

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
- **Notion API**: Database integration for automated workflows
  - API token management through Raycast preferences
  - Database property mapping and synchronization
- **MCP (Model Context Protocol)**: Integration framework for AI tools
  - Server configuration through `.kiro/settings/mcp.json`
  - Auto-approval and tool management

## Pattern Development Stack
- **Custom Pattern Creation**: TypeScript-based pattern development framework
- **Template Generation**: Automated pattern template creation and validation
- **Quality Assurance**: Comprehensive testing and validation systems
- **Knowledge Base**: Searchable database for pattern creation best practices
- **Export Systems**: CSV and Notion export compatibility layers

## Configuration
- Extension preferences managed through Raycast's preference system
- TypeScript configuration targets ES2020 with React JSX
- Jest configured for React component testing with jsdom environment
- Notion API configuration through secure preference management
- Pattern registry configuration for custom pattern deployment