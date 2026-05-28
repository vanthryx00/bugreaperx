import { SentryDashboard } from '../components/sentry/SentryDashboard'
import { DashboardHUD } from '../components/dashboard/DashboardHUD'
import { cn } from '../lib/utils'

export function SentryPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-hacker-text-bright font-mono tracking-wide">▸ SENTRY</h1>
        <p className="text-sm text-hacker-text-dim mt-1 font-mono">Live monitoring · Incident response · Alert rules</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Systems Monitored', value: '8', color: 'text-hacker-green', sub: 'All active' },
          { label: 'Active Incidents', value: '2', color: 'text-hacker-red', sub: '1 critical · 1 medium' },
          { label: 'Alert Rules', value: '5', color: 'text-hacker-cyan', sub: '4 enabled' },
          { label: 'Uptime (Avg)', value: '99.87%', color: 'text-hacker-amber', sub: '30d rolling' },
        ].map(stat => (
          <div key={stat.label} className="hacker-card p-3">
            <p className="text-[10px] font-mono text-hacker-text-dim">{stat.label}</p>
            <p className={cn('text-lg font-bold font-mono', stat.color)}>{stat.value}</p>
            <p className="text-[8px] font-mono text-hacker-text-dim/50">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Live HUD */}
      <DashboardHUD />

      {/* Sentry Dashboard */}
      <SentryDashboard />

      {/* System health table */}
      <div className="hacker-card p-4">
        <h3 className="text-xs font-semibold text-hacker-cyan font-mono mb-3">◈ SYSTEM HEALTH</h3>
        <div className="space-y-1">
          {[
            { svc: 'Hunter Engine', status: 'healthy', uptime: '99.97%', lastCheck: '2s ago', latency: '12ms' },
            { svc: 'Arsenal Core', status: 'healthy', uptime: '100%', lastCheck: '1s ago', latency: '8ms' },
            { svc: 'Godseye', status: 'healthy', uptime: '99.99%', lastCheck: '3s ago', latency: '45ms' },
            { svc: 'JARVIS AI', status: 'healthy', uptime: '99.95%', lastCheck: '2s ago', latency: '120ms' },
            { svc: 'Neurohack', status: 'healthy', uptime: '100%', lastCheck: '4s ago', latency: '5ms' },
            { svc: 'Sentry', status: 'healthy', uptime: '99.98%', lastCheck: '1s ago', latency: '15ms' },
            { svc: 'Ollama AI', status: 'unknown', uptime: '0%', lastCheck: '30s ago', latency: '—' },
            { svc: 'Cloudflare', status: 'degraded', uptime: '98.5%', lastCheck: '5s ago', latency: '210ms' },
          ].map(s => (
            <div key={s.svc} className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-hacker-surface2 transition-colors text-[10px] font-mono">
              <span className={cn('w-1.5 h-1.5 rounded-full', s.status === 'healthy' ? 'bg-hacker-green' : s.status === 'degraded' ? 'bg-hacker-amber' : 'bg-hacker-text-dim')} />
              <span className="text-hacker-text w-28">{s.svc}</span>
              <span className={cn('w-16', s.status === 'healthy' ? 'text-hacker-green' : s.status === 'degraded' ? 'text-hacker-amber' : 'text-hacker-text-dim')}>{s.status}</span>
              <span className="text-hacker-text-dim/50 w-16">{s.uptime}</span>
              <span className="text-hacker-text-dim/50 flex-1">{s.lastCheck}</span>
              <span className={cn('w-12 text-right', parseInt(s.latency) > 100 ? 'text-hacker-amber' : 'text-hacker-text-dim/50')}>{s.latency}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
