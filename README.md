# Raycast Fabric AI Extension

A powerful Raycast extension that integrates with [Fabric AI](https://github.com/danielmiessler/fabric) to extract wisdom and insights from any text content using AI-powered analysis.

## 🚀 Features

- **Extract Wisdom**: Process any text content through Fabric AI's `extract_wisdom` pattern
- **YouTube Integration**: Direct transcript extraction and analysis from YouTube videos
- **Multi-format Support**: Handle plain text, HTML, Markdown, and URLs
- **Clipboard Integration**: Seamlessly extract wisdom from clipboard content
- **Selection Processing**: Extract wisdom directly from selected text in any application
- **History Management**: Save, search, and manage extraction history

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
3. The extension will automatically detect the YouTube URL and extract the transcript
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

## 🧪 Development

### Available Commands

```bash
npm run dev          # Start development mode with hot reload
npm run build        # Build extension for production
npm run lint         # Run ESLint checks
npm run fix-lint     # Auto-fix linting issues
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
```

### Testing

The project includes comprehensive testing with Jest and React Testing Library:

```bash
npm test                    # Run all tests
npm run test:coverage      # Run tests with coverage report
npm run test:ci           # Run tests for CI environment
```

### Implementation Variants

The project includes multiple implementation variants for different use cases:

- **`extract-wisdom-working.tsx`**: Stable, production-ready implementation
- **`extract-wisdom-youtube-fixed.tsx`**: Enhanced YouTube integration
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

## 🔮 Roadmap

- [ ] Multiple Fabric AI patterns support
- [ ] Batch processing capabilities
- [ ] Custom pattern creation
- [ ] Cloud synchronization
- [ ] Mobile app integration

---

**Made with ❤️ for the Raycast and Fabric AI communities**