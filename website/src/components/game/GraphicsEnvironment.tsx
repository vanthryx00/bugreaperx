import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../lib/game/store'
import { MonsterEntity } from './MonsterEntity'
import { HeroModel } from './HeroModel'

// Import shader files to trigger extend() side effects
import '../../shaders/scanlineGround'
import '../../shaders/skyDome'
import '../../shaders/particleData'

// ─── Sky Dome ────────────────────────────────────────────────
function SkyDome() {
  const ref = useRef<THREE.Mesh>(null)
  const { clock } = useThree()

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.005
    }
  })

  return (
    <mesh ref={ref} scale={[50, 50, 50]}>
      <sphereGeometry args={[1, 64, 64]} />
      <skyDomeMaterial
        uTime={0}
        uColor1={new THREE.Color('#000a00')}
        uColor2={new THREE.Color('#002200')}
        uColor3={new THREE.Color('#003300')}
        uStarDensity={50}
      />
    </mesh>
  )
}

// ─── Reflective Floor ──────────────────────────────────────
function ReflectiveFloor() {
  const floorRef = useRef<THREE.Mesh>(null)
  const { clock } = useThree()

  useFrame(() => {
    if (floorRef.current) {
      const mat = floorRef.current.material as THREE.MeshPhysicalMaterial
      mat.roughness = 0.2 + Math.sin(clock.elapsedTime * 0.1) * 0.05
    }
  })

  return (
    <group>
      {/* Main reflective ground */}
      <mesh ref={floorRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshPhysicalMaterial
          color="#0a0a1a"
          metalness={0.9}
          roughness={0.2}
          envMapIntensity={0.8}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Glass-like outer ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, 0]}>
        <ringGeometry args={[6, 14, 64]} />
        <meshPhysicalMaterial
          color="#00ff41"
          metalness={0.3}
          roughness={0.1}
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
          envMapIntensity={0.4}
        />
      </mesh>

      {/* Grid overlay using custom shader */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.47, 0]}>
        <planeGeometry args={[28, 28]} />
        <scanlineGroundMaterial
          uTime={0}
          uColor={new THREE.Color('#00ff41')}
          uGridSize={24}
          uRingSpeed={0.4}
        />
      </mesh>
    </group>
  )
}

// ─── Data Particles ─────────────────────────────────────────
function DataParticles() {
  const count = 800
  const ref = useRef<THREE.Points>(null)

  const { positions, offsets, speeds, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const off = new Float32Array(count)
    const spd = new Float32Array(count)
    const siz = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 24
      off[i] = Math.random() * 6
      spd[i] = 0.2 + Math.random() * 0.6
      siz[i] = 0.3 + Math.random() * 0.7
    }

    return { positions: pos, offsets: off, speeds: spd, sizes: siz }
  }, [])

  useFrame(({ clock }) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.ShaderMaterial
      mat.uniforms.uTime.value = clock.elapsedTime
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aOffset"
          count={count}
          array={offsets}
          itemSize={1}
          args={[offsets, 1]}
        />
        <bufferAttribute
          attach="attributes-aSpeed"
          count={count}
          array={speeds}
          itemSize={1}
          args={[speeds, 1]}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={count}
          array={sizes}
          itemSize={1}
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <dataParticleMaterial
        uTime={0}
        uColor={new THREE.Color('#00ff41')}
        uPointSize={1.8}
        uOpacity={0.5}
      />
    </points>
  )
}

// ─── Volumetric Light Beams ─────────────────────────────────
function LightBeams() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001
      groupRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh
        const mat = mesh.material as THREE.MeshBasicMaterial
        mat.opacity = 0.015 + 0.01 * Math.sin(clock.elapsedTime * 0.5 + i)
      })
    }
  })

  const beams = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      angle: (i / 8) * Math.PI * 2,
      height: 4 + Math.random() * 3,
    }))
  }, [])

  return (
    <group ref={groupRef}>
      {beams.map((beam, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(beam.angle) * 5,
            1.5,
            Math.sin(beam.angle) * 5,
          ]}
          rotation={[0, -beam.angle, 0]}
        >
          <planeGeometry args={[0.15, beam.height]} />
          <meshBasicMaterial
            color="#00ff41"
            transparent
            opacity={0.025}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

// ─── Main Environment ───────────────────────────────────────
export function GraphicsEnvironment() {
  const monsters = useGameStore(s => s.monsters)
  const hero = useGameStore(s => s.hero)

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <hemisphereLight args={['#002200', '#000011', 0.4]} />
      <directionalLight
        position={[8, 15, 5]}
        intensity={0.6}
        color="#00ff41"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-4, 6, -3]} intensity={0.3} color="#339af0" />
      <pointLight position={[4, 4, 4]} intensity={0.25} color="#cc5de8" />

      {/* Environment */}
      <SkyDome />
      <ReflectiveFloor />
      <DataParticles />
      <LightBeams />

      {/* Monsters */}
      {monsters.map((monster) => (
        <MonsterEntity key={monster.id} monster={monster} />
      ))}

      {/* Hero 3D model */}
      {hero && <HeroModel />}
    </>
  )
}
