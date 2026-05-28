/// <reference types="vite/client" />

interface Window {
  electronAPI: {
    getSystemInfo: () => Promise<{
      platform: string
      arch: string
      electronVersion: string
      nodeVersion: string
      chromeVersion: string
    }>
    checkTool: (toolName: string) => Promise<{ installed: boolean }>
    openExternal: (url: string) => Promise<void>
  }
}
