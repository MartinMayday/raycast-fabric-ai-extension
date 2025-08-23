# FabricAI Extension Documentation

Welcome to the comprehensive documentation for the FabricAI Extension for Raycast. This documentation provides everything you need to know about installing, configuring, using, and developing with the extension.

## 📚 Documentation Overview

This documentation is organized into several key sections:

### For Users

- **[User Guide](USER_GUIDE.md)** - Complete guide for end users
  - Getting started and setup
  - Feature overview and usage
  - Keyboard shortcuts and workflows
  - Troubleshooting common issues
  - Tips and best practices

### For Developers

- **[Developer Guide](DEVELOPER_GUIDE.md)** - Technical documentation for developers
  - Architecture overview and design patterns
  - Development setup and workflow
  - Testing strategies and guidelines
  - Performance optimization techniques
  - Contributing guidelines

- **[API Reference](API_REFERENCE.md)** - Detailed API documentation
  - Complete class and method documentation
  - Interface definitions and types
  - Usage examples and patterns
  - Error handling and best practices

## 🚀 Quick Start

### Prerequisites

1. **Install Fabric AI**:
   ```bash
   pip install fabric-ai
   # or
   pipx install fabric-ai
   ```

2. **Configure Fabric AI**:
   ```bash
   fabric --setup
   ```

3. **Install Raycast**: Download from [raycast.com](https://raycast.com)

### Installation

1. Clone or download the FabricAI Extension source code
2. Install dependencies: `npm install`
3. Build the extension: `npm run build`
4. Import into Raycast using "Import Extension" command
5. Configure your Fabric AI installation path in preferences
6. Test the installation using the built-in test functionality
7. Start extracting wisdom from your content!

## 📁 Implementation Variants

The extension includes multiple implementation variants for different use cases:

### `extract-wisdom-enhanced-production.tsx` (Latest Enhanced Production)
- **Advanced structured output parsing** with comprehensive parsing of Fabric AI's wisdom output into organized sections (summary, ideas, insights, quotes, habits, facts, references, takeaway, recommendations)
- **Professional CSV export system** with automatic export to structured 20-column spreadsheet for comprehensive data analysis and content tracking workflows
- **Enhanced debug logging infrastructure** with file-based persistence in Raycast's support directory and comprehensive troubleshooting capabilities
- **Spawn-based process control** using Node.js `spawn` for superior process management with real-time stdout/stderr handling and proper timeout management
- **Enhanced YouTube processing** with dual extraction of both video title and channel information using `yt-dlp --get-title` and `--print "%(uploader)s"`
- **Structured data management** with rich data model including parsed wisdom components (author, hook, summary, takeaway, CTA URLs, etc.)
- **Production-ready export pipeline** with automatic CSV generation, proper data escaping, headers, and incremental data appending
- **Advanced content analysis** with automatic CTA URL extraction, structured metadata, and comprehensive content type classification

### `extract-wisdom-ultimate.tsx` (Previous Ultimate)
- **Advanced process control** using Node.js `spawn` instead of `exec` for superior process management and reliability
- **Hardcoded path configuration** using specific absolute paths for Fabric AI (`/Volumes/askuss/cloudworkspace/.creatorworkspace/.add-ons/fabric-ai/fabric`) and yt-dlp (`/opt/homebrew/bin/yt-dlp`) for maximum reliability
- **Stream-based processing** with real-time stdout/stderr handling for immediate feedback and better error detection
- **Enhanced YouTube processing** using `yt-dlp --get-title` with intelligent fallback to video ID extraction
- **Built-in connection testing** using the same spawn-based approach for consistent testing methodology
- **Process lifecycle management** with proper timeout handling (60 seconds) and graceful process termination
- **Advanced error handling** with process-level error classification and stream-based error detection
- **Content type tracking** with comprehensive detection and visual indicators (🎥📝📋)
- **No buffer limitations** through stream processing, handling large content more efficiently
- **File system integration** with enhanced logging capabilities and data persistence using `writeFileSync`, `existsSync`, `mkdirSync`, and `appendFileSync`
- **Environment awareness** with improved Raycast environment integration for better system context and path management
- **Interactive debug logging** with real-time log entry tracking, persistent file storage, and one-click clipboard sharing for comprehensive troubleshooting

### `extract-wisdom-mission-complete.tsx` (Previous Mission Complete)
- **Hardcoded path configuration** using specific absolute paths for Fabric AI (`/Volumes/askuss/cloudworkspace/.creatorworkspace/.add-ons/fabric-ai/fabric`) and yt-dlp (`/opt/homebrew/bin/yt-dlp`) for reliable execution
- **Robust YouTube processing** using `yt-dlp --get-title` with hardcoded path for consistent YouTube title extraction
- **Built-in connection testing** with integrated Fabric AI connection testing showing current path configuration
- **Enhanced error classification** with specific handling for API credits (402), authentication (401), and pattern availability errors
- **Fallback mechanisms** for graceful degradation when YouTube extraction fails, using video ID and URL as fallback
- **Explicit shell execution** using `/bin/zsh` shell for all command execution with comprehensive environment variable handling
- **Optimized content processing** with configurable length limits (default 2000 characters) and 5MB buffer management
- **Comprehensive error guidance** with actionable messages for credit issues, authentication failures, and YouTube extraction problems
- **Visual content type indicators** (🎥 YouTube, 📝 text, 📋 clipboard) with streamlined user experience

### `extract-wisdom-production.tsx` (Previous Production)
- **Robust YouTube processing** using `yt-dlp --get-title` for reliable title extraction with intelligent path detection
- **Smart path detection** automatically finds yt-dlp across common installation paths (`/opt/homebrew/bin`, `/usr/local/bin`, `/usr/bin`, system PATH)
- **Enhanced error classification** with specific handling for API credits (402), authentication (401), and pattern availability errors
- **Built-in testing functionality** with integrated Fabric AI connection testing and detailed feedback
- **Fallback mechanisms** for graceful degradation when YouTube extraction fails, using video ID and URL as fallback
- **Optimized content processing** with configurable length limits (default 2000 characters) and 5MB buffer management
- **Comprehensive error guidance** with actionable messages for credit issues, authentication failures, and YouTube extraction problems
- **Visual content type indicators** (🎥 YouTube, 📝 text, 📋 clipboard) with streamlined user experience

### `extract-wisdom-final.tsx` (Previous Production)
- **Production-ready YouTube processing** using `yt-dlp --print "%(title)s"` for reliable title extraction
- **API credit management** with `--tokens 4000` flag to prevent quota exhaustion and API limit issues
- **Enhanced error classification** with specific handling for API credits (402), authentication (401), and YouTube processing errors
- **Optimized content processing** with configurable length limits (default 1000 characters) and 2MB buffer management
- **Comprehensive error guidance** with actionable messages for credit issues, authentication failures, and YouTube extraction problems
- **Visual content type indicators** (🎥 YouTube, 📝 text, 📋 clipboard) with streamlined user experience

### `extract-wisdom-youtube-fixed.tsx` (Enhanced YouTube)
- **YouTube transcript extraction** with direct `fabric --youtube="URL" --transcript --pattern extract_wisdom` command integration
- **Smart content detection** with automatic YouTube URL, URL, text, and clipboard type recognition
- **Enhanced command format** using `--pattern extract_wisdom` and proper `--youtube="URL"` syntax for better shell compatibility
- **YouTube-specific error handling** with API configuration guidance and transcript availability checks
- **Visual content type indicators** (🎥 YouTube, 🔗 URL, 📝 text, 📋 clipboard)
- **Advanced sharing features** with content-type-specific formatting and source attribution

### `extract-wisdom-youtube-working.tsx` (Alternative YouTube Method)
- **Alternative YouTube Processing** using `yt-dlp` directly for transcript extraction when Fabric AI's built-in YouTube support encounters issues
- **Simplified YouTube Integration** with step-by-step `yt-dlp --write-auto-sub --sub-lang en` command pipeline
- **Enhanced URL Processing** using `curl` and `html2text` for general web content extraction
- **Improved Command Pipeline** with clearer transcript extraction: `yt-dlp --print title → yt-dlp --write-auto-sub → cat /tmp/*.vtt → fabric --pattern extract_wisdom`
- **Better Error Handling** with fallback mechanism when transcript extraction fails
- **Temporary File Management** using `/tmp/` directory for organized subtitle file storage
- **Processing Optimization** limiting transcript to 500 lines for better performance
- **Content Type Tracking** with comprehensive detection and visual indicators throughout the workflow
- **Dependency Requirements** for `yt-dlp` and `html2text` external tools
- **Use Case**: When Fabric AI's `--youtube` flag is not available, not working, or when you need more control over transcript extraction

### `extract-wisdom-enhanced.tsx`
- **Smart content detection** with automatic URL, text, and clipboard type recognition
- **URL processing capabilities** with built-in web scraping support
- **Live clipboard preview** with real-time content display and character counting
- **Enhanced user experience** with content type indicators and contextual actions
- **Improved error handling** with content-type-specific guidance and recovery
- **Advanced sharing features** with formatted output and source attribution

### `extract-wisdom-fixed.tsx` (Recommended)
- **Production-ready** implementation with comprehensive error handling
- **Icon compatibility** fixes for latest Raycast API
- **Robust testing** functionality with detailed feedback
- **Enhanced path configuration** for custom Fabric AI installations
- **Improved command format** using `-p` flag for pattern specification

### `extract-wisdom-working.tsx`
- **Stable baseline** implementation with core functionality
- **Simplified error handling** for basic use cases
- **Standard Raycast patterns** and UI components

### `extract-wisdom-simple.tsx`
- **Minimal implementation** for basic wisdom extraction
- **Streamlined UI** with essential features only
- **Lightweight** with reduced complexity

### `extract-wisdom-debug.tsx`
- **Development version** with extensive debugging information
- **Detailed logging** for troubleshooting installation issues
- **Step-by-step diagnostics** for Fabric AI connectivity

## 🎯 Implementation Selection Guide

### When to Use Each Implementation

**`extract-wisdom-enhanced-production.tsx` (Latest Enhanced Production)**
- ✅ **Best for**: Production use with comprehensive data analysis, structured export, and advanced content processing
- ✅ **Features**: Structured output parsing, CSV export system, debug logging, spawn-based process control, YouTube metadata extraction
- ✅ **Use when**: You need comprehensive content analysis with structured data export for professional workflows and data analysis
- ⚠️ **Note**: Includes advanced data parsing, 20-column CSV export, and comprehensive logging infrastructure

**`extract-wisdom-ultimate.tsx` (Previous Ultimate)**
- ✅ **Best for**: Production use with advanced process control and maximum reliability
- ✅ **Features**: Spawn-based process control, stream processing, file system integration, advanced error handling, built-in testing, interactive debug logging
- ✅ **Use when**: You need the most advanced process management with real-time feedback, superior error handling, enhanced logging capabilities, and comprehensive debugging tools
- ⚠️ **Note**: Uses hardcoded paths, spawn-based process control, file system operations, and interactive debug interface for maximum reliability and troubleshooting

**`extract-wisdom-mission-complete.tsx` (Previous Mission Complete)**
- ✅ **Best for**: Production use with hardcoded paths for maximum reliability and built-in testing
- ✅ **Features**: Hardcoded path configuration, connection testing with path verification, comprehensive error handling
- ✅ **Use when**: You need maximum reliability with specific installation paths and built-in diagnostics
- ⚠️ **Note**: Uses hardcoded paths (`/Volumes/askuss/cloudworkspace/.creatorworkspace/.add-ons/fabric-ai/fabric` and `/opt/homebrew/bin/yt-dlp`)

**`extract-wisdom-production.tsx` (Previous Production)**
- ✅ **Best for**: Production use with robust YouTube processing and built-in testing
- ✅ **Features**: Smart path detection, fallback mechanisms, connection testing, comprehensive error handling
- ✅ **Use when**: You need reliable YouTube processing with intelligent path detection and built-in diagnostics
- ⚠️ **Note**: Uses `yt-dlp --get-title` for YouTube (automatically detects yt-dlp installation paths)

**`extract-wisdom-final.tsx` (Alternative Production)**
- ✅ **Best for**: Production use with API credit management
- ✅ **Features**: Token limits, enhanced error handling, optimized YouTube processing
- ✅ **Use when**: You need reliable API credit management and streamlined YouTube title extraction
- ⚠️ **Note**: Uses `yt-dlp --print "%(title)s"` for YouTube (requires yt-dlp installation)

**`extract-wisdom-youtube-fixed.tsx` (Best for Full YouTube Integration)**
- ✅ **Best for**: Full YouTube transcript extraction with Fabric AI's built-in support
- ✅ **Features**: Direct transcript extraction, comprehensive sharing, advanced content detection
- ✅ **Use when**: You need full YouTube transcript processing and Fabric AI's YouTube integration is available
- ⚠️ **Note**: Requires Fabric AI with YouTube support configured

**`extract-wisdom-youtube-working.tsx` (Fallback for YouTube)**
- ✅ **Best for**: Alternative YouTube processing when Fabric AI's YouTube support isn't available
- ✅ **Features**: Direct yt-dlp integration, simplified command pipeline, reliable fallback
- ✅ **Use when**: Fabric AI's `--youtube` flag is not working or not available
- ⚠️ **Note**: Requires `yt-dlp` and `html2text` external dependencies

## 🎯 Key Features

### 🆕 Enhanced Features (Latest Version)

#### Advanced Data Analysis (Enhanced Production)
- **Structured Output Parsing**: Comprehensive parsing of Fabric AI's wisdom output into organized sections (summary, ideas, insights, quotes, habits, facts, references, takeaway, recommendations)
- **Professional CSV Export**: Automatic export to structured 20-column spreadsheet for comprehensive data analysis and content tracking workflows
- **Enhanced Debug Logging**: File-based logging system with persistent storage in Raycast's support directory for comprehensive troubleshooting
- **YouTube Metadata Extraction**: Dual extraction of both video title and channel information for comprehensive content analysis
- **CTA URL Detection**: Automatic extraction of call-to-action URLs from wisdom content for marketing analysis
- **Rich Data Model**: Extended data structure with 15+ structured fields for professional content analysis workflows

#### Smart Content Detection
- **Automatic YouTube URL Recognition**: Detects YouTube URLs and applies transcript extraction
- **Automatic URL Recognition**: Detects URLs and applies specialized processing
- **Content Type Indicators**: Visual emojis (🎥 YouTube, 📝 text, 🔗 URL, 📋 clipboard) for clear identification
- **Intelligent Processing**: Different handling strategies based on content type

#### Live Clipboard Integration
- **Real-time Preview**: See clipboard content before processing with character count
- **Smart Type Detection**: Automatically identifies if clipboard contains URLs or text
- **One-click Processing**: Extract wisdom directly from clipboard with visual feedback

#### Enhanced User Experience
- **Contextual Actions**: Different actions based on content type (share, copy, back)
- **Better Error Messages**: Content-type-specific error guidance and recovery suggestions
- **Improved Sharing**: Formatted sharing with source attribution and metadata
- **Professional Export Actions**: One-click CSV export, summary copying, and takeaway extraction

## 🎯 Core Features

### 🧠 Intelligent Wisdom Extraction
- Extract key insights and actionable items from any text
- Support for multiple content types (Plain Text, HTML, Markdown, URLs, YouTube Videos) with automatic detection
- **YouTube transcript extraction** using `yt --transcript` command integration
- Smart URL processing with built-in web scraping capabilities
- Automatic content preprocessing and optimization
- Large content chunking for processing extensive documents
- Content type indicators for better user awareness

### 📋 Seamless Integration
- Direct clipboard integration with `Cmd+Shift+V` and live preview
- Automatic content type detection (text, URL, clipboard)
- Selection-based extraction from any application
- Quick access via Raycast's universal search
- Keyboard-first design for maximum efficiency
- Real-time clipboard content preview with character counting

### 📚 Smart History Management
- Automatic saving of all extractions
- Powerful search through extraction history
- Export/import capabilities for data portability
- Intelligent cleanup and memory management

### ⚡ Performance Optimized
- Real-time progress tracking for large content
- Debounced search for smooth user experience
- Intelligent caching and memory management
- Optimized rendering for large datasets

## 🔧 Configuration

The extension provides extensive configuration options:

- **Fabric AI Settings**: Custom paths, API endpoints, model preferences
- **Content Processing**: Length limits, timeout settings, chunk sizes
- **Performance Tuning**: Cache duration, debounce delays, history limits
- **User Experience**: Keyboard shortcuts, display preferences

Access settings with `Cmd+,` or through the action panel.

## 📖 Usage Examples

### Basic Extraction
```
1. Launch: "Extract Wisdom" in Raycast
2. Paste: Your content into the search field
3. Extract: Press Cmd+Enter (automatically detects content type)
4. Copy: Use Cmd+Shift+C to copy results
```

### Enhanced Clipboard Workflow
```
1. Copy content from any application (text or URL)
2. Launch: "Extract Wisdom" 
3. Preview: Click "Preview Clipboard" to see content and character count
4. Quick Extract: Press Cmd+Shift+V (auto-detects URL vs text)
5. Results: Automatically processed with content type indicators
```

### YouTube Video Processing
```
1. Copy or paste a YouTube URL into the search field
2. Notice: YouTube icon (🎥) appears automatically
3. Extract: Click "Extract Wisdom from YouTube Video"
4. Results: Transcript automatically extracted and processed
5. Share: Use enhanced sharing with video source attribution
```

### URL Processing
```
1. Copy or paste a URL into the search field
2. Notice: URL icon (🔗) appears automatically
3. Extract: Click "Extract Wisdom from URL"
4. Results: Processed with web scraping capabilities
5. Share: Use enhanced sharing with source attribution
```

### History Management
```
1. View History: Press Cmd+H
2. Search: Type to filter previous extractions
3. Reuse: Click any item to view full results
4. Export: Save important extractions
```

## 🛠️ Development

### Architecture

The extension follows a modular architecture with clear separation of concerns:

- **Services Layer**: Business logic (FabricClient, ContentProcessor, HistoryManager)
- **Components Layer**: React UI components with performance optimizations
- **Utilities Layer**: Helper functions for error handling, performance monitoring
- **Types Layer**: TypeScript definitions for type safety

### Key Technologies

- **TypeScript**: Type-safe development
- **React**: UI components and state management
- **Raycast API**: Native integration with Raycast
- **Jest**: Comprehensive testing framework
- **ESLint/Prettier**: Code quality and formatting

### Testing

The extension includes comprehensive testing:

- **Unit Tests**: Individual functions and methods (90%+ coverage)
- **Integration Tests**: Service interactions and workflows
- **Component Tests**: React component behavior
- **Error Handling Tests**: Error scenarios and recovery

Run tests with:
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## 🔍 Troubleshooting

### Common Issues

1. **"Fabric AI is not installed"**
   - Install with `pip install fabric-ai`
   - Verify with `fabric --version`
   - Check that `extract_wisdom` pattern is available: `fabric --list`

2. **"Fabric test failed"**
   - Verify Fabric AI installation path in extension preferences
   - Run `fabric --setup` to configure API keys
   - Check internet connection for AI service access

3. **"No wisdom extracted"**
   - Ensure content is substantial enough for analysis
   - Verify the `extract_wisdom` pattern is available
   - Check that API keys are properly configured

4. **API Credit Issues** (Production/Final Implementation)
   - **402 Payment Required**: Add more credits at https://openrouter.ai/settings/credits
   - **401 Unauthorized**: Check API configuration with `fabric --setup`
   - **Token Limits**: Final implementation uses `--tokens 4000` to prevent quota issues
   - **Content Length**: Reduce content length if hitting API limits (production default: 2000 chars, final default: 1000 chars)
   - **Built-in Testing**: Use production implementation's built-in "Test Fabric AI Connection" feature for diagnostics

5. **Icon/UI Issues**
   - Extension uses Raycast-compatible icons (Stars, QuestionMark, Forward, etc.)
   - **Production Implementation**: Uses `Icon.ArrowLeft`, `Icon.Bug`, and `Icon.Wand` which may need updates to compatible icons
   - **Recommended Fixes**: Replace with `Icon.ArrowCounterClockwise`, `Icon.ExclamationMark`, and `Icon.Star` respectively
   - Enhanced version includes content type indicators (📝, 🔗, 📋)
   - Ensure you're using the latest version of Raycast
   - Try restarting Raycast if UI elements don't display correctly

5. **YouTube Processing Issues**

*Production Implementation (production.tsx):*
- **Smart Path Detection**: Automatically detects yt-dlp across common paths (`/opt/homebrew/bin`, `/usr/local/bin`, `/usr/bin`, system PATH)
- **Install yt-dlp**: `brew install yt-dlp` or `pip install yt-dlp`
- **Fallback Mechanism**: Uses video ID and URL as fallback when title extraction fails
- **Built-in Testing**: Use "Test Fabric AI Connection" for diagnostics
- **Error Handling**: Provides specific guidance for yt-dlp installation and path issues

*YouTube-Fixed Version:*
- Ensure `yt` command is installed and configured with Fabric AI
- Check YouTube API configuration: `fabric --setup`
- Verify video has captions/transcript available
- Some videos may be private or have restricted access
- Error "yt: command not found" indicates missing YouTube integration

6. **Alternative YouTube Processing** (YouTube-Working Version)
   - **yt-dlp Required**: Install with `brew install yt-dlp` or `pip install yt-dlp`
   - **html2text Required**: Install with `brew install html2text` for URL processing
   - **Simplified Pipeline**: Uses step-by-step approach: `yt-dlp --print title → yt-dlp --write-auto-sub → cat /tmp/*.vtt → fabric`
   - **Improved Error Handling**: Better fallback with clear error messages when transcript extraction fails
   - **Temporary File Management**: Uses `/tmp/` directory for organized subtitle file storage
   - **Processing Optimization**: Limits transcript to 500 lines for better performance
   - **Use When**: Fabric AI's built-in `--youtube` flag is not working or not available

6. **URL Processing Issues** (Enhanced Version)
   - Enhanced version automatically detects URLs and applies specialized processing
   - If URL processing fails, try copying the webpage text instead
   - Ensure Fabric AI is configured for web scraping capabilities
   - Check internet connection for URL access

### Getting Help

1. **Built-in Help**: Use the help system within the extension
2. **Configuration Test**: Test your setup with built-in diagnostics
3. **Documentation**: Review this comprehensive documentation
4. **Logs**: Check Raycast logs for detailed error information

## 📊 Performance Guidelines

### Content Optimization

- **Optimal Length**: 1,000-10,000 characters
- **Clean Text**: Remove unnecessary formatting
- **Meaningful Content**: Ensure substantial information
- **Context**: Include relevant background information

### System Requirements

- **macOS**: 10.15 or later
- **Raycast**: Latest version
- **Python**: 3.7+ (for Fabric AI)
- **Memory**: 4GB+ recommended
- **Network**: Stable internet connection

## 🔒 Privacy & Security

### Data Handling

- **Local Storage**: All history stored locally on your device
- **No Cloud Storage**: No data sent to third-party services (except Fabric AI)
- **API Security**: Secure transmission through encrypted connections
- **Temporary Processing**: Content not permanently stored during processing

### Best Practices

1. **Sensitive Content**: Be cautious with confidential information
2. **API Keys**: Keep Fabric AI credentials secure
3. **Regular Cleanup**: Clear history containing sensitive data
4. **Network Security**: Use secure networks for API requests

## 🚀 Advanced Usage

### Batch Processing

Process multiple pieces of content efficiently:
1. Prepare content in separate documents
2. Use clipboard workflow for quick processing
3. Leverage history for result collection
4. Export combined results for analysis

### Integration Workflows

- **Note-Taking**: Extract insights from research materials
- **Email Processing**: Distill key points from communications
- **Article Analysis**: Extract wisdom from articles and papers
- **Meeting Notes**: Process transcripts for action items

### Automation

While the extension doesn't directly support scripting, it integrates well with:
- **AppleScript**: Automate clipboard operations
- **Shortcuts**: Create iOS/macOS automation workflows
- **Raycast Scripts**: Custom command integration

## 📈 Roadmap

### Recently Implemented

- **✅ Ultimate Implementation**: Latest ultimate version with spawn-based process control, stream processing, and advanced error handling
- **✅ Process Control**: Advanced process management using Node.js spawn for superior reliability and real-time feedback
- **✅ Stream Processing**: Real-time stdout/stderr handling for immediate feedback and better error detection
- **✅ Production Implementation**: Production-ready version with robust YouTube processing, smart path detection, and built-in testing
- **✅ Smart Path Detection**: Automatic yt-dlp detection across common installation paths with intelligent fallback
- **✅ Built-in Testing**: Integrated Fabric AI connection testing with detailed feedback and diagnostics
- **✅ Final Production Implementation**: Previous production-ready version with API credit management and optimized processing
- **✅ API Credit Management**: Automatic token limiting with `--tokens 4000` to prevent quota issues
- **✅ Enhanced Error Classification**: Specific handling for 402 (credits), 401 (auth), and YouTube errors
- **✅ YouTube Integration**: Direct transcript extraction from YouTube videos using `yt --transcript`
- **✅ Enhanced Command Format**: Updated to use `--pattern extract_wisdom` for better compatibility
- **✅ Smart Content Detection**: Automatic YouTube URL, URL, text, and clipboard type recognition
- **✅ Enhanced Clipboard Integration**: Live preview with character counting
- **✅ Content Type Indicators**: Visual indicators for different content types (🎥🔗📝📋)
- **✅ URL Processing**: Built-in URL detection and specialized processing

### Planned Features

- **Multiple Patterns**: Support for different Fabric AI patterns beyond extract_wisdom
- **Batch Processing**: Process multiple items simultaneously with spawn-based parallel processing
- **Custom Templates**: User-defined output templates
- **Integration APIs**: Connect with other productivity services
- **Advanced Analytics**: Detailed usage statistics and insights
- **Enhanced Stream Processing**: Advanced stream handling for even larger content processing

### Performance Improvements

- **Plugin System**: Extensible architecture for custom functionality
- **Enhanced Caching**: Advanced caching strategies for better performance
- **Background Processing**: Worker threads for heavy operations leveraging spawn-based architecture
- **Real-time Updates**: Live processing feedback and progress with stream-based updates
- **Process Pool Management**: Multiple concurrent Fabric AI processes for batch operations

## 🤝 Contributing

We welcome contributions! Please see the [Developer Guide](DEVELOPER_GUIDE.md) for:

- Development setup instructions
- Code style guidelines
- Testing requirements
- Pull request process
- Issue reporting guidelines

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🙏 Acknowledgments

- **Fabric AI**: For the powerful AI framework that powers wisdom extraction
- **Raycast**: For the excellent platform and development tools
- **Community**: For feedback, bug reports, and feature suggestions

---

## 📞 Support

For additional support:

- **Documentation**: Start with this comprehensive guide
- **Built-in Help**: Use the extension's help system
- **Configuration Test**: Verify your setup with diagnostic tools
- **Community**: Join discussions and share experiences

Happy wisdom extracting! 🧠✨