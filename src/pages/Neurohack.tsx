import { SprintEngine } from '../components/neurohack/SprintEngine'

export function NeurohackPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-hacker-text-bright font-mono tracking-wide flex items-center gap-2">
            <span className="text-hacker-amber">⚡</span>
            <span>▸ NEUROHACK SOVEREIGN</span>
          </h1>
          <p className="text-sm text-hacker-text-dim mt-1 font-mono">
            ADHD → APEX protocol · Compress 4-week learning into 4-hour sprints · Zero friction · Maximum velocity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-hacker-amber animate-pulse" />
          <span className="text-[10px] font-mono text-hacker-amber">Flow state ready</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Feynman Speed-Run', value: '4h', sub: 'Learn → Teach', color: 'text-hacker-green', icon: '⚡' },
          { label: 'Reverse Engineer', value: '3h', sub: 'Expert → Rebuild', color: 'text-hacker-cyan', icon: '◎' },
          { label: 'Constraint Mastery', value: '4h', sub: 'MVP → Iterate', color: 'text-hacker-purple', icon: '◈' },
          { label: 'Dopamine Triggers', value: '5', sub: 'Momentum hits', color: 'text-hacker-amber', icon: '◉' },
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

      {/* Main Engine */}
      <SprintEngine />

      {/* Principles Banner */}
      <div className="hacker-card p-4 border-hacker-amber/20 bg-hacker-amber/5">
        <div className="flex items-center gap-4">
          <span className="text-hacker-amber text-lg">⚡</span>
          <div className="flex-1">
            <p className="text-[10px] font-mono text-hacker-amber font-semibold">NEUROHACK PRINCIPLES</p>
            <div className="flex items-center gap-4 mt-1 text-[8px] font-mono text-hacker-text-dim/70">
              <span>1. Compress learning → 4 hours max</span>
              <span>·</span>
              <span>2. Remove friction → zero decisions</span>
              <span>·</span>
              <span>3. Dopamine optimization → instant feedback</span>
              <span>·</span>
              <span>4. Context switching cost → eliminated</span>
              <span>·</span>
              <span>5. Execution clarity → always know next action</span>
            </div>
          </div>
        </div>
      </div>

      {/* Python CLI Reference */}
      <div className="hacker-card p-3 border-hacker-text-dim/10">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-hacker-text-dim/50">CLI module available at</span>
          <code className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-hacker-bg text-hacker-cyan border border-hacker-border/30">neurohack_sovereign.py</code>
          <span className="text-[10px] font-mono text-hacker-text-dim/50">— run standalone or</span>
          <code className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-hacker-bg text-hacker-green border border-hacker-border/30">from neurohack_sovereign import NeurohackEngine</code>
        </div>
      </div>
    </div>
  )
}
