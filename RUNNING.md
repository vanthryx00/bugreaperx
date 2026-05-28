# 🎯 BugReaper X — Running Guide v4.0

> **Location:** `C:\Users\bugre\bugreaper-desktop`
> **Node.js:** v24.16.0 | **npm:** 11.13.0

---

## 📋 TABLE OF CONTENTS

1. [First-Time Setup](#-first-time-setup)
2. [Run in Browser (Dev Mode)](#-mode-1-run-in-browser-dev-mode)
3. [Run as Desktop App (Electron)](#-mode-2-run-as-desktop-app-electron)
4. [Build a Portable .exe Installer](#-mode-3-build-portable-exe-installer)
5. [Python Tools (Neurohack Sovereign)](#-python-tools-neurohack-sovereign)
6. [Safety Nets & Troubleshooting](#-safety-nets--troubleshooting)
7. [Quick Reference Sheet](#-quick-reference-sheet)

---

## 🚀 FIRST-TIME SETUP

### Step 1: Open Terminal
```
Win + R  →  type "cmd"  →  Enter
```

### Step 2: Go to the Project Folder
```cmd
cd C:\Users\bugre\bugreaper-desktop
```

### Step 3: Install Dependencies
```cmd
npm install
```
⏳ Wait 30–60 seconds. You'll see a progress bar. When it's done, the prompt returns.

**✅ Done.** Setup is complete. No more steps needed.

---

## 🌐 MODE 1: Run in Browser (Dev Mode)

**Best for:** Development, testing changes, quick access.

### Run:
```cmd
npm run dev
```

### What happens:
- A local server starts at **`http://localhost:5173`**
- Your browser opens automatically (if not, open it manually)
- You see the BugReaper X web app

### To stop:
Press **`Ctrl + C`** in the terminal, then type `Y` and Enter.

### Pro tip:
Keep this terminal open in the background. Changes to code auto-reload the page.

---

## 🖥️ MODE 2: Run as Desktop App (Electron)

**Best for:** Full experience with standalone window, menu bar, desktop feel.

### Step 1 — Build the web files:
```cmd
npm run build
```
⏳ ~10 seconds. You'll see `✓ built in Xs` when done.

### Step 2 — Launch the desktop app:
```cmd
npx electron .
```

### What happens:
- A native desktop window opens (1550×980, dark theme)
- Title bar says "REAPER — BugReaper X v4.0"
- The app runs exactly like a downloaded program

### To stop:
Just close the window. Or press **`Ctrl + C`** in the terminal.

---

## 📦 MODE 3: Build Portable .exe Installer

**Best for:** Sharing the app, running on another PC, having a permanent install.

### Run:
```cmd
npm run build:win
```
⏳ ~2–5 minutes. This compiles everything into a single `.exe` file.

### Output:
The portable `.exe` will be in:
```
C:\Users\bugre\bugreaper-desktop\release\
BugReaperX-4.0.0-portable.exe
```

### To use:
Double-click the `.exe` anywhere — no install needed. Carry it on a USB stick.

---

## 🐍 PYTHON TOOLS (Neurohack Sovereign)

The Neurohack Sovereign is a standalone Python learning engine (ADHD→APEX protocol).

### Location:
```
C:\Users\bugre\bugreaper-desktop\neurohack_sovereign.py
```

### Run the demo:
```cmd
cd C:\Users\bugre\bugreaper-desktop
python neurohack_sovereign.py
```
> ⚠️ If you see garbled characters (boxes/squiggles), run with:
> ```cmd
> PYTHONIOENCODING=utf-8 python neurohack_sovereign.py
> ```

### Use as a module (from Python):
```python
from neurohack_sovereign import NeurohackEngine, LEARNING_PROTOCOLS

engine = NeurohackEngine()
sprint = engine.start_sprint('Learn Rust async', deadline_hours=4)
print(engine.next_action())
```

---

## 🛡️ SAFETY NETS & TROUBLESHOOTING

### 🔥 Problem: `npm install` fails
**Fix:** Clear the cache and retry:
```cmd
cd C:\Users\bugre\bugreaper-desktop
rmdir /s node_modules
npm cache clean --force
npm install
```

### 🔥 Problem: `npm run dev` gives EADDRINUSE (port taken)
**Fix:** Port 5173 is busy. Kill whatever is using it:
```cmd
netstat -ano | findstr :5173
taskkill /PID <NUMBER> /F
```
Then run `npm run dev` again.

### 🔥 Problem: `npm run build` has TypeScript errors
**Fix:** Check which files have errors:
```cmd
npx tsc --noEmit
```
Fix the reported errors, then build again.

### 🔥 Problem: `npx electron .` opens blank window
**Fix:** Rebuild the web files first:
```cmd
npm run build
npx electron .
```

### 🔥 Problem: `npm run build:win` fails
**Fix:** Make sure the web build works first:
```cmd
npm run build
```
If that passes, try the electron build again.

### 🔥 Problem: `python` not found
**Fix:** Install Python from the Microsoft Store or https://python.org.
Then verify:
```cmd
python --version
```

### 🔥 Problem: `node` or `npm` not found
Run this in PowerShell (Win + X → Terminal):
```powershell
winget install OpenJS.NodeJS.LTS
```
Then restart your terminal.

### 🔥 Problem: "Script execution policy" error (PowerShell)
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### 🔥 Problem: Everything is broken — Nuclear Reset
```cmd
cd C:\Users\bugre\bugreaper-desktop
rmdir /s node_modules
rmdir /s dist
rmdir /s dist-electron
rmdir /s release
npm cache clean --force
npm install
npm run build
npx electron .
```

---

## 📖 QUICK REFERENCE SHEET

| What you want | Command |
|---|---|
| First-time setup | `npm install` |
| Run in browser | `npm run dev` |
| Build web files | `npm run build` |
| Run as desktop app | `npm run build` then `npx electron .` |
| Build .exe installer | `npm run build:win` |
| Check TypeScript errors | `npx tsc --noEmit` |
| Run Python tool | `python neurohack_sovereign.py` |
| Fix all + rebuild | `rmdir /s node_modules` → `npm install` → `npm run build` |
| Stop a running server | `Ctrl + C` in terminal |

---

> **BugReaper X v4.0** — Built for Kairyx Empire. Zero friction. Maximum velocity.
