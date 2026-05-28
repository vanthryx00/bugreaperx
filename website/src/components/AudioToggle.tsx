import { useState, useRef, useEffect } from 'react'
import { useAudioEngine, BRAINWAVE_MODES, type BrainwaveMode } from './AudioEngine'
import { AudioMiniVisualizer } from './AudioVisualizer'

export function AudioToggle() {
  const { mode, isPlaying, volume, setMode, togglePlay, setVolume } = useAudioEngine()
  const [expanded, setExpanded] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    if (!expanded) return
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setExpanded(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [expanded])

  const modeKeys = Object.keys(BRAINWAVE_MODES) as Exclude<BrainwaveMode, 'off'>[]
  const currentConfig = mode !== 'off' ? BRAINWAVE_MODES[mode] : null

  return (
    <div ref={panelRef} className="fixed bottom-16 right-6 z-[9999]">
      {/* Main Toggle Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
          isPlaying
            ? 'bg-hacker-green/15 border border-hacker-green/40 shadow-[0_0_20px_rgba(0,255,65,0.15)]'
            : 'bg-hacker-surface2/50 border border-hacker-border/30 hover:border-hacker-green/30'
        }`}
        title={isPlaying ? `Hacker Focus: ${currentConfig?.label || ''}` : 'Activate Hacker Focus Audio'}
      >
        {/* Pulse ring when active */}
        {isPlaying && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-hacker-green" />
        )}

        {isPlaying ? (
          <span className="text-lg relative z-10">🎧</span>
        ) : (
          <span className="text-lg relative z-10">🔇</span>
        )}
      </button>

      {/* Expanded Panel */}
      {expanded && (
        <div className="absolute bottom-14 right-0 w-72 bg-hacker-surface border border-hacker-border/40 rounded-xl shadow-2xl shadow-black/50 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="px-4 py-3 border-b border-hacker-border/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-hacker-green tracking-wider uppercase">Hacker Focus Audio</span>
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                isPlaying ? 'bg-hacker-green/10 text-hacker-green' : 'bg-hacker-text-dim/10 text-hacker-text-dim/50'
              }`}>
                {isPlaying ? 'ACTIVE' : 'OFF'}
              </span>
            </div>
            {currentConfig && (
              <p className="text-[10px] font-mono text-hacker-text-dim/60 mt-1">{currentConfig.desc}</p>
            )}
          </div>

          {/* Mini Visualizer */}
          {isPlaying && (
            <div className="px-4 py-2 border-b border-hacker-border/20 flex items-center justify-center">
              <AudioMiniVisualizer />
            </div>
          )}

          {/* Mode Selector */}
          <div className="px-4 py-3 border-b border-hacker-border/20">
            <p className="text-[9px] font-mono text-hacker-text-dim/40 uppercase tracking-wider mb-2">Brainwave Mode</p>
            <div className="grid grid-cols-2 gap-1.5">
              {modeKeys.map((key) => {
                const cfg = BRAINWAVE_MODES[key]
                const isActive = mode === key
                return (
                  <button
                    key={key}
                    onClick={() => setMode(isActive ? 'off' : key)}
                    className={`px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-hacker-green/10 border border-hacker-green/30'
                        : 'bg-hacker-surface2/30 border border-hacker-border/20 hover:border-hacker-green/20'
                    }`}
                  >
                    <div className={`text-[10px] font-bold font-mono ${isActive ? 'text-hacker-green' : 'text-hacker-text-dim'}`}>
                      {cfg.label}
                    </div>
                    <div className="text-[8px] font-mono text-hacker-text-dim/40 mt-0.5">
                      {cfg.beat} Hz · {cfg.desc.split('·')[0].trim()}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Volume & Controls */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] font-mono text-hacker-text-dim/60">Volume</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1 h-1 rounded-full appearance-none bg-hacker-surface3 cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-hacker-green
                  [&::-webkit-slider-thumb]:shadow-[0_0_6px_rgba(0,255,65,0.4)]"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={togglePlay}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-hacker-green/10 border border-hacker-green/20 text-[10px] font-mono text-hacker-green hover:bg-hacker-green/20 transition-all"
              >
                {isPlaying ? '⏹ Stop' : '▶ Start Focus'}
              </button>

              {isPlaying && (
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-hacker-green animate-pulse" />
                  <span className="text-[8px] font-mono text-hacker-text-dim/40">
                    {currentConfig?.beat || ''} Hz
                  </span>
                </div>
              )}
            </div>

            {/* Info text */}
            <p className="mt-3 text-[8px] font-mono text-hacker-text-dim/30 leading-relaxed">
              Binaural beats + ambient drone with hemi-sync layering.
              Use headphones for best effect. β = focus, α = flow, θ = deep flow, γ = peak.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
