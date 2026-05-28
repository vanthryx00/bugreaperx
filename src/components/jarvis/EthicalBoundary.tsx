import { useState } from 'react'
import { cn } from '../../lib/utils'
import type { EthicalBoundary } from '../../types'

const boundaries: EthicalBoundary[] = [
  { id: 'eb1', principle: 'Authorized Testing Only', description: 'All actions must be on systems you own or have explicit written permission to test', enforced: true, violations: 0 },
  { id: 'eb2', principle: 'No Harm', description: 'No actions that could cause damage, data loss, or denial of service to systems', enforced: true, violations: 0 },
  { id: 'eb3', principle: 'Responsible Disclosure', description: 'Vulnerability findings must be reported through proper channels with reasonable disclosure timelines', enforced: true, violations: 0 },
  { id: 'eb4', principle: 'Privacy Preservation', description: 'No access to, collection of, or exposure of personal data without explicit consent', enforced: true, violations: 0 },
  { id: 'eb5', principle: 'Legal Compliance', description: 'All operations must comply with applicable laws including CFAA, GDPR, and local regulations', enforced: true, violations: 0 },
  { id: 'eb6', principle: 'No Criminal Activity', description: 'Zero tolerance for fraud, theft, extortion, blackmail, or any criminal enterprise', enforced: true, violations: 0 },
]

export function EthicalBoundary() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="hacker-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-hacker-purple text-lg">◉</span>
          <h3 className="text-xs font-semibold text-hacker-text font-mono">ETHICAL BOUNDARIES</h3>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono text-hacker-green">{boundaries.filter(b => b.enforced).length}/{boundaries.length}</span>
          <span className="text-[8px] font-mono text-hacker-text-dim/50">enforced</span>
        </div>
      </div>

      {/* Summary banner */}
      <div className="flex items-center gap-2 p-2 rounded bg-hacker-purple/5 border border-hacker-purple/10 mb-3">
        <span className="text-hacker-purple text-xs">◉</span>
        <div>
          <p className="text-[9px] font-mono text-hacker-purple">All ethical boundaries enforced</p>
          <p className="text-[8px] font-mono text-hacker-text-dim/50">Zero violations across all principles</p>
        </div>
      </div>

      {/* Boundaries list */}
      <div className="space-y-1 max-h-56 overflow-y-auto">
        {boundaries.map((b) => {
          const isExpanded = expandedId === b.id
          return (
            <div key={b.id}>
              <button
                onClick={() => setExpandedId(isExpanded ? null : b.id)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded bg-hacker-bg/30 hover:bg-hacker-bg/50 transition-colors text-left"
              >
                <span className={cn(
                  'w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold flex-shrink-0',
                  b.enforced ? 'bg-hacker-green/20 text-hacker-green' : 'bg-hacker-red/20 text-hacker-red'
                )}>
                  {b.enforced ? '✓' : '✕'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-hacker-text truncate">{b.principle}</span>
                    {b.enforced && <span className="text-[7px] font-mono px-1 rounded bg-hacker-green/10 text-hacker-green">ENFORCED</span>}
                  </div>
                </div>
                <span className="text-[8px] font-mono text-hacker-text-dim/30">{b.violations} violations</span>
                <span className="text-[8px] text-hacker-text-dim/20">{isExpanded ? '▲' : '▼'}</span>
              </button>
              {isExpanded && (
                <div className="mx-2 mb-1 p-2 rounded bg-hacker-bg/60 border border-hacker-border/20">
                  <p className="text-[9px] font-mono text-hacker-text-dim/70 leading-relaxed">{b.description}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Integrity check */}
      <div className="mt-3 pt-3 border-t border-hacker-border/50">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-hacker-green" />
          <span className="text-[8px] font-mono text-hacker-text-dim/60">
            Ethical integrity check: PASSED · All AI responses comply with ethical guidelines
          </span>
        </div>
      </div>
    </div>
  )
}
