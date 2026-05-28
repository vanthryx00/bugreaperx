import { create } from 'zustand'
import { GameScreen, Monster, HeroClass, GameState } from './types'
import { createHero, addXp } from './hero'
import { spawnMonsterWave } from './monsters'
import { calculateDamage, monsterAttack, getBrxReward, getXpReward, CombatResult } from './combat'

interface GameStore extends GameState {
  // Lifecycle
  initGame: () => void
  setScreen: (screen: GameScreen) => void
  setZone: (zone: string) => void

  // Hero
  createNewHero: (name: string, heroClass: HeroClass) => void

  // Combat
  startCombat: (monster: Monster) => void
  endCombat: () => void
  playerAttack: () => CombatResult | null
  monsterTurn: () => number
  spawnWave: () => void

  // Economy
  addBrx: (amount: number) => void
  spendBrx: (amount: number) => boolean
  equipWeapon: (weaponId: string) => void
  equipArmour: (armourId: string) => void
  buyWeapon: (weaponId: string, price: number) => boolean
  buyArmour: (armourId: string, price: number) => boolean
}

export const useGameStore = create<GameStore>((set, get) => ({
  screen: 'menu',
  hero: null,
  monsters: [],
  combat: { active: false, targetMonster: null, turn: 'player', turnCount: 0 },
  zone: 'web_layer',
  fps: 0,

  initGame: () => {
    // Setup initial game state
  },

  setScreen: (screen) => set({ screen }),

  setZone: (zone) => set({ zone }),

  createNewHero: (name, heroClass) => {
    const hero = createHero(name, heroClass)
    const monsters = spawnMonsterWave(5, 'web_layer')
    set({
      hero,
      monsters,
      screen: 'hub',
      zone: 'web_layer',
      combat: { active: false, targetMonster: null, turn: 'player', turnCount: 0 },
    })
  },

  startCombat: (monster) => {
    set({
      combat: {
        active: true,
        targetMonster: { ...monster },
        turn: 'player',
        turnCount: 0,
      },
    })
  },

  endCombat: () => {
    set({
      combat: { active: false, targetMonster: null, turn: 'player', turnCount: 0 },
    })
  },

  playerAttack: () => {
    const { hero, combat } = get()
    if (!hero || !combat.targetMonster) return null

    const { damage, crit } = calculateDamage(hero, combat.targetMonster, undefined)

    const updatedMonster = { ...combat.targetMonster }
    updatedMonster.hp = Math.max(0, updatedMonster.hp - damage)
    const killed = updatedMonster.hp <= 0

    let result: CombatResult = {
      damage,
      crit,
      killed,
      xpGained: 0,
      brxGained: 0,
      loot: [],
    }

    if (killed) {
      const brx = getBrxReward(combat.targetMonster)
      const xp = getXpReward(combat.targetMonster)
      result.brxGained = brx
      result.xpGained = xp

      // Update hero
      let updatedHero = addXp(hero, xp)
      updatedHero = { ...updatedHero, brxTokens: updatedHero.brxTokens + brx }
      set({ hero: updatedHero })

      // Remove monster from field
      const monsters = get().monsters.filter(m => m.id !== combat.targetMonster!.id)
      set({ monsters })
    }

    if (!killed) {
      set({
        combat: {
          ...combat,
          targetMonster: updatedMonster,
          turn: 'monster',
          turnCount: combat.turnCount + 1,
        },
      })
    } else {
      set({ combat: { active: false, targetMonster: null, turn: 'player', turnCount: 0 } })
    }

    return result
  },

  monsterTurn: () => {
    const { hero, combat } = get()
    if (!hero || !combat.targetMonster) return 0

    const damage = monsterAttack(combat.targetMonster, hero)
    const updatedHero = {
      ...hero,
      stats: {
        ...hero.stats,
        hp: Math.max(0, hero.stats.hp - damage),
      },
    }
    set({ hero: updatedHero, combat: { ...combat, turn: 'player' } })
    return damage
  },

  spawnWave: () => {
    const zone = get().zone
    const monsters = spawnMonsterWave(5, zone)
    set({ monsters })
  },

  addBrx: (amount) => {
    const hero = get().hero
    if (!hero) return
    set({ hero: { ...hero, brxTokens: hero.brxTokens + amount } })
  },

  spendBrx: (amount) => {
    const hero = get().hero
    if (!hero || hero.brxTokens < amount) return false
    set({ hero: { ...hero, brxTokens: hero.brxTokens - amount } })
    return true
  },

  equipWeapon: (weaponId) => {
    const hero = get().hero
    if (!hero) return
    set({ hero: { ...hero, equippedWeapon: weaponId } })
  },

  equipArmour: (armourId) => {
    const hero = get().hero
    if (!hero) return
    set({ hero: { ...hero, equippedArmour: armourId } })
  },

  buyWeapon: (weaponId, price) => {
    const hero = get().hero
    if (!hero || hero.brxTokens < price) return false
    if (hero.weapons.includes(weaponId)) return false
    set({
      hero: {
        ...hero,
        brxTokens: hero.brxTokens - price,
        weapons: [...hero.weapons, weaponId],
        equippedWeapon: weaponId,
      },
    })
    return true
  },

  buyArmour: (armourId, price) => {
    const hero = get().hero
    if (!hero || hero.brxTokens < price) return false
    if (hero.armour.includes(armourId)) return false
    set({
      hero: {
        ...hero,
        brxTokens: hero.brxTokens - price,
        armour: [...hero.armour, armourId],
        equippedArmour: armourId,
      },
    })
    return true
  },
}))
