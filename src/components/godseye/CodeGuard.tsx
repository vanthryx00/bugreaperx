import { useState } from 'react'
import { cn } from '../../lib/utils'

interface BlockedAttempt {
  id: string
  type: 'exploit-gen' | 'malware-gen' | 'phishing-gen' | 'social-eng' | 'unauthorized-access'
  prompt: string
  reason: string
  timestamp: string
  severity: 'critical' | 'high' | 'medium'
}

const mockAttempts: BlockedAttempt[] = [
  { id: 'b1', type: 'exploit-gen', prompt: 'Generate a zero-day exploit for...', reason: 'Criminal code generation blocked — violates ethical boundary #1', timestamp: new Date().toISOString(), severity: 'critical' },
  { id: 'b2', type: 'phishing-gen', prompt: 'Create a convincing phishing email targeting...', reason: 'Social engineering tool generation blocked — violates guardrail #3', timestamp: new Date(Date.now() - 60000).toISOString(), severity: 'critical' },
  { id: 'b3', type: 'malware-gen', prompt: 'Write a keylogger in Python that...', reason: 'Malicious software generation blocked — violates safety rule #2', timestamp: new Date(Date.now() - 180000).toISOString(), severity: 'critical' },
  { id: 'b4', type: 'unauthorized-access', prompt: 'Help me access a server I don\'t own...', reason: 'Unauthorized access attempt blocked — ethical boundary #4', timestamp: new Date(Date.now() - 600000).toISOString(), severity: 'high' },
  { id: 'b5', type: 'social-eng', prompt: 'Write a script to manipulate employees into...', reason: 'Social engineering tool blocked — guardrail #5', timestamp: new Date(Date.now() - 1800000).toISOString(), severity: 'high' },
]

const typeConfig: Record<string, { icon: string; label: string }> = {
  'exploit-gen': { icon: '⚡', label: 'Exploit Gen' },
  'malware-gen': { icon: '◉', label: 'Malware Gen' },
  'phishing-gen': { icon: '◈', label: 'Phishing Gen' },
  'social-eng': { icon: '◎', label: 'Social Eng' },
  'unauthorized-access': { icon: '◻', label: 'Unauth Access' },
}

const severityColors: Record<string, string> = {
  critical: 'text-hacker-red',
  high: 'text-hacker-amber',
  medium: 'text-hacker-cyan',
}

const severityBorderColors: Record<string, string> = {
  critical: 'border-hacker-red',
  high: 'border-hacker-amber',
  medium: 'border-hacker-cyan',
}

export function CodeGuard() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [attempts] = useState(mockAttempts)

  return (
    <div className="hacker-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-hacker-red text-lg">⚡</span>
          <h3 className="text-xs font-semibold text-hacker-text font-mono">ANTI-CODE ENGINE</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-hacker-green">{attempts.length} blocked</span>
          <span className="w-1.5 h-1.5 rounded-full bg-hacker-green" />
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {Object.entries(typeConfig).map(([key, cfg]) => {
          const count = attempts.filter(a => a.type === key).length
          return (
            <div key={key} className="text-center p-1.5 rounded bg-hacker-bg/30">
              <p className="text-xs">{cfg.icon}</p>
              <p className="text-[9px] font-mono text-hacker-text-dim/60">{cfg.label}</p>
              <p className="text-sm font-bold font-mono text-hacker-red">{count}</p>
            </div>
          )
        })}
      </div>

      {/* Blocked attempts feed */}
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {attempts.map((a) => (
          <div key={a.id}>
            <button
              onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded bg-hacker-red/5 hover:bg-hacker-red/10 transition-colors text-left"
            >
              <span className={cn('text-[9px] font-mono px-1 py-0.5 rounded border', `${severityBorderColors[a.severity]}/20 ${severityColors[a.severity]} bg-current/10`)}>
                BLOCKED
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-mono text-hacker-text truncate">{a.prompt}</p>
              </div>
              <span className="text-[8px] font-mono text-hacker-text-dim/30">
                {new Date(a.timestamp).toLocaleTimeString('en-US', { hour12: false })}
              </span>
            </button>
            {expandedId === a.id && (
              <div className="mx-2 mb-1 p-2 rounded bg-hacker-red/5 border border-hacker-red/10">
                <p className="text-[9px] font-mono text-hacker-amber">Reason: {a.reason}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Status */}
      <div className="mt-3 pt-3 border-t border-hacker-border/50">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-hacker-green animate-pulse" />
          <span className="text-[9px] font-mono text-hacker-green">Railguard AI active — scanning all code generation requests</span>
        </div>
        <p className="text-[8px] font-mono text-hacker-text-dim/50 mt-1">
          Zero malicious code has passed through the system. All blocked attempts logged and timestamped.
        </p>
      </div>
    </div>
  )
}
