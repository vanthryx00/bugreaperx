const { app, BrowserWindow } = require('electron');
const path = require('path');

function initializeSovereignShell() {
  const displayWindow = new BrowserWindow({
    width: 1550,
    height: 980,
    autoHideMenuBar: true,
    title: "REAPER — BugReaper X v4.0",
    backgroundColor: '#0a0a0a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  displayWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  initializeSovereignShell();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) initializeSovereignShell(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
