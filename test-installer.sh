#!/bin/bash

# Quick test script to verify the installer works
echo "🚀 Testing Tahoe Installer..."

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ This installer only works on macOS"
    exit 1
fi

# Show architecture
ARCH=$(uname -m)
echo "📱 Detected architecture: $ARCH"

# Show required dependencies status
echo "🔍 Checking dependencies:"

if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js: $NODE_VERSION"
else
    echo "❌ Node.js: Not installed - Install from https://nodejs.org/"
fi

if command -v npm >/dev/null 2>&1; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm: $NPM_VERSION"
else
    echo "❌ npm: Not installed"
fi

if command -v git >/dev/null 2>&1; then
    GIT_VERSION=$(git --version)
    echo "✅ Git: $GIT_VERSION"
else
    echo "❌ Git: Not installed"
fi

echo ""
echo "🎯 To install Tahoe, run:"
echo "curl -sSL https://raw.githubusercontent.com/thelastligma/tahoe/main/installer.sh | bash"
