
## Installation

### Quick Install ⚡
```bash
curl -sSL https://raw.githubusercontent.com/thelastligma/tahoe/main/installer.sh | bash
```

### Installation Validation 🔍
After installation, verify everything works:
```bash
curl -sSL https://raw.githubusercontent.com/thelastligma/tahoe/main/validate.sh | bash
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

## Troubleshooting

### Script Hub Not Loading
If Script Hub shows no scripts:
1. Check internet connection
2. Run the app from Terminal to see console output: `/Applications/Tahoe.app/Contents/MacOS/Tahoe`
3. Look for API error messages in the console

### Icon Not Showing
If the Tahoe icon doesn't appear:
1. Restart Finder: `sudo killall Finder`
2. Clear icon cache: `sudo rm -rf /Library/Caches/com.apple.iconservices.store`
3. Refresh Launchpad: `defaults write com.apple.dock ResetLaunchPad -bool true && killall Dock`
- ✅ Clean up build files

### Manual Installation
1. Clone the repository: `git clone https://github.com/thelastligma/tahoe.git`
2. Navigate to the directory: `cd tahoe`
3. Install dependencies: `npm install`
4. Build the application: `npm run build`
5. Copy the app to Applications folder:
   - For Apple Silicon: `cp -R dist/mac-arm64/Tahoe.app /Applications/`
   - For Intel: `cp -R dist/mac/Tahoe.app /Applications/`

