import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

export const ScanlineGroundMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#00ff41'),
    uGridSize: 20.0,
    uRingSpeed: 0.3,
  },
  // Vertex
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment
  `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uGridSize;
    uniform float uRingSpeed;

    varying vec2 vUv;

    void main() {
      // Center the UVs
      vec2 centered = vUv * 2.0 - 1.0;
      float dist = length(centered);

      // Grid lines
      vec2 grid = abs(fract(vUv * uGridSize - uTime * 0.05) - 0.5);
      float gridLine = 1.0 - min(grid.x, grid.y) * 10.0;
      gridLine = step(0.95, gridLine);

      // Expanding rings from center
      float ring = sin(dist * 10.0 - uTime * uRingSpeed) * 0.5 + 0.5;
      ring = step(0.6, ring) * (1.0 - dist * 0.3);

      // Scan line sweep
      float scanY = fract(vUv.y + uTime * 0.08);
      float scanLine = exp(-pow((scanY - 0.5) * 8.0, 2.0));

      // Distance fade
      float fade = 1.0 - dist * 0.4;

      // Composite
      vec3 color = vec3(0.0, 0.02, 0.0);
      color += uColor * gridLine * 0.08 * fade;
      color += uColor * ring * 0.15 * fade;
      color += uColor * scanLine * 0.12 * fade;
      color += uColor * 0.02 * fade;

      float alpha = 0.6 * fade;

      gl_FragColor = vec4(color, alpha);
    }
  `
)

extend({ ScanlineGroundMaterial })
