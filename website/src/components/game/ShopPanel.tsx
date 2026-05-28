import { useState } from 'react'
import { useGameStore } from '../../lib/game/store'
import { WEAPONS } from '../../lib/game/weapons'
import { ARMOURS } from '../../lib/game/armour'
import { WeaponRarity } from '../../lib/game/types'

export function ShopPanel() {
  const hero = useGameStore(s => s.hero)
  const setScreen = useGameStore(s => s.setScreen)
  const buyWeapon = useGameStore(s => s.buyWeapon)
  const buyArmour = useGameStore(s => s.buyArmour)
  const [tab, setTab] = useState<'weapons' | 'armour'>('weapons')
  const [filterRarity, setFilterRarity] = useState<WeaponRarity | 'all'>('all')

  if (!hero) return null

  const rarityColors: Record<WeaponRarity, string> = {
    common: 'text-hacker-text-dim',
    uncommon: 'text-hacker-green',
    rare: 'text-hacker-cyan',
    epic: 'text-hacker-purple',
    legendary: 'text-hacker-amber',
  }

  const rarityBorders: Record<WeaponRarity, string> = {
    common: 'border-hacker-border/30',
    uncommon: 'border-hacker-green/30',
    rare: 'border-hacker-cyan/30',
    epic: 'border-hacker-purple/30',
    legendary: 'border-hacker-amber/30',
  }

  const filteredWeapons = filterRarity === 'all'
    ? WEAPONS
    : WEAPONS.filter(w => w.rarity === filterRarity)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-hacker-bg/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[80vh] bg-hacker-bg border border-hacker-border/50 rounded-xl shadow-[0_0_60px_rgba(0,0,0,0.5)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-hacker-border/20">
          <h2 className="text-lg font-bold text-hacker-text-bright">
            <span className="text-gradient">ARSENAL</span> SHOP
          </h2>
          <button
            onClick={() => setScreen('hub')}
            className="text-xs font-mono text-hacker-text-dim/50 hover:text-hacker-text-dim transition-colors"
          >
            ✕ Close
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-hacker-border/20">
          <button
            onClick={() => setTab('weapons')}
            className={`flex-1 py-2.5 text-xs font-mono transition-all ${
              tab === 'weapons'
                ? 'text-hacker-green border-b-2 border-hacker-green bg-hacker-green/5'
                : 'text-hacker-text-dim/50 hover:text-hacker-text-dim'
            }`}
          >
            WEAPONS ({hero.weapons.length} owned)
          </button>
          <button
            onClick={() => setTab('armour')}
            className={`flex-1 py-2.5 text-xs font-mono transition-all ${
              tab === 'armour'
                ? 'text-hacker-cyan border-b-2 border-hacker-cyan bg-hacker-cyan/5'
                : 'text-hacker-text-dim/50 hover:text-hacker-text-dim'
            }`}
          >
            ARMOUR ({hero.armour.length} owned)
          </button>
        </div>

        {/* Rarity Filter (Weapons only) */}
        {tab === 'weapons' && (
          <div className="flex gap-1 p-2 border-b border-hacker-border/10 overflow-x-auto">
            {['all', 'common', 'uncommon', 'rare', 'epic', 'legendary'].map((r) => (
              <button
                key={r}
                onClick={() => setFilterRarity(r as WeaponRarity | 'all')}
                className={`px-2 py-1 rounded text-[9px] font-mono whitespace-nowrap transition-all ${
                  filterRarity === r
                    ? 'bg-hacker-green/10 text-hacker-green border border-hacker-green/30'
                    : 'text-hacker-text-dim/40 hover:text-hacker-text-dim/70 border border-transparent'
                }`}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {tab === 'weapons' ? (
            filteredWeapons.map((weapon) => {
              const owned = hero.weapons.includes(weapon.id)
              const canAfford = hero.brxTokens >= weapon.price
              return (
                <div
                  key={weapon.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    rarityBorders[weapon.rarity]
                  } bg-hacker-bg/50`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${rarityColors[weapon.rarity]}`}>
                        {weapon.name}
                      </span>
                      <span className="text-[8px] font-mono text-hacker-text-dim/30 uppercase">
                        {weapon.rarity}
                      </span>
                    </div>
                    <p className="text-[9px] font-mono text-hacker-text-dim/50 mt-0.5">
                      {weapon.realTool} · ATK {weapon.baseDamage} · Crit {Math.round(weapon.critChance * 100)}%
                      {weapon.specialEffect !== 'None' && ` · ${weapon.specialEffect}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    {owned ? (
                      <span className="text-[9px] font-mono text-hacker-green">OWNED</span>
                    ) : (
                      <button
                        onClick={() => buyWeapon(weapon.id, weapon.price)}
                        disabled={!canAfford}
                        className={`px-3 py-1.5 rounded text-[9px] font-mono font-bold transition-all ${
                          canAfford
                            ? 'bg-hacker-green/10 border border-hacker-green/30 text-hacker-green hover:bg-hacker-green/20'
                            : 'bg-hacker-bg/50 border border-hacker-border/10 text-hacker-text-dim/30 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? `${weapon.price} BRX` : `Need ${weapon.price} BRX`}
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            ARMOURS.map((armour) => {
              const owned = hero.armour.includes(armour.id)
              const canAfford = hero.brxTokens >= armour.price
              return (
                <div
                  key={armour.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-hacker-border/30 bg-hacker-bg/50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-hacker-cyan">{armour.name}</span>
                    </div>
                    <p className="text-[9px] font-mono text-hacker-text-dim/50 mt-0.5">
                      DEF {armour.defense} · {armour.setBonus}
                      {armour.setBonus2 && ` · 2pc: ${armour.setBonus2}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    {owned ? (
                      <span className="text-[9px] font-mono text-hacker-green">OWNED</span>
                    ) : (
                      <button
                        onClick={() => buyArmour(armour.id, armour.price)}
                        disabled={!canAfford}
                        className={`px-3 py-1.5 rounded text-[9px] font-mono font-bold transition-all ${
                          canAfford
                            ? 'bg-hacker-cyan/10 border border-hacker-cyan/30 text-hacker-cyan hover:bg-hacker-cyan/20'
                            : 'bg-hacker-bg/50 border border-hacker-border/10 text-hacker-text-dim/30 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? `${armour.price} BRX` : `Need ${armour.price} BRX`}
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Balance Footer */}
        <div className="border-t border-hacker-border/20 p-3 flex items-center justify-between">
          <span className="text-[9px] font-mono text-hacker-text-dim/40">
            BRX Balance
          </span>
          <span className="text-xs font-mono text-hacker-green font-bold">
            {hero.brxTokens.toLocaleString()} BRX
          </span>
        </div>
      </div>
    </div>
  )
}
