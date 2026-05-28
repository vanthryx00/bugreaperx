# Changelog

All notable changes to BugReaperX will be documented in this file.

## [4.0.0] - 2026-05-28

### 🚀 Initial Open-Source Release

Sovereign-grade bug bounty automation suite for offensive security researchers.

#### Added
- **Hunt Engine** — Target & program management with live scope mapping across HackerOne, Bugcrowd, Intigriti, and self-managed programs
- **Arsenal (275+ Weapons)** — Comprehensive attacker tool database across 15 categories: Recon, Vulnerability Assessment, Exploitation, Web, Mobile, Cloud, API, Active Directory, OSINT, Wireless, Social Engineering, C2, Evasion, Post-Exploitation, Physical Security
- **Web Repeater** — Full HTTP request crafting workstation with structured/raw mode, method selection, header editing, body manipulation, response viewer, and persistent request history (25 entries)
- **Pipeline** — Multi-platform submission tracker with earnings ledger ($5,300 sample data), severity breakdown (critical/high/medium/low/info), wallet tracking, and CVSS-scored report submission form
- **MCP Console** — AI-augmented analysis console with Ollama integration, chat interface, tool search, and execution framework
- **Workshop** — Local workspace for custom tool authoring and payload generation
- **Secrets Vault** — Encrypted credential storage with add/view/delete operations
- **Reports** — Generated security report viewer with download capability
- **Dashboard** — Real-time status overview with connection health, pipeline activity, Arsenal stats, and latest submissions widget
- **Windows Portable EXE** — Standalone executable (68 MB) via electron-builder, no installation required
- **Marketing Website** — Deployable landing page (`bugreaper-x.ca`) with Vercel deployment config, SEO metadata, OG images, and community/sales CTAs
- **IPC Infrastructure** — Secure context bridge for minimize/maximize/close window controls, HTTP request forwarding, and file system operations
- **Test Suite** — 63 unit tests covering Arsenal search/filter/copy, Pipeline submission/filter, Repeater HTTP states, and Hunt program management
- **CI/CD** — GitHub Actions workflow for automated testing and build validation

#### Technical
- Electron 34 + React 19 + TypeScript 5.7
- Vite 6 + Tailwind CSS for renderer
- IPC-based architecture with typed context bridge
- Zero TypeScript errors across both app and website
- Production builds optimized and verified
