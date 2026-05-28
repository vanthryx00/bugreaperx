# BugReaper X: Vulnerability Hunter
## Game Design Document v1.0

---

## 1. Core Concept

**BugReaper X: Vulnerability Hunter** transforms real bug bounty hunting into an immersive 3D RPG. Every web vulnerability is a monster. Every real-world CVE is a boss. Your hacking tools are weapons. Your bounties are crypto.

The game mirrors real bug bounty workflows — recon, scanning, exploitation, reporting — but visualizes each phase as a game mechanic. When you "defeat" a vulnerability in-game, you're actually learning how to find and exploit it in the real world.

---

## 2. The World — "The Dark Web Grid"

### Hub: Sovereign Command
A 3D cyberpunk command center floating in neon-lit cyberspace. This is your home base:
- **The War Table** — Holographic globe showing active targets, vulnerability hot spots, and ongoing campaigns
- **The Arsenal Wall** — Display all unlocked weapons/tools with upgrade slots
- **The Pipeline Terminal** — Submit real bug bounty reports, track earnings
- **The Training Dojo** — Practice against spawned vulnerability monsters (no risk)
- **The Vault** — Crypto wallet interface: deposit, withdraw, check balance

### Regions (Zones)
Each zone represents a different attack surface:

| Zone | Theme | Monsters | Difficulty |
|------|-------|----------|------------|
| **The Web Layer** | HTTP/HTTPS surface | XSS imps, Open Redirect snakes, Info Disclosure spirits | Easy |
| **The API Abyss** | REST/GraphQL endpoints | IDOR wraiths, Mass Assignment ghosts, Rate Limit zombies | Medium |
| **The Auth Citadel** | Authentication systems | JWT phantoms, OAuth shades, Session specters | Medium |
| **The Cloud Spire** | Cloud infrastructure | S3 elementals, IAM golems, Lambda shades | Hard |
| **The Database Core** | Databases | SQLi hydras, NoSQL mimics, Injection serpents | Hard |
| **The Binary Forge** | Compiled binaries | Buffer overflow giants, RCE leviathans | Expert |
| **The Zero-Day Throne** | Final boss zone | CVE lords, 0-Day overlords | Legendary |

---

## 3. Hero System

### Character Creation
Players create a Hunter avatar with:
- **Name / Handle** — Your hunter alias
- **Class** — Determines playstyle (see below)
- **Appearance** — Cyberpunk aesthetic customizations
- **Origin Story** — Flavor text, no gameplay effect

### Hunter Classes

| Class | Specialty | Starting Weapon | Ability |
|-------|-----------|----------------|---------|
| **Recon Scout** | Information gathering, speed | `gau` (ranged scanner) | **Scan Reveal** — Highlights all monsters in a zone |
| **Vuln Breaker** | Exploitation, damage | `nuclei` (heavy cannon) | **Critical Strike** — 3x damage on known CVEs |
| **Payload Slinger** | Fuzzing, multi-target | `ffuf` (rapid fire) | **Barrage** — Hits all monsters in range |
| **Web Reaper** | Balanced, all-rounder | `httpx` (versatile blade) | **Reap** — Execute low-health monsters instantly |
| **Cloud Warden** | Defense, mitigation | `cloud_enum` (shield) | **Fortify** — Reduce incoming damage 50% for 10s |

### Stats
| Stat | What It Does | Max |
|------|-------------|-----|
| **HP** | Health points | 100 + (Vitality × 10) |
| **Attack Power** | Base damage | 10 + (Strength × 2) |
| **Defense** | Damage reduction | 0 + (Endurance × 1.5) |
| **Speed** | Move speed, dodge chance | 100 + (Agility × 2) |
| **Scan Range** | Detection radius | 10m + (Intellect × 1) |
| **Luck** | Drop rates, crit chance | 5% + (Luck × 0.5%) |

### Leveling & XP
- Kill monsters → earn XP
- Level up → gain stat points to distribute
- Every 5 levels → unlock new ability
- Every 10 levels → unlock new zone
- Max level: 100

---

## 4. Monster System (Vulnerabilities as Enemies)

### Monster Types

| Vulnerability | Monster Form | Attack | Weakness |
|--------------|-------------|--------|----------|
| **XSS (Stored)** | Data Leech — parasitic worm | Drains HP over time | Input sanitization weapon |
| **XSS (Reflected)** | Mirror Wraith — clones itself | Confuses, reduces accuracy | URL parameter weapon |
| **SQL Injection** | Data Hydra — many-headed serpent | Multi-hit attack | Parameterized query sword |
| **IDOR** | Wraith — phases through defenses | Bypasses armor, direct HP damage | Auth token weapon |
| **Open Redirect** | Viper — fast, strikes from blind spots | High speed, low HP | Validation shield |
| **SSRF** | Phantom — attacks from inside | Internal damage, ignores armor | Network segmentation blade |
| **RCE** | **LEVIATHAN** — giant, devastating | Massive AOE attacks | Patch & update weapons |
| **File Upload** | Mimic Chest — disguised treasure | Trap damage, steals loot | File type validation |
| **Rate Limit** | Zombie Horde — endless, weak | Low damage, overwhelming numbers | Token bucket weapon |
| **S3 Bucket** | Elemental Golem — armored giant | High defense, slow | Permission scanner |

### Monster Tiers
| Tier | Color | Examples | Loot |
|------|-------|----------|------|
| Common (Info) | Gray | Info disclosure, verbose error messages | 1-5 BRX tokens |
| Uncommon (Low) | Green | Missing headers, outdated versions | 5-15 BRX tokens |
| Rare (Medium) | Blue | XSS, IDOR, Open Redirect | 15-50 BRX tokens |
| Epic (High) | Purple | SSRF, XXE, RCE | 50-200 BRX tokens |
| Legendary (Critical) | Orange | Chained exploits, 0-days | 200-1000 BRX tokens |

---

## 5. Boss Fights — "CVE Lords"

Each zone ends with a **CVE Lord** — a boss based on a real, famous vulnerability.

### Boss Progression

| Boss | Based On | Zone | Health | Mechanics |
|------|----------|------|--------|-----------|
| **Heartbleed** | CVE-2014-0160 | The Web Layer | 5,000 | Drains HP over time, must interrupt memory leak channels |
| **Shellshock** | CVE-2014-6271 | The API Abyss | 8,000 | Spawns CGI minions, must exploit env vars to stun |
| **GHOST** | CVE-2015-0235 | The Auth Citadel | 12,000 | Glitches through defenses, must time attacks to glitch pattern |
| **Cloud Bleed** | CVE-2017-17099 | The Cloud Spire | 20,000 | Random data leak pulses, must position in safe zones |
| **BlueKeep** | CVE-2019-0708 | The Binary Forge | 35,000 | RDP chain lightning, must break LOS and use RDS countermeasures |
| **Log4Shell** | CVE-2021-44228 | The Database Core | 50,000 | JNDI injection pulse, must deploy WAF shields in pattern |
| **The Zero-Day Overlord** | Custom | The Zero-Day Throne | 100,000 | Phase-shifts through 10 vulnerability types, must counter each phase with correct weapon |

### Boss Rewards
- **Unique Weapon Blueprints** — Can't be found anywhere else
- **Large BRX token drops** (500-2500)
- **Title/Achievement** — Displayed on your hunter profile
- **Zone completion** — Unlocks next zone

---

## 6. Weapon & Armour System

### Weapon Types (Map to Real Tools)

| Category | Example Weapons | In-Game Effect |
|----------|----------------|----------------|
| **Scanners** | `nmap`, `masscan`, `zmap` | Reveal monsters, detect boss phases |
| **Fuzzers** | `ffuf`, `dirsearch`, `gobuster` | Rapid multi-hit attacks |
| **Exploit Kits** | `nuclei`, `metasploit` | Heavy damage, execute on vulnerable monsters |
| **Proxies** | `burpsuite`, `zap` | Intercept and redirect enemy attacks |
| **Deobfuscators** | `jadx`, `uncompyle6` | Strip armor from armored enemies |
| **Cloud Tools** | `cloud_enum`, `s3scanner` | Damage cloud-type monsters bonus |
| **Payload Tools** | `sqlmap`, `dalfox` | High damage to specific vuln types |

### Weapon Rarity

| Rarity | Drop Rate | Damage Bonus | Special Effect |
|--------|-----------|-------------|----------------|
| Common | 60% | 1x | None |
| Uncommon | 25% | 1.5x | +5% crit |
| Rare | 10% | 2x | +15% crit, type advantage |
| Epic | 4% | 3x | +25% crit, type advantage, AOE |
| Legendary | 1% | 5x | +40% crit, type advantage, AOE, lifesteal |

### Armour Types

| Armour | Defense | Set Bonus (2-piece) | Set Bonus (4-piece) |
|--------|---------|---------------------|---------------------|
| **Recon Suit** | +5 | +10% speed | +20% scan range |
| **Breaker Plate** | +10 | +15% attack | +50% crit damage |
| **Cloud Ward** | +8 | -10% incoming damage | +25% max HP |
| **Phantom Cloak** | +3 | +20% dodge | +30% movement speed |
| **Reaper Mantle** | +7 | +10% all stats | Execute <15% HP |

---

## 7. Crypto Economy — "BRX Token"

### Overview
BRX tokens are the in-game cryptocurrency that bridges gameplay to real value.

### Earning BRX
| Activity | BRX Reward |
|----------|-----------|
| Kill Common monster | 1-5 |
| Kill Rare monster | 15-50 |
| Kill Epic monster | 50-200 |
| Defeat Boss | 500-2500 |
| Daily login bonus | 10 |
| Level up | 50 × level |
| Submit real bug report (verified) | 100 bonus |
| Complete zone | 500 |

### Spending BRX
| Purchase | Cost | Effect |
|----------|------|--------|
| Weapon upgrade (per level) | 50 × level | +5% damage per level |
| Armour upgrade (per level) | 40 × level | +3% defense per level |
| Potion (heal) | 10 | Restore 25% HP |
| Revive | 100 | Respawn at hub with full HP |
| Weapon blueprint | 500-5000 | Craft specific weapon |
| Cosmetic skin | 200 | Change hero appearance |
| XP boost (1hr) | 150 | 2x XP gain |
| Loot boost (1hr) | 200 | 2x drop rate |

### Crypto Wallet
- **Deposit** — Transfer crypto (ETH/SOL/USDC) → BRX tokens
- **Withdraw** — Convert BRX tokens → crypto (with fee)
- **Balance** — Display current BRX holdings
- **Transaction History** — Full ledger of all deposits, withdrawals, and in-game earnings
- **Wallet Connect** — MetaMask, WalletConnect, Phantom, or embedded wallet

### Tokenomics
- **Total Supply:** 100,000,000 BRX (capped)
- **In-game earning:** 40% of supply
- **Staking rewards:** 20%
- **Team/Development:** 15% (4-year vest)
- **Partnerships/Marketing:** 15%
- **Liquidity pool:** 10%

---

## 8. Real Bounty Integration

The game connects to REAL bug bounty hunting:

### Pipeline Link
- Submit actual findings to HackerOne/Bugcrowd from within the game
- Verified submissions earn BRX bonus
- Leaderboard shows real earnings alongside game progress

### Knowledge Transfer
- Each vulnerability monster has a **"Learn"** button
- Clicking it opens the real-world documentation on detecting/exploiting that vuln
- Boss kills unlock detailed CVE analysis writeups

### Dual Progression
- Real bounty earnings → can mint as in-game trophies
- In-game skill → translates to real hunting knowledge
- Weapon names map to actual tools with real command-line usage

---

## 9. Technical Architecture (Browser-Based)

### Stack
- **3D Engine:** React Three Fiber + Three.js + Rapier physics
- **State:** Zustand + Supabase (off-chain game state)
- **Wallet:** Wagmi + Viem (wallet connection, transactions)
- **Smart Contract:** Solidity (BRX token, staking, marketplace)
- **Backend:** Supabase (auth, game state, leaderboards)

### Phased Development

#### Phase 1 — Hub Demo (Now)
- 3D command center environment
- Hero character with basic movement
- Wallet connection UI
- 3-4 monster types that spawn and fight
- Basic weapon system

#### Phase 2 — Full Game
- All zones and monsters
- Boss fights with mechanics
- Character progression and loot
- BRX token smart contract deployment

#### Phase 3 — Bounty Bridge
- Real-world bounty submission integration
- Leaderboard
- Marketplace

---

## 10. Visual Style

- **Aesthetic:** Cyberpunk meets matrix — neon greens, cyber blues, void blacks
- **UI:** Holographic panels, glitch effects, scan lines
- **Monsters:** Glitchy, data-corrupted forms — think Tron meets horror
- **Bosses:** Massive, CVE-number branded, particle effects
- **Hub:** Warm neon glow — safe haven feeling
- **Combat:** Satisfying particle bursts on hit, screen shake on crit

---

*"Hunt smarter. Reap faster. Dominate the wild."*
