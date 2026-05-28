import { useState } from 'react'
import { cn } from '../lib/utils'
import { PlaybookEditor } from '../components/workshop/PlaybookEditor'
import { StationConfig } from '../components/workshop/StationConfig'
import { WorkspaceAudit } from '../components/workshop/WorkspaceAudit'
import type { Workbench, WorkbenchStation } from '../types'

const DEMO_WORKBENCHES: Workbench[] = [
  { id: 'wb1', name: 'bug-bounty-001', target: 'example.com', status: 'active', stations: [], playbook: 'pb1', notes: 'Full recon chain running', tags: ['recon', 'bug-bounty'], createdAt: '2026-05-28', lastActive: '2026-05-28T14:00:00Z', progress: 65, entryCount: 142 },
  { id: 'wb2', name: 'pentest-alpha', target: 'api.test.org', status: 'active', stations: [], playbook: 'pb2', notes: 'API endpoint testing', tags: ['api', 'pentest'], createdAt: '2026-05-27', lastActive: '2026-05-28T13:00:00Z', progress: 35, entryCount: 89 },
  { id: 'wb3', name: 'scope-review', target: 'new-client.io', status: 'idle', stations: [], playbook: null, notes: 'Waiting for scope approval', tags: ['recon'], createdAt: '2026-05-26', lastActive: '2026-05-26T10:45:00Z', progress: 10, entryCount: 47 },
]

const DEMO_STATIONS: WorkbenchStation[] = [
  { id: 'st1', name: 'subfinder', tool: 'subfinder', category: 'recon', order: 0, config: { threads: '10', timeout: '30' } },
  { id: 'st2', name: 'httpx', tool: 'httpx', category: 'recon', order: 1, config: { threads: '15', statusCodes: '200,301,302' } },
  { id: 'st3', name: 'nuclei', tool: 'nuclei', category: 'vuln', order: 2, config: { severity: 'critical,high', rateLimit: '150' } },
]

export function WorkshopPage() {
  const [workbenches, setWorkbenches] = useState(DEMO_WORKBENCHES)
  const [selectedWb, setSelectedWb] = useState<string | null>('wb1')
  const [stations, setStations] = useState(DEMO_STATIONS)
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [newTarget, setNewTarget] = useState('')

  const activeWb = workbenches.find(w => w.id === selectedWb)

  const createWorkbench = () => {
    if (!newName.trim() || !newTarget.trim()) return
    const wb: Workbench = {
      id: `wb${Date.now()}`,
      name: newName.trim(),
      target: newTarget.trim(),
      status: 'active',
      stations: [],
      playbook: null,
      notes: '',
      tags: [],
      createdAt: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString(),
      progress: 0,
      entryCount: 0,
    }
    setWorkbenches([wb, ...workbenches])
    setSelectedWb(wb.id)
    setNewName('')
    setNewTarget('')
    setShowNew(false)
  }

  const statusColor: Record<string, string> = {
    active: 'bg-hacker-green',
    paused: 'bg-hacker-amber',
    idle: 'bg-hacker-text-dim',
    completed: 'bg-hacker-cyan',
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-hacker-text-bright font-mono tracking-wide">▸ WORKSHOP</h1>
          <p className="text-sm text-hacker-text-dim mt-1 font-mono">Workbenches · Stations · Playbooks · Audit trail</p>
        </div>
        <button onClick={() => setShowNew(!showNew)} className="hacker-btn-primary text-xs">
          + New Workbench
        </button>
      </div>

      {showNew && (
        <div className="hacker-card p-4 border-hacker-green/30">
          <h3 className="text-xs font-semibold text-hacker-green font-mono mb-3">New Workbench</h3>
          <div className="grid grid-cols-2 gap-3">
            <input className="hacker-input text-xs" placeholder="Workbench name..." value={newName} onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createWorkbench()} />
            <input className="hacker-input text-xs" placeholder="Target domain..." value={newTarget} onChange={e => setNewTarget(e.target.value)} />
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={createWorkbench} disabled={!newName.trim() || !newTarget.trim()} className="hacker-btn-primary text-[10px] disabled:opacity-30">Create</button>
            <button onClick={() => setShowNew(false)} className="hacker-btn-ghost text-[10px]">Cancel</button>
          </div>
        </div>
      )}

      {/* Workbenches list */}
      <div className="grid grid-cols-3 gap-4">
        <div className="hacker-card p-4 col-span-1">
          <h3 className="text-xs font-semibold text-hacker-cyan font-mono mb-3">◈ WORKBENCHES</h3>
          <div className="space-y-2">
            {workbenches.map(wb => (
              <button
                key={wb.id}
                onClick={() => setSelectedWb(wb.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-2 py-2 rounded transition-colors text-left',
                  selectedWb === wb.id ? 'bg-hacker-green/10 border border-hacker-green/20' : 'bg-hacker-bg/50 hover:bg-hacker-surface2'
                )}
              >
                <span className={cn('w-2 h-2 rounded-full flex-shrink-0', statusColor[wb.status])} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-hacker-text truncate">{wb.name}</p>
                  <p className="text-[9px] font-mono text-hacker-text-dim truncate">{wb.target}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[8px] font-mono text-hacker-text-dim/50">{wb.entryCount} entries</span>
                    <span className="text-[8px] font-mono text-hacker-text-dim/50">{wb.progress}%</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Workbench details */}
        <div className="col-span-2 space-y-4">
          {activeWb ? (
            <>
              <div className="hacker-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={cn('w-2 h-2 rounded-full', statusColor[activeWb.status])} />
                    <div>
                      <h3 className="text-xs font-semibold text-hacker-text font-mono">{activeWb.name}</h3>
                      <p className="text-[9px] font-mono text-hacker-text-dim">{activeWb.target}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn('text-[9px] font-mono px-1.5 py-0.5 rounded', activeWb.status === 'active' ? 'bg-hacker-green/10 text-hacker-green' : 'text-hacker-text-dim bg-hacker-surface2')}>
                      {activeWb.status}
                    </span>
                    <button className="hacker-btn-ghost text-[10px]">▸ Run</button>
                    <button className="hacker-btn-ghost text-[10px]">Pause</button>
                  </div>
                </div>
                <div className="h-1.5 bg-hacker-surface2 rounded-full overflow-hidden mb-3">
                  <div className={cn('h-full rounded-full transition-all duration-500', activeWb.progress > 50 ? 'bg-hacker-green' : 'bg-hacker-cyan')}
                    style={{ width: `${activeWb.progress}%` }} />
                </div>
                <div className="flex flex-wrap gap-2 text-[8px] font-mono">
                  {activeWb.tags.map(t => (
                    <span key={t} className="px-1 py-0.5 rounded bg-hacker-surface2 text-hacker-text-dim/70">{t}</span>
                  ))}
                  {activeWb.notes && <span className="text-hacker-text-dim/50 ml-auto">{activeWb.notes}</span>}
                </div>
              </div>

              {/* Station Config */}
              <div className="hacker-card p-4">
                <h3 className="text-xs font-semibold text-hacker-amber font-mono mb-3">◈ STATIONS</h3>
                <StationConfig stations={stations} onUpdate={setStations} />
              </div>

              {/* Playbook Editor */}
              <PlaybookEditor />
            </>
          ) : (
            <div className="hacker-card p-8 text-center">
              <p className="text-sm font-mono text-hacker-text-dim/50">Select a workbench to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Audit trail */}
      <WorkspaceAudit />
    </div>
  )
}
