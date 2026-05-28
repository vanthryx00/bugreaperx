import { ArmourDef } from './types'

export const ARMOURS: ArmourDef[] = [
  {
    id: 'recon_suit',
    name: 'Recon Suit',
    defense: 5,
    setBonus: '+10% speed',
    setBonus2: '+20% scan range',
    setBonus4: '+30% movement speed',
    price: 200,
  },
  {
    id: 'breaker_plate',
    name: 'Breaker Plate',
    defense: 10,
    setBonus: '+15% attack',
    setBonus2: '+50% crit damage',
    setBonus4: '+75% crit damage',
    price: 500,
  },
  {
    id: 'cloud_ward',
    name: 'Cloud Ward',
    defense: 8,
    setBonus: '-10% incoming damage',
    setBonus2: '+25% max HP',
    setBonus4: '+50% max HP',
    price: 800,
  },
  {
    id: 'phantom_cloak',
    name: 'Phantom Cloak',
    defense: 3,
    setBonus: '+20% dodge',
    setBonus2: '+30% movement speed',
    setBonus4: '+50% movement speed, phase through enemies',
    price: 600,
  },
  {
    id: 'reaper_mantle',
    name: 'Reaper Mantle',
    defense: 7,
    setBonus: '+10% all stats',
    setBonus2: 'Execute <15% HP enemies',
    setBonus4: 'Execute <25% HP enemies, +20% all stats',
    price: 1500,
  },
]

export function getArmour(id: string): ArmourDef | undefined {
  return ARMOURS.find(a => a.id === id)
}
