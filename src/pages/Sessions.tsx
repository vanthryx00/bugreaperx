import { useState, useMemo } from 'react'
import { cn } from '../lib/utils'
import { ActivityLog } from '../components/sessions/ActivityLog'
import type { SessionEntry, SessionRecording } from '../types'

const DEMO_RECORDINGS: SessionRecording[] = [
  { id: 'sr1', name: 'bug-bounty-001', target: 'example.com', startTime: '2026-05-28T14:00:00Z', endTime: null, duration: 5400, entries: 142, status: 'active' },
  { id: 'sr2', name: 'pentest-alpha', target: 'api.test.org', startTime: '2026-05-27T09:00:00Z', endTime: '2026-05-27T15:30:00Z', duration: 23400, entries: 389, status: 'completed' },
  { id: 'sr3', name: 'scope-review', target: 'new-client.io', startTime: '2026-05-26T10:00:00Z', endTime: '2026-05-26T10:45:00Z', duration: 2700, entries: 47, status: 'completed' },
]

const DEMO_ENTRIES: SessionEntry[] = Array.from({ length: 30 }, (_, i) => ({
  id: `se${i}`,
  timestamp: new Date(Date.now() - i * 60000).toISOString(),
  type: ['tool-run', 'request', 'finding', 'screenshot', 'note', 'command', 'file-change'][Math.floor(Math.random() * 7)] as SessionEntry['type'],
  source: ['subfinder', 'httpx', 'nuclei', 'gau', 'system', 'user', 'dalfox', 'naabu'][Math.floor(Math.random() * 8)],
  summary: ['Subdomain enumeration', 'HTTP probe completed', 'Vulnerability scan', 'URL discovery', 'Phase completed', 'Screenshot captured', 'Note added', 'Command executed'][Math.floor(Math.random() * 8)],
  details: 'Auto-logged from active session',
}))

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function SessionsPage() {
  const [recordings] = useState(DEMO_RECORDINGS)
  const [entries] = useState(DEMO_ENTRIES)
  const [selectedSession, setSelectedSession] = useState<string | null>(null)

  const totalEntries = entries.length
  const activeSessions = recordings.filter(r => r.status === 'active').length

  const statusColor: Record<string, string> = {
    active: 'bg-hacker-green animate-pulse',
    paused: 'bg-hacker-amber',
    completed: 'bg-hacker-text-dim',
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-hacker-text-bright font-mono tracking-wide">▸ SESSIONS</h1>
        <p className="text-sm text-hacker-text-dim mt-1 font-mono">Session recording · Activity logs · Proxy capture</p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-4">
        <div className="hacker-card p-3">
          <p className="text-[10px] font-mono text-hacker-text-dim">Active Sessions</p>
          <p className="text-lg font-bold font-mono text-hacker-green">{activeSessions}</p>
        </div>
        <div className="hacker-card p-3">
          <p className="text-[10px] font-mono text-hacker-text-dim">Total Sessions</p>
          <p className="text-lg font-bold font-mono text-hacker-cyan">{recordings.length}</p>
        </div>
        <div className="hacker-card p-3">
          <p className="text-[10px] font-mono text-hacker-text-dim">Total Activity</p>
          <p className="text-lg font-bold font-mono text-hacker-amber">{totalEntries} events</p>
        </div>
        <div className="hacker-card p-3">
          <p className="text-[10px] font-mono text-hacker-text-dim">Recording</p>
          <p className="text-lg font-bold font-mono text-hacker-purple">{activeSessions > 0 ? '● LIVE' : 'Idle'}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Sessions list */}
        <div className="hacker-card p-4 col-span-1">
          <h3 className="text-xs font-semibold text-hacker-green font-mono mb-3">◈ RECORDINGS</h3>
          <div className="space-y-2">
            {recordings.map(sr => (
              <button
                key={sr.id}
                onClick={() => setSelectedSession(selectedSession === sr.id ? null : sr.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-2 py-2 rounded transition-colors text-left',
                  selectedSession === sr.id ? 'bg-hacker-green/10 border border-hacker-green/20' : 'bg-hacker-bg/50 hover:bg-hacker-surface2'
                )}
              >
                <span className={cn('w-2 h-2 rounded-full flex-shrink-0', statusColor[sr.status])} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-hacker-text truncate">{sr.name}</p>
                  <p className="text-[9px] font-mono text-hacker-text-dim truncate">{sr.target}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[8px] font-mono text-hacker-text-dim/50">{formatDuration(sr.duration)}</span>
                    <span className="text-[8px] font-mono text-hacker-text-dim/50">{sr.entries} events</span>
                  </div>
                </div>
                {sr.status === 'active' && <span className="text-[8px] font-mono text-hacker-green animate-pulse">●</span>}
              </button>
            ))}
          </div>
          <button className="hacker-btn-primary text-[10px] w-full mt-3">+ New Recording</button>
        </div>

        {/* Activity log */}
        <div className="col-span-2">
          <ActivityLog entries={entries} />
        </div>
      </div>
    </div>
  )
}
