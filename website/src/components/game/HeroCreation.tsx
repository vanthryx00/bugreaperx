import { useState } from 'react'
import { HeroClass } from '../../lib/game/types'
import { HERO_CLASSES } from '../../lib/game/hero'
import { useGameStore } from '../../lib/game/store'

export function HeroCreation() {
  const [name, setName] = useState('')
  const [selectedClass, setSelectedClass] = useState<HeroClass | null>(null)
  const createNewHero = useGameStore(s => s.createNewHero)
  const setScreen = useGameStore(s => s.setScreen)

  const handleCreate = () => {
    if (!name.trim() || !selectedClass) return
    createNewHero(name.trim(), selectedClass)
  }

  return (
    <div className="min-h-screen bg-hacker-bg flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-4xl">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-hacker-text-bright mb-2">
            CREATE YOUR <span className="text-gradient">HUNTER</span>
          </h1>
          <p className="text-sm font-mono text-hacker-text-dim">
            Choose your class and enter the Dark Web Grid
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Name + Class Selection */}
          <div className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-xs font-mono text-hacker-text-dim mb-2">
                HUNTER HANDLE
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 20))}
                placeholder="Enter your alias..."
                className="w-full px-4 py-3 bg-hacker-bg border border-hacker-border/50 rounded-lg text-sm text-hacker-text-bright font-mono placeholder:text-hacker-text-dim/30 focus:outline-none focus:border-hacker-green/50 focus:shadow-[0_0_15px_rgba(0,255,65,0.08)] transition-all"
                maxLength={20}
              />
              <span className="text-[10px] font-mono text-hacker-text-dim/30 mt-1 block">
                {name.length}/20 characters
              </span>
            </div>

            {/* Class Selection */}
            <div>
              <label className="block text-xs font-mono text-hacker-text-dim mb-3">
                SELECT CLASS
              </label>
              <div className="grid grid-cols-1 gap-2">
                {HERO_CLASSES.map((hc) => (
                  <button
                    key={hc.id}
                    onClick={() => setSelectedClass(hc.id)}
                    className={`text-left px-4 py-3 rounded-lg border transition-all duration-200 ${
                      selectedClass === hc.id
                        ? 'bg-hacker-green/10 border-hacker-green/50 shadow-[0_0_15px_rgba(0,255,65,0.1)]'
                        : 'bg-hacker-bg border-hacker-border/30 hover:border-hacker-border/60 hover:bg-hacker-bg/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-bold ${
                        selectedClass === hc.id ? 'text-hacker-green' : 'text-hacker-text-bright'
                      }`}>
                        {hc.name}
                      </span>
                      <span className="text-[9px] font-mono text-hacker-text-dim/40">
                        ATK {hc.baseStats.attack} · DEF {hc.baseStats.defense} · SPD {hc.baseStats.speed}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-hacker-text-dim/60 mt-1 leading-relaxed">
                      {hc.description}
                    </p>
                    <p className="text-[9px] font-mono text-hacker-cyan/60 mt-1">
                      {hc.ability}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setScreen('menu')}
                className="px-4 py-3.5 bg-hacker-bg border border-hacker-border/30 text-hacker-text-dim rounded-lg text-xs font-mono hover:border-hacker-text-dim/40 hover:text-hacker-text-dim/70 transition-all"
              >
                ← Back
              </button>
              <button
                onClick={handleCreate}
                disabled={!name.trim() || !selectedClass}
                className="flex-1 py-3.5 bg-hacker-green text-hacker-bg font-bold rounded-lg text-sm hover:bg-hacker-green-dim disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                ENTER THE GRID →
              </button>
            </div>
          </div>

          {/* Right: Hero Preview */}
          <div className="hidden lg:flex flex-col items-center justify-center bg-hacker-bg/50 border border-hacker-border/20 rounded-xl p-8 min-h-[400px]">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-hacker-green/20 via-hacker-cyan/10 to-hacker-purple/20 border-2 border-hacker-green/30 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(0,255,65,0.08)]">
              <span className="text-5xl text-hacker-green/60">
                {selectedClass ? (
                  { recon_scout: '🔍', vuln_breaker: '⚡', payload_slinger: '🎯', web_reaper: '⚔️', cloud_warden: '🛡️' }[selectedClass]
                ) : '?'}
              </span>
            </div>

            {selectedClass ? (
              <div className="text-center">
                <h3 className="text-lg font-bold text-hacker-text-bright mb-1">
                  {name || 'YOUR NAME'}
                </h3>
                <p className="text-sm font-mono text-hacker-cyan mb-4">
                  {HERO_CLASSES.find(c => c.id === selectedClass)?.name}
                </p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: 'HP', value: HERO_CLASSES.find(c => c.id === selectedClass)?.baseStats.hp },
                    { label: 'ATK', value: HERO_CLASSES.find(c => c.id === selectedClass)?.baseStats.attack },
                    { label: 'DEF', value: HERO_CLASSES.find(c => c.id === selectedClass)?.baseStats.defense },
                  ].map(stat => (
                    <div key={stat.label} className="bg-hacker-bg/50 border border-hacker-border/20 rounded-lg p-2">
                      <div className="text-[9px] font-mono text-hacker-text-dim/40">{stat.label}</div>
                      <div className="text-lg font-bold text-hacker-green">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm font-mono text-hacker-text-dim/40 text-center">
                Select a class to preview your hunter
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
