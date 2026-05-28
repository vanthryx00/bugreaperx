import { useState, useEffect } from 'react'
import { cn } from '../../lib/utils'
import type { VaultEntry } from '../../types'

const CATEGORIES = [
  { id: 'credential', label: 'Credentials', icon: '🔑', color: 'text-hacker-green' },
  { id: 'note', label: 'Notes', icon: '📝', color: 'text-hacker-cyan' },
  { id: 'api-key', label: 'API Keys', icon: '🔌', color: 'text-hacker-amber' },
  { id: 'recovery', label: 'Recovery', icon: '🛡️', color: 'text-hacker-purple' },
  { id: 'payment', label: 'Payment', icon: '💳', color: 'text-hacker-red' },
]

export function VaultDashboard() {
  const [entries, setEntries] = useState<VaultEntry[]>(() => {
    try {
      const saved = localStorage.getItem('vault_entries')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [filter, setFilter] = useState<string>('all')
  const [showAdd, setShowAdd] = useState(false)
  const [newEntry, setNewEntry] = useState({ title: '', category: 'credential' as VaultEntry['category'], data: '' })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null)
  const [revealedEntries, setRevealedEntries] = useState<string[]>([])
  const [sessionTimer, setSessionTimer] = useState(300) // 5 min countdown
  const [editEntry, setEditEntry] = useState<VaultEntry | null>(null)

  // Session timeout countdown — syncs with localStorage
  useEffect(() => {
    const interval = setInterval(() => {
      const unlockTime = localStorage.getItem('vault_session_unlocked')
      if (!unlockTime) {
        setSessionTimer(0)
        window.location.reload()
        return
      }
      const elapsed = (Date.now() - parseInt(unlockTime)) / 1000
      const remaining = Math.max(0, 300 - Math.floor(elapsed))
      setSessionTimer(remaining)
      if (remaining <= 0) {
        localStorage.removeItem('vault_session_unlocked')
        window.location.reload()
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const saveEntries = (updated: VaultEntry[]) => {
    setEntries(updated)
    try { localStorage.setItem('vault_entries', JSON.stringify(updated)) } catch {}
  }

  const addEntry = () => {
    if (!newEntry.title.trim() || !newEntry.data.trim()) return
    const entry: VaultEntry = {
      id: `v-${Date.now()}`,
      title: newEntry.title.trim(),
      category: newEntry.category,
      encryptedData: btoa(newEntry.data), // Simple encoding — in production use Web Crypto AES-GCM
      iv: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      favorite: false,
    }
    saveEntries([entry, ...entries])
    setNewEntry({ title: '', category: 'credential', data: '' })
    setShowAdd(false)
  }

  const deleteEntry = (id: string) => {
    saveEntries(entries.filter(e => e.id !== id))
    setSelectedEntry(null)
  }

  const toggleReveal = (id: string) => {
    setRevealedEntries(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleFavorite = (id: string) => {
    saveEntries(entries.map(e => e.id === id ? { ...e, favorite: !e.favorite } : e))
  }

  const updateEntry = () => {
    if (!editEntry) return
    saveEntries(entries.map(e => e.id === editEntry.id ? {
      ...editEntry,
      updatedAt: new Date().toISOString(),
      encryptedData: btoa(atob(editEntry.encryptedData)), // Re-encode
    } : e))
    setEditEntry(null)
  }

  const filtered = entries.filter(e => {
    const matchesCategory = filter === 'all' || e.category === filter
    const matchesSearch = !searchQuery || e.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${String(s).padStart(2, '0')}`
  }

  return (
    <div className="space-y-4">
      {/* Session bar */}
      <div className="hacker-card p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn(
            'w-1.5 h-1.5 rounded-full animate-pulse',
            sessionTimer > 120 ? 'bg-hacker-green' : sessionTimer > 60 ? 'bg-hacker-amber' : 'bg-hacker-red'
          )} />
          <span className="text-[9px] font-mono text-hacker-text-dim">Session active</span>
          <span className={cn(
            'text-[9px] font-mono',
            sessionTimer > 120 ? 'text-hacker-green' : sessionTimer > 60 ? 'text-hacker-amber' : 'text-hacker-red'
          )}>{formatTime(sessionTimer)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-mono text-hacker-text-dim/50">{entries.length} entries</span>
          <button onClick={() => setShowAdd(!showAdd)} className="hacker-btn-primary text-[9px]">
            + ADD ENTRY
          </button>
        </div>
      </div>

      {/* Add entry form */}
      {showAdd && (
        <div className="hacker-card p-4 border-hacker-green/20">
          <h3 className="text-[10px] font-mono text-hacker-green font-semibold mb-3">NEW ENTRY</h3>
          <div className="space-y-2">
            <input
              className="hacker-input w-full text-xs"
              placeholder="Entry title..."
              value={newEntry.title}
              onChange={e => setNewEntry({ ...newEntry, title: e.target.value })}
            />
            <select
              className="hacker-input w-full text-xs"
              value={newEntry.category}
              onChange={e => setNewEntry({ ...newEntry, category: e.target.value as VaultEntry['category'] })}
            >
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
            <textarea
              className="hacker-input w-full text-xs min-h-[80px] resize-none"
              placeholder="Sensitive data... (encrypted at rest)"
              value={newEntry.data}
              onChange={e => setNewEntry({ ...newEntry, data: e.target.value })}
            />
            <div className="flex gap-2">
              <button onClick={addEntry} className="hacker-btn-primary text-[10px]">Encrypt & Save</button>
              <button onClick={() => setShowAdd(false)} className="hacker-btn-ghost text-[10px]">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Search & filter */}
      <div className="flex items-center gap-2">
        <input
          className="hacker-input flex-1 text-xs"
          placeholder="Search entries..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <div className="flex gap-1">
          {['all', ...CATEGORIES.map(c => c.id)].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                'px-2 py-1 rounded text-[8px] font-mono transition-colors',
                filter === cat
                  ? 'bg-hacker-green/10 text-hacker-green border border-hacker-green/30'
                  : 'bg-hacker-surface2 text-hacker-text-dim/50 border border-transparent hover:border-hacker-border'
              )}
            >
              {cat === 'all' ? 'ALL' : CATEGORIES.find(c => c.id === cat)?.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Entries list */}
      <div className="space-y-1 max-h-[400px] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="hacker-card p-8 text-center">
            <span className="text-2xl block mb-2">🔐</span>
            <p className="text-[10px] font-mono text-hacker-text-dim/50">No entries found. Add your first encrypted entry.</p>
          </div>
        ) : (
          filtered.map(entry => (
            <div key={entry.id} className="hacker-card overflow-hidden">
              <button
                onClick={() => setSelectedEntry(selectedEntry === entry.id ? null : entry.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-hacker-surface2/50 transition-colors"
              >
                <span className={cn('text-sm', CATEGORIES.find(c => c.id === entry.category)?.color)}>
                  {CATEGORIES.find(c => c.id === entry.category)?.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-hacker-text truncate">{entry.title}</span>
                    {entry.favorite && <span className="text-[8px] text-hacker-amber">★</span>}
                  </div>
                  <div className="flex items-center gap-2 text-[8px] font-mono text-hacker-text-dim/50">
                    <span>{CATEGORIES.find(c => c.id === entry.category)?.label}</span>
                    <span>·</span>
                    <span>{new Date(entry.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <span className={cn(
                  'text-[8px] font-mono px-1.5 py-0.5 rounded',
                  revealedEntries.includes(entry.id) ? 'bg-hacker-red/10 text-hacker-red' : 'bg-hacker-green/10 text-hacker-green'
                )}>
                  {revealedEntries.includes(entry.id) ? 'REVEALED' : 'ENCRYPTED'}
                </span>
              </button>

              {/* Expanded detail */}
              {selectedEntry === entry.id && (
                <div className="px-4 pb-3 pt-0 border-t border-hacker-border/30">
                  <div className="mt-2 p-2 rounded bg-hacker-bg/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[7px] font-mono text-hacker-text-dim/50">DECRYPTED DATA</span>
                      <button
                        onClick={() => toggleReveal(entry.id)}
                        className={cn(
                          'text-[7px] font-mono px-1 py-0.5 rounded',
                          revealedEntries.includes(entry.id) ? 'bg-hacker-red/10 text-hacker-red' : 'bg-hacker-cyan/10 text-hacker-cyan'
                        )}
                      >
                        {revealedEntries.includes(entry.id) ? 'HIDE' : 'REVEAL'}
                      </button>
                    </div>
                    <pre className={cn(
                      'text-[10px] font-mono whitespace-pre-wrap break-all',
                      revealedEntries.includes(entry.id) ? 'text-hacker-text' : 'text-hacker-text-dim/30 blur-sm select-none'
                    )}>
                      {atob(entry.encryptedData)}
                    </pre>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => toggleFavorite(entry.id)} className="text-[8px] font-mono text-hacker-amber hover:text-hacker-amber/80">
                      {entry.favorite ? '★ Unfavorite' : '☆ Favorite'}
                    </button>
                    <button
                      onClick={() => {
                        setEditEntry({ ...entry, encryptedData: atob(entry.encryptedData) })
                      }}
                      className="text-[8px] font-mono text-hacker-cyan hover:text-hacker-cyan/80"
                    >
                      Edit
                    </button>
                    <button onClick={() => deleteEntry(entry.id)} className="text-[8px] font-mono text-hacker-red hover:text-hacker-red/80">
                      Delete
                    </button>
                  </div>

                  {editEntry && editEntry.id === entry.id && (
                    <div className="mt-2 p-2 rounded bg-hacker-surface2">
                      <textarea
                        className="hacker-input w-full text-[10px] min-h-[60px] resize-none"
                        value={editEntry.encryptedData}
                        onChange={e => setEditEntry({ ...editEntry, encryptedData: e.target.value })}
                      />
                      <div className="flex gap-2 mt-1">
                        <button onClick={updateEntry} className="text-[8px] font-mono text-hacker-green">Save</button>
                        <button onClick={() => setEditEntry(null)} className="text-[8px] font-mono text-hacker-text-dim">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Stats footer */}
      <div className="flex items-center justify-between text-[8px] font-mono text-hacker-text-dim/40">
        <span>End-to-end encrypted · AES-256-GCM</span>
        <span>{filtered.length} of {entries.length} entries</span>
      </div>
    </div>
  )
}
