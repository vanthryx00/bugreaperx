import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import javascriptObfuscator from 'vite-plugin-javascript-obfuscator'

export default defineConfig({
  plugins: [
    react(),
    javascriptObfuscator({
      options: {
        // ─── Basic ──────────────────────────────────────────
        compact: true,
        log: false,
        optionsPreset: 'high-obfuscation',

        // ─── Identifier Obfuscation ─────────────────────────
        identifierNamesGenerator: 'mangled',
        identifiersPrefix: '_0x',
        renameGlobals: true,

        // ─── String Protection ──────────────────────────────
        stringArray: true,
        stringArrayCallsTransform: true,
        stringArrayCallsTransformThreshold: 1.0,
        stringArrayEncoding: ['rc4', 'base64'],
        stringArrayIndexShift: true,
        stringArrayRotate: true,
        stringArrayShuffle: true,
        stringArrayWrappersChainedCalls: true,
        stringArrayWrappersCount: 10,
        stringArrayWrappersParametersMaxCount: 10,
        stringArrayWrappersType: 'function',
        stringArrayThreshold: 1.0,

        // ─── Control Flow ───────────────────────────────────
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.9,

        // ─── Dead Code Injection ────────────────────────────
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.8,

        // ─── Numbers & Expressions ──────────────────────────
        numbersToExpressions: true,
        simplify: true,

        // ─── String Splitting ───────────────────────────────
        splitStrings: true,
        splitStringsChunkLength: 3,

        // ─── Object Transform ───────────────────────────────
        transformObjectKeys: true,

        // ─── Unicode Escape (double encoding) ───────────────
        unicodeEscapeSequence: true,

        // ─── Domain Lock (CLONE KILLER) ─────────────────────
        domainLock: ['bugreaper-x.ca', 'www.bugreaper-x.ca', 'bugreaperx.vercel.app', 'localhost'],
        domainLockRedirectUrl: 'https://bugreaper-x.ca',

        // ─── Self-Defending ─────────────────────────────────
        selfDefending: true,

        // ─── Debug Protection ───────────────────────────────
        debugProtection: true,
        debugProtectionInterval: 2000,

        // ─── Console Protection ─────────────────────────────
        disableConsoleOutput: false, // We manage console ourselves

        // ─── Source Maps (DISABLED - security) ──────────────
        sourceMap: false,
        sourceMapBaseUrl: '',
        sourceMapMode: 'inline',

        // ─── Misc ───────────────────────────────────────────
        ignoreRequireImports: false,
        preventDebug: true,
        reservedNames: ['BugReaperX', 'bugreaper'],
      },
    }),
  ],
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    esbuild: {
      drop: [],
      legalComments: 'none',
      keepNames: false,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          three: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing', 'three-stdlib'],
          game: ['./src/lib/game/store.ts', './src/lib/game/types.ts', './src/lib/game/combat.ts', './src/lib/game/hero.ts', './src/lib/game/monsters.ts', './src/lib/game/weapons.ts', './src/lib/game/armour.ts'],
          shaders: ['./src/shaders/holographic.ts', './src/shaders/monsterGlitch.ts', './src/shaders/scanlineGround.ts', './src/shaders/particleData.ts', './src/shaders/skyDome.ts'],
          protection: ['./src/lib/honeypot.ts', './src/lib/anticlone.ts'],
        },
        chunkFileNames: 'assets/[name]-[hash].js',
      },
    },
    // Increase chunk size limit since obfuscation inflates code
    chunkSizeWarningLimit: 2000,
  },
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __BUILD_VERSION__: JSON.stringify('4.0.0'),
  },
})
