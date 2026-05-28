import { ChatInterface } from '../components/jarvis/ChatInterface'
import { SafetyGuardrails } from '../components/jarvis/SafetyGuardrails'
import { PrivacyShield } from '../components/jarvis/PrivacyShield'
import { EthicalBoundary } from '../components/jarvis/EthicalBoundary'

export function JarvisPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-hacker-text-bright font-mono tracking-wide flex items-center gap-2">
            <span className="text-hacker-cyan">●</span>
            <span>▸ JARVIS</span>
          </h1>
          <p className="text-sm text-hacker-text-dim mt-1 font-mono">
            Security AI assistant · Safety railguards · Privacy protection
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-hacker-green animate-pulse" />
            <span className="text-[10px] font-mono text-hacker-green">Online</span>
          </div>
          <div className="h-4 w-px bg-hacker-border" />
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-hacker-red/10 text-hacker-red border border-hacker-red/20">
              422 blocked
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-hacker-green/10 text-hacker-green border border-hacker-green/20">
              6 guardrails
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Safety Rules Active', value: '6', sub: '100% enforcement', color: 'text-hacker-green' },
          { label: 'Criminal Requests Blocked', value: '422', sub: 'All logged', color: 'text-hacker-red' },
          { label: 'Privacy Violations', value: '0', sub: 'Zero tolerance', color: 'text-hacker-cyan' },
          { label: 'Ethical Compliance', value: '100%', sub: 'All responses', color: 'text-hacker-purple' },
        ].map((stat) => (
          <div key={stat.label} className="hacker-card p-3">
            <p className="text-[10px] text-hacker-text-dim font-mono uppercase tracking-wider">{stat.label}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</span>
              <span className={`text-[9px] font-mono ${stat.color}`}>{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-3 gap-4">
        {/* Chat Area (spans 2 cols) */}
        <ChatInterface />

        {/* Right Panel */}
        <div className="space-y-4">
          <SafetyGuardrails />
          <PrivacyShield />
          <EthicalBoundary />
        </div>
      </div>

      {/* Bottom Safety Notice */}
      <div className="hacker-card p-3 border-hacker-red/20 bg-hacker-red/5">
        <div className="flex items-center gap-3">
          <span className="text-hacker-red text-lg">⛔</span>
          <div className="flex-1">
            <p className="text-[10px] font-mono text-hacker-red font-semibold">SAFETY NOTICE</p>
            <p className="text-[9px] font-mono text-hacker-text-dim/70 mt-0.5">
              JARVIS is an ethical AI assistant for authorized security research only. All conversations are monitored by
              the Godseye security oversight system. Criminal activity requests are immediately blocked, logged, and flagged.
              By using JARVIS, you agree to operate within legal and ethical boundaries.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-hacker-green">
            <span className="w-1 h-1 rounded-full bg-hacker-green" />
            <span>Compliant</span>
          </div>
        </div>
      </div>
    </div>
  )
}
