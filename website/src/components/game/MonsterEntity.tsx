import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { Group } from 'three'
import { Monster } from '../../lib/game/types'
import { MONSTER_DEFS } from '../../lib/game/monsters'
import { useGameStore } from '../../lib/game/store'

interface MonsterEntityProps {
  monster: Monster
}

export function MonsterEntity({ monster }: MonsterEntityProps) {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const startCombat = useGameStore(s => s.startCombat)
  const combat = useGameStore(s => s.combat)

  const def = MONSTER_DEFS[monster.defId]
  if (!def || !monster.alive) return null

  const isTargeted = combat.targetMonster?.id === monster.id
  const hpPercent = (monster.hp / monster.maxHp) * 100

  // Floating animation
  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * def.speed + parseInt(monster.id.slice(-4), 36)) * 0.3
    groupRef.current.rotation.y += 0.005 * def.speed
  })

  const handleClick = () => {
    if (combat.active) return
    startCombat(monster)
  }

  // Monster size based on tier
  const sizeMap = { common: 0.4, uncommon: 0.5, rare: 0.65, epic: 0.85, legendary: 1.1 }
  const size = sizeMap[monster.tier] || 0.5

  return (
    <group
      ref={groupRef}
      position={[monster.x, 0, monster.z]}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Glow aura */}
      <mesh>
        <sphereGeometry args={[size * 1.8, 16, 16]} />
        <meshBasicMaterial
          color={def.color}
          transparent
          opacity={hovered ? 0.15 : 0.06}
        />
      </mesh>

      {/* Monster body — using geometric shape based on form */}
      <group scale={size}>
        {/* Core body */}
        <mesh>
          {def.form.includes('worm') || def.form.includes('serpent') ? (
            <capsuleGeometry args={[0.3, 0.8, 8, 8]} />
          ) : def.form.includes('giant') || def.form.includes('leviathan') ? (
            <boxGeometry args={[0.8, 1.0, 0.8]} />
          ) : def.form.includes('specter') || def.form.includes('wraith') || def.form.includes('phantom') ? (
            <octahedronGeometry args={[0.6]} />
          ) : def.form.includes('chest') || def.form.includes('golem') ? (
            <boxGeometry args={[0.7, 0.9, 0.7]} />
          ) : def.form.includes('zombie') || def.form.includes('horde') ? (
            <dodecahedronGeometry args={[0.4]} />
          ) : def.form.includes('horror') || def.form.includes('entity') ? (
            <icosahedronGeometry args={[0.6]} />
          ) : (
            <sphereGeometry args={[0.5, 8, 8]} />
          )}
          <meshStandardMaterial
            color={def.color}
            emissive={def.color}
            emissiveIntensity={hovered ? 0.6 : 0.25}
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>

        {/* Glow outline */}
        <mesh>
          {def.form.includes('worm') || def.form.includes('serpent') ? (
            <capsuleGeometry args={[0.35, 0.85, 8, 8]} />
          ) : def.form.includes('giant') || def.form.includes('leviathan') ? (
            <boxGeometry args={[0.85, 1.05, 0.85]} />
          ) : def.form.includes('specter') || def.form.includes('wraith') || def.form.includes('phantom') ? (
            <octahedronGeometry args={[0.65]} />
          ) : (
            <sphereGeometry args={[0.55, 8, 8]} />
          )}
          <meshBasicMaterial
            color={def.color}
            transparent
            opacity={0.15}
            wireframe
          />
        </mesh>
      </group>

      {/* HP Bar (shown when hovered or targeted) */}
      {(hovered || isTargeted) && (
        <group position={[0, size * 1.5 + 0.3, 0]}>
          {/* Background */}
          <mesh>
            <planeGeometry args={[0.8, 0.08]} />
            <meshBasicMaterial color="#1a1a2e" transparent opacity={0.8} />
          </mesh>
          {/* HP fill */}
          <mesh position={[-(0.8 * (1 - hpPercent / 100)) / 2, 0, 0.01]}>
            <planeGeometry args={[0.78 * (hpPercent / 100), 0.06]} />
            <meshBasicMaterial color={hpPercent > 50 ? def.color : '#ff3333'} />
          </mesh>
        </group>
      )}

      {/* Monster Name */}
      {(hovered || isTargeted) && (
        <Text
          position={[0, size * 1.5 + 0.6, 0]}
          fontSize={0.12}
          color={def.color}
          anchorX="center"
          anchorY="middle"
        >
          {def.name} [{monster.hp} HP]
        </Text>
      )}

      {/* Combat indicator */}
      {isTargeted && combat.active && (
        <Text
          position={[0, -size * 0.8, 0]}
          fontSize={0.1}
          color="#ff4444"
          anchorX="center"
          anchorY="middle"
        >
          ⚔ TARGET
        </Text>
      )}
    </group>
  )
}
