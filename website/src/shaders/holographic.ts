import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

export const HolographicMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#00ff41'),
    uOpacity: 0.8,
    uScanlineDensity: 20.0,
    uFresnelPower: 2.0,
  },
  // Vertex shader
  `
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    void main() {
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uOpacity;
    uniform float uScanlineDensity;
    uniform float uFresnelPower;

    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;

    void main() {
      // Fresnel effect (edge glow)
      vec3 viewDir = normalize(cameraPosition - vPosition);
      float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), uFresnelPower);

      // Scanlines
      float scanline = sin(vUv.y * uScanlineDensity + uTime * 2.0) * 0.5 + 0.5;
      scanline = mix(0.3, 1.0, scanline);

      // Data noise
      float noise = fract(sin(dot(vPosition.xy + uTime * 0.5, vec2(12.9898, 78.233))) * 43758.5453);

      // Glitch lines
      float glitch = step(0.98, fract(vUv.y * 40.0 + uTime * 0.5));

      // Composite
      vec3 color = uColor * (0.6 + 0.4 * fresnel) * scanline;
      color += vec3(0.0, 0.3, 0.0) * noise * 0.2;
      color += uColor * glitch * 0.5;

      float alpha = (0.3 + 0.7 * fresnel) * scanline * uOpacity;

      gl_FragColor = vec4(color, alpha);
    }
  `
)

extend({ HolographicMaterial })
