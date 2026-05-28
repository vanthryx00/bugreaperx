import { useState, useMemo } from 'react'
import { cn } from '../lib/utils'
import { arsenalWeapons, weaponCategories } from '../data/arsenal'
import type { ArsenalWeapon } from '../data/arsenal'

export function ArsenalPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filteredWeapons = useMemo(() => {
    let weapons = arsenalWeapons

    if (!showAll && activeCategory) {
      weapons = weapons.filter(w => w.category === activeCategory)
    } else if (!showAll) {
      // Smart Hunt mode: show only high-signal categories
      weapons = weapons.filter(w =>
        ['recon', 'vuln', 'secrets', 'api'].includes(w.category)
      )
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      weapons = weapons.filter(w =>
        w.name.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q) ||
        w.command.toLowerCase().includes(q) ||
        w.tags.some(t => t.toLowerCase().includes(q))
      )
    }

    return weapons
  }, [searchQuery, activeCategory, showAll])

  const handleCopy = async (weapon: ArsenalWeapon) => {
    try {
      await navigator.clipboard.writeText(weapon.command)
      setCopiedId(weapon.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // Fallback for Electron
      const ta = document.createElement('textarea')
      ta.value = weapon.command
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopiedId(weapon.id)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  const totalActive = arsenalWeapons.length
  const totalCategories = weaponCategories.length

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-hacker-text-bright font-mono tracking-wide">▸ ARSENAL</h1>
          <p className="text-sm text-hacker-text-dim mt-1 font-mono">Weapon systems · Tool chains · Command templates</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAll(!showAll)}
            className={cn(
              'px-3 py-1.5 rounded text-xs font-mono transition-all',
              showAll
                ? 'bg-hacker-green/10 text-hacker-green border border-hacker-green/30'
                : 'bg-hacker-surface2 text-hacker-text-dim border border-hacker-border hover:text-hacker-green'
            )}
          >
            {showAll ? '◈ Show All' : '◎ Smart Hunt'}
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4">
        <div className="hacker-card p-3">
          <p className="text-[10px] text-hacker-text-dim font-mono">Total Weapons</p>
          <p className="text-lg font-bold font-mono text-hacker-green">{totalActive}</p>
        </div>
        <div className="hacker-card p-3">
          <p className="text-[10px] text-hacker-text-dim font-mono">Categories</p>
          <p className="text-lg font-bold font-mono text-hacker-cyan">{totalCategories}</p>
        </div>
        <div className="hacker-card p-3">
          <p className="text-[10px] text-hacker-text-dim font-mono">Filtered</p>
          <p className="text-lg font-bold font-mono text-hacker-amber">{filteredWeapons.length}</p>
        </div>
        <div className="hacker-card p-3">
          <p className="text-[10px] text-hacker-text-dim font-mono">Clips Today</p>
          <p className="text-lg font-bold font-mono text-hacker-purple">{copiedId ? '+1' : '0'}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          className="hacker-input w-full pl-8 pr-4 py-2 text-sm"
          placeholder="Search weapons by name, category, tag, or command..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          autoFocus
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-hacker-text-dim/50 text-xs">◎</span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-hacker-text-dim/50 hover:text-hacker-text text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => { setActiveCategory(null); setShowAll(true) }}
          className={cn(
            'px-2.5 py-1 rounded text-[10px] font-mono transition-all border',
            !activeCategory
              ? 'bg-hacker-green/10 text-hacker-green border-hacker-green/30'
              : 'bg-hacker-surface2 text-hacker-text-dim border-hacker-border hover:text-hacker-text'
          )}
        >
          ALL
        </button>
        {weaponCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id); setShowAll(true) }}
            className={cn(
              'px-2.5 py-1 rounded text-[10px] font-mono transition-all border flex items-center gap-1',
              activeCategory === cat.id
                ? 'bg-hacker-green/10 text-hacker-green border-hacker-green/30'
                : 'bg-hacker-surface2 text-hacker-text-dim border-hacker-border hover:text-hacker-text'
            )}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
            <span className="text-[8px] opacity-60">({cat.count})</span>
          </button>
        ))}
      </div>

      {/* Weapon Grid */}
      {filteredWeapons.length === 0 ? (
        <div className="hacker-card p-12 text-center">
          <p className="text-hacker-text-dim/40 text-lg mb-2">◎</p>
          <p className="text-sm font-mono text-hacker-text-dim">No weapons match your search</p>
          <p className="text-[10px] font-mono text-hacker-text-dim/50 mt-1">Try different keywords or clear the filter</p>
        </div>
      ) : showAll && !searchQuery && !activeCategory ? (
        /* Grouped by category */
        weaponCategories.map(cat => {
          const catWeapons = arsenalWeapons.filter(w => w.category === cat.id)
          if (catWeapons.length === 0) return null
          return (
            <div key={cat.id}>
              <h3 className="text-xs font-semibold text-hacker-text font-mono mb-2 flex items-center gap-2">
                <span className={cat.color}>{cat.icon}</span>
                <span>{cat.name}</span>
                <span className="text-[10px] text-hacker-text-dim font-mono">({catWeapons.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mb-6">
                {catWeapons.map(weapon => (
                  <WeaponCard
                    key={weapon.id}
                    weapon={weapon}
                    copiedId={copiedId}
                    onCopy={handleCopy}
                    color={cat.color}
                  />
                ))}
              </div>
            </div>
          )
        })
      ) : (
        /* Flat list when filtered/searched */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {filteredWeapons.map(weapon => {
            const cat = weaponCategories.find(c => c.id === weapon.category)
            return (
              <WeaponCard
                key={weapon.id}
                weapon={weapon}
                copiedId={copiedId}
                onCopy={handleCopy}
                color={cat?.color || 'text-hacker-text'}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

function WeaponCard({
  weapon,
  copiedId,
  onCopy,
  color
}: {
  weapon: ArsenalWeapon
  copiedId: string | null
  onCopy: (w: ArsenalWeapon) => void
  color: string
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className={cn(
        'hacker-card p-3 group cursor-pointer transition-all duration-150',
        expanded ? 'border-hacker-green/30' : 'hover:border-hacker-border'
      )}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono text-hacker-text truncate">{weapon.name}</span>
            <span className={cn('text-[8px] font-mono opacity-60', color)}>
              {weapon.tags.slice(0, 2).join(', ')}
            </span>
          </div>
          <p className="text-[10px] text-hacker-text-dim mt-0.5 line-clamp-2">{weapon.description}</p>
        </div>
      </div>

      {/* Command Preview */}
      {expanded && (
        <div className="mt-2 pt-2 border-t border-hacker-border/50" onClick={e => e.stopPropagation()}>
          <pre className="text-[10px] font-mono text-hacker-cyan bg-hacker-bg rounded p-2 overflow-x-auto leading-relaxed whitespace-pre-wrap break-all max-h-24 overflow-y-auto">
            {weapon.command}
          </pre>
          <div className="flex items-center justify-between mt-2">
            <div className="flex flex-wrap gap-1">
              {weapon.tags.map(tag => (
                <span key={tag} className="text-[8px] font-mono px-1 py-0.5 rounded bg-hacker-surface2 text-hacker-text-dim">
                  #{tag}
                </span>
              ))}
            </div>
            <button
              onClick={() => onCopy(weapon)}
              className={cn(
                'px-2.5 py-1 rounded text-[10px] font-mono transition-all border',
                copiedId === weapon.id
                  ? 'bg-hacker-green/20 text-hacker-green border-hacker-green/40'
                  : 'bg-hacker-surface2 text-hacker-text-dim border-hacker-border hover:text-hacker-green hover:border-hacker-green/30'
              )}
            >
              {copiedId === weapon.id ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {/* Minimized indicator */}
      {!expanded && (
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex gap-1">
            {weapon.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[8px] font-mono text-hacker-text-dim/40">
                #{tag}
              </span>
            ))}
          </div>
          <span className="text-[8px] text-hacker-text-dim/30">click to expand</span>
        </div>
      )}
    </div>
  )
}
