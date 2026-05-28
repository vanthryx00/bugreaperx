import { useState, useMemo } from 'react'
import { cn } from '../../lib/utils'
import type { WalletEntry } from '../../types'

const DEMO_ENTRIES: WalletEntry[] = [
  { id: 'w1', programName: 'Example Corp', platform: 'hackerone', amount: 2500, currency: 'USD', type: 'paid', findingTitle: 'SQL Injection in login endpoint', severity: 'critical', date: '2026-05-27', notes: 'Auth bypass via parameterized injection' },
  { id: 'w2', programName: 'Testify API', platform: 'bugcrowd', amount: 1500, currency: 'USD', type: 'pending', findingTitle: 'IDOR in payment status', severity: 'high', date: '2026-05-26', notes: 'Awaiting triage' },
  { id: 'w3', programName: 'CloudSync Inc', platform: 'intigriti', amount: 800, currency: 'USD', type: 'earned', findingTitle: 'XSS in file upload', severity: 'medium', date: '2026-05-25', notes: 'CSRF + XSS chain' },
  { id: 'w4', programName: 'Example Corp', platform: 'hackerone', amount: 500, currency: 'USD', type: 'paid', findingTitle: 'Open redirect on logout', severity: 'low', date: '2026-05-24', notes: 'Redirect via dest param' },
  { id: 'w5', programName: 'BetaApp', platform: 'self-managed', amount: 3000, currency: 'USD', type: 'earned', findingTitle: 'RCE in file parser', severity: 'critical', date: '2026-05-22', notes: 'Direct engagement' },
]

export function WalletLedger() {
  const [entries] = useState(DEMO_ENTRIES)
  const [filter, setFilter] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date')

  const stats = useMemo(() => {
    const totalEarned = entries.filter(e => e.type === 'paid' || e.type === 'earned').reduce((s, e) => s + e.amount, 0)
    const totalPending = entries.filter(e => e.type === 'pending').reduce((s, e) => s + e.amount, 0)
    const byPlatform = {} as Record<string, { count: number; total: number }>
    entries.forEach(e => {
      if (!byPlatform[e.platform]) byPlatform[e.platform] = { count: 0, total: 0 }
      byPlatform[e.platform].count++
      if (e.type !== 'pending') byPlatform[e.platform].total += e.amount
    })
    return { totalEarned, totalPending, byPlatform, count: entries.length }
  }, [entries])

  const filtered = useMemo(() => {
    let result = filter ? entries.filter(e => e.type === filter) : [...entries]
    result.sort((a, b) => sortBy === 'date'
      ? new Date(b.date).getTime() - new Date(a.date).getTime()
      : b.amount - a.amount)
    return result
  }, [entries, filter, sortBy])

  const typeColors: Record<string, string> = {
    paid: 'text-hacker-green bg-hacker-green/10',
    pending: 'text-hacker-amber bg-hacker-amber/10',
    earned: 'text-hacker-cyan bg-hacker-cyan/10',
  }

  const platformColors: Record<string, string> = {
    hackerone: 'text-hacker-green',
    bugcrowd: 'text-hacker-amber',
    intigriti: 'text-hacker-cyan',
    'self-managed': 'text-hacker-purple',
  }

  return (
    <div className="hacker-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold text-hacker-amber font-mono">◈ LEDGER</h3>
          <span className="text-[9px] font-mono text-hacker-text-dim/50">{entries.length} entries</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-hacker-text-dim/70">Sort:</span>
          <button onClick={() => setSortBy(sortBy === 'date' ? 'amount' : 'date')}
            className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-hacker-surface2 text-hacker-text-dim hover:text-hacker-text">
            {sortBy}
          </button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="px-2 py-1.5 rounded bg-hacker-bg/50">
          <p className="text-[8px] font-mono text-hacker-text-dim">Earned</p>
          <p className="text-sm font-bold font-mono text-hacker-green">${stats.totalEarned.toLocaleString()}</p>
        </div>
        <div className="px-2 py-1.5 rounded bg-hacker-bg/50">
          <p className="text-[8px] font-mono text-hacker-text-dim">Pending</p>
          <p className="text-sm font-bold font-mono text-hacker-amber">${stats.totalPending.toLocaleString()}</p>
        </div>
        <div className="px-2 py-1.5 rounded bg-hacker-bg/50">
          <p className="text-[8px] font-mono text-hacker-text-dim">Platforms</p>
          <p className="text-sm font-bold font-mono text-hacker-text">{Object.keys(stats.byPlatform).length}</p>
        </div>
        <div className="px-2 py-1.5 rounded bg-hacker-bg/50">
          <p className="text-[8px] font-mono text-hacker-text-dim">Total</p>
          <p className="text-sm font-bold font-mono text-hacker-cyan">${(stats.totalEarned + stats.totalPending).toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-1 mb-3">
        {['paid', 'pending', 'earned'].map(t => (
          <button key={t} onClick={() => setFilter(filter === t ? null : t)}
            className={cn('text-[8px] font-mono px-1.5 py-0.5 rounded border transition-colors',
              filter === t ? typeColors[t] + ' border-current' : 'bg-hacker-surface2 text-hacker-text-dim border-hacker-border hover:text-hacker-text'
            )}>
            {t}
          </button>
        ))}
        {filter && <button onClick={() => setFilter(null)} className="text-[8px] font-mono px-1.5 py-0.5 text-hacker-red/70">✕</button>}
      </div>

      {/* Entries */}
      <div className="space-y-1 max-h-80 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-6 text-[10px] font-mono text-hacker-text-dim/50">No entries</div>
        ) : filtered.map(entry => (
          <div key={entry.id} className="flex items-center gap-3 px-2 py-1.5 rounded bg-hacker-bg/50 hover:bg-hacker-surface2 transition-colors group">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-hacker-text truncate">{entry.findingTitle}</span>
                <span className={cn('text-[8px] font-mono px-1 py-0.5 rounded', typeColors[entry.type])}>{entry.type}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={cn('text-[9px] font-mono', platformColors[entry.platform])}>{entry.programName}</span>
                <span className="text-[8px] font-mono text-hacker-text-dim/50">{entry.date}</span>
              </div>
            </div>
            <span className="text-xs font-bold font-mono text-hacker-amber flex-shrink-0">${entry.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Export */}
      <div className="mt-3 pt-3 border-t border-hacker-border">
        <button className="hacker-btn-ghost text-[10px]">
          Export CSV
        </button>
      </div>
    </div>
  )
}
