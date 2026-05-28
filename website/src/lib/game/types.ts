// ─── Hero Types ────────────────────────────────────────────────

export type HeroClass = 'recon_scout' | 'vuln_breaker' | 'payload_slinger' | 'web_reaper' | 'cloud_warden'

export interface HeroClassDef {
  id: HeroClass
  name: string
  description: string
  startingWeapon: string
  ability: string
  baseStats: HeroStats
}

export interface HeroStats {
  hp: number
  maxHp: number
  attack: number
  defense: number
  speed: number
  scanRange: number
  luck: number
  level: number
  xp: number
  xpToNext: number
}

export interface Hero {
  name: string
  heroClass: HeroClass
  stats: HeroStats
  statPoints: number
  weapons: string[]
  armour: string[]
  equippedWeapon: string | null
  equippedArmour: string | null
  brxTokens: number
  createdAt: number
}

// ─── Monster Types ─────────────────────────────────────────────

export type MonsterTier = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
export type VulnType = 'xss' | 'sqli' | 'idor' | 'open_redirect' | 'ssrf' | 'rce' | 'file_upload' | 'rate_limit' | 's3_bucket' | 'xxe'

export interface MonsterDef {
  id: VulnType
  name: string
  form: string
  attack: string
  weakness: string
  tier: MonsterTier
  baseHp: number
  baseAttack: number
  baseDefense: number
  speed: number
  color: string
  brxReward: [number, number] // min, max
}

export interface Monster {
  id: string
  defId: VulnType
  hp: number
  maxHp: number
  attack: number
  defense: number
  x: number
  z: number
  tier: MonsterTier
  alive: boolean
  aggroRange: number
}

// ─── Weapon Types ──────────────────────────────────────────────

export type WeaponRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
export type WeaponCategory = 'scanner' | 'fuzzer' | 'exploit_kit' | 'proxy' | 'deobfuscator' | 'cloud_tool' | 'payload_tool'

export interface WeaponDef {
  id: string
  name: string
  realTool: string
  category: WeaponCategory
  rarity: WeaponRarity
  baseDamage: number
  critChance: number
  specialEffect: string
  price: number
  upgrades: number
  maxUpgrades: number
  upgradeCost: (level: number) => number
}

// ─── Armour Types ──────────────────────────────────────────────

export interface ArmourDef {
  id: string
  name: string
  defense: number
  setBonus: string
  setBonus2: string
  setBonus4: string
  price: number
}

// ─── Game State Types ──────────────────────────────────────────

export type GameScreen = 'menu' | 'hero_creation' | 'hub' | 'combat' | 'shop' | 'wallet' | 'inventory'

export interface CombatState {
  active: boolean
  targetMonster: Monster | null
  turn: 'player' | 'monster'
  turnCount: number
}

export interface GameState {
  screen: GameScreen
  hero: Hero | null
  monsters: Monster[]
  combat: CombatState
  zone: string
  fps: number
}
