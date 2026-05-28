import { useState } from 'react'
import { cn } from '../../lib/utils'
import type { PrivacyShieldStatus } from '../../types'

const mockShield: PrivacyShieldStatus = {
  enabled: true,
  dataEncrypted: true,
  piiMasked: true,
  sessionIsolated: true,
  networkMonitored: true,
  lastScan: new Date().toISOString(),
}

const shieldItems = [
  { key: 'enabled' as const, label: 'Privacy Shield', description: 'Active protection across all data channels' },
  { key: 'dataEncrypted' as const, label: 'Data Encryption', description: 'AES-256 encryption on all stored and transmitted data' },
  { key: 'piiMasked' as const, label: 'PII Masking', description: 'Personal identifiable information redacted from outputs' },
  { key: 'sessionIsolated' as const, label: 'Session Isolation', description: 'Each session sandboxed with isolated memory' },
  { key: 'networkMonitored' as const, label: 'Network Monitor', description: 'Outbound traffic inspected for data leakage' },
]

export function PrivacyShield() {
  const [shield] = useState(mockShield)
  const activeCount = shieldItems.filter(i => shield[i.key]).length

  return (
    <div className="hacker-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-hacker-cyan text-lg">◈</span>
          <h3 className="text-xs font-semibold text-hacker-text font-mono">PRIVACY SHIELD</h3>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono text-hacker-green">{activeCount}/{shieldItems.length}</span>
          <span className="text-[8px] font-mono text-hacker-text-dim/50">active</span>
        </div>
      </div>

      {/* Shield items */}
      <div className="space-y-1.5">
        {shieldItems.map((item) => {
          const active = shield[item.key]
          return (
            <div key={item.key} className="flex items-center gap-2 px-2 py-1.5 rounded bg-hacker-bg/30">
              <span className={cn(
                'w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0',
                active ? 'bg-hacker-green/20 text-hacker-green' : 'bg-hacker-text-dim/10 text-hacker-text-dim/50'
              )}>
                {active ? '✓' : '✕'}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={cn('text-[10px] font-mono', active ? 'text-hacker-text' : 'text-hacker-text-dim/50')}>
                    {item.label}
                  </span>
                  {active && <span className="text-[7px] font-mono px-1 rounded bg-hacker-green/10 text-hacker-green">ON</span>}
                </div>
                <p className="text-[8px] font-mono text-hacker-text-dim/50">{item.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Last scan status */}
      <div className="mt-3 pt-3 border-t border-hacker-border/50">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-hacker-green animate-pulse" />
          <span className="text-[9px] font-mono text-hacker-green">Privacy shield active — no data leakage detected</span>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[8px] font-mono text-hacker-text-dim/50">
            Last scan: {new Date(shield.lastScan).toLocaleTimeString('en-US', { hour12: false })}
          </span>
          <span className="text-[8px] font-mono text-hacker-text-dim/50">All PII masked</span>
          <span className="text-[8px] font-mono text-hacker-text-dim/50">Zero violations</span>
        </div>
      </div>
    </div>
  )
}
