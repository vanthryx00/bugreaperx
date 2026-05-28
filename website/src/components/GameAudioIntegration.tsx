import { useEffect, useRef } from 'react'
import { useAudioEngine, type BrainwaveMode } from './AudioEngine'
import { useGameStore } from '../lib/game/store'

// Maps game screens to optimal brainwave modes
const SCREEN_MODE_MAP: Record<string, BrainwaveMode> = {
  combat: 'beta',       // Intense focus for battle
  shop: 'alpha',        // Relaxed creativity for browsing
  wallet: 'alpha',      // Calm analysis
  menu: 'theta',        // Deep flow for strategizing
  hero_creation: 'theta', // Creative flow for character building
  hub: 'alpha',         // Exploration mode
}

export function GameAudioIntegration() {
  const screen = useGameStore(s => s.screen)
  const { setMode, isPlaying, mode } = useAudioEngine()
  const prevScreenRef = useRef(screen)

  useEffect(() => {
    const prevScreen = prevScreenRef.current
    prevScreenRef.current = screen

    // Don't switch if audio isn't playing
    if (!isPlaying) return

    // Get the target mode for current screen
    const targetMode = SCREEN_MODE_MAP[screen]
    if (!targetMode) return

    // Only switch if different from current
    if (targetMode !== mode) {
      // Add a small transition comment for console (helps debugging)
      if (import.meta.env.DEV) {
        console.log(`[GameAudio] ${prevScreen}→${screen}: ${mode}→${targetMode}`)
      }
      setMode(targetMode)
    }
  }, [screen, isPlaying, mode, setMode])

  // Start audio on first combat encounter if not already playing
  useEffect(() => {
    if (screen === 'combat' && !isPlaying) {
      setMode('beta')
    }
  }, [screen, isPlaying, setMode])

  // This component renders nothing
  return null
}

// ─── Export the screen-to-mode mapping for other components ──
export function getOptimalModeForScreen(screen: string): BrainwaveMode {
  return SCREEN_MODE_MAP[screen] || 'beta'
}
