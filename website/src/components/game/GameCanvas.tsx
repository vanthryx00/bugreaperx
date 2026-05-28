import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Stars, OrbitControls } from '@react-three/drei'
import { useGameStore } from '../../lib/game/store'
import { MonsterEntity } from './MonsterEntity'

function Scene() {
  const monsters = useGameStore(s => s.monsters)

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 20, 5]}
        intensity={0.8}
        color="#00ff41"
      />
      <pointLight position={[-5, 5, -5]} intensity={0.4} color="#339af0" />
      <pointLight position={[5, 3, 5]} intensity={0.3} color="#cc5de8" />

      <Stars
        radius={50}
        depth={30}
        count={2000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#0a0a1a" transparent opacity={0.8} />
      </mesh>
      <gridHelper args={[30, 30, '#00ff41', '#00ff41']} position={[0, -0.45, 0]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, 0]}>
        <ringGeometry args={[2, 8, 64]} />
        <meshBasicMaterial color="#00ff41" transparent opacity={0.03} side={2} />
      </mesh>

      {monsters.map((monster) => (
        <MonsterEntity key={monster.id} monster={monster} />
      ))}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2.5}
        minDistance={3}
        maxDistance={20}
        target={[0, 0, 0]}
      />

      <ContactShadows
        position={[0, -0.4, 0]}
        opacity={0.4}
        scale={20}
        blur={2.5}
        far={4}
      />
    </>
  )
}

export function GameCanvas() {
  return (
    <div className="fixed inset-0 top-0 left-0 w-full h-full">
      <Canvas
        camera={{ position: [8, 6, 8], fov: 60, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0a0a1a')
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
