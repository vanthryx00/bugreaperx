import { useGameStore } from '../../lib/game/store'
import { getWeapon } from '../../lib/game/weapons'
import { getArmour } from '../../lib/game/armour'
import { HERO_CLASSES } from '../../lib/game/hero'

export function GameHUD() {
  const hero = useGameStore(s => s.hero)
  const combat = useGameStore(s => s.combat)
  const setScreen = useGameStore(s => s.setScreen)
  const monsters = useGameStore(s => s.monsters)

  if (!hero) return null

  const classDef = HERO_CLASSES.find(c => c.id === hero.heroClass)
  const equippedWeapon = hero.equippedWeapon ? getWeapon(hero.equippedWeapon) : null
  const equippedArmour = hero.equippedArmour ? getArmour(hero.equippedArmour) : null
  const hpPercent = (hero.stats.hp / hero.stats.maxHp) * 100
  const xpPercent = (hero.stats.xp / hero.stats.xpToNext) * 100

  return (
    <div className="fixed top-4 left-4 right-4 z-40 flex items-start justify-between gap-4 pointer-events-none">
      {/* Left: hero info */}
      <div className="pointer-events-auto bg-hacker-bg/85 backdrop-blur-md border border-hacker-border/40 rounded-lg p-3 min-w-[240px] shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        {/* Name + Class */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-bold text-hacker-text-bright">{hero.name}</h3>
            <span className="text-[10px] font-mono text-hacker-cyan">{classDef?.name} Lv.{hero.stats.level}</span>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-hacker-green">{hero.brxTokens} BRX</span>
          </div>
        </div>

        {/* HP Bar */}
        <div className="mb-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono mb-0.5">
            <span className="text-hacker-red">HP</span>
            <span className="text-hacker-text-dim">{hero.stats.hp}/{hero.stats.maxHp}</span>
          </div>
          <div className="h-1.5 bg-hacker-bg border border-hacker-border/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-hacker-red to-hacker-red/70 rounded-full transition-all duration-300"
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>

        {/* XP Bar */}
        <div className="mb-2">
          <div className="flex items-center justify-between text-[10px] font-mono mb-0.5">
            <span className="text-hacker-purple">XP</span>
            <span className="text-hacker-text-dim">{hero.stats.xp}/{hero.stats.xpToNext}</span>
          </div>
          <div className="h-1 bg-hacker-bg border border-hacker-border/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-hacker-purple to-hacker-cyan rounded-full transition-all duration-300"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>

        {/* Equipped Items */}
        <div className="flex gap-2 text-[9px] font-mono text-hacker-text-dim">
          {equippedWeapon && (
            <span className="px-1.5 py-0.5 rounded bg-hacker-green/10 border border-hacker-green/20 text-hacker-green">
              {equippedWeapon.name}
            </span>
          )}
          {equippedArmour && (
            <span className="px-1.5 py-0.5 rounded bg-hacker-cyan/10 border border-hacker-cyan/20 text-hacker-cyan">
              {equippedArmour.name}
            </span>
          )}
          {!equippedWeapon && !equippedArmour && (
            <span className="text-hacker-text-dim/40">No equipment</span>
          )}
        </div>

        {/* Quick Stats Row */}
        <div className="mt-2 flex gap-2 text-[9px] font-mono text-hacker-text-dim/60">
          <span>ATK {hero.stats.attack}</span>
          <span>DEF {hero.stats.defense}</span>
          <span>SPD {hero.stats.speed}</span>
          <span>LUK {hero.stats.luck}</span>
        </div>
      </div>

      {/* Right: action buttons */}
      <div className="pointer-events-auto flex gap-2">
        {combat.active && (
          <div className="bg-hacker-red/20 border border-hacker-red/30 rounded-lg px-3 py-2 text-center">
            <div className="text-[10px] font-mono text-hacker-red animate-pulse">⚔ COMBAT</div>
            <div className="text-[9px] font-mono text-hacker-text-dim">Turn {combat.turnCount}</div>
          </div>
        )}
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setScreen('shop')}
            className="text-[10px] px-2 py-1 bg-hacker-bg/70 border border-hacker-border/30 rounded text-hacker-text-dim hover:text-hacker-green hover:border-hacker-green/30 transition-all font-mono"
          >
            Shop
          </button>
          <button
            onClick={() => setScreen('wallet')}
            className="text-[10px] px-2 py-1 bg-hacker-bg/70 border border-hacker-border/30 rounded text-hacker-text-dim hover:text-hacker-cyan hover:border-hacker-cyan/30 transition-all font-mono"
          >
            Wallet
          </button>
          <span className="text-[9px] font-mono text-hacker-text-dim/30 text-center">
            {monsters.filter(m => m.alive).length} mobs
          </span>
        </div>
      </div>
    </div>
  )
}
