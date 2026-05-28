import { useState, useEffect } from 'react'
import { cn } from '../../lib/utils'
import type { SystemHealthMetric } from '../../types'

const INITIAL_HEALTH: SystemHealthMetric[] = [
  { id: 'hunter', label: 'Hunter Engine', status: 'healthy', uptime: 99.97, lastCheck: new Date().toISOString(), details: '7 active scans · 0 failures' },
  { id: 'arsenal', label: 'Arsenal Core', status: 'healthy', uptime: 100, lastCheck: new Date().toISOString(), details: '275 weapons loaded · 15 categories' },
  { id: 'godseye', label: 'Godseye', status: 'healthy', uptime: 99.99, lastCheck: new Date().toISOString(), details: '6 privacy layers · 6 safety railguards' },
  { id: 'jarvis', label: 'JARVIS AI', status: 'healthy', uptime: 99.95, lastCheck: new Date().toISOString(), details: '28 safety rules · 422 threats blocked' },
  { id: 'neurohack', label: 'Neurohack', status: 'healthy', uptime: 100, lastCheck: new Date().toISOString(), details: '15 protocols · sprint-ready' },
  { id: 'sentry', label: 'Sentry', status: 'healthy', uptime: 99.98, lastCheck: new Date().toISOString(), details: '12 alert rules · 0 active incidents' },
  { id: 'ollama', label: 'Ollama AI', status: 'unknown', uptime: 0, lastCheck: new Date().toISOString(), details: 'Not connected · Configure in Settings' },
  { id: 'cloudflare', label: 'Cloudflare', status: 'degraded', uptime: 98.5, lastCheck: new Date().toISOString(), details: 'CDN edge: 210 ms latency' },
]

export function DashboardHUD() {
  const [health, setHealth] = useState(INITIAL_HEALTH)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {
      // Simulate live health checks
      setHealth(prev => prev.map(h => ({
        ...h,
        status: h.status === 'down' ? 'down' : Math.random() > 0.92 ? 'degraded' : h.status === 'unknown' ? 'unknown' : 'healthy',
        lastCheck: new Date().toISOString(),
      })))
      setLastUpdate(new Date())
    }, 5000)
    return () => clearInterval(interval)
  }, [autoRefresh])

  const statusColor = {
    healthy: 'bg-hacker-green shadow-[0_0_6px_rgba(0,255,65,0.5)]',
    degraded: 'bg-hacker-amber shadow-[0_0_6px_rgba(255,176,0,0.5)]',
    down: 'bg-hacker-red shadow-[0_0_6px_rgba(255,51,51,0.5)]',
    unknown: 'bg-hacker-text-dim',
  }

  const healthyCount = health.filter(h => h.status === 'healthy').length
  const totalCount = health.length

  return (
    <div className="hacker-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold text-hacker-green font-mono flex items-center gap-2">
            <span>◈ LIVE HUD</span>
            {autoRefresh && <span className="text-[8px] text-hacker-green animate-pulse">●</span>}
          </h3>
          <span className={cn(
            'text-[10px] font-mono px-1.5 py-0.5 rounded',
            healthyCount === totalCount ? 'bg-hacker-green/10 text-hacker-green' :
            healthyCount >= totalCount - 1 ? 'bg-hacker-amber/10 text-hacker-amber' :
            'bg-hacker-red/10 text-hacker-red'
          )}>
            {healthyCount}/{totalCount} online
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-mono text-hacker-text-dim/50">
            last: {lastUpdate.toLocaleTimeString('en-US', { hour12: false })}
          </span>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={cn(
              'text-[10px] font-mono px-1.5 py-0.5 rounded transition-colors',
              autoRefresh ? 'text-hacker-green bg-hacker-green/10' : 'text-hacker-text-dim bg-hacker-surface2'
            )}
          >
            {autoRefresh ? '◉ LIVE' : '◯ PAUSED'}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {health.map(h => (
          <div key={h.id} className="flex items-center gap-2 px-2 py-1.5 rounded bg-hacker-bg/50 hover:bg-hacker-surface2 transition-colors group relative">
            <span className={cn('w-2 h-2 rounded-full flex-shrink-0', statusColor[h.status])} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-hacker-text truncate">{h.label}</span>
                <span className={cn(
                  'text-[8px] font-mono uppercase',
                  h.status === 'healthy' ? 'text-hacker-green/60' :
                  h.status === 'degraded' ? 'text-hacker-amber/60' :
                  h.status === 'down' ? 'text-hacker-red/60' : 'text-hacker-text-dim/40'
                )}>
                  {h.status}
                </span>
              </div>
              <p className="text-[8px] font-mono text-hacker-text-dim/50 truncate">{h.details}</p>
            </div>
            {/* Tooltip */}
            <div className="absolute left-0 top-full mt-1 z-50 hidden group-hover:block bg-hacker-surface2 border border-hacker-border rounded p-2 shadow-xl min-w-[200px]">
              <p className="text-[10px] font-mono text-hacker-text">{h.label}</p>
              <p className="text-[9px] font-mono text-hacker-text-dim mt-1">{h.details}</p>
              <p className="text-[8px] font-mono text-hacker-text-dim/50 mt-1">Uptime: {h.uptime}%</p>
              <p className="text-[8px] font-mono text-hacker-text-dim/50">Last check: {new Date(h.lastCheck).toLocaleTimeString('en-US', { hour12: false })}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
