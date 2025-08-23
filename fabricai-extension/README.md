# FabricAI Extension for Raycast

A powerful Raycast extension that integrates with [Fabric AI](https://github.com/danielmiessler/fabric) to extract wisdom and insights from any text content using advanced AI patterns.

## Features

### 🧠 Intelligent Wisdom Extraction
- Extract valuable insights from any text using Fabric AI's `extract_wisdom` pattern
- Support for multiple content types: Plain text, HTML, Markdown, URLs, and YouTube videos with automatic detection
- **YouTube Integration**: Direct transcript extraction from YouTube videos using `yt --transcript` command
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

3. **For YouTube Integration** (optional): Ensure YouTube transcript extraction is configured
   ```bash
   # YouTube integration should be included with Fabric AI
   # Verify yt command is available
   yt --help
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

- **`extract-wisdom-youtube-fixed.tsx`** (Latest): Enhanced version with YouTube transcript extraction, URL processing, and improved error handling
- **`extract-wisdom-enhanced.tsx`**: Enhanced version with URL processing, content type detection, and improved UX
- **`extract-wisdom-fixed.tsx`**: Production-ready with latest fixes and icon compatibility
- **`extract-wisdom-working.tsx`**: Stable baseline implementation  
- **`extract-wisdom-simple.tsx`**: Minimal version for basic use cases
- **`extract-wisdom-debug.tsx`**: Development version with detailed diagnostics

Configure your preferred implementation in the Raycast extension settings or package.json.

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
├── extract-wisdom-youtube-fixed.tsx # Latest version with YouTube transcript extraction and enhanced error handling
├── extract-wisdom-enhanced.tsx      # Enhanced version with URL processing and content type detection
├── extract-wisdom-fixed.tsx         # Production-ready implementation with robust error handling
├── extract-wisdom-working.tsx       # Stable working version with core functionality
├── extract-wisdom-simple.tsx        # Simplified implementation for basic use cases
├── extract-wisdom-debug.tsx         # Debug version with detailed logging and diagnostics
├── __mocks__/                       # Jest mocks for @raycast/api
│   └── @raycast/
│       └── api.ts
└── constants/                       # Shared constants and configuration
    └── index.ts                     # Error messages, defaults, storage keys
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
- Ensure `yt` command is installed and configured with Fabric AI
- Check YouTube API configuration: `fabric --setup`
- Verify video has captions/transcript available
- Some videos may be private or have restricted access

**Command Format Issues**
- The extension uses `--pattern extract_wisdom` command format (updated from `-p`)
- Ensure your Fabric AI version supports the `--pattern` flag
- Try the debug version for detailed command execution logs

**Icon Display Issues**
- Extension uses Raycast-compatible icons (Stars, QuestionMark, etc.)
- Update to latest Raycast version if icons don't display
- Restart Raycast if UI elements appear broken

### Debug Mode

Enable debug logging by setting the environment variable:
```bash
export FABRIC_DEBUG=true
```

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