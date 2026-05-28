import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsType } from 'three-stdlib'
import { EffectComposer, Bloom, DepthOfField, Noise, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { GraphicsEnvironment } from './GraphicsEnvironment'

// ─── Post-Processing Effects ─────────────────────────────────
function Effects() {
  return (
    <EffectComposer>
      {/* Bloom - high quality with mipmap blur */}
      <Bloom
        mipmapBlur
        intensity={1.2}
        luminanceThreshold={0.15}
        luminanceSmoothing={0.7}
      />

      {/* Secondary bloom for bright objects */}
      <Bloom
        intensity={0.5}
        luminanceThreshold={0.8}
        luminanceSmoothing={0.3}
      />

      {/* Depth of field - subtle cinematic blur */}
      <DepthOfField
        focusDistance={0.025}
        focalLength={0.08}
        bokehScale={3}
        height={480}
      />

      {/* Film grain for atmospheric feel */}
      <Noise opacity={0.03} />

      {/* Dark vignette corners */}
      <Vignette eskil={false} offset={0.2} darkness={0.8} />
    </EffectComposer>
  )
}

// ─── Camera Controller ──────────────────────────────────────
function CameraController() {
  const controlsRef = useRef<OrbitControlsType>(null)
  const isInteracting = useRef(false)

  useFrame(({ clock }) => {
    if (controlsRef.current) {
      const controls = controlsRef.current
      // Subtle auto-orbit when not interacting
      if (!isInteracting.current) {
        controls.target.x = Math.sin(clock.elapsedTime * 0.02) * 0.3
        controls.target.z = Math.cos(clock.elapsedTime * 0.02) * 0.3
      }
    }
  })

  const handleStart = () => { isInteracting.current = true }
  const handleEnd = () => { isInteracting.current = false }

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan
      enableZoom
      enableRotate
      maxPolarAngle={Math.PI / 2.4}
      minDistance={3}
      maxDistance={20}
      target={[0, 0.5, 0]}
      dampingFactor={0.05}
      enableDamping
      onStart={handleStart}
      onEnd={handleEnd}
    />
  )
}

// ─── Scene ──────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <GraphicsEnvironment />
      <CameraController />
      <Effects />
    </>
  )
}

// ─── Canvas ─────────────────────────────────────────────────
export function GameCanvas() {
  return (
    <div className="fixed inset-0 top-0 left-0 w-full h-full">
      <Canvas
        camera={{ position: [8, 5, 8], fov: 55, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
