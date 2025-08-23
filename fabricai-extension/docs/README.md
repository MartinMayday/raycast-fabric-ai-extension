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

### `extract-wisdom-youtube-fixed.tsx` (Latest)
- **YouTube transcript extraction** with direct `yt --transcript` command integration
- **Smart content detection** with automatic YouTube URL, URL, text, and clipboard type recognition
- **Enhanced command format** using `--pattern extract_wisdom` for better compatibility
- **YouTube-specific error handling** with API configuration guidance and transcript availability checks
- **Visual content type indicators** (🎥 YouTube, 🔗 URL, 📝 text, 📋 clipboard)
- **Advanced sharing features** with content-type-specific formatting and source attribution

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

## 🎯 Key Features

### 🆕 Enhanced Features (Latest Version)

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

4. **Icon/UI Issues**
   - Extension uses Raycast-compatible icons (Stars, QuestionMark, Forward, etc.)
   - Enhanced version includes content type indicators (📝, 🔗, 📋)
   - Ensure you're using the latest version of Raycast
   - Try restarting Raycast if UI elements don't display correctly

5. **YouTube Processing Issues** (YouTube-Fixed Version)
   - Ensure `yt` command is installed and configured with Fabric AI
   - Check YouTube API configuration: `fabric --setup`
   - Verify video has captions/transcript available
   - Some videos may be private or have restricted access
   - Error "yt: command not found" indicates missing YouTube integration

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

- **✅ YouTube Integration**: Direct transcript extraction from YouTube videos using `yt --transcript`
- **✅ Enhanced Command Format**: Updated to use `--pattern extract_wisdom` for better compatibility
- **✅ Smart Content Detection**: Automatic YouTube URL, URL, text, and clipboard type recognition
- **✅ Enhanced Clipboard Integration**: Live preview with character counting
- **✅ Content Type Indicators**: Visual indicators for different content types (🎥🔗📝📋)
- **✅ URL Processing**: Built-in URL detection and specialized processing

### Planned Features

- **Multiple Patterns**: Support for different Fabric AI patterns beyond extract_wisdom
- **Batch Processing**: Process multiple items simultaneously
- **Custom Templates**: User-defined output templates
- **Integration APIs**: Connect with other productivity services
- **Advanced Analytics**: Detailed usage statistics and insights

### Performance Improvements

- **Plugin System**: Extensible architecture for custom functionality
- **Enhanced Caching**: Advanced caching strategies for better performance
- **Background Processing**: Worker threads for heavy operations
- **Real-time Updates**: Live processing feedback and progress

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