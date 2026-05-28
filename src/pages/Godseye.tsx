import { SecurityHealth } from '../components/godseye/SecurityHealth'
import { ThreatMonitor } from '../components/godseye/ThreatMonitor'
import { PrivacyGuard } from '../components/godseye/PrivacyGuard'
import { CodeGuard } from '../components/godseye/CodeGuard'
import { SessionMonitor } from '../components/godseye/SessionMonitor'

export function GodseyePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-hacker-text-bright font-mono tracking-wide flex items-center gap-2">
            <span className="text-hacker-green">◉</span>
            <span>▸ GODSEYE</span>
          </h1>
          <p className="text-sm text-hacker-text-dim mt-1 font-mono">
            Security oversight · Anti-code monitoring · Privacy protection · Railguard status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-hacker-green animate-pulse" />
          <span className="text-[10px] font-mono text-hacker-green">All systems secure</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Safety Railguards', value: '6', sub: 'All Active', color: 'text-hacker-green' },
          { label: 'Threats Blocked', value: '422', sub: 'Today', color: 'text-hacker-red' },
          { label: 'Privacy Layers', value: '6', sub: 'Full Protection', color: 'text-hacker-cyan' },
          { label: 'Code Gen Blocks', value: '142', sub: 'Malicious Attempts', color: 'text-hacker-amber' },
          { label: 'Uptime', value: '99.97%', sub: '30 Days', color: 'text-hacker-purple' },
        ].map((stat) => (
          <div key={stat.label} className="hacker-card p-3">
            <p className="text-[10px] text-hacker-text-dim font-mono uppercase tracking-wider">{stat.label}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</span>
              <span className={`text-[9px] font-mono ${stat.color}`}>{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Left column */}
        <div className="space-y-4">
          <SecurityHealth />
          <PrivacyGuard />
        </div>

        {/* Center + Right */}
        <div className="col-span-2 space-y-4">
          <ThreatMonitor />
          <div className="grid grid-cols-2 gap-4">
            <CodeGuard />
            <SessionMonitor />
          </div>
        </div>
      </div>

      {/* Bottom System Integrity Banner */}
      <div className="hacker-card p-4 border-hacker-green/20 bg-hacker-green/5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-hacker-green shadow-[0_0_10px_rgba(0,255,65,0.3)]" />
            <span className="text-sm font-bold font-mono text-hacker-green">SYSTEM INTEGRITY: VERIFIED</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-hacker-green/30 to-transparent" />
          <div className="flex items-center gap-4 text-[10px] font-mono text-hacker-text-dim">
            <span>No security breaches</span>
            <span>·</span>
            <span>All railguards operational</span>
            <span>·</span>
            <span>Zero privacy violations</span>
            <span>·</span>
            <span>Full ethical compliance</span>
          </div>
        </div>
      </div>
    </div>
  )
}
