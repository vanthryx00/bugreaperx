import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { Monster } from '../../lib/game/types'
import { MONSTER_DEFS, TIER_COLORS } from '../../lib/game/monsters'
import { useGameStore } from '../../lib/game/store'
// Import shader to trigger extend() side effect
import '../../shaders/monsterGlitch'

interface MonsterEntityProps {
  monster: Monster
}

export function MonsterEntity({ monster }: MonsterEntityProps) {
  const groupRef = useRef<THREE.Group>(null)
  const shaderRef = useRef<THREE.ShaderMaterial>(null)
  const auraRef = useRef<THREE.Mesh>(null)
  const trailRefs = useRef<(THREE.Mesh | null)[]>([])
  const [hovered, setHovered] = useState(false)
  const [damageFlash, setDamageFlash] = useState(0)
  const startCombat = useGameStore(s => s.startCombat)
  const combat = useGameStore(s => s.combat)
  const lastHpRef = useRef(monster.hp)

  const def = MONSTER_DEFS[monster.defId]
  if (!def || !monster.alive) return null

  const isTargeted = combat.targetMonster?.id === monster.id
  const hpPercent = (monster.hp / monster.maxHp) * 100
  const tierColor = TIER_COLORS[monster.tier]

  // Track HP changes for damage flash
  if (monster.hp < lastHpRef.current) {
    setDamageFlash(1.0)
    lastHpRef.current = monster.hp
    setTimeout(() => setDamageFlash(0), 300)
  }

  // Monster size based on tier
  const sizeMap = { common: 0.4, uncommon: 0.55, rare: 0.7, epic: 0.9, legendary: 1.2 }
  const size = sizeMap[monster.tier] || 0.5

  // Orbital particle config
  const orbitalConfig = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      angleOffset: (i / 6) * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.5,
      radius: size * 0.6,
      yOffset: (Math.random() - 0.5) * 0.3,
    }))
  }, [size])

  // Animate monster + trail particles + shader
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    const seed = parseInt(monster.id.slice(-4), 36)

    groupRef.current.position.y = Math.sin(t * def.speed + seed) * 0.3
    groupRef.current.rotation.y += 0.008 * def.speed

    // Update shader uniforms
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = t
      shaderRef.current.uniforms.uHover.value = hovered ? 0.6 + 0.4 * Math.sin(t * 2) : 0
      shaderRef.current.uniforms.uDamage.value = damageFlash
    }

    // Animate aura
    if (auraRef.current) {
      const auraMat = auraRef.current.material as THREE.MeshBasicMaterial
      auraMat.opacity = (hovered ? 0.2 : 0.08) + 0.04 * Math.sin(t * 1.5 + seed)
    }

    // Animate orbital particles
    orbitalConfig.forEach((c, i) => {
      const trail = trailRefs.current[i]
      if (trail) {
        const angle = c.angleOffset + t * c.speed
        trail.position.x = Math.cos(angle) * c.radius
        trail.position.z = Math.sin(angle) * c.radius
        trail.position.y = c.yOffset + Math.sin(t * c.speed * 1.5) * 0.3
      }
    })
  })

  const handleClick = () => {
    if (combat.active) return
    startCombat(monster)
  }

  // Choose geometry based on monster form
  const getGeometry = () => {
    if (def.form.includes('worm') || def.form.includes('serpent')) return <capsuleGeometry args={[0.3, 0.8, 8, 8]} />
    if (def.form.includes('giant') || def.form.includes('leviathan')) return <boxGeometry args={[0.8, 1.0, 0.8]} />
    if (def.form.includes('specter') || def.form.includes('wraith') || def.form.includes('phantom')) return <octahedronGeometry args={[0.6]} />
    if (def.form.includes('chest') || def.form.includes('golem')) return <boxGeometry args={[0.7, 0.9, 0.7]} />
    if (def.form.includes('zombie') || def.form.includes('horde')) return <dodecahedronGeometry args={[0.4]} />
    if (def.form.includes('horror') || def.form.includes('entity')) return <icosahedronGeometry args={[0.6]} />
    return <sphereGeometry args={[0.5, 8, 8]} />
  }

  return (
    <group
      ref={groupRef}
      position={[monster.x, 0, monster.z]}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Energy Aura */}
      <mesh ref={auraRef}>
        <sphereGeometry args={[size * 2.2, 16, 16]} />
        <meshBasicMaterial color={def.color} transparent opacity={0.08} />
      </mesh>

      {/* Orbiting Particles */}
      {orbitalConfig.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => { trailRefs.current[i] = el }}
        >
          <sphereGeometry args={[0.02 * size, 6, 6]} />
          <meshBasicMaterial color={def.color} transparent opacity={0.5} />
        </mesh>
      ))}

      {/* Monster Body */}
      <group scale={size}>
        <mesh>
          {getGeometry()}
          <monsterGlitchMaterial
            ref={shaderRef}
            uTime={0}
            uColor={new THREE.Color(def.color)}
            uGlitchIntensity={hovered || isTargeted ? 0.8 : 0.15}
            uHover={0}
            uDamage={0}
            uEmissiveIntensity={0.4}
          />
        </mesh>

        {/* Wireframe overlay */}
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
            color={tierColor}
            transparent
            opacity={hovered ? 0.25 : 0.1}
            wireframe
          />
        </mesh>
      </group>

      {/* HP Bar */}
      {(hovered || isTargeted) && (
        <group position={[0, size * 1.8 + 0.3, 0]}>
          <mesh>
            <planeGeometry args={[1.0, 0.1]} />
            <meshBasicMaterial color="#0a0a0a" transparent opacity={0.6} />
          </mesh>
          <mesh position={[-(1.0 * (1 - hpPercent / 100)) / 2, 0, 0.01]}>
            <planeGeometry args={[0.98 * (hpPercent / 100), 0.08]} />
            <meshBasicMaterial color={hpPercent > 50 ? def.color : '#ff3333'} />
          </mesh>
        </group>
      )}

      {/* Monster Name + HP */}
      {hovered && (
        <Text
          position={[0, size * 1.8 + 0.7, 0]}
          fontSize={0.1}
          color={def.color}
          anchorX="center"
          anchorY="middle"
        >
          {def.name} [{monster.hp}/{monster.maxHp}]
        </Text>
      )}

      {/* Combat indicator */}
      {isTargeted && combat.active && (
        <Text
          position={[0, -size * 1.0, 0]}
          fontSize={0.08}
          color="#ff3333"
          anchorX="center"
          anchorY="middle"
        >
          ⚔ IN COMBAT
        </Text>
      )}
    </group>
  )
}
