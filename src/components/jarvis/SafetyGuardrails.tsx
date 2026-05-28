import { useState } from 'react'
import { cn } from '../../lib/utils'
import type { SafetyRule } from '../../types'

const safetyRules: SafetyRule[] = [
  { id: 'gr1', name: 'No Exploit Generation', description: 'Blocks requests to generate exploit code, malware, or attack vectors', category: 'criminal', severity: 'critical', active: true, blockedCount: 142 },
  { id: 'gr2', name: 'No Phishing/Social Eng', description: 'Blocks social engineering tools, phishing campaigns, and manipulation scripts', category: 'criminal', severity: 'critical', active: true, blockedCount: 89 },
  { id: 'gr3', name: 'No Unauthorized Access', description: 'Blocks instructions for accessing systems without permission', category: 'criminal', severity: 'critical', active: true, blockedCount: 56 },
  { id: 'gr4', name: 'No Data Exfiltration', description: 'Blocks data theft, exfiltration techniques, and privacy violations', category: 'malicious', severity: 'critical', active: true, blockedCount: 34 },
  { id: 'gr5', name: 'PII Protection', description: 'Prevents generation or exposure of personally identifiable information', category: 'privacy', severity: 'high', active: true, blockedCount: 78 },
  { id: 'gr6', name: 'Ethical Use Only', description: 'Ensures all generated content is for authorized security testing only', category: 'ethics', severity: 'high', active: true, blockedCount: 23 },
]

const categoryConfig: Record<string, { icon: string; color: string }> = {
  criminal: { icon: '⛔', color: 'text-hacker-red' },
  malicious: { icon: '⚡', color: 'text-hacker-amber' },
  privacy: { icon: '◈', color: 'text-hacker-cyan' },
  ethics: { icon: '◉', color: 'text-hacker-purple' },
}

const severityBg: Record<string, string> = {
  critical: 'bg-hacker-red/10 border-hacker-red/20',
  high: 'bg-hacker-amber/10 border-hacker-amber/20',
  medium: 'bg-hacker-cyan/10 border-hacker-cyan/20',
}

export function SafetyGuardrails() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const totalBlocked = safetyRules.reduce((s, r) => s + r.blockedCount, 0)

  return (
    <div className="hacker-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-hacker-red text-lg">⛔</span>
          <h3 className="text-xs font-semibold text-hacker-text font-mono">SAFETY RAILGUARDS</h3>
        </div>
        <span className="text-[10px] font-mono text-hacker-green">{totalBlocked} total blocked</span>
      </div>

      {/* Active guardrails count */}
      <div className="flex items-center gap-2 p-2 rounded bg-hacker-green/5 border border-hacker-green/10 mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-hacker-green animate-pulse" />
        <span className="text-[9px] font-mono text-hacker-green">{safetyRules.filter(r => r.active).length} of {safetyRules.length} guardrails active</span>
        <span className="flex-1" />
        <span className="text-[8px] font-mono text-hacker-text-dim/50">System secure</span>
      </div>

      {/* Rules list */}
      <div className="space-y-1 max-h-64 overflow-y-auto">
        {safetyRules.map((rule) => {
          const cat = categoryConfig[rule.category]
          const isExpanded = expandedId === rule.id

          return (
            <div key={rule.id}>
              <button
                onClick={() => setExpandedId(isExpanded ? null : rule.id)}
                className={cn(
                  'w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors text-left border',
                  severityBg[rule.severity]
                )}
              >
                <span className={cat?.color || 'text-hacker-text'}>{cat?.icon || '●'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-hacker-text truncate">{rule.name}</span>
                    {rule.active && <span className="text-[7px] font-mono px-1 rounded bg-hacker-green/10 text-hacker-green">ACTIVE</span>}
                  </div>
                </div>
                <span className="text-[9px] font-mono text-hacker-red">{rule.blockedCount}</span>
                <span className="text-[8px] text-hacker-text-dim/30">{isExpanded ? '▲' : '▼'}</span>
              </button>
              {isExpanded && (
                <div className="mx-2 mb-1 p-2 rounded bg-hacker-bg/60 border border-hacker-border/20">
                  <p className="text-[9px] font-mono text-hacker-text-dim/70 leading-relaxed">{rule.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[8px] font-mono text-hacker-text-dim/50">Category: {rule.category}</span>
                    <span className="text-[8px] font-mono text-hacker-text-dim/50">Severity: {rule.severity}</span>
                    <span className="text-[8px] font-mono text-hacker-red">{rule.blockedCount} blocked attempts</span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-hacker-border/50">
        {Object.entries(categoryConfig).map(([key, cfg]) => {
          const count = safetyRules.filter(r => r.category === key).length
          const blocked = safetyRules.filter(r => r.category === key).reduce((s, r) => s + r.blockedCount, 0)
          return (
            <div key={key} className="text-center">
              <span className={cn('text-sm', cfg.color)}>{cfg.icon}</span>
              <p className="text-[8px] font-mono text-hacker-text-dim/60 capitalize mt-0.5">{key}</p>
              <p className="text-[10px] font-bold font-mono text-hacker-text">{blocked}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
