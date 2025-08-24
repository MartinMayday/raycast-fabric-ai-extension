# FabricAI Extension for Raycast

A comprehensive Raycast extension that integrates with [Fabric AI](https://github.com/danielmiessler/fabric) to extract wisdom and insights from any text content using advanced AI patterns. Features a complete pattern creation framework with 4 production-ready landing page analysis patterns and professional CSV export capabilities.

## Features

### ✅ Core Features (Milestone Completed - Phase 1)

#### 🧠 Intelligent Wisdom Extraction
- Extract valuable insights from any text using Fabric AI's `extract_wisdom` pattern
- Support for multiple content types: Plain text, HTML, Markdown, URLs, and YouTube videos with automatic detection
- **Structured Output Parsing**: Advanced parsing of wisdom into organized sections (summary, ideas, insights, quotes, habits, facts, references, takeaway, recommendations)
- **Professional CSV Export**: Automatic export to structured 20-column spreadsheet for comprehensive data analysis and content tracking workflows
- **Enhanced Debug Logging**: File-based logging system with comprehensive troubleshooting and analysis capabilities
- **YouTube Integration**: Multiple approaches including direct transcript extraction, optimized title extraction, and channel metadata extraction
- **API Credit Management**: Built-in token limiting (`--tokens 4000`) to prevent quota exhaustion in final implementation
- **Enhanced Error Handling**: Specific guidance for API credits (402), authentication (401), and processing errors
- Intelligent URL processing with built-in web scraping capabilities
- Automatic content preprocessing and optimization
- Large content chunking for processing extensive documents

### 📋 Seamless Clipboard Integration
- Extract wisdom directly from clipboard content with live preview
- Automatic content type detection (text, URL, YouTube video, or clipboard)
- Smart YouTube URL detection with specialized transcript processing
- Smart URL detection and specialized processing
- One-click clipboard processing with visual feedback and content preview

### 📚 Comprehensive History Management
- Automatic saving of all extractions with timestamps
- Searchable history with intelligent filtering
- Export/import functionality for data portability
- History statistics and analytics

### ⚡ Performance Optimized
- Debounced search and input handling
- React component memoization for smooth UI
- Automatic content chunking for large inputs
- Real-time progress tracking for long operations

### ⌨️ Keyboard-First Experience
- `Cmd+Enter`: Extract wisdom from current content
- `Cmd+K`: Clear current content
- `Cmd+H`: Toggle history view
- `Cmd+,`: Open settings
- `Cmd+Shift+V`: Extract from clipboard
- `Cmd+Shift+C`: Copy result to clipboard
- `Cmd+R`: Refresh/reload

### 🛠️ Advanced Configuration
- Customizable Fabric AI installation path
- Configurable API endpoints and model preferences
- Adjustable timeout and content length limits
- First-run setup wizard for easy onboarding

### 🔧 Robust Error Handling
- Intelligent error classification and recovery
- Contextual error messages with actionable guidance
- Automatic retry mechanisms for transient failures
- Comprehensive error logging and debugging

#### 📊 Enhanced Production Features (Latest Implementation)

##### Structured Data Analysis
- **Comprehensive Output Parsing**: Automatic parsing of Fabric AI's structured wisdom output into organized components
- **Rich Data Model**: Extended data structure with 15+ fields including summary, ideas, insights, quotes, habits, facts, references, takeaway, and recommendations
- **Content Metadata Extraction**: Automatic extraction of author information, hooks, CTA URLs, and content classification
- **YouTube Metadata**: Dual extraction of video title and channel information for comprehensive content analysis

##### Professional Export System
- **20-Column CSV Export**: Structured spreadsheet export matching professional content analysis workflows
- **Automatic Data Escaping**: Proper CSV formatting with quote escaping and data sanitization
- **Incremental Data Appending**: Automatic header management and data appending for continuous analysis
- **Export Path Configuration**: Configurable export directory with automatic directory creation

##### Advanced Debug Infrastructure
- **File-Based Logging**: Persistent logging to Raycast's support directory with timestamp tracking
- **Comprehensive Debug Information**: Detailed process tracking, command execution logs, and error classification
- **Log Sharing**: One-click debug log copying to clipboard for troubleshooting and support
- **Production Monitoring**: Real-time process monitoring with detailed feedback and error tracking

### ✅ Phase 2 Features (MILESTONE ACHIEVED - Complete)

#### 🔧 Pattern Creation Framework (✅ PHASE 2 COMPLETE)
- **15+ TypeScript Classes**: Complete implementation of specialized pattern creation tools
  - **DocumentationGenerator**: Automatic pattern documentation with usage examples
  - **KnowledgeBaseIntegrator**: Searchable best practices database with comprehensive test suite
  - **PatternTestSuite**: 5-category testing framework with quality grading
  - **QualityAssuranceSystem**: 8-category quality assessment with improvement recommendations
  - **DeploymentIntegrator**: Production deployment with validation, testing, and rollback capabilities
  - **RegistryIntegrator**: Pattern registration and configuration management
  - **ExportSystemIntegrator**: CSV/Notion export compatibility layers
  - **ChainCompatibilityEnsurer**: Pattern chaining support and workflow management
  - **PatternTemplateGenerator**: Custom pattern creation tools
  - **SampleCollectionGenerator**: Test sample generation with 5 samples per pattern
  - **StructureExtractor**: Pattern structure analysis and validation
  - **PatternValidator**: Syntax and structure validation systems
  - **OutputTester**: Automated output testing and verification
  - **BestPracticesDatabase**: Built-in best practices with categorization
  - **ExistingPatternAnalyzer**: Analysis of existing pattern implementations

- **4 Production-Ready Landing Page Patterns**: Complete with 20+ test samples
  - **analyze_wireframe_flow.md**: UX analysis with user flow, navigation, and conversion optimization
  - **analyze_copywriting_score.md**: Copywriting effectiveness with headlines, persuasion, and clarity scoring
  - **create_storybrand_variant.md**: StoryBrand SB7 framework application for landing page optimization
  - **create_competitive_audit.md**: SWOT analysis and competitive intelligence with strategic recommendations

- **Comprehensive Testing Infrastructure**: Complete validation and quality assurance
  - **Pattern Test Suite**: 5-category automated testing with quality grading
  - **Quality Assurance System**: 8-category quality assessment with improvement recommendations
  - **Deployment Integration**: Production deployment system with validation and rollback
  - **Knowledge Base System**: Complete implementation with search functionality and template management

### 🚧 Phase 3 Features (In Development)

#### 🗄️ Notion Database Integration
- **Send to Database**: Unified export action that saves to both Notion database (primary) and CSV file (backup) simultaneously
- **Smart Property Mapping**: Automatic mapping of the 20-column CSV structure to Notion database properties
- **Secure Configuration**: Notion API token and database ID management through Raycast preferences
- **Software Independence**: Maintains CSV backup ensuring data portability and independence from any single platform
- **Error Handling**: Comprehensive error handling with user-friendly guidance for setup and troubleshooting

#### 🤖 Notion Watcher Automation
- **Automated URL Monitoring**: Intelligent system that monitors Notion databases for new URLs and automatically processes them
- **Content Type Classification**: Automatic detection and classification of content (video, repo, webshop, landingpage, unspecified)
- **Pattern Chain Workflows**: Tailored analysis workflows for different content types:
  - **Video**: extract_wisdom_dm → extract_questions → extract_primary_problem → extract_primary_solution → extract_instructions
  - **Repository**: explain_project → extract_instructions → analyze_tech_impact → create_coding_feature → extract_business_ideas
  - **Webshop**: extract_business_ideas → analyze_sales_call → create_hormozi_offer → extract_patterns → analyze_risk
  - **Landing Page**: convert_to_markdown → analyze_wireframe_flow → analyze_copywriting_score → create_storybrand_variant → create_competitive_audit
- **Priority Intelligence**: Automated extraction of insights to help prioritize which content to consume based on extracted value

#### 🔍 Advanced Pattern Marketplace
- **Pattern Discovery**: Advanced search and filtering for community-created patterns
- **Pattern Sharing**: Seamless sharing and deployment of custom patterns
- **Community Integration**: Rating, reviews, and collaborative pattern development
- **Version Management**: Pattern versioning and update management system

## Installation

### Prerequisites

1. **Install Fabric AI**: Follow the [official installation guide](https://github.com/danielmiessler/fabric#installation)
   ```bash
   # Using pip
   pip install fabric-ai
   
   # Or using pipx (recommended)
   pipx install fabric-ai
   ```

2. **Configure Fabric AI**: Set up your API keys and preferences
   ```bash
   fabric --setup
   ```

3. **For YouTube Integration** (optional): Choose your preferred method
   
   **Method 1 - Direct Fabric AI Integration** (Recommended):
   ```bash
   # YouTube integration should be included with Fabric AI
   # Test YouTube functionality
   fabric --youtube="https://www.youtube.com/watch?v=example" --transcript --pattern extract_wisdom
   ```
   
   **Method 2 - Alternative yt-dlp Integration** (Fallback):
   ```bash
   # Install yt-dlp for alternative YouTube processing
   brew install yt-dlp
   # or
   pip install yt-dlp
   
   # Install html2text for URL processing
   brew install html2text
   
   # Test yt-dlp functionality (simplified approach)
   yt-dlp --write-auto-sub --sub-lang en --skip-download --output "/tmp/%(id)s.%(ext)s" "https://www.youtube.com/watch?v=example"
   ```

4. **Verify Installation**: Test that Fabric AI is working
   ```bash
   fabric --help
   fabric --list  # Should show available patterns including extract_wisdom
   ```

### Install the Extension

1. Clone this repository or download the extension
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
4. Import into Raycast using the "Import Extension" command

### Choosing an Implementation

The extension includes multiple implementation variants:

- **`extract-wisdom-enhanced-production.tsx`** (Latest Enhanced Production): Most advanced implementation with structured output parsing, professional CSV export system, enhanced debug logging, spawn-based process control, and comprehensive data analysis capabilities for professional workflows
- **`extract-wisdom-ultimate.tsx`** (Previous Ultimate): Advanced implementation with spawn-based process control, stream processing, file system integration, interactive debug logging, and superior error handling for maximum reliability and performance
- **`extract-wisdom-production.tsx`** (Production): Production-ready version with robust YouTube processing using `yt-dlp --get-title`, intelligent path detection, built-in testing, and comprehensive error handling
- **`extract-wisdom-final.tsx`** (Previous Production): Production-ready version with API credit management, optimized YouTube processing using `yt-dlp --print "%(title)s"`, and enhanced error handling for API credits (402) and authentication (401) issues
- **`extract-wisdom-youtube-fixed.tsx`** (Enhanced YouTube): Enhanced version with direct Fabric AI YouTube integration using `--youtube="URL"` flag
- **`extract-wisdom-youtube-working.tsx`** (Alternative): Uses `yt-dlp` directly with simplified command pipeline for YouTube transcript extraction when Fabric AI's built-in support isn't available
- **`extract-wisdom-enhanced.tsx`**: Enhanced version with URL processing, content type detection, and improved UX
- **`extract-wisdom-fixed.tsx`**: Production-ready with latest fixes and icon compatibility
- **`extract-wisdom-working.tsx`**: Stable baseline implementation  
- **`extract-wisdom-simple.tsx`**: Minimal version for basic use cases
- **`extract-wisdom-debug.tsx`**: Development version with detailed diagnostics

Configure your preferred implementation in the Raycast extension settings or package.json.

**Recommended for Production**: Use `extract-wisdom-enhanced-production.tsx` for the most advanced production deployments with comprehensive data analysis, structured export, and professional workflow integration. Alternatively, use `extract-wisdom-ultimate.tsx` for advanced process control with spawn-based processing and file system integration, `extract-wisdom-production.tsx` for standard production use with robust YouTube processing, or `extract-wisdom-final.tsx` if you need API credit management with token limiting.

#### Key Differences Between Production Implementations

| Feature | Ultimate | Production | Final | YouTube-Fixed | YouTube-Working |
|---------|----------|------------|-------|---------------|-----------------|
| Process Control | ✅ Spawn-based | ❌ exec-based | ❌ exec-based | ❌ exec-based | ❌ exec-based |
| Stream Processing | ✅ Real-time | ❌ No | ❌ No | ❌ No | ❌ No |
| File System Integration | ✅ Enhanced logging + UI | ❌ No | ❌ No | ❌ No | ❌ No |
| YouTube Method | `yt-dlp --get-title` | `yt-dlp --get-title` | `yt-dlp --print "%(title)s"` | `fabric --youtube="URL"` | `yt-dlp` direct |
| Path Detection | ❌ Hardcoded | ✅ Smart detection | ❌ Manual path | ❌ Manual path | ❌ Manual path |
| Built-in Testing | ✅ Spawn-based | ✅ Integrated | ❌ No | ❌ No | ❌ No |
| API Credit Management | ❌ No | ❌ No | ✅ `--tokens 4000` | ❌ No | ❌ No |
| Fallback Mechanisms | ✅ Video ID fallback | ✅ Video ID fallback | ❌ No | ❌ No | ✅ Multiple methods |
| Content Length Default | 2000 chars | 2000 chars | 1000 chars | 10000 chars | 10000 chars |
| Buffer Management | ✅ Stream-based | 5MB | 2MB | 5MB | 5MB |
| Timeout Handling | ✅ Process-level | ❌ Command-level | ❌ Command-level | ❌ Command-level | ❌ Command-level |
| Icon Compatibility | ⚠️ Needs fixes | ⚠️ Needs fixes | ⚠️ Needs fixes | ✅ Compatible | ✅ Compatible |
| Debug Interface | ✅ Interactive UI | ❌ No | ❌ No | ❌ No | ❌ No |

## Usage

### Basic Wisdom Extraction

1. **Launch the extension** using the "Extract Wisdom" command in Raycast
2. **Enter your content** in the search bar or paste from clipboard
3. **Press Enter** or click "Extract Wisdom" to process
4. **View the results** with extracted insights and wisdom
5. **Copy to clipboard** or save to history for later reference

### From Clipboard

1. **Copy any text** to your clipboard
2. **Launch the extension** - clipboard content will be detected automatically
3. **Click "Extract from Clipboard"** or use `Cmd+Shift+V`
4. **Review the extracted wisdom** and copy or save as needed

### From Selected Text

1. **Select text** in any application
2. **Use the "Extract Wisdom from Selection" command** in Raycast
3. **Wisdom is automatically extracted** and copied to clipboard
4. **Receive a notification** when processing is complete

### History Management

1. **View history** by clicking "View History" or pressing `Cmd+H`
2. **Search through past extractions** using the search bar
3. **Click any item** to view the full wisdom extraction
4. **Export history** for backup or sharing
5. **Clear history** when needed to free up space

## Configuration

### Fabric AI Settings

Access configuration through the extension preferences:

- **Installation Path**: Custom path to Fabric AI executable (default: system PATH)
- **Max Content Length**: Maximum characters to process (default: 5000)
- **Timeout Seconds**: Processing timeout in seconds (default: 60)

The extension includes built-in testing functionality to verify your Fabric AI installation and configuration.

### Performance Tuning

- **Content Chunking**: Automatically enabled for content >4KB
- **Debounce Delay**: Search input delay (default: 300ms)
- **Cache Settings**: Function caching for improved performance
- **Memory Management**: Automatic cleanup and optimization

## Architecture

### Core Components

```
src/
├── extract-wisdom-ultimate.tsx        # Latest ultimate version with spawn-based process control, stream processing, file system integration, and interactive debug logging
├── extract-wisdom-production.tsx      # Production version with robust YouTube processing and built-in testing
├── extract-wisdom-final.tsx           # Previous production version with API credit management
├── extract-wisdom-youtube-fixed.tsx   # Enhanced version with direct Fabric AI YouTube integration
├── extract-wisdom-youtube-working.tsx # Alternative YouTube processing using yt-dlp directly
├── extract-wisdom-enhanced.tsx        # Enhanced version with URL processing and content type detection
├── extract-wisdom-fixed.tsx           # Production-ready implementation with robust error handling
├── extract-wisdom-working.tsx         # Stable working version with core functionality
├── extract-wisdom-simple.tsx          # Simplified implementation for basic use cases
├── extract-wisdom-debug.tsx           # Debug version with detailed logging and diagnostics
├── __mocks__/                         # Jest mocks for @raycast/api
│   └── @raycast/
│       └── api.ts
└── constants/                         # Shared constants and configuration
    └── index.ts                       # Error messages, defaults, storage keys
```

### Service Layer

- **ContentProcessor**: Validates, sanitizes, and preprocesses content
- **FabricClient**: Manages communication with Fabric AI
- **HistoryManager**: Handles local storage and history operations

### Performance Features

- **React Memoization**: Prevents unnecessary re-renders
- **Debounced Operations**: Smooth user interactions
- **Content Chunking**: Handles large documents efficiently
- **Error Recovery**: Intelligent retry mechanisms

## Development

### Setup Development Environment

```bash
# Clone the repository
git clone <repository-url>
cd fabricai-extension

# Install dependencies
npm install

# Start development mode
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Testing

The extension includes comprehensive tests:

```bash
# Run all tests
npm test

# Run specific test suites
npm test -- --testPathPattern="services"
npm test -- --testPathPattern="utils"

# Run tests with coverage
npm run test:coverage
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run fix-lint

# Format code
npm run format
```

## API Reference

### ContentProcessor

```typescript
class ContentProcessor {
  validateContent(content: string): ValidationResult
  detectContentType(content: string): ContentType
  preprocessContent(content: string): string
  chunkContent(content: string, options?: ChunkOptions): ContentChunk[]
}
```

### FabricClient

```typescript
class FabricClient {
  checkInstallation(): Promise<boolean>
  executePattern(pattern: string, content: string): Promise<string>
  validateConfiguration(): Promise<boolean>
  getAvailablePatterns(): Promise<string[]>
}
```

### HistoryManager

```typescript
class HistoryManager {
  saveExtraction(content: string, wisdom: string, type: ContentType): Promise<void>
  getRecentExtractions(limit?: number): Promise<HistoryItem[]>
  searchHistory(query: string, limit?: number): Promise<HistoryItem[]>
  exportHistory(): Promise<string>
  clearHistory(): Promise<void>
}
```

## Troubleshooting

### Common Issues

**Fabric AI Not Found**
- Ensure Fabric AI is installed: `pip install fabric-ai`
- Use the built-in "Test Fabric AI" functionality to verify installation
- Check installation path in extension preferences
- Verify Fabric AI works in terminal: `fabric --version`

**Pattern Not Available**
- Verify `extract_wisdom` pattern exists: `fabric --list`
- Update Fabric AI to latest version: `pip install --upgrade fabric-ai`
- Run `fabric --setup` to refresh pattern configurations

**YouTube Processing Issues**

*Primary Method (youtube-fixed.tsx):*
- Ensure YouTube integration is configured with Fabric AI: `fabric --setup`
- Test YouTube functionality: `fabric --youtube="URL" --transcript --pattern extract_wisdom`
- Verify video has captions/transcript available
- Some videos may be private or have restricted access
- Check command format uses `--youtube="URL"` (with equals sign, no space)

*Alternative Method (youtube-working.tsx):*
- Install required dependencies: `brew install yt-dlp html2text`
- Test yt-dlp: `yt-dlp --write-auto-sub --sub-lang en --skip-download --output "/tmp/%(id)s.%(ext)s" "URL"`
- Ensure video has auto-generated or manual captions
- Check file system permissions for `/tmp/` directory access
- Uses simplified step-by-step command pipeline for better reliability
- Use when Fabric AI's built-in YouTube support is unavailable

**Command Format Issues**
- The extension uses `--pattern extract_wisdom` command format (updated from `-p`)
- Ensure your Fabric AI version supports the `--pattern` flag
- Try the debug version for detailed command execution logs

**Icon Display Issues**
- Extension uses Raycast-compatible icons (Stars, QuestionMark, etc.)
- **Ultimate Implementation**: Uses incompatible icons (`Icon.ArrowLeft`, `Icon.Bug`, `Icon.Wand`)
- **Production Implementation**: May use incompatible icons (`Icon.ArrowLeft`, `Icon.Bug`, `Icon.Wand`)
- **Quick Fix**: Replace with `Icon.ArrowCounterClockwise`, `Icon.ExclamationMark`, and `Icon.Star` respectively
- Update to latest Raycast version if icons don't display
- Restart Raycast if UI elements appear broken

**Process Control Issues** (Enhanced Production & Ultimate Implementations)
- **Spawn Process Failures**: Check if Fabric AI path is accessible and executable
- **Stream Processing Errors**: Verify proper stdout/stderr handling in spawn configuration
- **Timeout Issues**: Default 60-second timeout may need adjustment for large content
- **Process Cleanup**: Ensure proper process termination to avoid zombie processes

**CSV Export Issues** (Enhanced Production Implementation)
- **Export Path Permissions**: Ensure write permissions to the configured export directory (default: Raycast support path)
- **CSV File Access**: Check if the CSV file is not open in another application during export
- **Data Escaping**: CSV export automatically handles quote escaping and special characters
- **File Size**: Large CSV files may impact performance; consider periodic cleanup

**Debug Logging Issues** (Enhanced Production Implementation)
- **Log Directory Access**: Verify write permissions to Raycast's support directory for log file creation
- **Log File Size**: Monitor log file growth; logs are appended continuously during use
- **Log Sharing**: Use the built-in "Copy Debug Logs" feature for troubleshooting and support
- **Log Persistence**: Logs persist across sessions for comprehensive debugging

### Debug Mode

Enable debug logging by setting the environment variable:
```bash
export FABRIC_DEBUG=true
```

**Interactive Debug Interface** (Ultimate Implementation):
- Real-time log entry tracking with live count display
- One-click debug log copying to clipboard for easy sharing
- Persistent file-based logging in Raycast's support directory
- Comprehensive troubleshooting information for support requests

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Run the test suite: `npm test`
5. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Add tests for new functionality
- Update documentation for API changes
- Use semantic commit messages
- Ensure all tests pass before submitting

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Fabric AI](https://github.com/danielmiessler/fabric) - The AI framework powering this extension
- [Raycast](https://raycast.com) - The productivity platform this extension runs on
- The open-source community for inspiration and contributions

## Support

- **Issues**: Report bugs and feature requests on GitHub
- **Documentation**: Check the README and inline code documentation
- **Community**: Join discussions in the Raycast community
- **Updates**: Follow the repository for latest updates and releases

---

**Made with ❤️ for the Raycast community**