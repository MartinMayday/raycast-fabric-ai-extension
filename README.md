# Raycast Fabric AI Extension

A comprehensive Raycast extension that integrates with [Fabric AI](https://github.com/danielmiessler/fabric) to extract wisdom and insights from any text content using AI-powered analysis. Features a complete pattern creation framework with 4 production-ready landing page analysis patterns and advanced TypeScript-based development tools.

## 🚀 Features

### ✅ Core Features (Milestone Completed)
- **Extract Wisdom**: Process any text content through Fabric AI's `extract_wisdom` pattern
- **Advanced Process Control**: Spawn-based process management for superior reliability and real-time feedback
- **Structured Output Parsing**: Comprehensive parsing of wisdom into organized sections (summary, ideas, insights, quotes, habits, facts, references, takeaway, recommendations)
- **Professional CSV Export**: Automatic export to structured 20-column spreadsheet for data analysis and content tracking
- **Enhanced Debug Logging**: File-based logging system with comprehensive troubleshooting capabilities and interactive debug interface
- **YouTube Integration**: Direct transcript extraction and analysis from YouTube videos with metadata extraction
- **Multi-format Support**: Handle plain text, HTML, Markdown, and URLs
- **Clipboard Integration**: Seamlessly extract wisdom from clipboard content
- **Selection Processing**: Extract wisdom directly from selected text in any application
- **History Management**: Save, search, and manage extraction history
- **Stream Processing**: Real-time stdout/stderr handling for immediate feedback

### 🚧 New Features (In Development)
- **Notion Database Integration**: Send extracted wisdom directly to Notion databases with CSV backup for software independence
- **Notion Watcher Automation**: Automated monitoring and processing of URLs saved to Notion databases
- **Pattern Registry Framework**: Advanced pattern chaining and custom pattern creation system

## 📦 Installation

### Prerequisites

1. **Fabric AI**: Install Fabric AI following the [official installation guide](https://github.com/danielmiessler/fabric#installation)
   ```bash
   pip install fabric-ai
   ```

2. **Raycast**: Download and install [Raycast](https://raycast.com/)

### Extension Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/raycast-fabric-ai-extension.git
   cd raycast-fabric-ai-extension
   ```

2. Navigate to the main extension directory:
   ```bash
   cd fabricai-extension
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Build and install the extension:
   ```bash
   npm run build
   ray install
   ```

## 🎯 Usage

### Basic Wisdom Extraction

1. Open Raycast (`Cmd + Space`)
2. Type "Extract Wisdom" and select the command
3. Enter your text or paste from clipboard
4. Press `Cmd + Enter` to extract wisdom

### YouTube Video Analysis

1. Copy a YouTube URL to your clipboard
2. Run the "Extract Wisdom" command
3. The extension will automatically detect the YouTube URL and extract the transcript using `fabric --youtube="URL" --transcript --pattern extract_wisdom`
4. Get AI-powered insights from the video content

### Keyboard Shortcuts

- `Cmd + Enter`: Extract wisdom from current content
- `Cmd + K`: Clear current content and reset interface
- `Cmd + H`: Toggle between main interface and history view
- `Cmd + Shift + V`: Extract wisdom directly from clipboard
- `Cmd + Shift + C`: Copy extracted wisdom to clipboard

## 🏗️ Project Structure

```
raycast-fabric-ai-extension/
├── fabricai-extension/          # Main extension (recommended)
│   ├── src/
│   │   ├── extract-wisdom-*.tsx # Multiple implementation variants
│   │   ├── constants/           # Shared constants and configuration
│   │   └── __mocks__/          # Jest mocks for testing
│   ├── assets/                 # Extension assets
│   ├── docs/                   # Documentation
│   └── package.json           # Extension manifest
├── src/pattern-creation/        # Pattern Registry Framework
│   ├── DocumentationGenerator.ts      # Automatic pattern documentation
│   ├── KnowledgeBaseIntegrator.ts     # Searchable best practices database
│   ├── RegistryIntegrator.ts          # Pattern registry integration
│   ├── ExportSystemIntegrator.ts      # CSV/Notion export integration
│   ├── ChainCompatibilityEnsurer.ts   # Pattern chaining support
│   ├── PatternTemplateGenerator.ts    # Custom pattern creation
│   ├── SampleCollectionGenerator.ts   # Test sample generation
│   ├── QualityAssurance.ts            # Pattern validation & testing
│   └── test-*.ts                      # Comprehensive test suite
├── patterns/                    # Custom pattern implementations (✅ Complete)
│   ├── analyze_wireframe_flow.md      # UX analysis pattern (✅ Production Ready)
│   ├── analyze_copywriting_score.md   # Copywriting analysis pattern (✅ Production Ready)
│   ├── create_storybrand_variant.md   # StoryBrand framework pattern (✅ Production Ready)
│   ├── create_competitive_audit.md    # Competitive analysis pattern (✅ Production Ready)
│   ├── test-samples/                  # Pattern test samples (✅ Complete)
│   │   ├── wireframe_flow_samples.md
│   │   ├── copywriting_score_samples.md
│   │   ├── storybrand_variant_samples.md
│   │   └── competitive_audit_samples.md
│   └── _RAW/                          # Original Fabric AI patterns (200+ patterns)
├── raycast-fabricAI/           # Experimental/alternative implementation
└── .kiro/                      # Kiro AI assistant configuration
    ├── hooks/                  # Automated workflow hooks
    ├── specs/                  # Project specifications
    └── steering/               # AI assistant guidance
```

## 🔧 Configuration

The extension supports flexible configuration through Raycast preferences:

- **Fabric AI Path**: Custom installation path for Fabric AI
- **Processing Limits**: Configure timeout and content size limits
- **Default Patterns**: Set preferred Fabric AI patterns

## 📋 Current Capabilities Summary

### ✅ Production Ready Features
- **Core Raycast Extension**: Extract wisdom from any content with professional CSV export
- **YouTube Integration**: Complete video processing with metadata extraction
- **4 Custom Landing Page Patterns**: UX analysis, copywriting scoring, StoryBrand optimization, competitive audit
- **Pattern Creation Framework**: 15+ TypeScript classes for custom pattern development
- **Knowledge Base System**: Searchable database with comprehensive test suite
- **Documentation Generator**: Automatic pattern documentation with examples
- **Export Systems**: CSV and Notion compatibility with structured data mapping
- **Quality Assurance**: Automated testing and validation with comprehensive coverage

### 🚧 In Active Development
- **Notion Database Integration**: API integration for unified export workflows
- **Notion Watcher Automation**: Automated URL monitoring and processing
- **Pattern Marketplace**: Community pattern discovery and sharing

### 📊 Implementation Statistics
- **Total TypeScript Classes**: 15+ specialized pattern creation classes
- **Custom Patterns**: 4 production-ready landing page analysis patterns
- **Test Coverage**: Comprehensive test suites for all major components
- **Sample Data**: 20+ test samples across all pattern types
- **Documentation**: Auto-generated docs for all patterns with usage examples

## 🏛️ Technical Architecture

### Pattern Creation Framework (✅ Complete)
The project includes a comprehensive TypeScript-based pattern creation system:

```typescript
// Core Components (✅ Complete)
DocumentationGenerator     // Automatic pattern documentation generation
KnowledgeBaseIntegrator   // Searchable best practices database with complete test suite
RegistryIntegrator        // Pattern registration and management
ExportSystemIntegrator    // CSV/Notion export compatibility
ChainCompatibilityEnsurer // Pattern chaining workflows

// Pattern Development (✅ Complete)
PatternTemplateGenerator  // Custom pattern creation tools
SampleCollectionGenerator // Test sample generation with 5 samples per pattern
QualityAssurance         // Validation and testing systems
PatternValidator         // Syntax and structure validation
OutputTester            // Automated output testing

// Production Patterns (✅ Complete)
analyze_wireframe_flow    // UX analysis with scoring and prioritization
analyze_copywriting_score // Copywriting effectiveness analysis
create_storybrand_variant // StoryBrand SB7 framework application
create_competitive_audit  // SWOT analysis and competitive intelligence
```

### Knowledge Base System
Comprehensive TypeScript interfaces for:
- **Searchable Entries**: Best practices, templates, examples, troubleshooting guides
- **Metadata Tracking**: Author, version, quality scores, usage statistics
- **Advanced Search**: Multi-criteria filtering with relevance scoring
- **Category Management**: Structured organization with subcategories and tags
- **Template System**: Reusable pattern templates with variable substitution

## 🧪 Development

### Available Commands

```bash
npm run dev          # Start development mode with hot reload
npm run build        # Build extension for production
npm run lint         # Run ESLint checks
npm run fix-lint     # Auto-fix linting issues
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Latest Implementation Variants

The project includes multiple implementation variants for different use cases:

- **`extract-wisdom-enhanced-production.tsx`**: Latest enhanced production version with structured output parsing, CSV export system, debug logging, and comprehensive data analysis capabilities
- **`extract-wisdom-ultimate.tsx`**: Advanced implementation with spawn-based process control, stream processing, file system integration, and interactive debug logging
- **`extract-wisdom-production.tsx`**: Production-ready version with robust YouTube processing and smart path detection
- **`extract-wisdom-final.tsx`**: Previous production version with API credit management
- **`extract-wisdom-youtube-fixed.tsx`**: Enhanced version with direct Fabric AI YouTube integration
- **`extract-wisdom-youtube-working.tsx`**: Alternative YouTube processing using yt-dlp directly

### Testing

The project includes comprehensive testing with Jest and React Testing Library:

```bash
npm test                    # Run all tests
npm run test:coverage      # Run tests with coverage report
npm run test:ci           # Run tests for CI environment
```

### Implementation Variants

The project includes multiple implementation variants for different use cases:

- **`extract-wisdom-enhanced-production.tsx`**: Latest enhanced production version with structured output parsing, CSV export system, debug logging, and comprehensive data analysis capabilities
- **`extract-wisdom-ultimate.tsx`**: Advanced implementation with spawn-based process control, stream processing, file system integration, and interactive debug logging
- **`extract-wisdom-production.tsx`**: Production-ready version with robust YouTube processing, smart path detection, and built-in testing
- **`extract-wisdom-final.tsx`**: Previous production version with API credit management and optimized YouTube processing
- **`extract-wisdom-youtube-fixed.tsx`**: Enhanced version with direct Fabric AI YouTube integration
- **`extract-wisdom-youtube-working.tsx`**: Alternative YouTube processing using yt-dlp directly
- **`extract-wisdom-working.tsx`**: Stable, production-ready implementation
- **`extract-wisdom-debug.tsx`**: Debug version with enhanced logging
- **`extract-wisdom-simple.tsx`**: Minimal implementation for reference

## 📚 Documentation

- [Complete Documentation](fabricai-extension/docs/README.md)
- [Changelog](fabricai-extension/CHANGELOG.md)
- [Project Specifications](.kiro/specs/raycast-extract-wisdom/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Fabric AI](https://github.com/danielmiessler/fabric) - The amazing AI framework that powers this extension
- [Raycast](https://raycast.com/) - The productivity platform that makes this possible
- The open-source community for inspiration and support

## 🐛 Issues & Support

If you encounter any issues or have questions:

1. Check the [documentation](fabricai-extension/docs/README.md)
2. Search existing [issues](https://github.com/yourusername/raycast-fabric-ai-extension/issues)
3. Create a new issue with detailed information

### Common Issues

**API Credit Management** (Final Implementation):
- **402 Payment Required**: Add more credits at https://openrouter.ai/settings/credits
- **401 Unauthorized**: Check API configuration with `fabric --setup`
- **Token Limits**: Final implementation uses `--tokens 4000` to prevent quota issues
- **Content Length**: Reduce content length if hitting API limits (default max: 1000 chars)

**YouTube Processing**: 
- **Production method**: Use `extract-wisdom-production.tsx` with `yt-dlp --get-title` for robust title extraction with intelligent path detection
- Primary method: Use `fabric --youtube="URL" --transcript --pattern extract_wisdom` (note the equals sign without spaces)
- Final method: Use `extract-wisdom-final.tsx` with `yt-dlp --print "%(title)s"` for title extraction
- Alternative method: Use `extract-wisdom-youtube-working.tsx` with simplified `yt-dlp` pipeline for direct transcript extraction
- Install dependencies: `brew install yt-dlp html2text` for the alternative method
- Alternative method uses step-by-step approach with `/tmp/` file management for better reliability

**Icon Compatibility** (Final Implementation):
- Final implementation uses `Icon.ArrowLeft` and `Icon.Wand` which may cause TypeScript errors
- Recommended fix: Replace with `Icon.ArrowCounterClockwise` and `Icon.Star` respectively
- Other implementations use compatible Raycast icons

**Fabric AI Installation**: Verify installation with `fabric --version` and ensure the `extract_wisdom` pattern is available with `fabric --list`

## 🎯 Major Milestone Achievements

### ✅ Phase 1 Complete: Core Raycast Extension
**Status: Production Ready** - Core extract wisdom functionality with professional CSV export system

### ✅ Phase 2 Complete: Pattern Creation Framework  
**Status: Implementation Complete** - Comprehensive TypeScript-based pattern creation system with 15+ specialized classes

### ✅ Phase 2 Complete: Pattern Creation Framework
**Status: Implementation Complete** - Advanced TypeScript-based pattern creation system with comprehensive knowledge base

### 🚧 Phase 3 In Progress: Advanced Integration Features
**Status: Active Development** - Notion integration and automation workflows

## 📊 Current Implementation Status

### ✅ Completed Components (Phase 1 & 2)
- **Core Extension**: Production-ready Raycast extension with comprehensive wisdom extraction
- **CSV Export System**: Professional 20-column spreadsheet export with structured data analysis
- **YouTube Integration**: Complete video processing with metadata extraction
- **Debug Infrastructure**: Advanced logging and troubleshooting capabilities
- **Pattern Creation Framework**: Complete TypeScript implementation with 15+ specialized classes
- **Custom Landing Page Patterns**: 4 production-ready patterns (wireframe analysis, copywriting scoring, StoryBrand optimization, competitive audit)
- **Knowledge Base System**: Complete TypeScript interfaces and comprehensive test suite for searchable pattern creation database
- **Documentation Generator**: Automatic pattern documentation with usage examples and best practices
- **Registry Integration**: Pattern registration and configuration management systems
- **Export Integration**: CSV and Notion export compatibility layers
- **Chain Compatibility**: Pattern chaining support and workflow management
- **Quality Assurance**: Automated testing and validation systems with comprehensive test coverage
- **Sample Collection System**: Test sample generation for all custom patterns
- **Template Generation**: Automated pattern template creation and validation

### 🚧 Phase 3 In Development
- **Notion Database Integration**: API integration and property mapping (TypeScript interfaces complete)
- **Notion Watcher Automation**: URL monitoring and automated processing workflows
- **Knowledge Base Implementation**: ✅ Complete - Full implementation with search functionality, template management, and comprehensive test suite
- **Pattern Marketplace**: Discovery and sharing system for custom patterns

## 🔮 Current Development (Phase 3)

### 🗄️ Notion Database Integration
- **Send to Database**: Unified export to both Notion database (primary) and CSV file (backup)
- **Smart Mapping**: Automatic mapping of 20-column CSV structure to Notion database properties
- **Secure Configuration**: Notion API token and database ID management through Raycast preferences
- **Error Handling**: Comprehensive error handling with user-friendly guidance

### 🤖 Notion Watcher Automation
- **Automated Monitoring**: Intelligent detection of new URLs added to Notion databases
- **Content Type Analysis**: Automatic content classification (video, repo, webshop, landingpage, unspecified)
- **Pattern Chain Execution**: Tailored analysis workflows for different content types
- **Priority Insights**: Automated extraction to help prioritize content consumption

### 🔧 Pattern Registry Framework (✅ Complete)
- **Custom Pattern Creation**: Complete TypeScript implementation with 15+ specialized classes
- **Landing Page Analysis Patterns**: 4 production-ready patterns for UX, copywriting, StoryBrand, and competitive analysis
- **Pattern Chaining**: Advanced workflows combining multiple patterns for comprehensive analysis
- **Quality Assurance**: Automated testing and validation systems with comprehensive test coverage
- **Export Integration**: Seamless integration with CSV and Notion export systems
- **Knowledge Base System**: Complete TypeScript interfaces and test suite for searchable pattern creation database
- **Documentation Generation**: Automatic pattern documentation with usage examples and best practices
- **Template System**: Automated pattern template creation and validation tools

## 🚀 Future Roadmap (Phase 4+)

- [ ] Multiple Fabric AI patterns support (expanded beyond extract_wisdom)
- [ ] Batch processing capabilities
- [ ] Advanced pattern marketplace
- [ ] Cloud synchronization
- [ ] Mobile app integration
- [ ] AI-powered pattern recommendations

---

**Made with ❤️ for the Raycast and Fabric AI communities**