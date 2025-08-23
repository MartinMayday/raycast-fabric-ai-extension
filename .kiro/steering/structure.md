# Project Structure

## Repository Layout

The repository contains two main extension projects:

### fabricai-extension/
Primary Raycast extension with full feature set:

```
fabricai-extension/
├── src/
│   ├── __mocks__/           # Jest mocks for @raycast/api
│   ├── constants/           # Shared constants and configuration
│   │   └── index.ts         # Error messages, defaults, storage keys
│   ├── extract-wisdom-*.tsx # Command implementations (multiple variants)
│   └── [other components]   # Additional UI components and utilities
├── assets/                  # Extension assets (icons, images)
├── docs/                    # Documentation files
├── package.json             # Extension manifest and dependencies
├── tsconfig.json           # TypeScript configuration
└── jest.config.js          # Jest testing configuration
```

### raycast-fabricAI/
Secondary/experimental extension:

```
raycast-fabricAI/
├── src/
│   ├── lib/                # Shared utilities and clients
│   │   └── fabric-client.ts # Fabric AI integration logic
│   ├── extract-wisdom.tsx  # Main command implementation
│   └── index.tsx           # Entry point
├── planning.md             # Development planning notes
└── tsconfig.json          # TypeScript configuration
```

## File Naming Conventions

- **Commands**: `extract-wisdom-*.tsx` format with descriptive suffixes
  - `-simple`: Basic implementation
  - `-working`: Stable working version
  - `-debug`: Debug/development version
- **Components**: PascalCase React components
- **Utilities**: camelCase TypeScript files
- **Constants**: Grouped in `constants/index.ts` with UPPER_CASE naming

## Code Organization Patterns

### Command Structure
Each command file follows this pattern:
- State management with React hooks
- Preference handling via `getPreferenceValues`
- External process execution using `child_process`
- Error handling with toast notifications
- Raycast UI components (List, Detail, ActionPanel)

### Constants Organization
Centralized in `constants/index.ts`:
- `DEFAULT_CONFIG`: Default configuration values
- `ERROR_MESSAGES`: Standardized error messages with placeholders
- `SUCCESS_MESSAGES`: Success notification messages
- `STORAGE_KEYS`: Local storage key constants

### Testing Structure
- Mocks in `__mocks__/@raycast/` for Raycast API
- Jest configuration for React component testing
- Test files co-located with source files (when present)

## Development Workflow

1. **Primary development** happens in `fabricai-extension/`
2. **Experimental features** may be prototyped in `raycast-fabricAI/`
3. **Multiple command variants** allow for iterative development and A/B testing
4. **Constants centralization** ensures consistency across commands