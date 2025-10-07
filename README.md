# Tahoe - Modern Script Executor

![Tahoe Icon](build/icon.png)

A modern, elegant script executor built with Electron, featuring Script Hub integration and Opiumware API support.

## Features

- 🎨 **Modern UI** - Clean, transparent design with Monaco Editor
- 📜 **Script Hub** - Browse and execute scripts from ScriptBlox
- 🔧 **Opiumware Integration** - Full API support for script execution
- ⚙️ **Advanced Settings** - Customizable injection and connection settings
- 📁 **Tab Management** - Multiple script tabs with auto-save
- 💉 **One-Click Injection** - Easy DLL injection with status indicators

## Installation

### Quick Install ⚡
```bash
curl -sSL https://raw.githubusercontent.com/thelastligma/tahoe/main/installer.sh | bash
```

### Prerequisites Check 🔍
Not sure if you have the requirements? Test first:
```bash
curl -sSL https://raw.githubusercontent.com/thelastligma/tahoe/main/test-installer.sh | bash
```

**Required Dependencies:**
- **Node.js 16+** - Download from [nodejs.org](https://nodejs.org/)
- **npm** (comes with Node.js)
- **git** - Install via Xcode Command Line Tools: `xcode-select --install`

### What the installer does:
- ✅ **Checks dependencies** - Verifies Node.js, npm, and git are installed
- ✅ **Downloads source** - Clones the latest code from GitHub
- ✅ **Builds locally** - Compiles for your specific architecture (Intel/ARM64)
- ✅ **Installs safely** - Copies to /Applications and adds to Launchpad
- ✅ **Removes restrictions** - Eliminates macOS security warnings
- ✅ **Cleans up** - Removes temporary build files
- ✅ Clean up build files

### Manual Installation
1. Clone the repository: `git clone https://github.com/thelastligma/tahoe.git`
2. Navigate to the directory: `cd tahoe`
3. Install dependencies: `npm install`
4. Build the application: `npm run build`
5. Copy the app to Applications folder:
   - For Apple Silicon: `cp -R dist/mac-arm64/Tahoe.app /Applications/`
   - For Intel: `cp -R dist/mac/Tahoe.app /Applications/`

## macOS Security Notice

The installer automatically handles security warnings, but if you install manually and see "Tahoe is damaged", run:
```bash
sudo xattr -rd com.apple.quarantine /Applications/Tahoe.app
```

## Development

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Setup
```bash
git clone https://github.com/thelastligma/tahoe.git
cd tahoe
npm install
```

### Development Mode
```bash
npm start
```

### Build
```bash
npm run build
```

## API Integration

Tahoe integrates with:
- **ScriptBlox API** - For script browsing and downloading
- **Opiumware API** - For script execution and injection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Credits

- **UI Design**: 420
- **Backend**: 420
- **Icons**: Lucide Icons
- **Editor**: Monaco Editor

## License

MIT License - see [LICENSE](LICENSE) file for details

## Support

For issues and support:
- Open an issue on [GitHub](https://github.com/thelastligma/tahoe/issues)
- Check the [Wiki](https://github.com/thelastligma/tahoe/wiki) for troubleshooting

---

*Tahoe - Where modern design meets powerful execution* 🚀
