#!/bin/bash
#
# BUGREAPERX SYSTEM INITIALIZER
# One-command setup: installs dependencies, builds, and validates
#

set -e

GREEN='\033[0;32m'
CYAN='\033[0;36m'
AMBER='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}"
echo "=================================================="
echo "          BUGREAPERX SYSTEM INITIALIZER           "
echo "     Sovereign Bug Bounty Automation Suite        "
echo "=================================================="
echo -e "${NC}"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}[-] Node.js is required but not installed.${NC}"
    echo "    Download from: https://nodejs.org/ (v20+)"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
echo -e "${GREEN}[+] Node.js $(node -v) detected${NC}"

if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}[-] Node.js v18+ required. Found v${NODE_VERSION}.${NC}"
    exit 1
fi

# Check for npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}[-] npm is required but not installed.${NC}"
    exit 1
fi
echo -e "${GREEN}[+] npm $(npm -v) detected${NC}"

# Create .env if missing
if [ ! -f .env ]; then
    echo -e "${AMBER}[+] Creating local environment template (.env)...${NC}"
    cat << 'ENV' > .env
# BugReaperX Configuration
# Copy this file to .env and fill in your values

# Ollama endpoint for MCP Console AI features
OLLAMA_HOST=http://localhost:11434

# Supabase sync (optional)
SUPABASE_URL=
SUPABASE_ANON_KEY=

# API Keys
ANTHROPIC_API_KEY=
ENV
    echo -e "${GREEN}[+] .env template created${NC}"
fi

# Install dependencies
echo -e "${CYAN}[+] Installing main application dependencies...${NC}"
npm install

echo -e "${CYAN}[+] Installing website dependencies...${NC}"
cd website
npm install
cd ..

# Build the project
echo -e "${CYAN}[+] Building application...${NC}"
npm run build

# Build Windows portable EXE (only on Windows)
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
    echo -e "${CYAN}[+] Building Windows portable EXE...${NC}"
    npm run build:win
fi

echo -e "${CYAN}[+] Building website...${NC}"
cd website
npm run build
cd ..

# Run validation
echo -e "${CYAN}[+] Running TypeScript validation...${NC}"
npx tsc --noEmit

echo -e "${CYAN}[+] Running test suite...${NC}"
npm test

echo -e "${GREEN}"
echo "=================================================="
echo "          BUGREAPERX SETUP COMPLETE              "
echo "=================================================="
echo -e "${NC}"
if [ -f ./release/BugReaperX-4.0.0-portable.exe ]; then
    echo -e "  ${CYAN}Portable EXE:${NC}  ./release/BugReaperX-4.0.0-portable.exe"
fi
echo -e "  ${CYAN}Dev Server:${NC}   npm run dev"
echo -e "  ${CYAN}Website:${NC}      cd website && npm run dev"
echo -e "  ${CYAN}Tests:${NC}        npm test"
echo ""
echo -e "  ${AMBER}Configure:${NC}    Edit .env for Ollama/Supabase settings"
echo ""
echo -e "${GREEN}==================================================${NC}"
