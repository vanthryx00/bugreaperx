import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

export const MonsterGlitchMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#ff6b6b'),
    uGlitchIntensity: 0.0,
    uHover: 0.0,
    uDamage: 0.0,
    uEmissiveIntensity: 0.3,
  },
  // Vertex
  `
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    uniform float uTime;
    uniform float uGlitchIntensity;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);

      // Glitch vertex displacement
      float glitch = step(0.98, fract(vUv.y * 30.0 + uTime * 2.0)) * uGlitchIntensity;
      vec3 pos = position;
      pos.x += glitch * 0.1 * sin(pos.y * 5.0 + uTime * 3.0);
      pos.y += glitch * 0.05 * cos(pos.z * 5.0 + uTime * 2.0);

      vPosition = (modelViewMatrix * vec4(pos, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment
  `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uHover;
    uniform float uDamage;
    uniform float uEmissiveIntensity;

    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;

    void main() {
      // Base color with emissive glow
      vec3 color = uColor * 0.3;

      // Energy pulse
      float pulse = sin(uTime * 2.0) * 0.5 + 0.5;
      float energy = step(0.95, fract(vUv.y * 5.0 + uTime)) * pulse;

      // Data corruption lines
      float corruption = step(0.97, fract(vUv.y * 20.0 + uTime * 0.5 + sin(vUv.x * 50.0) * 0.1));
      vec3 corruptionColor = vec3(0.0, 1.0, 0.0); // Green data corruption

      // Hover glow
      float hoverGlow = uHover * (0.1 + 0.9 * pulse);

      // Damage flash
      float damageFlash = uDamage * (0.5 + 0.5 * sin(uTime * 20.0));

      // Fresnel edge glow
      vec3 viewDir = normalize(-vPosition);
      float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 1.5);

      // Composite
      vec3 finalColor = color;
      finalColor += uColor * energy * 0.5 * uEmissiveIntensity;
      finalColor += corruptionColor * corruption * 0.4;
      finalColor += uColor * fresnel * 0.3 * (0.5 + 0.5 * pulse) * uEmissiveIntensity;
      finalColor += uColor * hoverGlow * 0.5;
      finalColor += vec3(1.0, 0.0, 0.0) * damageFlash;

      float alpha = 1.0;

      gl_FragColor = vec4(finalColor, alpha);
    }
  `
)

extend({ MonsterGlitchMaterial })
