import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

export const SkyDomeMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor1: new THREE.Color('#001a00'),
    uColor2: new THREE.Color('#003300'),
    uColor3: new THREE.Color('#004400'),
    uStarDensity: 40.0,
  },
  // Vertex
  `
    varying vec3 vPosition;
    void main() {
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment
  `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform float uStarDensity;

    varying vec3 vPosition;

    // Simple noise function
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float stars(vec2 uv, float density) {
      vec2 grid = floor(uv * density);
      vec2 local = fract(uv * density) - 0.5;
      float star = hash(grid);
      float twinkle = sin(uTime * 2.0 + star * 6.28) * 0.5 + 0.5;
      float dist = length(local);
      return step(0.95, star) * step(dist, 0.02 + 0.03 * twinkle) * (0.3 + 0.7 * twinkle);
    }

    void main() {
      // Normalize position to get direction
      vec3 dir = normalize(vPosition);

      // Create UV from spherical coordinates
      vec2 uv = vec2(
        atan(dir.z, dir.x) / 6.2832,
        acos(dir.y) / 3.1416
      );

      // Nebula bands
      float nebula1 = sin(uv.x * 3.0 + uv.y * 2.0 + uTime * 0.02) * 0.5 + 0.5;
      float nebula2 = sin(uv.x * 5.0 - uv.y * 3.0 + uTime * 0.03 + 1.2) * 0.5 + 0.5;
      float nebula3 = sin((uv.x + uv.y) * 4.0 + uTime * 0.015 + 3.0) * 0.5 + 0.5;

      // Gradient background
      vec3 color = mix(uColor1, uColor2, nebula1);
      color = mix(color, uColor3, nebula2 * 0.5);
      color += vec3(0.0, 0.1, 0.0) * nebula3 * 0.3;

      // Stars
      float star = stars(uv, uStarDensity);
      float star2 = stars(uv + 0.5, uStarDensity * 1.5);
      color += vec3(1.0, 1.0, 0.8) * (star + star2 * 0.6);

      // Data stream bands (horizontal lines across sky)
      float dataBand = step(0.97, fract(uv.y * 12.0 + uTime * 0.05));
      color += vec3(0.0, 0.5, 0.0) * dataBand * 0.3;

      // Horizon glow (green)
      float horizon = exp(-pow(abs(uv.y - 0.1) * 5.0, 2.0));
      color += vec3(0.0, 0.2, 0.0) * horizon * 0.5;

      gl_FragColor = vec4(color, 1.0);
    }
  `
)

extend({ SkyDomeMaterial })
