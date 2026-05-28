# BugReaperX 🏴‍☠️

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Electron](https://img.shields.io/badge/Electron-34-47848F.svg)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![Build](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![Platform](https://img.shields.io/badge/Platform-Windows-darkblue.svg)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg)]()

**BugReaperX** is an elite, sovereign-grade bug bounty automation suite engineered for offensive security researchers and professional bounty hunters. It combines real-time target orchestration, weaponized HTTP repeater capabilities, multi-platform pipeline submission tracking, AI-augmented analysis via MCP/Ollama, and a 275-weapon Arsenal — all unified inside a single, portable Electron fortress.

> **No cloud required. No telemetry. No middleman. Your data, your infrastructure, your rules.**

---

## ⚡ Core Pillars

- **🎯 Hunt Engine** — Target & program management with live scope mapping. Import programs from HackerOne, Bugcrowd, Intigriti, or run fully self-managed.
- **🔫 Arsenal (275+ Weapons)** — Comprehensive attacker tool database spanning Recon, Vulnerability Assessment, Exploitation, Web, Mobile, Cloud, API, Active Directory, OSINT, Wireless, Social Engineering, C2, Evasion, Post-Exploitation, and Physical Security.
- **🔄 Web Repeater** — Full HTTP request crafting workstation with raw mode, header editing, body manipulation, response viewer, and request history.
- **💰 Pipeline** — Multi-platform submission tracker with earnings ledger, severity breakdown, wallet, and report form with CVSS scoring.
- **🧠 MCP Console** — AI-augmented analysis console with Ollama integration, chat interface, and tool execution framework.
- **🔧 Workshop** — Local workspace for custom tool authoring and payload generation.
- **🌐 Marketing Website** — Deployable landing page at `bugreaper-x.ca` with download links, community hub, and enterprise sales funnel.

---

## 🛠️ Quick Installation

### Windows (Portable EXE)

```bash
# Download the latest release
# Grab BugReaperX-*-portable.exe from the Releases page
# Double-click to launch — no installation required
```

### From Source

```bash
# Clone the repository
git clone https://github.com/vanthryx00/bugreaperx.git
cd bugreaperx

# Run the setup script (installs dependencies + builds)
./setup.sh

# Or manually:
npm install
npm run build
```

---

## 🚀 Running BugReaperX

### Portable EXE (no install)
```
./release/BugReaperX-4.0.0-portable.exe
```

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
# Windows portable:
npm run build:win
```

### Website (for deployment)
```bash
cd website
npm install
npm run dev        # local dev server
npm run build      # production build
vercel --prod      # deploy to bugreaper-x.ca
```

---

## ⚙️ Configuration

BugReaperX runs fully offline by default. Optional integrations:

| Variable | Purpose |
|----------|---------|
| `OLLAMA_HOST` | Custom Ollama endpoint for MCP Console (default: `localhost:11434`) |
| `SUPABASE_URL` | Optional remote sync backend |
| `SUPABASE_ANON_KEY` | Supabase anonymous key for sync |

Create a `.env` file in the project root to configure these.

---

## 🧪 Testing

```bash
# Run the full test suite
npm test

# Run with coverage
npx vitest run --coverage
```

All 63 tests pass with zero TypeScript errors.

---

## 📂 Project Architecture

```
bugreaperx/
├── electron/              # Electron main process
│   ├── main.ts            # Window management, IPC handlers
│   └── preload.ts         # Context bridge API
├── src/                   # React renderer
│   ├── components/        # UI components
│   │   ├── dashboard/     # Status cards, dashboard grid
│   │   └── layout/        # Sidebar, bottom panel, topbar
│   ├── data/              # Static data (arsenal weapons)
│   ├── pages/             # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Hunt.tsx       # Target/program management
│   │   ├── Arsenal.tsx    # Weapon database
│   │   ├── Pipeline.tsx   # Submission tracker
│   │   ├── Repeater.tsx   # HTTP request tool
│   │   ├── McpConsole.tsx # AI analysis console
│   │   └── ...
│   ├── test/              # Test suite (63 tests)
│   ├── lib/               # Utilities
│   └── types/             # TypeScript types
├── website/               # Marketing website
│   ├── src/               # React site source
│   ├── public/            # Static assets (favicon, OG images)
│   └── vercel.json        # Vercel deployment config
├── dist/                  # Electron build output
├── release/               # Release artifacts (EXE)
├── docs/                  # Documentation
├── .github/workflows/     # CI/CD pipelines
├── CHANGELOG.md           # Version history
├── setup.sh               # Automated setup script
└── README.md              # This file
```

---

## 🛡️ License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

## 🤝 Contributing

PRs are welcome! For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🌐 Community

- [GitHub Issues](https://github.com/vanthryx00/bugreaperx/issues)
- [Discord Server](https://discord.gg/bugreaperx)
- [Twitter/X](https://x.com/vanthryx00)
- [Documentation](https://bugreaper-x.ca/docs)

---

*Built by operators, for operators. Sovereign infrastructure, zero compromise.*
