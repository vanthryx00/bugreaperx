import { useGameStore } from '../../lib/game/store'

export function CombatPanel() {
  const combat = useGameStore(s => s.combat)
  const hero = useGameStore(s => s.hero)
  const playerAttack = useGameStore(s => s.playerAttack)
  const monsterTurn = useGameStore(s => s.monsterTurn)
  const endCombat = useGameStore(s => s.endCombat)

  if (!combat.active || !combat.targetMonster || !hero) return null

  const handleAttack = () => {
    const result = playerAttack()
    if (result && !result.killed) {
      // Monster fights back after a short delay
      setTimeout(() => {
        monsterTurn()
      }, 800)
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center pb-24 pointer-events-none">
      <div className="pointer-events-auto bg-hacker-bg/90 backdrop-blur-md border border-hacker-border/40 rounded-xl p-4 w-full max-w-md shadow-[0_0_40px_rgba(0,0,0,0.6)]">
        {/* Combat Header */}
        <div className="text-center mb-3">
          <div className="text-[10px] font-mono text-hacker-red animate-pulse mb-1">⚔ COMBAT ENGAGED</div>
          {combat.turn === 'monster' && (
            <div className="text-xs font-mono text-hacker-amber">Monster's turn — defending...</div>
          )}
        </div>

        {/* Monster Info */}
        {combat.targetMonster && (
          <div className="bg-hacker-bg/50 border border-hacker-border/20 rounded-lg p-3 mb-3">
            <div className="text-xs font-bold text-hacker-text-bright mb-1">
              {combat.targetMonster.defId.toUpperCase()} — {combat.targetMonster.hp}/{combat.targetMonster.maxHp} HP
            </div>
            <div className="h-2 bg-hacker-bg border border-hacker-border/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-hacker-red to-hacker-red/70 rounded-full transition-all duration-300"
                style={{ width: `${(combat.targetMonster.hp / combat.targetMonster.maxHp) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Player Info */}
        <div className="bg-hacker-bg/50 border border-hacker-border/20 rounded-lg p-3 mb-3">
          <div className="text-xs font-bold text-hacker-text-bright mb-1">
            {hero.name} — {hero.stats.hp}/{hero.stats.maxHp} HP
          </div>
          <div className="h-2 bg-hacker-bg border border-hacker-border/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-hacker-green to-hacker-cyan rounded-full transition-all duration-300"
              style={{ width: `${(hero.stats.hp / hero.stats.maxHp) * 100}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleAttack}
            disabled={combat.turn !== 'player' || hero.stats.hp <= 0}
            className="py-3 bg-hacker-green/10 border border-hacker-green/30 rounded-lg text-sm font-mono text-hacker-green hover:bg-hacker-green/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            ⚔ Attack
          </button>
          <button
            onClick={endCombat}
            className="py-3 bg-hacker-bg border border-hacker-border/30 rounded-lg text-sm font-mono text-hacker-text-dim/50 hover:text-hacker-text-dim hover:border-hacker-border/60 transition-all"
          >
            ✕ Flee
          </button>
        </div>
      </div>
    </div>
  )
}
