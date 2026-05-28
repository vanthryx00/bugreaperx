import { contextBridge, ipcRenderer } from 'electron'

const api = {
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  checkTool: (toolName: string) => ipcRenderer.invoke('check-tool', toolName),
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
  makeHttpRequest: (options: { method: string; url: string; headers: string; body: string }) =>
    ipcRenderer.invoke('make-http-request', options),
  writeAutosave: (filePath: string, content: string) => ipcRenderer.invoke('write-autosave', filePath, content),
  readFile: (filePath: string) => ipcRenderer.invoke('read-file', filePath),
}

contextBridge.exposeInMainWorld('electronAPI', api)
