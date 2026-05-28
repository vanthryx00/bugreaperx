import type { ThreeElements } from '@react-three/fiber'
import type * as THREE from 'three'

type ShaderMatBase = ThreeElements['shaderMaterial']

declare module '@react-three/fiber' {
  interface ThreeElements {
    holographicMaterial: ShaderMatBase & {
      uTime?: number | THREE.Color
      uColor?: THREE.Color | string
      uOpacity?: number
      uScanlineDensity?: number
      uFresnelPower?: number
    }
    monsterGlitchMaterial: ShaderMatBase & {
      uTime?: number | THREE.Color
      uColor?: THREE.Color | string
      uGlitchIntensity?: number
      uHover?: number
      uDamage?: number
      uEmissiveIntensity?: number
    }
    scanlineGroundMaterial: ShaderMatBase & {
      uTime?: number | THREE.Color
      uColor?: THREE.Color | string
      uGridSize?: number
      uRingSpeed?: number
    }
    dataParticleMaterial: ShaderMatBase & {
      uTime?: number | THREE.Color
      uColor?: THREE.Color | string
      uPointSize?: number
      uOpacity?: number
    }
    skyDomeMaterial: ShaderMatBase & {
      uTime?: number | THREE.Color
      uColor1?: THREE.Color | string
      uColor2?: THREE.Color | string
      uColor3?: THREE.Color | string
      uStarDensity?: number
    }
  }
}

export {}
