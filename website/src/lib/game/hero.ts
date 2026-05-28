import { Hero, HeroClass, HeroClassDef, HeroStats } from './types'

export const HERO_CLASSES: HeroClassDef[] = [
  {
    id: 'recon_scout',
    name: 'Recon Scout',
    description: 'Information gathering specialist. Fast, agile, reveals hidden threats.',
    startingWeapon: 'gau',
    ability: 'Scan Reveal — Highlights all monsters in a zone',
    baseStats: {
      hp: 80,
      maxHp: 80,
      attack: 8,
      defense: 4,
      speed: 130,
      scanRange: 15,
      luck: 10,
      level: 1,
      xp: 0,
      xpToNext: 100,
    },
  },
  {
    id: 'vuln_breaker',
    name: 'Vuln Breaker',
    description: 'Exploitation expert. Heavy damage, critical strikes against known vulnerabilities.',
    startingWeapon: 'nuclei',
    ability: 'Critical Strike — 3x damage on known CVEs',
    baseStats: {
      hp: 100,
      maxHp: 100,
      attack: 14,
      defense: 6,
      speed: 100,
      scanRange: 8,
      luck: 8,
      level: 1,
      xp: 0,
      xpToNext: 100,
    },
  },
  {
    id: 'payload_slinger',
    name: 'Payload Slinger',
    description: 'Fuzzing and multi-target attacks. Rapid fire, crowd control specialist.',
    startingWeapon: 'ffuf',
    ability: 'Barrage — Hits all monsters within range',
    baseStats: {
      hp: 90,
      maxHp: 90,
      attack: 11,
      defense: 5,
      speed: 115,
      scanRange: 10,
      luck: 12,
      level: 1,
      xp: 0,
      xpToNext: 100,
    },
  },
  {
    id: 'web_reaper',
    name: 'Web Reaper',
    description: 'Balanced all-rounder. Versatile, adaptable, executes weakened enemies.',
    startingWeapon: 'httpx',
    ability: 'Reap — Execute low-health monsters instantly',
    baseStats: {
      hp: 110,
      maxHp: 110,
      attack: 12,
      defense: 7,
      speed: 105,
      scanRange: 10,
      luck: 10,
      level: 1,
      xp: 0,
      xpToNext: 100,
    },
  },
  {
    id: 'cloud_warden',
    name: 'Cloud Warden',
    description: 'Defensive powerhouse. Shields allies, resists damage, protects the team.',
    startingWeapon: 'cloud_enum',
    ability: 'Fortify — Reduce incoming damage 50% for 10s',
    baseStats: {
      hp: 130,
      maxHp: 130,
      attack: 8,
      defense: 10,
      speed: 90,
      scanRange: 8,
      luck: 6,
      level: 1,
      xp: 0,
      xpToNext: 100,
    },
  },
]

export function createHero(name: string, heroClass: HeroClass): Hero {
  const classDef = HERO_CLASSES.find(c => c.id === heroClass)!
  return {
    name,
    heroClass,
    stats: { ...classDef.baseStats },
    statPoints: 0,
    weapons: [classDef.startingWeapon],
    armour: [],
    equippedWeapon: classDef.startingWeapon,
    equippedArmour: null,
    brxTokens: 50, // Starting tokens
    createdAt: Date.now(),
  }
}

export function calculateXpToNext(level: number): number {
  return Math.floor(100 * Math.pow(1.2, level - 1))
}

export function addXp(hero: Hero, xp: number): Hero {
  let newStats = { ...hero.stats }
  let newXp = hero.stats.xp + xp
  let newLevel = hero.stats.level

  while (newXp >= calculateXpToNext(newLevel)) {
    newXp -= calculateXpToNext(newLevel)
    newLevel++
    // Stat increases on level up
    newStats.maxHp += 10
    newStats.hp = newStats.maxHp // Full heal on level up
    newStats.attack += 2
    newStats.defense += 1
  }

  return {
    ...hero,
    stats: {
      ...newStats,
      xp: newXp,
      level: newLevel,
      xpToNext: calculateXpToNext(newLevel),
    },
    statPoints: hero.statPoints + (newLevel - hero.stats.level) * 3,
  }
}

export function applyStatPoint(hero: Hero, stat: keyof Pick<HeroStats, 'hp' | 'attack' | 'defense' | 'speed' | 'scanRange' | 'luck'>): Hero {
  if (hero.statPoints <= 0) return hero

  const modifiers: Record<string, number> = {
    hp: 10,
    attack: 2,
    defense: 1.5,
    speed: 2,
    scanRange: 1,
    luck: 0.5,
  }

  return {
    ...hero,
    stats: {
      ...hero.stats,
      [stat]: hero.stats[stat] + modifiers[stat],
      maxHp: stat === 'hp' ? hero.stats.maxHp + modifiers.hp : hero.stats.maxHp,
    },
    statPoints: hero.statPoints - 1,
  }
}
