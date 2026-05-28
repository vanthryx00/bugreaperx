import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

export const DataParticleMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#00ff41'),
    uPointSize: 2.0,
    uOpacity: 0.6,
  },
  // Vertex
  `
    uniform float uTime;
    uniform float uPointSize;
    attribute float aOffset;
    attribute float aSpeed;
    attribute float aSize;

    varying float vAlpha;

    void main() {
      vec3 pos = position;

      // Float upward slowly
      pos.y += mod(uTime * aSpeed + aOffset, 6.0) - 3.0;

      // Slight horizontal drift
      pos.x += sin(uTime * 0.3 + aOffset) * 0.3;
      pos.z += cos(uTime * 0.4 + aOffset * 1.3) * 0.3;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = aSize * uPointSize * (200.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;

      // Fade at top and bottom of float cycle
      float cycle = mod(uTime * aSpeed + aOffset, 6.0);
      vAlpha = 1.0 - abs(cycle - 3.0) / 3.0;
    }
  `,
  // Fragment
  `
    uniform vec3 uColor;
    uniform float uOpacity;

    varying float vAlpha;

    void main() {
      // Circular point with soft edge
      vec2 center = gl_PointCoord - 0.5;
      float dist = length(center);
      if (dist > 0.5) discard;

      float alpha = smoothstep(0.5, 0.0, dist) * vAlpha * uOpacity;

      // Green glow
      vec3 color = uColor * (1.0 + 0.5 * (1.0 - dist * 2.0));

      gl_FragColor = vec4(color, alpha);
    }
  `
)

extend({ DataParticleMaterial })
