import { useState, useEffect } from 'react'
import { cn } from '../../lib/utils'
import type { SecurityMetric } from '../../types'

const metrics: SecurityMetric[] = [
  { id: 'code-guard', label: 'Code Generation Guard', value: 98, status: 'secure', detail: 'Anti-malicious-code AI railguards active' },
  { id: 'privacy', label: 'Privacy Shield', value: 94, status: 'secure', detail: 'PII masking · Data encryption active' },
  { id: 'session', label: 'Session Isolation', value: 100, status: 'secure', detail: 'All sessions sandboxed and monitored' },
  { id: 'network', label: 'Network Monitor', value: 88, status: 'warning', detail: 'Outbound traffic filtered · 2 alerts today' },
  { id: 'credential', label: 'Credential Guard', value: 96, status: 'secure', detail: 'No credential leakage detected' },
  { id: 'ethics', label: 'Ethical Boundary', value: 100, status: 'secure', detail: 'All AI responses within ethical bounds' },
]

const statusColors = {
  secure: 'text-hacker-green',
  warning: 'text-hacker-amber',
  critical: 'text-hacker-red',
}

const statusBg = {
  secure: 'bg-hacker-green',
  warning: 'bg-hacker-amber',
  critical: 'bg-hacker-red',
}

export function SecurityHealth() {
  const [score, setScore] = useState(0)

  useEffect(() => {
    const target = Math.round(metrics.reduce((s, m) => s + m.value, 0) / metrics.length)
    let current = 0
    const step = Math.ceil(target / 30)
    const interval = setInterval(() => {
      current = Math.min(current + step, target)
      setScore(current)
      if (current >= target) clearInterval(interval)
    }, 40)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="hacker-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-hacker-green text-lg">◉</span>
          <h3 className="text-xs font-semibold text-hacker-text font-mono">SECURITY HEALTH</h3>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-2xl font-bold font-mono text-hacker-green tabular-nums">{score}</span>
          <span className="text-[10px] text-hacker-text-dim font-mono">/100</span>
        </div>
      </div>

      {/* Animated radar ring */}
      <div className="relative flex items-center justify-center mb-4">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#1a1a1a" strokeWidth="3" />
          <circle
            cx="50" cy="50" r="42"
            fill="none"
            stroke="#00ff41"
            strokeWidth="3"
            strokeDasharray={`${(score / 100) * 264} 264`}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
          <circle cx="50" cy="50" r="30" fill="none" stroke="#1a1a1a" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="50" cy="50" r="15" fill="none" stroke="#1a1a1a" strokeWidth="1" strokeDasharray="2 4" />
          <text x="50" y="54" textAnchor="middle" fill="#00ff41" fontSize="18" fontFamily="monospace" fontWeight="bold">
            {score}
          </text>
        </svg>
      </div>

      {/* Metrics breakdown */}
      <div className="space-y-2">
        {metrics.map((m) => (
          <div key={m.id} className="flex items-center gap-2">
            <div className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', statusBg[m.status])} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-hacker-text truncate">{m.label}</span>
                <span className={cn('text-[10px] font-mono flex-shrink-0 ml-2', statusColors[m.status])}>{m.value}%</span>
              </div>
              <div className="w-full h-1 bg-hacker-surface2 rounded mt-0.5 overflow-hidden">
                <div
                  className={cn('h-full rounded transition-all duration-1000', statusBg[m.status])}
                  style={{ width: `${m.value}%`, opacity: 0.6 }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-hacker-border/50">
        <p className="text-[9px] font-mono text-hacker-text-dim/60 leading-relaxed">
          All safety railguards operational. No criminal activity patterns detected.
          System is within ethical boundaries. Privacy encryption at full strength.
        </p>
      </div>
    </div>
  )
}
