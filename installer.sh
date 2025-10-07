#!/bin/bash

# Define ANSI color codes
BLUE='\033[0;34m'
LIGHT_BLUE='\033[0;36m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Clear the terminal screen
clear

# Define paths
REPO_URL="https://github.com/thelastligma/tahoe.git"
TEMP_DIR="/tmp/tahoe-build"
APP_NAME="Tahoe.app"
APPLICATIONS_DIR="/Applications"

echo -e "${BLUE}Starting Tahoe installation...${NC}"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for required dependencies
echo -e "${LIGHT_BLUE}Checking dependencies...${NC}"

if ! command_exists node; then
    echo -e "${RED}Error: Node.js is not installed.${NC}"
    echo "Please install Node.js from https://nodejs.org/ and try again."
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}Error: npm is not installed.${NC}"
    echo "Please install npm and try again."
    exit 1
fi

if ! command_exists git; then
    echo -e "${RED}Error: git is not installed.${NC}"
    echo "Please install git and try again."
    exit 1
fi

echo -e "${GREEN}All dependencies found!${NC}"

# Remove existing temp directory if it exists
if [ -d "$TEMP_DIR" ]; then
    echo -e "${LIGHT_BLUE}Removing existing build directory...${NC}"
    rm -rf "$TEMP_DIR"
fi

# Clone the repository
echo -e "${LIGHT_BLUE}Cloning repository...${NC}"
git clone "$REPO_URL" "$TEMP_DIR"

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to clone repository.${NC}"
    exit 1
fi

# Navigate to the cloned directory
cd "$TEMP_DIR"

# Install dependencies
echo -e "${LIGHT_BLUE}Installing dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to install dependencies.${NC}"
    exit 1
fi

# Build the application for the current architecture
echo -e "${LIGHT_BLUE}Building application for your system...${NC}"

# Detect architecture
ARCH=$(uname -m)
if [ "$ARCH" = "x86_64" ]; then
    BUILD_TARGET="mac"
    BUILT_APP_PATH="$TEMP_DIR/dist/mac/$APP_NAME"
elif [ "$ARCH" = "arm64" ]; then
    BUILD_TARGET="mac-arm64"
    BUILT_APP_PATH="$TEMP_DIR/dist/mac-arm64/$APP_NAME"
else
    echo -e "${RED}Error: Unsupported architecture: $ARCH${NC}"
    exit 1
fi

npm run build:$BUILD_TARGET

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to build application.${NC}"
    exit 1
fi

# Check if the built app exists
if [ ! -d "$BUILT_APP_PATH" ]; then
    echo -e "${RED}Error: Built application not found at $BUILT_APP_PATH${NC}"
    exit 1
fi

# Remove existing app if it exists
if [ -d "$APPLICATIONS_DIR/$APP_NAME" ]; then
    echo -e "${LIGHT_BLUE}Removing existing installation...${NC}"
    rm -rf "$APPLICATIONS_DIR/$APP_NAME"
fi

# Copy the app to Applications
echo -e "${LIGHT_BLUE}Installing to Applications folder...${NC}"
cp -R "$BUILT_APP_PATH" "$APPLICATIONS_DIR/"

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to copy application to Applications folder.${NC}"
    exit 1
fi

# Remove quarantine attribute to prevent Gatekeeper warnings
echo -e "${LIGHT_BLUE}Removing quarantine attributes...${NC}"
xattr -dr com.apple.quarantine "$APPLICATIONS_DIR/$APP_NAME" 2>/dev/null || true

# Add to Launchpad by touching the Applications folder
echo -e "${LIGHT_BLUE}Updating Launchpad...${NC}"
touch "$APPLICATIONS_DIR"

# Clean up temporary directory
echo -e "${LIGHT_BLUE}Cleaning up...${NC}"
rm -rf "$TEMP_DIR"

echo -e "${GREEN}✅ Tahoe has been successfully installed!${NC}"
echo -e "${LIGHT_BLUE}You can now find Tahoe in your Applications folder and Launchpad.${NC}"
echo -e "${LIGHT_BLUE}Launch it from Spotlight by pressing Cmd+Space and typing 'Tahoe'.${NC}"

# Optional: Open the Applications folder
read -p "Would you like to open the Applications folder now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    open "$APPLICATIONS_DIR"
fi

echo -e "${GREEN}Installation complete! Enjoy using Tahoe! 🎉${NC}"
