import { useState } from 'react'
import { cn } from '../../lib/utils'
import type { ThreatEvent } from '../../types'

const mockThreats: ThreatEvent[] = [
  { id: 't1', type: 'code-gen', severity: 'high', source: 'AI Railguard', detail: 'Blocked attempt: Generate phishing email template', timestamp: new Date().toISOString(), blocked: true },
  { id: 't2', type: 'session-anomaly', severity: 'medium', source: 'Session Monitor', detail: 'Unusual login location — MFA enforced', timestamp: new Date(Date.now() - 30000).toISOString(), blocked: true },
  { id: 't3', type: 'privacy-scan', severity: 'low', source: 'Privacy Shield', detail: 'Outbound request checked — no PII detected', timestamp: new Date(Date.now() - 120000).toISOString(), blocked: false },
  { id: 't4', type: 'credential-test', severity: 'critical', source: 'Credential Guard', detail: 'Blocked: Credential stuffing attempt on admin panel', timestamp: new Date(Date.now() - 300000).toISOString(), blocked: true },
  { id: 't5', type: 'data-exfil', severity: 'critical', source: 'Data Guard', detail: 'Blocked: Unusual outbound data transfer to unknown IP', timestamp: new Date(Date.now() - 600000).toISOString(), blocked: true },
  { id: 't6', type: 'code-gen', severity: 'high', source: 'AI Railguard', detail: 'Blocked: Request to generate exploit code for CVE-2026-XXXX', timestamp: new Date(Date.now() - 900000).toISOString(), blocked: true },
  { id: 't7', type: 'session-anomaly', severity: 'low', source: 'Auth Monitor', detail: 'New device login — session approved', timestamp: new Date(Date.now() - 1800000).toISOString(), blocked: false },
]

const typeConfig: Record<string, { icon: string; label: string }> = {
  'code-gen': { icon: '⚡', label: 'Code Gen' },
  'privacy-scan': { icon: '◈', label: 'Privacy' },
  'session-anomaly': { icon: '◎', label: 'Session' },
  'credential-test': { icon: '◉', label: 'Credential' },
  'data-exfil': { icon: '◻', label: 'Data Exfil' },
}

const severityColors: Record<string, string> = {
  critical: 'text-hacker-red bg-hacker-red/10 border-hacker-red/20',
  high: 'text-hacker-amber bg-hacker-amber/10 border-hacker-amber/20',
  medium: 'text-hacker-cyan bg-hacker-cyan/10 border-hacker-cyan/20',
  low: 'text-hacker-text-dim bg-hacker-surface2 border-hacker-border/30',
}

export function ThreatMonitor() {
  const [filter, setFilter] = useState<string | null>(null)
  const [threats] = useState(mockThreats)

  const displayed = filter ? threats.filter(t => t.type === filter) : threats
  const totalBlocked = threats.filter(t => t.blocked).length

  return (
    <div className="hacker-card p-4 col-span-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-hacker-red text-lg">◉</span>
          <h3 className="text-xs font-semibold text-hacker-text font-mono">THREAT MONITOR</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-hacker-green">{totalBlocked} blocked</span>
          <span className={cn('w-1.5 h-1.5 rounded-full', threats.some(t => t.severity === 'critical') ? 'bg-hacker-red animate-pulse' : 'bg-hacker-green')} />
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-1 mb-3">
        {Object.entries(typeConfig).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setFilter(filter === key ? null : key)}
            className={cn(
              'px-2 py-0.5 rounded text-[9px] font-mono transition-colors border',
              filter === key
                ? 'bg-hacker-green/10 text-hacker-green border-hacker-green/30'
                : 'bg-hacker-surface2 text-hacker-text-dim border-hacker-border hover:text-hacker-text'
            )}
          >
            {cfg.icon} {cfg.label}
          </button>
        ))}
      </div>

      {/* Threat feed */}
      <div className="space-y-1 max-h-64 overflow-y-auto">
        {displayed.map((threat) => {
          const cfg = typeConfig[threat.type]
          return (
            <div
              key={threat.id}
              className="flex items-start gap-2 p-2 rounded bg-hacker-bg/50 hover:bg-hacker-bg transition-colors group"
            >
              <span className={cn('text-[9px] font-mono px-1 py-0.5 rounded border flex-shrink-0', severityColors[threat.severity])}>
                {threat.severity.toUpperCase()}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">{cfg?.icon}</span>
                  <span className="text-[10px] font-mono text-hacker-text truncate">{threat.detail}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[8px] font-mono text-hacker-text-dim/50">{threat.source}</span>
                  <span className="text-[8px] font-mono text-hacker-text-dim/30">
                    {new Date(threat.timestamp).toLocaleTimeString('en-US', { hour12: false })}
                  </span>
                </div>
              </div>
              {threat.blocked && (
                <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-hacker-green/10 text-hacker-green flex-shrink-0">
                  BLOCKED
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-hacker-border/50">
        {Object.entries(typeConfig).map(([key, cfg]) => {
          const count = threats.filter(t => t.type === key).length
          const blocked = threats.filter(t => t.type === key && t.blocked).length
          return (
            <div key={key} className="text-center">
              <p className="text-[9px] font-mono text-hacker-text-dim/60">{cfg.label}</p>
              <p className="text-sm font-bold font-mono text-hacker-text">{count}</p>
              <p className="text-[8px] font-mono text-hacker-green">{blocked} blocked</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
