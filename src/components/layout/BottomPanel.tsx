import { useState, useEffect, useRef } from 'react'
import { LogEntry } from '../../types'
import { cn } from '../../lib/utils'

const mockLogs: LogEntry[] = [
  { timestamp: new Date().toISOString(), level: 'info', message: 'BugReaper X v4.0 initialized', source: 'system' },
  { timestamp: new Date().toISOString(), level: 'info', message: 'Hunter module loaded — 12 active targets', source: 'hunter' },
  { timestamp: new Date().toISOString(), level: 'success', message: 'Arsenal Core online — 275 weapons armed', source: 'arsenal' },
  { timestamp: new Date().toISOString(), level: 'warn', message: 'Ollama not detected — AI features limited', source: 'mcp' },
  { timestamp: new Date().toISOString(), level: 'info', message: 'Sentry watching for new scope changes...', source: 'sentry' },
]

interface BottomPanelProps {
  visible: boolean
  onToggle: () => void
}

export function BottomPanel({ visible, onToggle }: BottomPanelProps) {
  const [activeTab, setActiveTab] = useState<'logs' | 'terminal'>('logs')
  const logsEndRef = useRef<HTMLDivElement>(null)
  const [logs] = useState<LogEntry[]>(mockLogs)

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  const levelColors: Record<string, string> = {
    info: 'text-hacker-cyan',
    warn: 'text-hacker-amber',
    error: 'text-hacker-red',
    success: 'text-hacker-green',
  }

  return (
    <div className={cn(
      'border-t border-hacker-border bg-hacker-surface transition-all duration-200 flex-shrink-0',
      visible ? 'h-48' : 'h-8'
    )}>
      {/* Panel Header */}
      <div className="h-8 flex items-center px-4 border-b border-hacker-border">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('logs')}
            className={cn(
              'px-3 py-1 text-xs font-mono transition-colors rounded',
              activeTab === 'logs' ? 'text-hacker-green bg-hacker-green/10' : 'text-hacker-text-dim hover:text-hacker-text'
            )}
          >
            ▸ logs
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={cn(
              'px-3 py-1 text-xs font-mono transition-colors rounded',
              activeTab === 'terminal' ? 'text-hacker-green bg-hacker-green/10' : 'text-hacker-text-dim hover:text-hacker-text'
            )}
          >
            ▸ terminal
          </button>
        </div>
        <div className="flex-1" />
        <button
          onClick={onToggle}
          className="text-hacker-text-dim hover:text-hacker-text text-xs font-mono px-2 py-0.5"
        >
          {visible ? '▼' : '▲'}
        </button>
      </div>

      {/* Panel Content */}
      {visible && (
        <div className="h-[calc(100%-2rem)] overflow-y-auto font-mono text-xs">
          {activeTab === 'logs' && (
            <div className="p-2 space-y-0.5">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2 hover:bg-hacker-surface2 px-2 py-0.5 rounded">
                  <span className="text-hacker-text-dim/50 w-20 flex-shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false })}
                  </span>
                  <span className={cn('w-16 flex-shrink-0', levelColors[log.level])}>
                    [{log.source}]
                  </span>
                  <span className="text-hacker-text">{log.message}</span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          )}
          {activeTab === 'terminal' && (
            <div className="p-3 text-hacker-text-dim">
              <span className="text-hacker-green">bugreaper@windows</span>
              <span className="text-hacker-text-dim">:~$ </span>
              <span className="animate-blink text-hacker-text">_</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
