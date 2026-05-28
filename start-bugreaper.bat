@echo off
title BugReaper X v4.0
cd /d "%~dp0"

:: ── Color setup ──────────────────────────────────────────
set "GREEN=[92m"
set "CYAN=[96m"
set "AMBER=[93m"
set "RED=[91m"
set "BOLD=[1m"
set "RESET=[0m"

cls
echo.
echo %GREEN%╔═══════════════════════════════════════════════════════════════╗%RESET%
echo %GREEN%║                                                               ║%RESET%
echo %GREEN%║   %CYAN%██████╗ ██╗   ██╗ ██████╗ ██████╗ ███████╗ █████╗ ██████╗ %GREEN%║%RESET%
echo %GREEN%║   %CYAN%██╔══██╗██║   ██║██╔════╝ ██╔══██╗██╔════╝██╔══██╗██╔══██╗%GREEN%║%RESET%
echo %GREEN%║   %CYAN%██████╔╝██║   ██║██║  ███╗██████╔╝█████╗  ███████║██████╔╝%GREEN%║%RESET%
echo %GREEN%║   %CYAN%██╔══██╗██║   ██║██║   ██║██╔══██╗██╔══╝  ██╔══██║██╔══██╗%GREEN%║%RESET%
echo %GREEN%║   %CYAN%██████╔╝╚██████╔╝╚██████╔╝██║  ██║███████╗██║  ██║██║  ██║%GREEN%║%RESET%
echo %GREEN%║   %CYAN%╚═════╝  ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝%GREEN%║%RESET%
echo %GREEN%║                                                               ║%RESET%
echo %GREEN%║   %BOLD%X v4.0 — Sovereign Windows Suite%RESET%                        %GREEN%║%RESET%
echo %GREEN%╚═══════════════════════════════════════════════════════════════╝%RESET%
echo.

:: ── Check Node.js ───────────────────────────────────────
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo %RED%[✗] Node.js not found!%RESET%
    echo %AMBER%    Install from: https://nodejs.org%RESET%
    echo %AMBER%    Or run: winget install OpenJS.NodeJS.LTS%RESET%
    echo.
    pause
    exit /b 1
)

for /f "tokens=1-3 delims=." %%a in ('node -v') do set NODE_VER=%%a.%%b.%%c
echo %GREEN%[✓] Node.js %NODE_VER:~1%%RESET%

:: ── Check node_modules ──────────────────────────────────
if not exist "node_modules\" (
    echo %AMBER%[!] Dependencies not installed. Running npm install...%RESET%
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo %RED%[✗] npm install failed. Try running it manually.%RESET%
        pause
        exit /b 1
    )
    echo %GREEN%[✓] Dependencies installed%RESET%
) else (
    echo %GREEN%[✓] Dependencies ready%RESET%
)

:: ── Check dist ──────────────────────────────────────────
if not exist "dist\index.html" (
    echo %AMBER%[!] Build not found. Building...%RESET%
    echo.
    call npm run build
    if %ERRORLEVEL% NEQ 0 (
        echo %RED%[✗] Build failed. Check for errors above.%RESET%
        pause
        exit /b 1
    )
    echo %GREEN%[✓] Build complete%RESET%
) else (
    echo %GREEN%[✓] Build ready%RESET%
)

:: ── Check dist-electron ─────────────────────────────────
if not exist "dist-electron\main.js" (
    echo %AMBER%[!] Electron files not found. Rebuilding...%RESET%
    echo.
    call npm run build
    if %ERRORLEVEL% NEQ 0 (
        echo %RED%[✗] Electron build failed.%RESET%
        pause
        exit /b 1
    )
    echo %GREEN%[✓] Electron build ready%RESET%
)

echo.
echo %CYAN%─────────────────────────────────────────────────────────────%RESET%
echo %CYAN%  Launching BugReaper X...%RESET%
echo %CYAN%─────────────────────────────────────────────────────────────%RESET%
echo.
echo %AMBER%  Close this window to quit the app.%RESET%
echo.

:: ── Launch Electron ─────────────────────────────────────
npx electron .

:: ── After exit ──────────────────────────────────────────
echo.
echo %GREEN%[✓] BugReaper X closed.%RESET%
echo.
pause
