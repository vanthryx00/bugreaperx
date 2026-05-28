import { DashboardHUD } from '../components/dashboard/DashboardHUD'
import { cn } from '../lib/utils'

export function DashboardPage() {
  const activities = [
    { time: '14:23:12', event: 'Scope update detected', target: 'hackerone.com/programs/123', type: 'info' as const },
    { time: '14:22:05', event: 'Subdomain enumeration complete', target: 'target.example.com — 142 hosts', type: 'success' as const },
    { time: '14:18:44', event: 'SQL Injection in admin/login', target: 'Critical · $2,500', type: 'critical' as const },
    { time: '14:15:30', event: 'Sentry: Rate limit threshold exceeded', target: 'httpx · 45 429s in 60s', type: 'warning' as const },
    { time: '14:12:01', event: 'Workshop: bug-bounty-001 active', target: '3 stations running', type: 'info' as const },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-hacker-text-bright font-mono tracking-wide">▸ DASHBOARD</h1>
        <p className="text-sm text-hacker-text-dim mt-1 font-mono">System overview · Module status · Active operations</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Targets', value: '12', color: 'text-hacker-green', change: '+3' },
          { label: 'Findings', value: '47', color: 'text-hacker-cyan', change: '+8' },
          { label: 'Arsenal Ready', value: '275', color: 'text-hacker-purple', change: '100%' },
          { label: 'Earnings (MTD)', value: '$2,450', color: 'text-hacker-amber', change: '+22%' },
        ].map((stat) => (
          <div key={stat.label} className="hacker-card p-4">
            <p className="text-[10px] text-hacker-text-dim font-mono uppercase tracking-wider">{stat.label}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</span>
              <span className={`text-[10px] font-mono ${stat.color}`}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Live HUD */}
      <DashboardHUD />

      {/* Second row: Sentry + Wallet + Activity */}
      <div className="grid grid-cols-3 gap-4">
        {/* Sentry summary */}
        <div className="hacker-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-hacker-red font-mono flex items-center gap-2">
              <span>⚠ SENTRY</span>
              <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-hacker-red/10 text-hacker-red animate-pulse">2 active</span>
            </h3>
            <a href="#/sentry" className="text-[9px] font-mono text-hacker-green/60 hover:text-hacker-green">view all →</a>
          </div>
          <div className="space-y-1">
            {[
              { name: 'Rate limit threshold', severity: 'high', status: 'active' },
              { name: 'Ollama connection lost', severity: 'critical', status: 'active' },
              { name: 'CDN latency warning', severity: 'info', status: 'resolved' },
            ].map(inc => (
              <div key={inc.name} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-hacker-surface2 text-[10px] font-mono">
                <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', inc.status === 'active' ? 'bg-hacker-red animate-pulse' : 'bg-hacker-green')} />
                <span className="flex-1 truncate text-hacker-text-dim">{inc.name}</span>
                <span className={cn('text-[8px] px-1 py-0.5 rounded', inc.severity === 'critical' ? 'text-hacker-red bg-hacker-red/10' : inc.severity === 'high' ? 'text-hacker-amber bg-hacker-amber/10' : 'text-hacker-text-dim bg-hacker-text-dim/10')}>
                  {inc.severity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Wallet summary */}
        <div className="hacker-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-hacker-amber font-mono flex items-center gap-2">
              <span>◈ WALLET</span>
            </h3>
            <a href="#/wallet" className="text-[9px] font-mono text-hacker-green/60 hover:text-hacker-green">view all →</a>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-hacker-text-dim">Total Earned</span>
              <span className="text-hacker-green font-bold">$8,300</span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-hacker-text-dim">Pending</span>
              <span className="text-hacker-amber font-bold">$1,500</span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-hacker-text-dim">This Month</span>
              <span className="text-hacker-cyan font-bold">$2,450</span>
            </div>
            <div className="h-1 bg-hacker-surface2 rounded-full overflow-hidden mt-2">
              <div className="h-full w-3/4 bg-gradient-to-r from-hacker-green to-hacker-cyan rounded-full" />
            </div>
            <div className="flex justify-between text-[8px] font-mono text-hacker-text-dim/50">
              <span>$0</span>
              <span>$10K target</span>
            </div>
          </div>
        </div>

        {/* Neurohack sprint */}
        <div className="hacker-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-hacker-green font-mono flex items-center gap-2">
              <span>◈ ACTIVE SPRINT</span>
              <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-hacker-green/10 text-hacker-green animate-pulse">LIVE</span>
            </h3>
            <a href="#/neurohack" className="text-[9px] font-mono text-hacker-green/60 hover:text-hacker-green">view all →</a>
          </div>
          <div className="space-y-2 text-[10px] font-mono">
            <div className="flex items-center justify-between">
              <span className="text-hacker-text-dim">Topic</span>
              <span className="text-hacker-text">API Security Deep Dive</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-hacker-text-dim">Protocol</span>
              <span className="text-hacker-cyan">APEX (4h)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-hacker-text-dim">Phase</span>
              <span className="text-hacker-text">3/15 · BUILD</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-hacker-text-dim">Momentum</span>
              <span className="text-hacker-green">89%</span>
            </div>
            <div className="h-1 bg-hacker-surface2 rounded-full overflow-hidden mt-1">
              <div className="h-full w-[45%] bg-hacker-green rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-sm font-semibold text-hacker-text font-mono mb-3 flex items-center gap-2">
          <span className="text-hacker-cyan">◆</span>
          Recent Activity
        </h2>
        <div className="hacker-card divide-y divide-hacker-border">
          {activities.map((activity, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5 hover:bg-hacker-surface2 transition-colors">
              <span className="text-[10px] font-mono text-hacker-text-dim/50 w-16 flex-shrink-0">{activity.time}</span>
              <span className={cn(
                'text-[10px] font-mono px-1.5 py-0.5 rounded',
                activity.type === 'critical' ? 'bg-hacker-red/10 text-hacker-red' :
                activity.type === 'success' ? 'bg-hacker-green/10 text-hacker-green' :
                activity.type === 'warning' ? 'bg-hacker-amber/10 text-hacker-amber' :
                'bg-hacker-cyan/10 text-hacker-cyan'
              )}>
                {activity.type.toUpperCase()}
              </span>
              <span className="text-xs text-hacker-text flex-1">{activity.event}</span>
              <span className="text-[10px] text-hacker-text-dim font-mono">{activity.target}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
