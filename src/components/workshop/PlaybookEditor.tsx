import { useState } from 'react'
import { cn } from '../../lib/utils'
import type { Playbook } from '../../types'

const AVAILABLE_STATIONS = [
  { id: 'subfinder', name: 'subfinder', category: 'recon', description: 'Subdomain discovery' },
  { id: 'httpx', name: 'httpx', category: 'recon', description: 'HTTP probing' },
  { id: 'nuclei', name: 'nuclei', category: 'vuln', description: 'Vulnerability scanning' },
  { id: 'gau', name: 'gau', category: 'recon', description: 'URL discovery' },
  { id: 'dalfox', name: 'dalfox', category: 'vuln', description: 'XSS scanning' },
  { id: 'sqlmap', name: 'sqlmap', category: 'vuln', description: 'SQL injection' },
  { id: 'ffuf', name: 'ffuf', category: 'vuln', description: 'Directory fuzzing' },
  { id: 'trufflehog', name: 'trufflehog', category: 'secrets', description: 'Secret scanning' },
  { id: 'subzy', name: 'subzy', category: 'takeover', description: 'Takeover check' },
  { id: 'naabu', name: 'naabu', category: 'recon', description: 'Port scanning' },
]

const INITIAL_PLAYBOOKS: Playbook[] = [
  { id: 'pb1', name: 'Full Recon Chain', description: 'subfinder → httpx → nuclei → report', stations: ['subfinder', 'httpx', 'nuclei'], createdAt: '2026-05-27', updatedAt: '2026-05-28', runCount: 12 },
  { id: 'pb2', name: 'XSS Pipeline', description: 'gau → dalfox → report', stations: ['gau', 'dalfox'], createdAt: '2026-05-26', updatedAt: '2026-05-28', runCount: 8 },
  { id: 'pb3', name: 'SQLi Hunter', description: 'waybackurls → sqlmap → verify', stations: ['gau', 'sqlmap'], createdAt: '2026-05-25', updatedAt: '2026-05-27', runCount: 5 },
  { id: 'pb4', name: 'Secrets Discovery', description: 'gau → trufflehog → report', stations: ['gau', 'trufflehog'], createdAt: '2026-05-24', updatedAt: '2026-05-26', runCount: 3 },
]

export function PlaybookEditor() {
  const [playbooks, setPlaybooks] = useState(INITIAL_PLAYBOOKS)
  const [editing, setEditing] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [selectedStations, setSelectedStations] = useState<string[]>([])
  const [showNew, setShowNew] = useState(false)

  const createPlaybook = () => {
    if (!newName.trim() || selectedStations.length === 0) return
    const pb: Playbook = {
      id: `pb${Date.now()}`,
      name: newName.trim(),
      description: newDesc.trim(),
      stations: selectedStations,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      runCount: 0,
    }
    setPlaybooks([pb, ...playbooks])
    setNewName('')
    setNewDesc('')
    setSelectedStations([])
    setShowNew(false)
  }

  return (
    <div className="hacker-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold text-hacker-cyan font-mono">◈ PLAYBOOKS</h3>
          <span className="text-[10px] font-mono text-hacker-text-dim">{playbooks.length} chains</span>
        </div>
        <button onClick={() => setShowNew(!showNew)} className="hacker-btn-primary text-[10px] px-2 py-0.5">
          + New Chain
        </button>
      </div>

      {showNew && (
        <div className="mb-4 p-3 rounded bg-hacker-bg border border-hacker-border space-y-2">
          <input
            className="hacker-input w-full text-xs"
            placeholder="Playbook name..."
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && createPlaybook()}
          />
          <input
            className="hacker-input w-full text-xs"
            placeholder="Description..."
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
          />
          <div>
            <p className="text-[9px] font-mono text-hacker-text-dim mb-1">Stations (click to add):</p>
            <div className="flex flex-wrap gap-1">
              {AVAILABLE_STATIONS.map(st => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStations(prev =>
                    prev.includes(st.id) ? prev.filter(id => id !== st.id) : [...prev, st.id]
                  )}
                  className={cn(
                    'text-[9px] font-mono px-1.5 py-0.5 rounded border transition-colors',
                    selectedStations.includes(st.id)
                      ? 'bg-hacker-green/10 text-hacker-green border-hacker-green/30'
                      : 'bg-hacker-surface2 text-hacker-text-dim border-hacker-border hover:text-hacker-text'
                  )}
                >
                  {st.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={createPlaybook} disabled={!newName.trim() || selectedStations.length === 0} className="hacker-btn-primary text-[10px] disabled:opacity-30">
              Create Playbook
            </button>
            <button onClick={() => { setShowNew(false); setSelectedStations([]) }} className="hacker-btn-ghost text-[10px]">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {playbooks.map(pb => (
          <div key={pb.id} className="flex items-center justify-between px-2 py-1.5 rounded bg-hacker-bg/50 hover:bg-hacker-surface2 transition-colors group">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <span className="text-hacker-green text-xs">▶</span>
              <div className="min-w-0">
                <p className="text-xs font-mono text-hacker-text truncate">{pb.name}</p>
                <p className="text-[9px] font-mono text-hacker-text-dim truncate">{pb.description}</p>
              </div>
              <div className="flex gap-1 ml-2">
                {pb.stations.map(sid => {
                  const st = AVAILABLE_STATIONS.find(s => s.id === sid)
                  return st ? (
                    <span key={sid} className="text-[8px] font-mono px-1 py-0.5 rounded bg-hacker-surface2 text-hacker-text-dim">
                      {st.name}
                    </span>
                  ) : null
                })}
              </div>
            </div>
            <div className="flex items-center gap-2 text-[9px] font-mono text-hacker-text-dim flex-shrink-0">
              <span>{pb.runCount} runs</span>
              <span className="hidden sm:inline">{pb.updatedAt}</span>
              <button className="opacity-0 group-hover:opacity-100 text-hacker-green hover:text-hacker-green/80 transition-all">▶ Run</button>
            </div>
          </div>
        ))}
      </div>
      {playbooks.length === 0 && (
        <div className="text-center py-6 text-[10px] font-mono text-hacker-text-dim/50">
          No playbooks yet. Create your first automation chain.
        </div>
      )}
    </div>
  )
}
