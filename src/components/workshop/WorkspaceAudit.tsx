import { useState, useEffect, useRef } from 'react'
import { cn } from '../../lib/utils'
import type { AuditLogEntry } from '../../types'

const DEMO_AUDIT: AuditLogEntry[] = [
  { id: 'a1', timestamp: new Date().toISOString(), level: 'info', source: 'system', message: 'Workbench initialized', details: 'bug-bounty-001: ready for operations', workbenchId: 'wb1' },
  { id: 'a2', timestamp: new Date(Date.now() - 2000).toISOString(), level: 'success', source: 'subfinder', message: 'Subdomain enumeration complete', details: '142 hosts found for target.example.com', workbenchId: 'wb1' },
  { id: 'a3', timestamp: new Date(Date.now() - 5000).toISOString(), level: 'warning', source: 'httpx', message: 'Rate limit encountered', details: 'Backoff: 5s — retrying in 10s', workbenchId: 'wb1' },
  { id: 'a4', timestamp: new Date(Date.now() - 8000).toISOString(), level: 'info', source: 'dnsx', message: 'DNS enumeration started', details: 'Resolving 1,042 subdomains', workbenchId: 'wb2' },
  { id: 'a5', timestamp: new Date(Date.now() - 12000).toISOString(), level: 'critical', source: 'bridge', message: 'Bridge offline', details: 'Start server.py to stream audit. Retrying in 30s...', workbenchId: null },
]

export function WorkspaceAudit() {
  const [entries, setEntries] = useState<AuditLogEntry[]>(DEMO_AUDIT)
  const [filter, setFilter] = useState<string | null>(null)
  const [autoScroll, setAutoScroll] = useState(true)
  const logEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      const fakeEntries: AuditLogEntry[] = [
        { id: `a${Date.now()}`, timestamp: new Date().toISOString(), level: Math.random() > 0.7 ? 'info' : Math.random() > 0.5 ? 'success' : 'warning', source: ['subfinder', 'httpx', 'nuclei', 'dnsx', 'gau', 'system'][Math.floor(Math.random() * 6)], message: ['Processing queue...', 'Scanning endpoint...', 'Analyzing response...', 'Checking DNS...', 'Probing target...', 'Reporting status...'][Math.floor(Math.random() * 6)], details: 'Auto-generated from active workbenches', workbenchId: 'wb1' },
      ]
      setEntries(prev => [...prev, ...fakeEntries].slice(-200))
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (autoScroll) {
      logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [entries, autoScroll])

  const filteredEntries = filter ? entries.filter(e => e.level === filter) : entries

  const levelColors: Record<string, string> = {
    info: 'text-hacker-cyan',
    success: 'text-hacker-green',
    warning: 'text-hacker-amber',
    error: 'text-hacker-red',
    critical: 'text-hacker-red font-bold',
  }

  const levelBg: Record<string, string> = {
    info: 'bg-hacker-cyan/5',
    success: 'bg-hacker-green/5',
    warning: 'bg-hacker-amber/5',
    error: 'bg-hacker-red/5',
    critical: 'bg-hacker-red/10',
  }

  return (
    <div className="hacker-card p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-[10px] font-semibold text-hacker-amber font-mono uppercase tracking-wider">Audit Trail</h3>
          <span className="text-[8px] font-mono text-hacker-text-dim/50">{entries.length} entries</span>
        </div>
        <div className="flex items-center gap-1">
          {['info', 'success', 'warning', 'error', 'critical'].map(l => (
            <button
              key={l}
              onClick={() => setFilter(filter === l ? null : l)}
              className={cn(
                'text-[8px] font-mono px-1 py-0.5 rounded uppercase',
                filter === l ? levelColors[l] + ' bg-hacker-surface2' : 'text-hacker-text-dim/50 hover:text-hacker-text-dim',
              )}
            >
              {l[0]}
            </button>
          ))}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={cn(
              'text-[8px] font-mono px-1 py-0.5 rounded ml-1',
              autoScroll ? 'text-hacker-green' : 'text-hacker-text-dim/50'
            )}
          >
            {autoScroll ? '◉' : '◯'}
          </button>
        </div>
      </div>
      <div className="h-40 font-mono text-[10px] bg-hacker-bg rounded p-2 overflow-y-auto space-y-0.5">
        {filteredEntries.slice(-100).map(entry => (
          <div key={entry.id} className={cn(
            'flex items-start gap-1.5 px-1 py-0.5 rounded',
            levelBg[entry.level]
          )}>
            <span className="text-hacker-text-dim/40 flex-shrink-0 w-14">
              {new Date(entry.timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <span className={cn('flex-shrink-0 uppercase text-[8px]', levelColors[entry.level])}>
              {entry.level}
            </span>
            <span className="text-hacker-text-dim/60 flex-shrink-0">{entry.source}</span>
            <span className="text-hacker-text truncate">{entry.message}</span>
            <span className="text-hacker-text-dim/40 truncate hidden lg:block">{entry.details}</span>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  )
}
