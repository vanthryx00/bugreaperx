import { AdventureProfile } from '../components/adventure/AdventureProfile'

export function AdventurePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-hacker-text-bright font-mono tracking-wide flex items-center gap-2">
            <span className="text-hacker-amber">⚡</span>
            <span>▸ ADVENTURE MODE</span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-hacker-amber/10 text-hacker-amber border border-hacker-amber/20">GAMIFIED</span>
          </h1>
          <p className="text-sm text-hacker-text-dim mt-1 font-mono">
            Level up through sprints · Earn XP · Unlock badges · Build streaks · Conquer the leaderboard
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-hacker-amber animate-pulse" />
          <span className="text-[10px] font-mono text-hacker-amber">XP tracking active</span>
        </div>
      </div>

      {/* Quick stats banner */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'XP per Sprint', value: '25 + 10/phase', icon: '⚡', color: 'text-hacker-green' },
          { label: 'Badges', value: '12 total', icon: '🏆', color: 'text-hacker-cyan' },
          { label: 'Max Streak Reward', value: '2x XP', icon: '🔥', color: 'text-hacker-amber' },
          { label: 'Max Level', value: '100', icon: '👑', color: 'text-hacker-purple' },
        ].map((stat) => (
          <div key={stat.label} className="hacker-card p-3">
            <p className="text-[10px] text-hacker-text-dim font-mono uppercase tracking-wider">{stat.label}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-lg font-bold font-mono ${stat.color}`}>{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Adventure Profile */}
      <AdventureProfile />

      {/* XP guide */}
      <div className="hacker-card p-4 border-hacker-amber/20 bg-hacker-amber/5">
        <div className="flex items-center gap-3">
          <span className="text-hacker-amber text-lg">⚡</span>
          <div className="flex-1">
            <p className="text-[10px] font-mono text-hacker-amber font-semibold">XP EARNED PER SPRINT</p>
            <div className="flex items-center gap-4 mt-1 text-[8px] font-mono text-hacker-text-dim/70">
              <span>Base: 25 XP per completed sprint</span>
              <span>·</span>
              <span>+10 XP per completed phase</span>
              <span>·</span>
              <span>2x XP on 7+ day streaks</span>
              <span>·</span>
              <span>Badges unlock automatically on achievement</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
