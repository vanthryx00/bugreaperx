import { app, BrowserWindow, ipcMain, shell } from 'electron'
import path from 'path'

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: '#0a0a0a',
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#0a0a0a',
      symbolColor: '#00ff41',
      height: 36,
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

ipcMain.handle('minimize-window', () => mainWindow?.minimize())
ipcMain.handle('maximize-window', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
})
ipcMain.handle('close-window', () => mainWindow?.close())

// IPC Handlers
ipcMain.handle('get-system-info', async () => {
  return {
    platform: process.platform,
    arch: process.arch,
    electronVersion: process.versions.electron,
    nodeVersion: process.versions.node,
    chromeVersion: process.versions.chrome,
  }
})

ipcMain.handle('check-tool', async (_event, toolName: string) => {
  try {
    const { execSync } = require('child_process')
    execSync(`where ${toolName}`, { timeout: 3000 })
    return { installed: true }
  } catch {
    return { installed: false }
  }
})

ipcMain.handle('open-external', async (_event, url: string) => {
  shell.openExternal(url)
})

ipcMain.handle('make-http-request', async (_event, options: {
  method: string
  url: string
  headers: string
  body: string
}) => {
  const http = require('http')
  const https = require('https')

  const urlObj = new URL(options.url)
  const isHttps = urlObj.protocol === 'https:'
  const lib = isHttps ? https : http

  return new Promise((resolve) => {
    const headers: Record<string, string> = {}
    options.headers.split('\n').forEach(line => {
      const idx = line.indexOf(':')
      if (idx > 0) {
        headers[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
      }
    })

    const req = lib.request(urlObj, {
      method: options.method || 'GET',
      headers,
      timeout: 10000,
    }, (res: any) => {
      let data = ''
      res.on('data', (chunk: string) => data += chunk)
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          statusText: res.statusMessage,
          headers: JSON.stringify(res.headers, null, 2),
          body: data.slice(0, 50000), // limit to 50KB
        })
      })
    })

    req.on('error', (err: Error) => {
      resolve({ status: 0, statusText: err.message, headers: '', body: '' })
    })

    req.on('timeout', () => {
      req.destroy()
      resolve({ status: 0, statusText: 'Request timed out', headers: '', body: '' })
    })

    if (options.body) {
      req.write(options.body)
    }
    req.end()
  })
})

ipcMain.handle('write-autosave', async (_event, filePath: string, content: string) => {
  const fs = require('fs')
  const dir = require('path').dirname(filePath)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(filePath, content, 'utf-8')
  return true
})

ipcMain.handle('read-file', async (_event, filePath: string) => {
  const fs = require('fs')
  try {
    return fs.readFileSync(filePath, 'utf-8')
  } catch {
    return null
  }
})

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
