import { useState } from 'react'
import { cn } from '../../lib/utils'
import type { SessionActivity } from '../../types'

const mockSessions: SessionActivity[] = [
  { id: 's1', user: 'admin', action: 'AI prompt submitted', resource: 'JARVIS Assistant', status: 'allowed', timestamp: new Date().toISOString() },
  { id: 's2', user: 'admin', action: 'Generated Nuclei template', resource: 'Arsenal Core', status: 'allowed', timestamp: new Date(Date.now() - 15000).toISOString() },
  { id: 's3', user: 'admin', action: 'Blocked: exploit code request', resource: 'Code Guard', status: 'blocked', timestamp: new Date(Date.now() - 45000).toISOString() },
  { id: 's4', user: 'admin', action: 'SQLMap execution on target', resource: 'Hunt Module', status: 'allowed', timestamp: new Date(Date.now() - 90000).toISOString() },
  { id: 's5', user: 'admin', action: 'Flagged: outbound PII attempt', resource: 'Privacy Shield', status: 'flagged', timestamp: new Date(Date.now() - 300000).toISOString() },
  { id: 's6', user: 'admin', action: 'Report export initiated', resource: 'Pipeline', status: 'allowed', timestamp: new Date(Date.now() - 600000).toISOString() },
]

const statusConfig = {
  allowed: { dot: 'bg-hacker-green', label: 'Allowed', text: 'text-hacker-green' },
  blocked: { dot: 'bg-hacker-red', label: 'Blocked', text: 'text-hacker-red' },
  flagged: { dot: 'bg-hacker-amber', label: 'Flagged', text: 'text-hacker-amber' },
}

export function SessionMonitor() {
  const [sessions] = useState(mockSessions)
  const blockedCount = sessions.filter(s => s.status === 'blocked').length
  const flaggedCount = sessions.filter(s => s.status === 'flagged').length

  return (
    <div className="hacker-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-hacker-amber text-lg">◎</span>
          <h3 className="text-xs font-semibold text-hacker-text font-mono">SESSION MONITOR</h3>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="text-hacker-red">{blockedCount} blocked</span>
          <span className="text-hacker-text-dim">·</span>
          <span className="text-hacker-amber">{flaggedCount} flagged</span>
        </div>
      </div>

      {/* Activity feed */}
      <div className="space-y-1 max-h-56 overflow-y-auto">
        {sessions.map((s) => {
          const config = statusConfig[s.status]
          return (
            <div key={s.id} className="flex items-center gap-2 px-2 py-1.5 rounded bg-hacker-bg/30 hover:bg-hacker-bg/50 transition-colors">
              <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', config.dot)} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-hacker-text truncate">{s.action}</span>
                  <span className={cn('text-[8px] font-mono flex-shrink-0', config.text)}>{config.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-mono text-hacker-text-dim/50">{s.resource}</span>
                  <span className="text-[8px] font-mono text-hacker-text-dim/30">{s.user}</span>
                </div>
              </div>
              <span className="text-[8px] font-mono text-hacker-text-dim/30 flex-shrink-0">
                {new Date(s.timestamp).toLocaleTimeString('en-US', { hour12: false })}
              </span>
            </div>
          )
        })}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-hacker-border/50">
        <div className="text-center">
          <p className="text-[18px] font-bold font-mono text-hacker-green">{sessions.length}</p>
          <p className="text-[8px] font-mono text-hacker-text-dim/60">Total Actions</p>
        </div>
        <div className="text-center">
          <p className="text-[18px] font-bold font-mono text-hacker-red">{blockedCount}</p>
          <p className="text-[8px] font-mono text-hacker-text-dim/60">Blocked</p>
        </div>
        <div className="text-center">
          <p className="text-[18px] font-bold font-mono text-hacker-amber">{flaggedCount}</p>
          <p className="text-[8px] font-mono text-hacker-text-dim/60">Flagged</p>
        </div>
      </div>
    </div>
  )
}
