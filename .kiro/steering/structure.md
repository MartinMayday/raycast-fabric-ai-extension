# Project Structure

## Repository Layout

The repository contains a comprehensive Raycast extension ecosystem with pattern creation framework:

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

### src/pattern-creation/
Pattern Creation Framework (✅ Complete):

```
src/pattern-creation/
├── DocumentationGenerator.ts      # Automatic pattern documentation
├── KnowledgeBaseIntegrator.ts     # Searchable best practices database
├── RegistryIntegrator.ts          # Pattern registry integration
├── ExportSystemIntegrator.ts      # CSV/Notion export integration
├── ChainCompatibilityEnsurer.ts   # Pattern chaining support
├── PatternTemplateGenerator.ts    # Custom pattern creation
├── SampleCollectionGenerator.ts   # Test sample generation
├── QualityAssurance.ts            # Pattern validation & testing
├── test-*.ts                      # Comprehensive test suite
└── index.ts                       # Main exports and documentation
```

### patterns/
Custom Pattern Implementations (✅ Production Ready):

```
patterns/
├── analyze_wireframe_flow.md      # UX analysis pattern
├── analyze_copywriting_score.md   # Copywriting analysis pattern
├── create_storybrand_variant.md   # StoryBrand framework pattern
├── create_competitive_audit.md    # Competitive analysis pattern
├── test-samples/                  # Pattern test samples
│   ├── wireframe_flow_samples.md
│   ├── copywriting_score_samples.md
│   ├── storybrand_variant_samples.md
│   └── competitive_audit_samples.md
└── _RAW/                          # Original Fabric AI patterns (200+)
```

### .kiro/specs/
Feature Specifications:

```
.kiro/specs/
├── custom-pattern-creation/       # Pattern creation framework spec
├── notion-database-integration/   # Notion database integration spec
├── notion-watcher-automation/     # Notion watcher automation spec
├── pattern-registry-framework/    # Pattern registry framework spec
└── raycast-extract-wisdom/       # Original extract wisdom spec
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

### Raycast Commands
- **Commands**: `extract-wisdom-*.tsx` format with descriptive suffixes
  - `-simple`: Basic implementation
  - `-working`: Stable working version
  - `-debug`: Debug/development version
  - `-ultimate`: Advanced implementation with full features

### Pattern Creation Framework
- **Classes**: PascalCase TypeScript classes (e.g., `DocumentationGenerator.ts`)
- **Tests**: `test-*.ts` format with descriptive names
- **Interfaces**: Defined within class files with comprehensive type safety

### Custom Patterns
- **Pattern Files**: `snake_case.md` format matching Fabric AI conventions
- **Test Samples**: `pattern_name_samples.md` format in `test-samples/` directory
- **Validation Scripts**: `test-pattern-name.js` and `validate-pattern-name.js`

### General Conventions
- **Components**: PascalCase React components
- **Utilities**: camelCase TypeScript files
- **Constants**: Grouped in `constants/index.ts` with UPPER_CASE naming
- **Specs**: kebab-case directory names in `.kiro/specs/`

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

### Phase-Based Development
1. **Phase 1 Complete**: Core Raycast extension in `fabricai-extension/`
2. **Phase 2 Complete**: Pattern creation framework in `src/pattern-creation/`
3. **Phase 3 Active**: Notion integrations and automation features

### Pattern Development Workflow
1. **Specification**: Create requirements in `.kiro/specs/feature-name/`
2. **Implementation**: Build TypeScript classes in `src/pattern-creation/`
3. **Testing**: Comprehensive test suites with `test-*.ts` files
4. **Validation**: Pattern validation with sample collections
5. **Documentation**: Auto-generated docs with usage examples

### Quality Assurance Process
1. **Template Generation**: Automated pattern template creation
2. **Sample Collection**: Generate 5+ test samples per pattern
3. **Validation Testing**: Automated syntax and structure validation
4. **Export Integration**: Ensure CSV and Notion compatibility
5. **Chain Compatibility**: Verify pattern chaining functionality

### Multi-Feature Development
- **Concurrent Development**: Multiple features developed simultaneously
- **Spec-Driven Development**: Each feature has comprehensive specifications
- **Automated Testing**: Continuous validation of all components
- **Documentation Sync**: Automated documentation updates via hooks