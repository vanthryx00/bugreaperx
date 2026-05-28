import { useState, useEffect } from 'react'
import { cn } from '../../lib/utils'
import type { AdventureProfile, Badge, LevelTier } from '../../types'

const LEVEL_TIERS: LevelTier[] = [
  { level: 1, title: 'Script Kiddie', icon: '◻', color: 'text-hacker-text-dim', xpRequired: 0 },
  { level: 5, title: 'Recon Runner', icon: '◎', color: 'text-hacker-green', xpRequired: 200 },
  { level: 10, title: 'Payload Crafter', icon: '◈', color: 'text-hacker-cyan', xpRequired: 600 },
  { level: 20, title: 'Exploit Engineer', icon: '⚔', color: 'text-hacker-amber', xpRequired: 1500 },
  { level: 35, title: 'Zero Day Hunter', icon: '◉', color: 'text-hacker-amber', xpRequired: 3500 },
  { level: 50, title: 'Bug Reaper', icon: '⚡', color: 'text-hacker-purple', xpRequired: 7000 },
  { level: 75, title: 'Apex Sovereign', icon: '🏆', color: 'text-hacker-green', xpRequired: 15000 },
  { level: 100, title: 'Hack God', icon: '👑', color: 'text-hacker-red', xpRequired: 30000 },
]

export function AdventureProfile() {
  const [profile, setProfile] = useState<AdventureProfile>(() => {
    try {
      const saved = localStorage.getItem('adventure_profile')
      return saved ? JSON.parse(saved) : {
        xp: 0, level: 1, streak: 0, longestStreak: 0,
        lastSprintDate: null, totalSprintsCompleted: 0,
        totalPhasesCompleted: 0, badges: [],
        unlockedProtocols: ['feynman_speedrun'],
        xpToNextLevel: LEVEL_TIERS[1]?.xpRequired || 200,
      }
    } catch {
      return {
        xp: 0, level: 1, streak: 0, longestStreak: 0,
        lastSprintDate: null, totalSprintsCompleted: 0,
        totalPhasesCompleted: 0, badges: [],
        unlockedProtocols: ['feynman_speedrun'],
        xpToNextLevel: 200,
      }
    }
  })

  const [showBadgeNotification, setShowBadgeNotification] = useState<string | null>(null)

  // Sync with Neurohack sprint completions
  useEffect(() => {
    const checkSprintCompletions = () => {
      try {
        const history = JSON.parse(localStorage.getItem('neurohack_history') || '[]') as any[]
        if (!history.length) return

        const lastCompleted = history[0]
        const lastCompletedDate = lastCompleted.completed_at || lastCompleted.started_at
        const completedDate = new Date(lastCompletedDate).toDateString()

        if (profile.lastSprintDate !== completedDate) {
          const completedPhases = lastCompleted.phases?.filter((p: any) => p.completed).length || 0
          const xpGain = 25 + completedPhases * 10
          const updated = { ...profile }
          updated.xp += xpGain
          updated.totalSprintsCompleted += 1
          updated.totalPhasesCompleted += completedPhases
          updated.lastSprintDate = completedDate

          // Streak tracking
          const today = new Date().toDateString()
          const yesterday = new Date(Date.now() - 86400000).toDateString()
          if (profile.lastSprintDate === yesterday || !profile.lastSprintDate) {
            updated.streak += 1
          } else if (profile.lastSprintDate !== today) {
            updated.streak = 1
          }
          if (updated.streak > updated.longestStreak) updated.longestStreak = updated.streak

          // Level up
          while (updated.xp >= updated.xpToNextLevel) {
            updated.xp -= updated.xpToNextLevel
            updated.level += 1
            const nextTier = LEVEL_TIERS.find(t => t.level > updated.level)
            updated.xpToNextLevel = nextTier?.xpRequired || updated.xpToNextLevel + 500
          }

          // Check badge unlocks
          const ALL_BADGES: Badge[] = [
            { id: 'b1', name: 'First Sprint', description: 'Complete your first sprint', icon: '⚡', unlockedAt: null, condition: p => p.totalSprintsCompleted >= 1 },
            { id: 'b2', name: 'Streak 3', description: '3-day sprint streak', icon: '🔥', unlockedAt: null, condition: p => p.longestStreak >= 3 },
            { id: 'b3', name: 'Streak 7', description: '7-day sprint streak', icon: '🔥', unlockedAt: null, condition: p => p.longestStreak >= 7 },
            { id: 'b4', name: 'Streak 30', description: '30-day sprint streak', icon: '🔥', unlockedAt: null, condition: p => p.longestStreak >= 30 },
            { id: 'b5', name: 'Level 10', description: 'Reach level 10', icon: '◈', unlockedAt: null, condition: p => p.level >= 10 },
            { id: 'b6', name: 'Level 25', description: 'Reach level 25', icon: '◉', unlockedAt: null, condition: p => p.level >= 25 },
            { id: 'b7', name: 'Level 50', description: 'Reach level 50', icon: '⚡', unlockedAt: null, condition: p => p.level >= 50 },
            { id: 'b8', name: 'Level 100', description: 'Reach level 100', icon: '👑', unlockedAt: null, condition: p => p.level >= 100 },
            { id: 'b9', name: '10 Sprints', description: 'Complete 10 sprints', icon: '◈', unlockedAt: null, condition: p => p.totalSprintsCompleted >= 10 },
            { id: 'b10', name: 'Phase Master', description: 'Complete 50 phases', icon: '◎', unlockedAt: null, condition: p => p.totalPhasesCompleted >= 50 },
            { id: 'b11', name: 'All Protocols', description: 'Unlock all protocols', icon: '⚔', unlockedAt: null, condition: p => p.unlockedProtocols.length >= 3 },
            { id: 'b12', name: 'Centurion', description: 'Complete 100 phases', icon: '🏆', unlockedAt: null, condition: p => p.totalPhasesCompleted >= 100 },
          ]

          ALL_BADGES.forEach(badge => {
            const alreadyUnlocked = updated.badges.find(b => b.id === badge.id)
            if (!alreadyUnlocked && badge.condition(updated)) {
              updated.badges.push({ ...badge, unlockedAt: new Date().toISOString() })
              setShowBadgeNotification(badge.name)
              setTimeout(() => setShowBadgeNotification(null), 3000)
            }
          })

          setProfile(updated)
          localStorage.setItem('adventure_profile', JSON.stringify(updated))
        }
      } catch {}
    }

    checkSprintCompletions()
  }, [])

  const currentTier = [...LEVEL_TIERS].reverse().find(t => profile.level >= t.level) || LEVEL_TIERS[0]
  const nextTier = LEVEL_TIERS.find(t => t.level > profile.level)
  const xpPercent = (profile.xp / profile.xpToNextLevel) * 100
  const unlockedBadges = profile.badges.filter(b => b.unlockedAt)
  const lockedBadgesCount = 12 - unlockedBadges.length

  return (
    <div className="space-y-4">
      {/* Badge notification */}
      {showBadgeNotification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="hacker-card px-6 py-3 border-hacker-amber/40 bg-hacker-amber/10 flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <div>
              <p className="text-[10px] font-mono text-hacker-amber uppercase tracking-wider">Badge Unlocked!</p>
              <p className="text-xs font-mono text-hacker-text">{showBadgeNotification}</p>
            </div>
          </div>
        </div>
      )}

      {/* Profile header */}
      <div className="hacker-card p-4">
        <div className="flex items-center gap-4">
          <div className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center text-2xl border',
            currentTier.color,
            'border-hacker-green/30',
            'bg-hacker-green/10'
          )}>
            {currentTier.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold font-mono text-hacker-text-bright">
                Level {profile.level}
              </h2>
              <span className={cn('text-[9px] font-mono px-1.5 py-0.5 rounded bg-current/10 border border-current/20', currentTier.color)}>
                {currentTier.title}
              </span>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[8px] font-mono text-hacker-text-dim/50">XP TO NEXT LEVEL</span>
                <span className="text-[8px] font-mono text-hacker-text-dim/70">{profile.xp} / {profile.xpToNextLevel}</span>
              </div>
              <div className="w-full h-1.5 bg-hacker-surface2 rounded overflow-hidden">
                <div
                  className="h-full rounded bg-gradient-to-r from-hacker-green to-hacker-cyan transition-all duration-500"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
            {nextTier && (
              <p className="text-[7px] font-mono text-hacker-text-dim/40 mt-1">
                Next rank: {nextTier.title} (Level {nextTier.level})
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Sprints', value: profile.totalSprintsCompleted, icon: '⚡', color: 'text-hacker-green' },
          { label: 'Phases', value: profile.totalPhasesCompleted, icon: '◈', color: 'text-hacker-cyan' },
          { label: 'Streak', value: `${profile.streak}d`, icon: '🔥', color: 'text-hacker-amber' },
          { label: 'Best Streak', value: `${profile.longestStreak}d`, icon: '🏆', color: 'text-hacker-purple' },
        ].map((stat) => (
          <div key={stat.label} className="hacker-card p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <span className={cn('text-xs', stat.color)}>{stat.icon}</span>
              <span className="text-[8px] font-mono text-hacker-text-dim/50">{stat.label}</span>
            </div>
            <span className={cn('text-lg font-bold font-mono', stat.color)}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Streak calendar */}
      <div className="hacker-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-hacker-amber text-sm">🔥</span>
            <h3 className="text-xs font-mono text-hacker-text">STREAK TRACKER</h3>
          </div>
          <span className="text-[9px] font-mono text-hacker-amber">{profile.streak}-day streak</span>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: 30 }, (_, i) => {
            const dayNum = i
            const isActive = i < profile.streak
            return (
              <div
                key={i}
                className={cn(
                  'flex-1 h-4 rounded-sm transition-all duration-300',
                  isActive ? 'bg-hacker-amber shadow-[0_0_4px_rgba(255,176,0,0.3)]' : 'bg-hacker-surface2'
                )}
                title={`Day ${dayNum + 1}`}
              />
            )
          })}
        </div>
      </div>

      {/* Badges */}
      <div className="hacker-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-hacker-cyan text-sm">🏆</span>
            <h3 className="text-xs font-mono text-hacker-text">BADGES</h3>
          </div>
          <span className="text-[9px] font-mono text-hacker-text-dim/50">{unlockedBadges.length} / 12</span>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {[
            { id: 'b1', name: 'First Sprint', icon: '⚡', color: 'text-hacker-green' },
            { id: 'b2', name: 'Streak 3', icon: '🔥', color: 'text-hacker-amber' },
            { id: 'b3', name: 'Streak 7', icon: '🔥', color: 'text-hacker-amber' },
            { id: 'b4', name: 'Streak 30', icon: '🔥', color: 'text-hacker-red' },
            { id: 'b5', name: 'Level 10', icon: '◈', color: 'text-hacker-cyan' },
            { id: 'b6', name: 'Level 25', icon: '◉', color: 'text-hacker-purple' },
            { id: 'b7', name: 'Level 50', icon: '⚡', color: 'text-hacker-amber' },
            { id: 'b8', name: 'Level 100', icon: '👑', color: 'text-hacker-red' },
            { id: 'b9', name: '10 Sprints', icon: '◈', color: 'text-hacker-green' },
            { id: 'b10', name: 'Phase Master', icon: '◎', color: 'text-hacker-cyan' },
            { id: 'b11', name: 'All Protocols', icon: '⚔', color: 'text-hacker-purple' },
            { id: 'b12', name: 'Centurion', icon: '🏆', color: 'text-hacker-amber' },
          ].map((badge) => {
            const unlocked = profile.badges.find(b => b.id === badge.id)?.unlockedAt
            return (
              <div
                key={badge.id}
                className={cn(
                  'flex flex-col items-center gap-1 p-2 rounded transition-all',
                  unlocked ? 'bg-hacker-green/5 border border-hacker-green/20' : 'bg-hacker-surface2 border border-transparent opacity-40'
                )}
              >
                <span className={cn('text-lg', unlocked ? badge.color : 'text-hacker-text-dim/30')}>{badge.icon}</span>
                <span className={cn('text-[7px] font-mono text-center leading-tight', unlocked ? 'text-hacker-text-dim/70' : 'text-hacker-text-dim/30')}>
                  {badge.name}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Level tiers preview */}
      <div className="hacker-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-hacker-text-dim text-sm">◈</span>
          <h3 className="text-xs font-mono text-hacker-text">RANK PROGRESSION</h3>
        </div>
        <div className="space-y-1.5">
          {LEVEL_TIERS.map((tier, i) => {
            const isUnlocked = profile.level >= tier.level
            const isCurrent = i < LEVEL_TIERS.length - 1 && profile.level >= tier.level && profile.level < (LEVEL_TIERS[i + 1]?.level || Infinity)
            return (
              <div
                key={tier.level}
                className={cn(
                  'flex items-center gap-3 px-3 py-1.5 rounded',
                  isCurrent ? 'bg-hacker-green/5 border border-hacker-green/20' : isUnlocked ? 'bg-hacker-bg/30' : 'bg-transparent opacity-40'
                )}
              >
                <span className={cn('text-sm', isUnlocked ? tier.color : 'text-hacker-text-dim/30')}>{tier.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className={cn('text-[9px] font-mono', isUnlocked ? 'text-hacker-text' : 'text-hacker-text-dim/50')}>
                      Lvl {tier.level} — {tier.title}
                    </span>
                    {isCurrent && <span className="text-[7px] font-mono text-hacker-green animate-pulse">CURRENT</span>}
                    {isUnlocked && !isCurrent && <span className="text-[7px] font-mono text-hacker-text-dim/40">UNLOCKED</span>}
                  </div>
                  <span className="text-[7px] font-mono text-hacker-text-dim/40">{tier.xpRequired} XP required</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
