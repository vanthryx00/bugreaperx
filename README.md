# BugReaper X 🏴‍☠️

[![Build](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.184-lightgrey.svg)](https://threejs.org/)
[![Platform](https://img.shields.io/badge/Platform-Windows-darkblue.svg)]()
[![Website](https://img.shields.io/badge/Website-bugreaper--x.ca-brightgreen.svg)](https://bugreaper-x.ca)

**The sovereign Windows standalone bug bounty automation suite.**  
275 weapons · AI-powered recon · 3D VR-compatible game · One EXE · Zero dependencies

> **No cloud. No telemetry. No middleman. Your data, your infrastructure, your rules.**

---

## 🔥 What's Inside

| Module | Description |
|--------|-------------|
| **🎯 Hunt Engine** | Multi-platform target/program management with live scope mapping |
| **🔫 Arsenal (275+)** | Weapons across 15 categories: Recon, Vuln, Exploit, Web, Mobile, Cloud, API, AD, OSINT |
| **🔄 Web Repeater** | HTTP request crafting workstation with raw/structured modes |
| **💰 Pipeline** | Multi-platform submission tracker, earnings ledger, CVSS 4.0 scoring |
| **🧠 MCP Console** | AI-augmented analysis with local Ollama integration |
| **🔧 Workshop** | Custom tool authoring and payload generation |
| **🎮 Vulnerability Hunter RPG** | 3D browser game — see below |

---

## 🎮 Vulnerability Hunter RPG

A photorealistic 3D browser RPG built into the marketing website. Turn web vulnerabilities into monsters and hunt them for bounties.

### Graphics Engine

| Feature | Implementation |
|---------|---------------|
| **Custom GLSL Shaders** | 5 hand-written shaders: holographic Fresnel, monster vertex displacement, scanline ground, data particle system, nebula sky dome |
| **Post-Processing** | 2-pass Bloom, Depth of Field, Film Grain, Vignette — ACES Filmic Tone Mapping |
| **Environment** | Reflective PBR floor with dynamic roughness, 800 floating data particles, volumetric light beams, twinkling star field |
| **3D Hero** | 6-part holographic figure with class-colored Fresnel/scanline material |
| **Monsters** | Dynamic glitch intensity on hover/combat, energy pulse auras, orbital trail particles, damage flashes |

### Game Features

- **5 Hero Classes**: Recon Scout, Vuln Breaker, Payload Slinger, Web Reaper, Cloud Warden
- **10 Vulnerability Monsters**: XSS leeches, SQLi hydras, RCE leviathans, IDOR wraiths, and more across 5 rarity tiers
- **12 Weapons** (5 rarities): Nuclei, FFUF, SQLMap, BurpSuite, Metasploit, and more
- **5 Armour Sets** with 2-piece and 4-piece set bonuses
- **Turn-based combat** with XP/leveling and BRX token economy
- **Crypto wallet UI**: Connect wallet, deposit/withdraw BRX tokens
- **VR Compatible**: Runs in Meta Quest 3 browser

---

## 🛡️ Protection System

10-layer security architecture:

1. **Bootstrap Guardian** — Inline domain check runs BEFORE any JS loads, blocks F12/Ctrl+Shift+I
2. **Domain Lock** — Obfuscator-enforced domain whitelist kills clones at runtime
3. **5 Devtools Detectors** — Multiple methods to detect opened devtools
4. **Anti-Scraping** — Blocks right-click, copy, drag, select, F12
5. **Console Override Trap** — Detects console manipulation
6. **DOM Watermarking** — Hidden markers to detect cloned DOM
7. **MutationObserver Guard** — Monitors DOM for tampering
8. **Health Check Loop** — Every 10s verification, self-destructs on clone
9. **Honeypot System** — 7 decoy credentials, 10 fake API endpoints, tamper detection
10. **Max Obfuscation** — Control flow flattening 0.9, dead code injection 0.8, RC4+base64 string encoding, self-defending, debug protection

---

## 🚀 Quick Start

### Windows Portable EXE
```bash
# Download from https://bugreaper-x.ca
# Double-click BugReaperX-4.0.0-portable.exe
# No installation required
```

### From Source
```bash
git clone https://github.com/vanthryx00/bugreaperx.git
cd bugreaperx
npm install
npm run dev          # Development mode
npm run build:win    # Build portable EXE
```

### Website (Marketing + Game)
```bash
cd website
npm install
npm run dev          # Local dev server
npm run build        # Production build
npm run deploy       # Deploy to Vercel
```

---

## 📊 Build Output

| Chunk | Size | Gzip | Content |
|-------|------|------|---------|
| `vendor` | 148 kB | 72 kB | React, React DOM |
| `three` | ~5 MB | ~2 MB | Three.js, R3F, Drei, Postprocessing |
| `shaders` | ~150 kB | ~40 kB | Custom GLSL shader materials |
| `game` | ~200 kB | ~60 kB | Game engine (combat, store, monsters) |
| `protection` | 620 kB | 302 kB | Anti-clone, honeypot system |
| `index` | ~3 MB | ~1.5 MB | Main application (obfuscated) |
| **Total** | **~8.6 MB** | **~3.9 MB** | |

---

## ⚙️ Configuration

| Variable | Purpose |
|----------|---------|
| `OLLAMA_HOST` | Custom Ollama endpoint (default: `localhost:11434`) |
| `SUPABASE_URL` | Optional remote sync backend |
| `SUPABASE_ANON_KEY` | Supabase anonymous key for sync |

Create a `.env` file in the project root.

---

## 🧪 Testing

```bash
npm test              # 63 tests
npx tsc --noEmit      # Zero TypeScript errors
npm run build         # Clean build
```

---

## 📁 Project Architecture

```
bugreaperx/
├── src/                    # React renderer (Electron app)
│   ├── components/         # UI components
│   ├── pages/              # Page components
│   ├── lib/                # Utilities, game engine, protection
│   ├── data/               # Static data (arsenal)
│   └── test/               # 63 tests
├── website/                # Marketing website
│   ├── src/
│   │   ├── components/     # Site + game components
│   │   ├── shaders/        # 5 custom GLSL shaders
│   │   └── lib/game/       # RPG game engine
│   ├── public/             # Static assets (favicon, OG, SEO)
│   └── vercel.json         # Vercel deployment config
├── dist/                   # Electron build output
├── docs/                   # Documentation
├── SECURITY.md             # Security policy
├── CONTRIBUTING.md         # Contributing guide
└── LICENSE                 # Proprietary license
```

---

## 🚀 Deployment

The marketing website auto-deploys to Vercel from `main` branch:

1. **Connect repo** to Vercel (framework: Vite)
2. **Custom domain**: `bugreaper-x.ca`
3. **Build**: `npm run build` (output: `dist`)
4. **SPA rewrites** configured in `vercel.json`

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvanthryx00%2Fbugreaperx)

---

## 🛡️ License

Proprietary — All Rights Reserved. See [LICENSE](LICENSE).  
Governing Law: Province of Alberta, Canada.

---

## 🌐 Community

- [Website](https://bugreaper-x.ca)
- [GitHub Issues](https://github.com/vanthryx00/bugreaperx/issues)
- [Discord](https://discord.gg/bugreaperx)
- [Twitter/X](https://x.com/vanthryx00)

---

*Built by operators, for operators. Sovereign infrastructure, zero compromise.*  
*Fort Saskatchewan, Alberta, Canada 🇨🇦*
