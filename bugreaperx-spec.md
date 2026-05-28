# BugReaperX v4.0 — Rebuild Specification

> **Author:** Wyatt Daryl Fiddler  
> **App Name:** BugReaperX (BugReaper X Sovereign Windows Standalone)  
> **Version:** 4.0.0  
> **Date:** May 28, 2026  
> **Status:** Specification (pre-implementation)  
> **Design Reference:** Empire Command Center – Hunter Mega-Module (Kairyx)

---

## 1. Executive Summary

BugReaperX is a Windows desktop application for bug bounty hunters that simplifies and automates the entire bug bounty workflow. The app provides a dark-themed, hacker-styled GUI to manage targets, run reconnaissance and vulnerability scanning tools, record hunting sessions, generate reports, integrate AI for automation, and manage findings — all from a single Electron-based interface.

This spec describes a **full rebuild** from scratch using **Vite + React + TypeScript + Electron**, since the existing source code (`/src/main.tsx`) was lost and only the Electron shell scaffold remains.

---

## 2. Current State & Problems

### Existing Project
- `package.json` — Electron + electron-builder config, version 4.0.0
- `main.js` — Creates a BrowserWindow (1550×980), loads `index.html`
- `preload.js` — Minimal context bridge exposing `sovereigntyCore` (`fetchPlatform`, `dispatchSignal`)
- `index.html` — Contains:
  - A massive inline React 19 production runtime (367 KB minified)
  - References to `/src/main.tsx?v=...` (Vite dev server entry point) — **FILE DOES NOT EXIST**
  - References to `/@react-refresh` (Vite HMR)
  - References to `__manus__/debug-collector.js` (Manus AI dev tools)
  - Google Fonts commented out
  - `<div id="root"></div>` mount point
- **Node modules are installed** (`node_modules/`, `package-lock.json` exist)
- **Windows build exists** in `dist/win-unpacked/` (previously built portable EXE)

### Core Problem
The app opens a window but shows a **blank/white page** because:
1. `index.html` tries to load `/src/main.tsx` via Electron's `file://` protocol
2. The `/src/` directory (Vite source folder) is missing entirely
3. The inline React runtime is present but no application code calls `createRoot` or renders anything

---

## 3. Technical Stack

| Layer | Technology |
|-------|-----------|
| Framework | **Electron** 30.x |
| UI Library | **React** 19.x |
| Language | **TypeScript** 5.x |
| Bundler | **Vite** 6.x (with `vite-plugin-electron`) |
| Styling | **Tailwind CSS** (dark hacker theme) |
| Build/Package | **electron-builder** (Windows Portable) |
| Icons | **Lucide React** (open source SVG icons) |
| State Management | React Context / Zustand (lightweight) |
| AI Integration | **Ollama** (local LLM) + **MCP** (Model Context Protocol) for tool execution |
| Proxy/HUD | Electron built-in for session recording |
| Database | **SQLite** (via `better-sqlite3`) |
| Target User | Beginner-friendly — download and run |

---

## 4. Visual Design

### Theme: Dark Terminal / Hacker
- **Background:** Pure black `#000000` or very dark `#0a0a0a`
- **Text:** Bright green `#00ff41` on dark backgrounds (classic terminal green)
- **Accents:** Cyan `#00d4ff`, amber `#ffb000`, red `#ff3333`
- **Fonts:** Monospace (JetBrains Mono or Fira Code) for terminal/log sections; Inter or similar for UI
- **Borders:** Subtle green/cyan glow effects, 1px borders
- **Window chrome:** Auto-hide menu bar (`autoHideMenuBar: true`)
- **Window size:** 1550×980 (as existing)
- **Scrollbars:** Custom dark scrollbars
- **Animations:** Subtle fade/slide transitions, terminal cursor blink
- **Footer:** "kairyx empire / bugreaperx — patent-pending — trade-secret-protected arsenal — all rights reserved" style branding

### UI Layout
- **Left sidebar:** Navigation (dashboard, hunt, arsenal, pipeline, sessions, reports, settings)
- **Main content area:** Tab-based views for each section
- **Bottom panel:** Collapsible terminal/log output area + workshop audit tail
- **Top bar:** App title, system status indicators (Hunter, Arsenal, Sentry, CF, Gmail), quick actions

---

## 5. Feature Roadmap

### Phase 1: Core Shell (MVP)
- [x] Electron window with proper initialization
- [ ] Vite + React + TypeScript project scaffolding
- [ ] Dark hacker theme with Tailwind CSS
- [ ] Sidebar navigation
- [ ] Dashboard page (system status, basic stats, recent activity)
- [ ] Electron IPC setup (preload bridge with typed APIs)
- [ ] Window management (minimize to tray, proper quit)
- [ ] Portable Windows build via electron-builder

### Phase 2: Dashboard & System Status
- [ ] **HUD/Status Bar** — Live indicators for:
  - Hunter (scan status)
  - Arsenal (weapon count)
  - Sentry (monitoring status)
  - Supabase (DB connection)
  - Cloudflare (CDN/proxy status)
  - Gmail (email integration)
- [ ] **System health** — Component connectivity indicators (green/red/ERR)
- [ ] **Auto-refresh** — Periodic status polling
- [ ] **Quick stats** — Active targets, findings count, recent scans

### Phase 3: Target & Scope Management (Programs)
- [ ] Add/manage bug bounty programs
- [ ] **Program account management:**
  - Account name (required)
  - Platform selector (HackerOne / Bugcrowd)
  - USD earnings tracker
  - Notes field
  - Address / account number
- [ ] Import scopes from HackerOne API
- [ ] Import scopes from Bugcrowd API
- [ ] Import scopes from Intigriti API
- [ ] Manual target entry (URLs, CIDR ranges, wildcards)
- [ ] **Unknown scope warnings** — Alert when scanning targets not in DB
- [ ] Target tagging and categorization (prod, staging, etc.)
- [ ] Scope visualization (in-scope vs out-of-scope)
- [ ] Local + optional cloud-synced storage of API keys
- [ ] **Wallet/Ledger** — Financial tracking per program

### Phase 4: The Arsenal — Copy-Paste Weapon System
This is the core tool library. Every tool is a "weapon" with a copy-paste command template, category tag, and active status.

#### Categories (matching reference design):
| Category | Count Target | Description |
|----------|-------------|-------------|
| **Recon** | 71 | Subdomain discovery, DNS, HTTP probing |
| **Cloud** | 10 | Cloud infrastructure scanning (AWS, GCP, Azure) |
| **Cache** | 3 | Cache-based attacks, CDN origin discovery |
| **Vuln** | 79 | Vulnerability detection templates |
| **Auth** | 16 | Authentication testing tools |
| **API** | 15 | API endpoint fuzzing and testing |
| **WAF** | 6 | WAF detection and bypass techniques |
| **403** | 8 | 403 bypass methodologies |
| **Takeover** | 4 | Subdomain takeover detection |
| **Smuggle** | 5 | HTTP request smuggling |
| **Burp** | 30 | Burp Suite integration/send-to |
| **OOB** | 5 | Out-of-band testing tools |
| **Obscure** | 10 | Obscure/niche techniques |
| **Chain** | 7 | Multi-step exploit chains |
| **Secrets** | 6 | Secret discovery tools (set below) |

#### Weapon Entry Structure:
- Name (e.g., "trufflehog-git")
- Description
- Category tag
- Command template (with `{{VARIABLE}}` placeholders)
- Active toggle
- Copy button (copies filled command to clipboard)

#### Smart Hunt / Show All toggle
- **Smart Hunt** — Context-aware weapon filtering based on current target
- **Show All** — Display all weapons unfiltered
- **Search** — Search arsenal by name, category, or command content

### Phase 5: Secret Discovery Module
Dedicated sub-section of Arsenal for secret scanning:

1. **trufflehog-git** — TruffleHog single repo scan
   - `trufflehog git https://github.com/{{ORG}}/{{REPO}}`
2. **trufflehog-org** — TruffleHog full org scan
   - `trufflehog github --org={{ORG}} --only-verified`
3. **gitleaks** — Gitleaks local secret scan
   - `gitleaks detect -s . -v`
4. **nuclei-expo** — Nuclei exposures template
   - `nuclei -l alive.txt -t exposures/ -severity medium,high,critical`
5. **js-secret-grep** — JS secret grep one-liner
   - `cat js-files.txt | xargs -I{} curl -s {} | grep -E "{{PATTERN}}"`
6. **mantra** — JS file secret tool
   - `mantra -ua "Mozilla" -l js-files.txt`

### Phase 6: Bug Bounty Pipeline
A financial tracking and reporting dashboard:

- **Earned** (total USD earned)
- **Pending** $ (pending payouts)
- **Drafts** (unsubmitted report drafts)
- **Submitted** (submitted reports count)
- **Critical** / **High** / **Medium** / **Low** (findings by severity)
- **Paid #** (number of paid findings)
- **Total** (total findings count)
- **Report submission panel:**
  - Title (required)
  - Affected URL
  - Impact / Summary
  - Program selector
  - Vulnerability type
  - Reward $ / Medium $
  - CVSS score
  - Draft CVSS
  - Commit to DB / Cancel buttons

### Phase 7: Recon & Scanning Tools (GUI Integration)
- [ ] **Subdomain enumeration** — GUI for subfinder, amass, assetfinder
- [ ] **HTTP probing** — GUI for httpx
- [ ] **Technology detection** — GUI for wappalyzer/whatweb
- [ ] **Vulnerability scanning** — GUI for nuclei
- [ ] **Fuzzing** — GUI for ffuf
- [ ] **Screenshot capture** — GUI for gowitness/aquatone
- [ ] **Port scanning** — GUI for naabu
- [ ] **Wordlist management** — download, generate, combine wordlists
- [ ] **One-click automation chains** — "Full recon" button that runs subfinder → httpx → nuclei
- [ ] **Output parsing** — Parse tool output into structured findings

### Phase 8: AI Integration (Ollama + MCP)

#### Ollama Integration
- [ ] Ollama connection manager (default: `http://localhost:11434`)
- [ ] Model selection (codestral, llama3, deepseek-coder, etc.)
- [ ] **AI-assisted report writing** — Generate markdown reports from findings
- [ ] **AI PoC generation** — Generate proof-of-concept code for vulnerabilities
- [ ] **AI scope analysis** — Analyze scope descriptions, identify ambiguities
- [ ] **AI triage** — Prioritize findings based on impact
- [ ] **AI chat** — Conversation window with context from current session
- [ ] Custom prompt templates

#### MCP Console (Model Context Protocol)
- [ ] **MCP Console window** — Execute any MCP tool via AI
- [ ] Tool selector dropdown (`-- select MCP tool --`)
- [ ] Args input (JSON format, e.g. `{"project_id":"...","query":"select 1"}`)
- [ ] Execute / Copy / Clear buttons
- [ ] Integration with Claude/Anthropic MCP
- [ ] `window.cowork.callMcpTool` — Programmatic MCP tool calling

### Phase 9: Web Repeater — Live HTTP Tool
A built-in HTTP request crafting tool:

- [ ] Method selector (GET, POST, PUT, DELETE, etc.)
- [ ] URL input field with path
- [ ] **FIRE button** — Send request
- [ ] Headers editor (one per line, e.g. `X-Forwarded-For: 127.0.0.1`)
- [ ] Body editor (JSON, form, raw)
- [ ] Response viewer (status, headers, body)
- [ ] curl command generator (output corresponding curl command)
- [ ] Request history
- [ ] Send to Arsenal (save as weapon)

### Phase 10: Virtual Workshop System
A workspace-based target management system:

- [ ] **Workbench per target** — Each target gets its own workbench
- [ ] **Stations** — Allow-listed recon tools assigned to workbenches
- [ ] **Playbooks** — Chain stations together in automated sequences
- [ ] **Workbench Inventory** — All output writes to inventory
- [ ] **Audit trail** — Every action is logged with timestamps
- [ ] **Workshop Log / Audit Tail** — Live streaming log viewer
  - `// bridge offline. start server.py to stream audit.` placeholder
- [ ] **Workbench management:**
  - List of active workbenches
  - Create new bench (name, tags)
  - Bench notes / scope notes
  - Tag system (prod, staging, etc.)
  - Save button
- [ ] **Bridge status indicator** — `bridge offline -- start server.py`

### Phase 11: Session Recording & Logging
- [ ] **Activity log** — Log all tool runs, commands, and findings with timestamps
- [ ] **Built-in HTTP proxy** — Route traffic through app (mitmproxy integration)
- [ ] **Screen recording** — Capture screen during sessions (via MediaRecorder API or OBS integration)
- [ ] **Embedded browser** — Chromium-based browser tab inside the app for target testing
- [ ] **Session replay** — Review recorded sessions
- [ ] **Screenshot management** — Auto-save screenshots, annotate

### Phase 12: Reporting
- [ ] **Auto-generated markdown reports** from findings
- [ ] **Report templates** (HackerOne, Bugcrowd, custom) — reference design shows a dedicated panel
- [ ] Export to PDF/HTML
- [ ] Screenshot inclusion in reports
- [ ] Vulnerability severity ratings (CVSS)
- [ ] Custom report sections
- [ ] **Workflows / AI Approval** — Approval pipeline for report submission

### Phase 13: Notifications & Alerts
- [ ] Webhook support (Discord, Slack, Telegram)
- [ ] Desktop notifications
- [ ] Scheduled/periodic scanning
- [ ] Email reports (Gmail integration)
- [ ] Platform-specific alert rules
- [ ] **Sentry** — Issue monitoring and alerting

### Phase 14: Data & Storage Infrastructure
- [ ] **SQLite database** for all local data
- [ ] **Supabase tables** — Database schema visualization (reference design shows this)
- [ ] **IP Lock / Patent / Trademark** — Legal/IP management section
- [ ] **Wallet / Ledger** — Financial records
- [ ] Import/export data

---

## 6. Project Structure (Target)

```
bugreaper-desktop/
├── electron/
│   ├── main.ts              # Electron main process
│   ├── preload.ts            # Context bridge (typed)
│   └── ipc-handlers.ts       # IPC handler registration
├── src/
│   ├── main.tsx              # React entry point
│   ├── App.tsx               # Root component with routing
│   ├── index.css             # Tailwind imports + global styles
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx       # System status HUD, title
│   │   │   ├── BottomPanel.tsx  # Terminal + workshop audit tail
│   │   │   └── MainLayout.tsx
│   │   ├── dashboard/           # System status, stats cards
│   │   ├── hunt/                # Hunt/Arsenal main view
│   │   │   ├── ArsenalView.tsx
│   │   │   ├── WeaponCard.tsx
│   │   │   ├── WeaponCategory.tsx
│   │   │   └── SecretDiscovery.tsx
│   │   ├── pipeline/            # Bug Bounty Pipeline
│   │   │   ├── PipelineStats.tsx
│   │   │   ├── ReportForm.tsx
│   │   │   └── WalletLedger.tsx
│   │   ├── repeater/            # Web Repeater
│   │   │   └── WebRepeater.tsx
│   │   ├── mcp/                 # MCP Console
│   │   │   └── MCPConsole.tsx
│   │   ├── workshop/            # Virtual Workshop
│   │   │   ├── WorkbenchPanel.tsx
│   │   │   ├── WorkshopAudit.tsx
│   │   │   └── PlaybookEditor.tsx
│   │   ├── targets/
│   │   ├── tools/
│   │   ├── sessions/
│   │   ├── reports/
│   │   ├── ai/
│   │   └── common/           # Buttons, inputs, modals, etc.
│   ├── hooks/                # Custom React hooks
│   ├── stores/               # Zustand stores or context providers
│   ├── services/             # API integrations, tool runners, etc.
│   ├── types/                # TypeScript type definitions
│   ├── data/                 # Arsenal weapon definitions, defaults
│   │   └── arsenal.ts       # All 200+ weapon entries
│   └── utils/                # Helper functions
├── index.html                # Vite entry HTML
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── electron-builder.yml
```

---

## 7. Key Architecture Decisions

### 7.1 IPC Communication
- Use Electron's `contextBridge` with a typed API surface
- Main process handles: file system access, child process spawning (tools), window management
- Renderer process handles: UI rendering, state management, user interactions
- Security: `contextIsolation: true`, `nodeIntegration: false`

### 7.2 Tool Execution (Arsenal Weapons)
- Each weapon is a data entry: `{ name, description, category, command, active, tags }`
- Command templates use `{{VARIABLE}}` syntax for user-provided values
- **Copy to clipboard** — All weapons have a copy button
- Future: Direct execution via IPC spawning child processes
- "Smart Hunt" filters weapons based on current target context

### 7.3 Data Storage
- **Local:** SQLite (via `better-sqlite3`) for targets, programs, findings, wallet, config
- **Encrypted storage:** `safeStorage` (Electron) for API keys
- **Optional sync:** JSON export/import for manual backup; future Supabase cloud sync
- **Database tables:** Programs, Targets, Findings, Weapons, Sessions, Wallet, Workbenches

### 7.4 AI Architecture
- **Ollama** — Connect to local instance (`http://localhost:11434`)
- **MCP** (Model Context Protocol) — Execute any tool via AI agent
  - `window.cowork.callMcpTool(tool, args)` — Programmatic interface
  - Tool selector + JSON args in MCP Console
- Model-dependent prompts and context windows
- Streaming responses (SSE-style) for real-time AI output
- System prompts tailored for bug bounty context

### 7.5 Virtual Workshop Architecture
- Each target creates a **workbench** (workspace)
- **Stations** = allowed tools within a workbench
- **Playbooks** = ordered sequences of stations
- All output goes to **workbench inventory**
- Every action writes to **audit log** (live tail)
- Bridge service (`server.py`) = optional backend for syncing

### 7.6 Web Repeater Architecture
- Uses Node.js `http`/`https` modules or `curl` via child process
- Custom headers support (e.g., `X-Forwarded-For`, `Authorization`)
- Body types: JSON, form-urlencoded, raw text
- Response rendered with status code, headers, body preview
- Request history saved locally
- Can generate equivalent curl command

---

## 8. Windows-Specific Requirements

- **Portable EXE** (no installer needed) via electron-builder `portable` target
- Proper window DPI scaling
- Windows taskbar integration
- Notification support (Windows toast notifications)
- File association (optional: `.bugreaper` project files)
- Anti-virus considerations: mark as safe, avoid false positives from tool spawning
- `requestedExecutionLevel: "asInvoker"` (no admin required)

---

## 9. Beginner-Friendly Design

The target user is a **beginner** who wants to:
1. Download the portable EXE (or clone + `npm start`)
2. Configure Ollama connection in settings
3. Add programs and targets via the GUI
4. Browse the Arsenal, copy-paste weapon commands
5. Use Web Repeater for live HTTP testing
6. Use MCP Console for AI-powered tool execution
7. Review findings, generate reports with AI
8. Track earnings in the Bug Bounty Pipeline

No command-line knowledge required for basic operations.
Advanced users can use the terminal panel, direct tool execution, and custom playbooks.

---

## 10. Open Questions / Future Considerations

- **Bridge service (`server.py`):** Optional backend for workshop sync & audit? Include in repo or keep optional?
- **Tool binary bundling:** Should common tools (subfinder, nuclei) be bundled with the app or auto-installed?
- **Cloud sync service:** Might require a backend — defer to post-MVP
- **Mobile companion app:** Not planned yet
- **Multi-user/collaboration:** Not planned yet
- **Linux/macOS support:** Could be added later (Electron is cross-platform)
- **Auto-updater:** Use electron-updater for seamless updates
- **Supabase integration:** Database schema panel shown in reference — embed Supabase Studio or build custom?

---

## 11. Build & Distribution

```bash
# Development
npm install
npm run dev          # Vite dev server + Electron

# Production build
npm run build:win    # electron-builder → dist/BugReaperX-portable.exe
```

### electron-builder Config
- App ID: `com.vanthryx00.bugreaperx`
- Product name: `BugReaperX`
- Windows target: `portable`
- Requested execution level: `asInvoker`
- Icon: Custom hacker-styled app icon (skull/reaper theme)

---

## 12. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Tool binaries not found on user's system | Auto-detect PATH, provide download links, bundle common tools |
| Ollama not installed / running | Install instructions, auto-start attempt, fallback to MCP-only mode |
| Large memory usage from scanning tools | Stream output, limit concurrent processes, cleanup child processes |
| Windows Defender flags tool spawning | Sign the app, document whitelisting steps |
| Scope creep / too many features | Phased releases, core MVP first (Dashboard + Arsenal + Pipeline) |
| Missing TypeScript source (current state) | Full rebuild from scratch using this spec |
| MCP protocol changes | Abstract MCP integration behind an adapter layer |

---

## 13. Autosave System

A comprehensive autosave system ensures no data is ever lost. All autosave data is written to the user's OS **Downloads folder** (configurable) for easy access and backup.

### 13.1 Autosave Targets

| Data Type | Trigger | Format | Location |
|-----------|---------|--------|----------|
| **Report Drafts** | Every keystroke (debounced 2s) | Markdown (.md) | `~/Downloads/BugReaperX/autosave/reports/` |
| **Session Logs** | Every 30s + on tool completion | JSONL (.jsonl) | `~/Downloads/BugReaperX/autosave/sessions/` |
| **Findings** | As discovered by tools | JSON (.json) | `~/Downloads/BugReaperX/autosave/findings/` |
| **Tool Output** | On each tool run completion | Raw `.txt` + parsed `.json` | `~/Downloads/BugReaperX/autosave/output/` |
| **Screenshots** | On capture | PNG (.png) | `~/Downloads/BugReaperX/autosave/screenshots/` |
| **HTTP Traffic** | On each request/response | HAR (.har) + raw | `~/Downloads/BugReaperX/autosave/traffic/` |
| **Workbench State** | On any change (debounced 5s) | JSON (.json) | `~/Downloads/BugReaperX/autosave/workbenches/` |
| **Wallet/Ledger** | On any transaction entry | CSV (.csv) + JSON | `~/Downloads/BugReaperX/autosave/finance/` |
| **Arsenal Config** | On weapon add/edit | JSON (.json) | `~/Downloads/BugReaperX/autosave/config/` |
| **Full Session Export** | On session end | Zip archive (.zip) | `~/Downloads/BugReaperX/sessions/` |

### 13.2 Autosave Behavior

- **Debounced saving** — Report drafts save 2 seconds after the user stops typing (prevents disk thrashing)
- **Continuous session logging** — Session logs append in real-time to a JSONL file
- **Crash recovery** — On app start, checks for unsaved drafts and offers to recover
- **Version history** — Keeps last 5 versions of each report draft (report-1.md, report-1-v2.md, etc.)
- **Configurable location** — Default is `~/Downloads/BugReaperX/autosave/`, can be changed in Settings
- **Export button** — "Export All Autosaves" creates a timestamped zip

### 13.3 OS Integration

- **Downloads folder** is the default save location across all Windows users
- Respects Windows `%USERPROFILE%\Downloads` path resolution
- Creates organized subfolder structure automatically
- Files are named with timestamps for easy sorting: `finding-2026-05-28-22-15-33.json`
- Compatible with OneDrive/Dropbox Downloads folder sync (auto-cloud backup)

### 13.4 UI Indicators

- **Autosave indicator** — Small icon/text in the bottom-right status bar showing last save time
- **Saving... / Saved** — Brief status toast on save
- **Unsaved changes indicator** — Dot/asterisk on tabs with unsaved changes
- **Autosave stats** — Session summary showing how many autosaves occurred, total data written

---

## 14. Immediate Next Steps

1. Scaffold Vite + React + TypeScript + Electron project with Tailwind
2. Build core layout (sidebar, topbar with status HUD, bottom panel)
3. Implement Dashboard with system status indicators
4. Build Arsenal view with categorized weapons (hardcoded initial set)
5. Implement Bug Bounty Pipeline (stats + report form)
6. Build Web Repeater (basic HTTP request tool)
7. Add MCP Console for AI tool execution
8. Implement Virtual Workshop with workbench system
9. Add target/program management
10. Integrate Ollama for AI-assisted features
11. Session recording & logging
12. Reporting engine
13. Package and distribute

---

## 14. Reference: Empire Command Center Feature Map

The following features are directly adapted from the Empire Command Center – Hunter Mega-Module design:

| Feature | Source | Priority |
|---------|--------|----------|
| System Status HUD (Hunter, Arsenal, Sentry, etc.) | Empire CC | P1 |
| Arsenal copy-paste weapons with categories | Empire CC | P1 |
| Smart Hunt / Show All toggle | Empire CC | P1 |
| Secret Discovery (trufflehog, gitleaks, etc.) | Empire CC | P1 |
| Bug Bounty Pipeline (earnings, drafts, submitted) | Empire CC | P1 |
| Program account management (platform, wallet) | Empire CC | P1 |
| Web Repeater (live HTTP tool) | Empire CC | P2 |
| MCP Console (any tool via AI) | Empire CC | P2 |
| Virtual Workshop (workbench per target) | Empire CC | P2 |
| Workshop Audit Tail (live log) | Empire CC | P2 |
| Report Templates panel | Empire CC | P2 |
| Workflows / AI Approval pipeline | Empire CC | P3 |
| Wallet / Ledger | Empire CC | P2 |
| Supabase Tables view | Empire CC | P3 |
| Sentry Issues monitoring | Empire CC | P3 |
| Gmail integration | Empire CC | P3 |

---

*This specification was compiled on May 28, 2026 through an iterative interview process. Features from the Empire Command Center – Hunter Mega-Module (Kairyx) have been merged into this design with appropriate adaptations for the Electron/Windows standalone platform.*

---

## Appendix: Arsenal Weapon — Initial Seed Data

The following weapons should be pre-loaded as the initial arsenal seed. Each can be expanded later.

### Recon (target: 71)
```
subfinder-basic       | subfinder -d {{DOMAIN}} -all -o subdomains.txt
subfinder-passive     | subfinder -d {{DOMAIN}} -passive -o passive.txt
subfinder-recursive   | subfinder -d {{DOMAIN}} -recursive -o recursive.txt
assetfinder           | assetfinder --subs-only {{DOMAIN}} | tee assetfinder.txt
findomain             | findomain -t {{DOMAIN}} -o
amass-enum            | amass enum -passive -d {{DOMAIN}} -o amass.txt
amass-intel           | amass intel -whois -d {{DOMAIN}}
chaos                 | curl -s https://chaos.projectdiscovery.io/{{DOMAIN}} | jq -r '.subdomains[]'
httpx-probe           | httpx -l subdomains.txt -o alive.txt -silent
httpx-tech            | httpx -l alive.txt -tech-detect -o tech.txt
httpx-title           | httpx -l alive.txt -title -o titles.txt
dnsx                  | dnsx -l subdomains.txt -a -aaaa -cname -o dns-records.txt
```

### Cloud (target: 10)
```
aws-s3-bucket         | s3scanner scan -b {{BUCKET_NAME}}
gcp-storage           | gcloud storage ls gs://{{BUCKET}}
azure-blob            | curl -s https://{{STORAGE}}.blob.core.windows.net/{{CONTAINER}}
```

### Vuln (target: 79)
```
nuclei-critical       | nuclei -l alive.txt -severity critical -o critical.txt
nuclei-high           | nuclei -l alive.txt -severity high -o high.txt
nuclei-medium         | nuclei -l alive.txt -severity medium -o medium.txt
nuclei-all            | nuclei -l alive.txt -t ~/nuclei-templates/ -o all-vulns.txt
```

### Secrets (target: 6)
```
trufflehog-git        | trufflehog git https://github.com/{{ORG}}/{{REPO}}
trufflehog-org        | trufflehog github --org={{ORG}} --only-verified
gitleaks              | gitleaks detect -s . -v
nuclei-expo           | nuclei -l alive.txt -t exposures/ -severity medium,high,critical
js-secret-grep        | cat js-files.txt | xargs -I{} curl -s {} | grep -E "{{PATTERN}}"
mantra                | mantra -ua "Mozilla" -l js-files.txt
```

### WAF (target: 6)
```
wafw00f               | wafw00f https://{{TARGET}}
cf-check              | curl -s https://{{TARGET}} | grep -i "cloudflare"
```

### 403 Bypass (target: 8)
```
403-bypass-headers   | curl -s -H "X-Forwarded-For: 127.0.0.1" https://{{TARGET}}{{PATH}}
403-bypass-methods   | curl -s -X PUT https://{{TARGET}}{{PATH}}
```

*(Expand to fill target counts as development progresses)*
