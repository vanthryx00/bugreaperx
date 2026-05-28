import { useState } from 'react'
import { cn } from '../lib/utils'

interface Target {
  name: string
  host: string | null
  status: 'active' | 'pending' | 'completed'
  tools: number
  findings: number
  program: string
  platform: string
}

interface Program {
  id: string
  name: string
  platform: 'hackerone' | 'bugcrowd' | 'intigriti' | 'self-managed'
  earnings: number
  targets: Target[]
  lastScanned: string | null
}

const defaultPrograms: Program[] = [
  {
    id: 'p1',
    name: 'MegaCorp VDP',
    platform: 'hackerone',
    earnings: 2500,
    lastScanned: '2026-05-27',
    targets: [
      { name: 'target.example.com', host: '192.168.1.1', status: 'active', tools: 8, findings: 3, program: 'MegaCorp VDP', platform: 'H1' },
      { name: 'admin.example.org', host: '10.0.0.5', status: 'active', tools: 12, findings: 7, program: 'MegaCorp VDP', platform: 'H1' },
    ]
  },
  {
    id: 'p2',
    name: 'Startup Inc.',
    platform: 'bugcrowd',
    earnings: 800,
    lastScanned: '2026-05-26',
    targets: [
      { name: 'api.startup.io', host: '203.0.113.10', status: 'pending', tools: 4, findings: 0, program: 'Startup Inc.', platform: 'BC' },
    ]
  },
  {
    id: 'p3',
    name: 'Private Program',
    platform: 'self-managed',
    earnings: 0,
    lastScanned: null,
    targets: [
      { name: 'new-client.io', host: null, status: 'pending', tools: 0, findings: 0, program: 'Private Program', platform: 'SM' },
    ]
  }
]

const platformIcons: Record<string, string> = {
  hackerone: 'H1',
  bugcrowd: 'BC',
  intigriti: 'IG',
  'self-managed': 'SM',
}

const platformColors: Record<string, string> = {
  hackerone: 'text-hacker-green',
  bugcrowd: 'text-hacker-cyan',
  intigriti: 'text-hacker-purple',
  'self-managed': 'text-hacker-amber',
}

export function HuntPage() {
  const [programs, setPrograms] = useState<Program[]>(defaultPrograms)
  const [showAddProgram, setShowAddProgram] = useState(false)
  const [newProgram, setNewProgram] = useState({ name: '', platform: 'self-managed' as Program['platform'], earnings: 0 })

  const allTargets = programs.flatMap(p => p.targets)
  const totalEarnings = programs.reduce((s, p) => s + p.earnings, 0)
  const activeTargets = allTargets.filter(t => t.status === 'active').length
  const totalFindings = allTargets.reduce((s, t) => s + t.findings, 0)

  const addProgram = () => {
    if (!newProgram.name.trim()) return
    const prog: Program = {
      id: `p${Date.now()}`,
      name: newProgram.name,
      platform: newProgram.platform,
      earnings: newProgram.earnings,
      lastScanned: null,
      targets: [],
    }
    setPrograms([...programs, prog])
    setNewProgram({ name: '', platform: 'self-managed', earnings: 0 })
    setShowAddProgram(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-hacker-text-bright font-mono tracking-wide">▸ HUNT</h1>
          <p className="text-sm text-hacker-text-dim mt-1 font-mono">Target management · Programs · Scope mapping</p>
        </div>
        <button
          onClick={() => setShowAddProgram(!showAddProgram)}
          className="hacker-btn-primary text-xs"
        >
          + Add Program
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="hacker-card p-3">
          <p className="text-[10px] text-hacker-text-dim font-mono">Programs</p>
          <p className="text-lg font-bold font-mono text-hacker-green">{programs.length}</p>
        </div>
        <div className="hacker-card p-3">
          <p className="text-[10px] text-hacker-text-dim font-mono">Active Targets</p>
          <p className="text-lg font-bold font-mono text-hacker-cyan">{activeTargets}</p>
        </div>
        <div className="hacker-card p-3">
          <p className="text-[10px] text-hacker-text-dim font-mono">Findings</p>
          <p className="text-lg font-bold font-mono text-hacker-amber">{totalFindings}</p>
        </div>
        <div className="hacker-card p-3">
          <p className="text-[10px] text-hacker-text-dim font-mono">Earnings</p>
          <p className="text-lg font-bold font-mono text-hacker-purple">${totalEarnings.toLocaleString()}</p>
        </div>
      </div>

      {/* Add Program Form */}
      {showAddProgram && (
        <div className="hacker-card p-4 border-hacker-green/30">
          <h3 className="text-xs font-semibold text-hacker-green font-mono mb-3">+ New Program</h3>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-mono text-hacker-text-dim block mb-1">Program Name</label>
              <input
                className="hacker-input w-full"
                placeholder="e.g., MegaCorp VDP"
                value={newProgram.name}
                onChange={e => setNewProgram({ ...newProgram, name: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && addProgram()}
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-hacker-text-dim block mb-1">Platform</label>
              <select
                className="hacker-input w-full"
                value={newProgram.platform}
                onChange={e => setNewProgram({ ...newProgram, platform: e.target.value as Program['platform'] })}
              >
                <option value="self-managed">Self-Managed</option>
                <option value="hackerone">HackerOne</option>
                <option value="bugcrowd">Bugcrowd</option>
                <option value="intigriti">Intigriti</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button onClick={addProgram} className="hacker-btn-primary text-xs flex-1">Add</button>
              <button onClick={() => setShowAddProgram(false)} className="hacker-btn-ghost text-xs">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Programs List */}
      <div className="space-y-3">
        {programs.map(prog => (
          <div key={prog.id} className="hacker-card p-4 hover:border-hacker-green/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className={cn('w-2 h-2 rounded-full', prog.targets.some(t => t.status === 'active') ? 'bg-hacker-green' : 'bg-hacker-text-dim')} />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-mono text-hacker-text">{prog.name}</p>
                    <span className={cn('text-[10px] font-mono px-1.5 py-0.5 rounded bg-hacker-surface2', platformColors[prog.platform])}>
                      {platformIcons[prog.platform]}
                    </span>
                  </div>
                  {prog.lastScanned && (
                    <p className="text-[10px] text-hacker-text-dim font-mono">Last scanned: {prog.lastScanned}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono text-hacker-text-dim">
                <span>{prog.targets.length} targets</span>
                <span className={prog.earnings > 0 ? 'text-hacker-amber' : ''}>
                  ${prog.earnings.toLocaleString()}
                </span>
              </div>
            </div>
            {prog.targets.length > 0 && (
              <div className="space-y-1.5">
                {prog.targets.map(target => (
                  <div key={target.name} className="flex items-center justify-between py-1.5 px-2 rounded bg-hacker-bg/50">
                    <div className="flex items-center gap-2">
                      <span className={cn('w-1.5 h-1.5 rounded-full', target.status === 'active' ? 'bg-hacker-green' : 'bg-hacker-amber')} />
                      <span className="text-xs font-mono text-hacker-text">{target.name}</span>
                      {target.host && <span className="text-[10px] text-hacker-text-dim font-mono">{target.host}</span>}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-hacker-text-dim">
                      <span>{target.tools} tools</span>
                      <span className={target.findings > 0 ? 'text-hacker-amber' : ''}>{target.findings} findings</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {prog.targets.length === 0 && (
              <div className="text-center py-3 text-[10px] font-mono text-hacker-text-dim/50">
                No targets yet. Configure scope or add a target manually.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
