import { useState } from 'react'
import { cn } from '../../lib/utils'
import type { PrivacyLayer } from '../../types'

const privacyLayers: PrivacyLayer[] = [
  { id: 'pii', name: 'PII Masking', status: 'active', protection: 'All personally identifiable information encrypted at rest and in transit', endpoints: 12 },
  { id: 'encryption', name: 'Data Encryption', status: 'active', protection: 'AES-256 encryption active on all stored data', endpoints: 8 },
  { id: 'session-iso', name: 'Session Isolation', status: 'active', protection: 'Each session sandboxed with isolated memory space', endpoints: 6 },
  { id: 'network-mon', name: 'Network Monitor', status: 'monitoring', protection: 'Outbound traffic inspected for PII/data leakage', endpoints: 4 },
  { id: 'clipboard', name: 'Clipboard Guard', status: 'active', protection: 'Sensitive data redacted from clipboard operations', endpoints: 2 },
  { id: 'telemetry', name: 'Telemetry Filter', status: 'active', protection: 'No sensitive data in telemetry or analytics', endpoints: 3 },
]

const statusConfig = {
  active: { dot: 'bg-hacker-green', label: 'Active', text: 'text-hacker-green' },
  monitoring: { dot: 'bg-hacker-amber', label: 'Monitoring', text: 'text-hacker-amber' },
  bypassed: { dot: 'bg-hacker-red', label: 'Bypassed', text: 'text-hacker-red' },
}

export function PrivacyGuard() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const activeCount = privacyLayers.filter(l => l.status === 'active').length

  return (
    <div className="hacker-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-hacker-cyan text-lg">◈</span>
          <h3 className="text-xs font-semibold text-hacker-text font-mono">PRIVACY SHIELD</h3>
        </div>
        <span className="text-[10px] font-mono text-hacker-green">{activeCount}/{privacyLayers.length} layers active</span>
      </div>

      <div className="space-y-1.5">
        {privacyLayers.map((layer) => {
          const config = statusConfig[layer.status]
          const isExpanded = expanded === layer.id

          return (
            <div key={layer.id}>
              <button
                onClick={() => setExpanded(isExpanded ? null : layer.id)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded bg-hacker-bg/30 hover:bg-hacker-bg/50 transition-colors text-left"
              >
                <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', config.dot)} />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-mono text-hacker-text">{layer.name}</span>
                  <span className={cn('text-[8px] font-mono ml-1.5', config.text)}>{config.label}</span>
                </div>
                <span className="text-[8px] font-mono text-hacker-text-dim/50">{layer.endpoints} EP</span>
                <span className="text-[8px] text-hacker-text-dim/30">{isExpanded ? '▲' : '▼'}</span>
              </button>
              {isExpanded && (
                <div className="px-3 py-1.5 mx-2 mb-1 rounded bg-hacker-bg/60 text-[9px] font-mono text-hacker-text-dim/70 leading-relaxed">
                  {layer.protection}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Encryption status banner */}
      <div className="mt-3 pt-3 border-t border-hacker-border/50">
        <div className="flex items-center gap-2 p-2 rounded bg-hacker-green/5 border border-hacker-green/10">
          <span className="text-hacker-green text-xs">◈</span>
          <div className="flex-1">
            <p className="text-[9px] font-mono text-hacker-green">Privacy encryption at full strength</p>
            <p className="text-[8px] font-mono text-hacker-text-dim/50">All data channels secured. Zero privacy violations detected.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
