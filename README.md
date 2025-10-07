# Tahoe - Modern Script Executor

![Tahoe Icon](build/icon.png)

A modern, elegant script executor built with Electron, featuring Script Hub integration and Opiumware API support.

*Updated with anonymous commits*

## Features

- 🎨 **Modern UI** - Clean, transparent design with Monaco Editor
- 📜 **Script Hub** - Browse and execute scripts from ScriptBlox
- 🔧 **Opiumware Integration** - Full API support for script execution
- ⚙️ **Advanced Settings** - Customizable injection and connection settings
- 📁 **Tab Management** - Multiple script tabs with auto-save
- 💉 **One-Click Injection** - Easy DLL injection with status indicators

## Installation

### Automatic Installation (Recommended)
```bash
curl -sSL https://raw.githubusercontent.com/thelastligma/tahoe/main/installer.sh | bash
```

**Prerequisites:** Node.js, npm, and git must be installed on your system.

The installer will:
- ✅ Clone the latest source code
- ✅ Build the application for your architecture
- ✅ Install to Applications folder
- ✅ Add to Launchpad
- ✅ Remove security warnings
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
