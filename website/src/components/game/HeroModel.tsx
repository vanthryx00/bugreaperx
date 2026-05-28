import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../lib/game/store'
import { HERO_CLASSES } from '../../lib/game/hero'
// Import shader to trigger extend() side effect
import '../../shaders/holographic'

export function HeroModel() {
  const hero = useGameStore(s => s.hero)
  const groupRef = useRef<THREE.Group>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime
    }
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.05
      groupRef.current.rotation.y = clock.elapsedTime * 0.15
    }
  })

  if (!hero) return null

  const classDef = HERO_CLASSES.find(c => c.id === hero.heroClass)
  const color = classDef?.id === 'recon_scout' ? '#339af0'
    : classDef?.id === 'vuln_breaker' ? '#ff6b6b'
    : classDef?.id === 'payload_slinger' ? '#ffd43b'
    : classDef?.id === 'web_reaper' ? '#00ff41'
    : '#4c6ef5'

  return (
    <group ref={groupRef} position={[0, 0.5, -3]} scale={0.6}>
      {/* Torso */}
      <mesh position={[0, 0.8, 0]}>
        <capsuleGeometry args={[0.25, 0.6, 8, 12]} />
        <holographicMaterial
          ref={materialRef}
          uTime={0}
          uColor={new THREE.Color(color)}
          uOpacity={0.9}
          uScanlineDensity={25}
          uFresnelPower={2.5}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.25, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <holographicMaterial
          uTime={0}
          uColor={new THREE.Color(color)}
          uOpacity={0.95}
          uScanlineDensity={30}
          uFresnelPower={3}
        />
      </mesh>

      {/* Shoulder left */}
      <mesh position={[-0.35, 0.95, 0]} rotation={[0, 0, -0.2]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <holographicMaterial
          uTime={0}
          uColor={new THREE.Color(color)}
          uOpacity={0.7}
          uScanlineDensity={20}
          uFresnelPower={2}
        />
      </mesh>

      {/* Shoulder right */}
      <mesh position={[0.35, 0.95, 0]} rotation={[0, 0, 0.2]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <holographicMaterial
          uTime={0}
          uColor={new THREE.Color(color)}
          uOpacity={0.7}
          uScanlineDensity={20}
          uFresnelPower={2}
        />
      </mesh>

      {/* Backpack */}
      <mesh position={[0, 0.75, -0.3]}>
        <boxGeometry args={[0.3, 0.2, 0.15]} />
        <holographicMaterial
          uTime={0}
          uColor={new THREE.Color(color)}
          uOpacity={0.5}
          uScanlineDensity={15}
          uFresnelPower={1.5}
        />
      </mesh>

      {/* Ground ring glow */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.5, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}
