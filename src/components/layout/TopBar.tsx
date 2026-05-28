import { useState, useEffect } from 'react'
import { systemStatusItems } from '../../data/navigation'

declare const window: Window & {
  electronAPI?: {
    minimizeWindow: () => Promise<void>
    maximizeWindow: () => Promise<void>
    closeWindow: () => Promise<void>
    getSystemInfo: () => Promise<any>
  }
}

export function TopBar() {
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false }))

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false }))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="h-10 bg-hacker-surface border-b border-hacker-border flex items-center px-3 gap-3 flex-shrink-0">
      {/* App icon + breadcrumb (drag region) */}
      <div className="flex items-center gap-2 flex-1 drag-handle min-w-0">
        <div className="w-5 h-5 rounded bg-hacker-green/20 flex items-center justify-center text-[10px] text-hacker-green font-bold flex-shrink-0">
          R
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-hacker-text-dim">
          <span className="text-hacker-green">~</span>
          <span className="text-hacker-text-dim/50">/</span>
          <span className="text-hacker-text">bugreaper</span>
          <span className="text-hacker-text-dim/50">/</span>
          <span className="text-hacker-text-dim/70">{time}</span>
        </div>
      </div>

      {/* System Status HUD */}
      <div className="flex items-center gap-2 flex-shrink-0" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        {systemStatusItems.map((item) => (
          <div key={item.id} className="flex items-center gap-1.5 group cursor-default">
            <span className={`status-dot-${item.status} group-hover:scale-125 transition-transform`} />
            <span className="text-[10px] font-mono text-hacker-text-dim group-hover:text-hacker-text transition-colors hidden sm:inline">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Spacer + Time */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-hacker-text-dim pl-3 border-l border-hacker-border">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-hacker-green/70 animate-pulse" />
          <span className="tabular-nums">{time}</span>
        </div>

        {/* Window controls */}
        <div className="flex items-center ml-2 -mr-2" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
          <button
            onClick={() => window.electronAPI?.minimizeWindow()}
            className="px-2 py-1.5 text-hacker-text-dim/40 hover:text-hacker-text hover:bg-hacker-surface2 transition-colors rounded"
            title="Minimize"
          >
            <svg width="10" height="10" viewBox="0 0 10 10"><rect x="1" y="4.5" width="8" height="1" fill="currentColor"/></svg>
          </button>
          <button
            onClick={() => window.electronAPI?.maximizeWindow()}
            className="px-2 py-1.5 text-hacker-text-dim/40 hover:text-hacker-text hover:bg-hacker-surface2 transition-colors rounded"
            title="Maximize"
          >
            <svg width="10" height="10" viewBox="0 0 10 10"><rect x="1.5" y="1.5" width="7" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="1"/></svg>
          </button>
          <button
            onClick={() => window.electronAPI?.closeWindow()}
            className="px-2 py-1.5 text-hacker-text-dim/40 hover:text-hacker-red hover:bg-hacker-red/10 transition-colors rounded"
            title="Close"
          >
            <svg width="10" height="10" viewBox="0 0 10 10"><path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.5"/></svg>
          </button>
        </div>
      </div>
    </header>
  )
}
