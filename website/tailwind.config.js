/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        hacker: {
          bg: '#0a0a0a',
          surface: '#111111',
          surface2: '#1a1a1a',
          surface3: '#242424',
          border: '#2a2a2a',
          green: '#00ff41',
          'green-dim': '#00cc34',
          cyan: '#00d4ff',
          amber: '#ffb000',
          red: '#ff3333',
          purple: '#a855f7',
          text: '#c8c8c8',
          'text-dim': '#666666',
          'text-bright': '#ffffff',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Orbitron', '"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'blink': 'blink 1s step-end infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'slide-up': 'slideUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'grid-scroll': 'gridScroll 20s linear infinite',
        'scanline': 'scanline 8s linear infinite',
        'typing': 'typing 3s steps(30) 1s forwards',
        'glitch-fast': 'glitch 0.3s ease-in-out',
        'glitch-slow': 'glitchSlow 4s ease-in-out infinite',
        'data-stream': 'dataStream 2s linear infinite',
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-beam': 'scanBeam 3s ease-in-out infinite',
        'matrix-rain': 'matrixRain 10s linear infinite',
        'terminal-blink': 'terminalBlink 0.5s step-end infinite',
        'cyber-slide': 'cyberSlide 0.8s ease-out forwards',
        'reveal': 'reveal 0.5s ease-out forwards',
        'shimmer': 'shimmer 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 255, 65, 0.2), 0 0 20px rgba(0, 255, 65, 0.05)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 255, 65, 0.4), 0 0 40px rgba(0, 255, 65, 0.1)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        gridScroll: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(2px, -2px)' },
          '60%': { transform: 'translate(-1px, 1px)' },
          '80%': { transform: 'translate(1px, -1px)' },
          '100%': { transform: 'translate(0)' },
        },
        glitchSlow: {
          '0%, 100%': { transform: 'translate(0)', opacity: '1' },
          '5%': { transform: 'translate(-3px, 0)', opacity: '0.8' },
          '10%': { transform: 'translate(3px, 0)', opacity: '0.6' },
          '15%': { transform: 'translate(0)', opacity: '1' },
          '95%': { transform: 'translate(0)', opacity: '1' },
          '97%': { transform: 'translate(-2px, 0) skewX(-2deg)' },
          '99%': { transform: 'translate(2px, 0) skewX(2deg)' },
        },
        dataStream: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.5)', opacity: '0.5' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        scanBeam: {
          '0%, 100%': { transform: 'translateY(0) scaleY(0.5)', opacity: '0' },
          '50%': { transform: 'translateY(100%) scaleY(1)', opacity: '0.3' },
        },
        matrixRain: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '0.5' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        terminalBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        cyberSlide: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        reveal: {
          '0%': { clipPath: 'inset(0 100% 0 0)' },
          '100%': { clipPath: 'inset(0 0 0 0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [],
}
