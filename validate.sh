#!/bin/bash

echo "🔍 Tahoe Installation Validator"
echo "==============================="

# Check if Tahoe.app exists
if [ -d "/Applications/Tahoe.app" ]; then
    echo "✅ Tahoe.app found in Applications"
    
    # Check app info
    if [ -f "/Applications/Tahoe.app/Contents/Info.plist" ]; then
        echo "✅ App bundle structure is valid"
        
        # Check if icon exists
        if [ -f "/Applications/Tahoe.app/Contents/Resources/icon.icns" ]; then
            echo "✅ Icon file found"
        else
            echo "⚠️  Icon file missing"
        fi
        
        # Try to get bundle info
        BUNDLE_ID=$(defaults read /Applications/Tahoe.app/Contents/Info.plist CFBundleIdentifier 2>/dev/null)
        if [ -n "$BUNDLE_ID" ]; then
            echo "✅ Bundle ID: $BUNDLE_ID"
        fi
        
        VERSION=$(defaults read /Applications/Tahoe.app/Contents/Info.plist CFBundleShortVersionString 2>/dev/null)
        if [ -n "$VERSION" ]; then
            echo "✅ Version: $VERSION"
        fi
    else
        echo "❌ Invalid app bundle"
    fi
    
    # Test if app can be launched
    echo ""
    echo "🚀 Testing app launch..."
    if open -a "Tahoe" --new; then
        echo "✅ Tahoe launched successfully"
        echo "   Check if Script Hub loads properly in the app"
    else
        echo "❌ Failed to launch Tahoe"
    fi
    
else
    echo "❌ Tahoe.app not found in Applications"
    echo "   Please run the installer:"
    echo "   curl -sSL https://raw.githubusercontent.com/thelastligma/tahoe/main/installer.sh | bash"
fi

echo ""
echo "📝 If you see any issues, check the console output when running the app."
