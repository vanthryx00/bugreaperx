import { useState } from 'react'
import { cn } from '../../lib/utils'

interface SentryIncident {
  id: string
  name: string
  severity: 'critical' | 'high' | 'medium' | 'info'
  source: string
  status: 'active' | 'acknowledged' | 'resolved'
  timestamp: string
  details: string
}

const DEMO_INCIDENTS: SentryIncident[] = [
  { id: 'i1', name: 'Rate limit threshold exceeded', severity: 'high', source: 'httpx', status: 'active', timestamp: new Date().toISOString(), details: '429 responses on target.example.com — 45 in 60s' },
  { id: 'i2', name: 'DNS resolution failure spike', severity: 'medium', source: 'dnsx', status: 'acknowledged', timestamp: new Date(Date.now() - 300000).toISOString(), details: '12% failure rate on subdomain resolution' },
  { id: 'i3', name: 'Ollama connection lost', severity: 'critical', source: 'ollama', status: 'active', timestamp: new Date(Date.now() - 600000).toISOString(), details: 'AI service unreachable at localhost:11434' },
  { id: 'i4', name: 'CDN latency warning', severity: 'info', source: 'cloudflare', status: 'resolved', timestamp: new Date(Date.now() - 3600000).toISOString(), details: 'Edge latency: 310ms — resolved automatically' },
]

const ALERT_RULES = [
  { id: 'r1', name: 'High error rate', description: 'Alert when HTTP errors > 5%', severity: 'high', active: true, threshold: '5%' },
  { id: 'r2', name: 'Tool failure', description: 'Alert when tool exits with non-zero', severity: 'critical', active: true, threshold: '1 failure' },
  { id: 'r3', name: 'DNS resolution degradation', description: 'Alert when resolution rate < 90%', severity: 'medium', active: true, threshold: '< 90%' },
  { id: 'r4', name: 'Rate limit proximity', description: 'Alert when 80% of rate limit reached', severity: 'medium', active: false, threshold: '80%' },
  { id: 'r5', name: 'New subdomain spike', description: 'Alert when >100 new subdomains found', severity: 'info', active: true, threshold: '100 hosts' },
]

export function SentryDashboard() {
  const [incidents] = useState(DEMO_INCIDENTS)
  const [rules] = useState(ALERT_RULES)
  const [view, setView] = useState<'incidents' | 'rules'>('incidents')

  const activeIncidents = incidents.filter(i => i.status === 'active').length

  const severityColor: Record<string, string> = {
    critical: 'text-hacker-red bg-hacker-red/10 border-hacker-red/20',
    high: 'text-hacker-amber bg-hacker-amber/10 border-hacker-amber/20',
    medium: 'text-hacker-cyan bg-hacker-cyan/10 border-hacker-cyan/20',
    info: 'text-hacker-text-dim bg-hacker-text-dim/10 border-hacker-text-dim/20',
  }

  const statusColor: Record<string, string> = {
    active: 'text-hacker-red',
    acknowledged: 'text-hacker-amber',
    resolved: 'text-hacker-green',
  }

  return (
    <div className="hacker-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold text-hacker-red font-mono flex items-center gap-2">
            <span>⚠ SENTRY</span>
            {activeIncidents > 0 && (
              <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-hacker-red/10 text-hacker-red animate-pulse">
                {activeIncidents} active
              </span>
            )}
          </h3>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setView('incidents')} className={cn('text-[10px] font-mono px-2 py-0.5 rounded transition-colors', view === 'incidents' ? 'text-hacker-green bg-hacker-green/10' : 'text-hacker-text-dim hover:text-hacker-text')}>Incidents</button>
          <button onClick={() => setView('rules')} className={cn('text-[10px] font-mono px-2 py-0.5 rounded transition-colors', view === 'rules' ? 'text-hacker-green bg-hacker-green/10' : 'text-hacker-text-dim hover:text-hacker-text')}>Rules</button>
        </div>
      </div>

      {view === 'incidents' ? (
        <div className="space-y-1">
          {incidents.length === 0 ? (
            <div className="text-center py-6 text-[10px] font-mono text-hacker-text-dim/50">No incidents. All systems clear.</div>
          ) : incidents.map(inc => (
            <div key={inc.id} className="flex items-center gap-3 px-2 py-1.5 rounded bg-hacker-bg/50 hover:bg-hacker-surface2 transition-colors">
              <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', inc.status === 'active' ? 'bg-hacker-red animate-pulse' : inc.status === 'acknowledged' ? 'bg-hacker-amber' : 'bg-hacker-green')} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-hacker-text truncate">{inc.name}</span>
                  <span className={cn('text-[8px] font-mono px-1 py-0.5 rounded', severityColor[inc.severity])}>{inc.severity}</span>
                </div>
                <p className="text-[9px] font-mono text-hacker-text-dim truncate">{inc.details}</p>
              </div>
              <span className={cn('text-[9px] font-mono', statusColor[inc.status])}>{inc.status}</span>
              <span className="text-[8px] font-mono text-hacker-text-dim/50">{new Date(inc.timestamp).toLocaleTimeString('en-US', { hour12: false })}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {rules.map(rule => (
            <div key={rule.id} className="flex items-center gap-3 px-2 py-1.5 rounded bg-hacker-bg/50 hover:bg-hacker-surface2 transition-colors">
              <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', rule.active ? 'bg-hacker-green' : 'bg-hacker-text-dim')} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-hacker-text truncate">{rule.name}</span>
                  <span className={cn('text-[8px] font-mono px-1 py-0.5 rounded', severityColor[rule.severity])}>{rule.severity}</span>
                </div>
                <p className="text-[9px] font-mono text-hacker-text-dim truncate">{rule.description} · Threshold: {rule.threshold}</p>
              </div>
              <span className={cn('text-[9px] font-mono', rule.active ? 'text-hacker-green' : 'text-hacker-text-dim')}>{rule.active ? 'active' : 'disabled'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
