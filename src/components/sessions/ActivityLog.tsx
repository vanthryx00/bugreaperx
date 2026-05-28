import { useState } from 'react'
import { cn } from '../../lib/utils'
import type { SessionEntry } from '../../types'

interface ActivityLogProps {
  entries: SessionEntry[]
}

const typeIcons: Record<string, string> = {
  'tool-run': '⚙', 'request': '◉', 'finding': '⚔',
  'screenshot': '◈', 'note': '◻', 'command': '▸', 'file-change': '◎',
}

const typeColors: Record<string, string> = {
  'tool-run': 'text-hacker-cyan',
  'request': 'text-hacker-amber',
  'finding': 'text-hacker-red',
  'screenshot': 'text-hacker-purple',
  'note': 'text-hacker-text-dim',
  'command': 'text-hacker-green',
  'file-change': 'text-hacker-amber',
}

export function ActivityLog({ entries }: ActivityLogProps) {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<string | null>(null)

  const filtered = entries.filter(e => {
    if (filterType && e.type !== filterType) return false
    if (search && !e.summary.toLowerCase().includes(search.toLowerCase()) && !e.source.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="hacker-card p-3">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-[10px] font-semibold text-hacker-green font-mono uppercase tracking-wider">Activity Log</h3>
        <span className="text-[8px] font-mono text-hacker-text-dim/50">{entries.length} events</span>
        <input
          className="hacker-input flex-1 text-[10px] py-1 h-7"
          placeholder="Search log..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-1 mb-2">
        {['tool-run', 'request', 'finding', 'screenshot', 'note', 'command'].map(t => (
          <button
            key={t}
            onClick={() => setFilterType(filterType === t ? null : t)}
            className={cn(
              'text-[8px] font-mono px-1.5 py-0.5 rounded border transition-colors',
              filterType === t
                ? 'bg-hacker-green/10 text-hacker-green border-hacker-green/30'
                : 'bg-hacker-surface2 text-hacker-text-dim border-hacker-border hover:text-hacker-text'
            )}
          >
            {t}
          </button>
        ))}
        {filterType && (
          <button onClick={() => setFilterType(null)} className="text-[8px] font-mono px-1.5 py-0.5 text-hacker-red/70 hover:text-hacker-red">✕ clear</button>
        )}
      </div>
      <div className="h-64 overflow-y-auto space-y-0.5">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-[10px] font-mono text-hacker-text-dim/50">No entries match filter</div>
        ) : filtered.map(entry => (
          <div key={entry.id} className="flex items-start gap-2 px-2 py-1 rounded hover:bg-hacker-surface2 transition-colors group">
            <span className={cn('text-xs flex-shrink-0', typeColors[entry.type])}>{typeIcons[entry.type] || '◉'}</span>
            <span className="text-[8px] font-mono text-hacker-text-dim/50 flex-shrink-0 w-14">{new Date(entry.timestamp).toLocaleTimeString('en-US', { hour12: false })}</span>
            <span className="text-[9px] font-mono text-hacker-text-dim/70 flex-shrink-0">{entry.source}</span>
            <span className="text-[10px] font-mono text-hacker-text flex-1 truncate">{entry.summary}</span>
            <span className="text-[8px] font-mono text-hacker-text-dim/30 opacity-0 group-hover:opacity-100 transition-opacity truncate max-w-[200px]">{entry.details}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
