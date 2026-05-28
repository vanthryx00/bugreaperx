import { Hero, Monster, WeaponDef } from './types'
import { getWeapon } from './weapons'

export interface CombatResult {
  damage: number
  crit: boolean
  killed: boolean
  xpGained: number
  brxGained: number
  loot: string[]
}

export function calculateDamage(
  hero: Hero,
  monster: Monster,
  weapon?: WeaponDef | null
): { damage: number; crit: boolean } {
  const eqWeapon = weapon || getWeapon(hero.equippedWeapon || '')
  if (!eqWeapon) return { damage: hero.stats.attack, crit: false }

  const baseDamage = eqWeapon.baseDamage + hero.stats.attack
  const crit = Math.random() < eqWeapon.critChance + hero.stats.luck * 0.005
  const critMultiplier = crit ? 2.5 : 1
  const defenseReduction = Math.max(0, monster.defense - hero.stats.defense * 0.5)

  const damage = Math.max(1, Math.floor((baseDamage * critMultiplier - defenseReduction) * (0.85 + Math.random() * 0.3)))
  return { damage, crit }
}

export function monsterAttack(monster: Monster, hero: Hero): number {
  const baseDamage = monster.attack
  const defenseReduction = Math.max(0, hero.stats.defense * 0.3)
  return Math.max(1, Math.floor((baseDamage - defenseReduction) * (0.8 + Math.random() * 0.4)))
}

export function getBrxReward(monster: Monster): number {
  const tierValues: Record<string, [number, number]> = {
    common: [1, 5],
    uncommon: [5, 15],
    rare: [15, 50],
    epic: [50, 200],
    legendary: [200, 1000],
  }
  const [min, max] = tierValues[monster.tier] || [1, 5]
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getXpReward(monster: Monster): number {
  const base = 10
  const tierMult: Record<string, number> = {
    common: 1,
    uncommon: 2,
    rare: 5,
    epic: 15,
    legendary: 50,
  }
  return base * (tierMult[monster.tier] || 1)
}
