const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('sovereigntyCore', {
  fetchPlatform: () => process.platform,
  dispatchSignal: (channel, payload) => ipcRenderer.send(channel, payload)
});
