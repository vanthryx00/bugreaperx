import { cn } from '../lib/utils'

const workbenches = [
  { name: 'bug-bounty-001', target: 'example.com', status: 'active', stations: ['recon', 'scan', 'report'], duration: '2h 34m' },
  { name: 'pentest-alpha', target: 'api.test.org', status: 'active', stations: ['cloud', 'api', 'oob'], duration: '1h 12m' },
  { name: 'scope-review', target: 'new-client.io', status: 'idle', stations: ['recon', 'scan'], duration: '45m' },
]

export function WorkshopPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-hacker-text-bright font-mono tracking-wide">▸ WORKSHOP</h1>
          <p className="text-sm text-hacker-text-dim mt-1 font-mono">Workbenches · Stations · Audit trail</p>
        </div>
        <button className="hacker-btn-primary text-xs">+ New Workbench</button>
      </div>

      <div className="space-y-3">
        {workbenches.map((wb) => (
          <div key={wb.name} className="hacker-card p-4 hover:border-hacker-green/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className={cn('w-2 h-2 rounded-full', wb.status === 'active' ? 'bg-hacker-green' : 'bg-hacker-text-dim')} />
                <div>
                  <p className="text-sm font-mono text-hacker-text">{wb.name}</p>
                  <p className="text-[10px] text-hacker-text-dim font-mono">{wb.target}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {wb.stations.map((st) => (
                    <span key={st} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-hacker-surface2 text-hacker-text-dim">
                      {st}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] font-mono text-hacker-text-dim">{wb.duration}</span>
              </div>
            </div>
            <div className="h-1 bg-hacker-surface2 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-hacker-cyan rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
