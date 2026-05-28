import { DashboardGrid } from '../components/dashboard/DashboardGrid'

export function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-hacker-text-bright font-mono tracking-wide">
          ▸ DASHBOARD
        </h1>
        <p className="text-sm text-hacker-text-dim mt-1 font-mono">
          System overview · Module status · Active operations
        </p>
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

      {/* System Status Grid */}
      <div>
        <h2 className="text-sm font-semibold text-hacker-text font-mono mb-3 flex items-center gap-2">
          <span className="text-hacker-green">◆</span>
          System Status
        </h2>
        <DashboardGrid />
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-sm font-semibold text-hacker-text font-mono mb-3 flex items-center gap-2">
          <span className="text-hacker-cyan">◆</span>
          Recent Activity
        </h2>
        <div className="hacker-card divide-y divide-hacker-border">
          {[
            { time: '14:23:12', event: 'Scope update detected', target: 'hackerone.com/programs/123', type: 'info' },
            { time: '14:22:05', event: 'Subdomain enumeration complete', target: 'target.example.com — 142 hosts', type: 'success' },
            { time: '14:18:44', event: 'New vulnerability: SQL Injection', target: 'admin.target.com/login', type: 'critical' },
            { time: '14:15:30', event: 'Tool chain initialized', target: 'subfinder → httpx → nuclei', type: 'info' },
            { time: '14:12:01', event: 'Session recording started', target: 'workshop: bug-bounty-001', type: 'info' },
          ].map((activity, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5 hover:bg-hacker-surface2 transition-colors">
              <span className="text-[10px] font-mono text-hacker-text-dim/50 w-16 flex-shrink-0">{activity.time}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                activity.type === 'critical' ? 'bg-hacker-red/10 text-hacker-red' :
                activity.type === 'success' ? 'bg-hacker-green/10 text-hacker-green' :
                'bg-hacker-cyan/10 text-hacker-cyan'
              }`}>
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
