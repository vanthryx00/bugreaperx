import { useRef, useEffect, useState } from 'react'
import { useAudioEngine } from './AudioEngine'

// ─── Visualizer Bar (always visible at bottom of screen) ────
export function AudioVisualizerBar() {
  const { isPlaying, frameData } = useAudioEngine()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!isPlaying || !frameData || !canvasRef.current) {
      // Draw flat line when not playing
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.fillStyle = 'rgba(0, 255, 65, 0.05)'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
      }
      return
    }

    let running = true

    const draw = () => {
      if (!running) return
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const { frequencies, waveform } = frameData
      const w = canvas.width
      const h = canvas.height

      if (!expanded) {
        // ── Mini spectrum bar ──
        ctx.clearRect(0, 0, w, h)

        const barCount = 64
        const barW = w / barCount
        const halfH = h / 2

        for (let i = 0; i < barCount; i++) {
          const idx = Math.floor((i / barCount) * frequencies.length)
          const val = frequencies[idx] / 255
          const barH = val * halfH

          // Gradient from green (low) → cyan (mid) → amber (high)
          const r = val > 0.5 ? Math.floor((val - 0.5) * 2 * 255) : 0
          const g = val > 0.5 ? Math.floor(255 - (val - 0.5) * 2 * 100) : 200 + Math.floor(val * 55)
          const b = val > 0.5 ? Math.floor(255 - (val - 0.5) * 2 * 255) : 255

          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
          ctx.fillRect(i * barW + 1, halfH - barH, barW - 2, barH * 2)
        }

        // Draw center line
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.15)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(0, halfH)
        ctx.lineTo(w, halfH)
        ctx.stroke()

        // Beat pulse indicator
        const avgFreq = frequencies.reduce((a, b) => a + b, 0) / frequencies.length
        if (avgFreq > 80) {
          ctx.fillStyle = `rgba(0, 255, 65, ${(avgFreq / 255) * 0.1})`
          ctx.fillRect(0, 0, w, h)
        }
      } else {
        // ── Expanded: top waveform + bottom spectrum ──
        ctx.clearRect(0, 0, w, h)

        const halfH = h / 2
        const midY = halfH

        // Background grid
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.05)'
        ctx.lineWidth = 0.5
        for (let i = 0; i < 10; i++) {
          const y = (i / 10) * h
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(w, y)
          ctx.stroke()
        }

        // ── Waveform (top half) ──
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.6)'
        ctx.lineWidth = 2
        ctx.beginPath()
        for (let x = 0; x < w; x++) {
          const idx = Math.floor((x / w) * waveform.length)
          const y = midY / 2 + ((waveform[idx] - 128) / 128) * (midY / 2 - 4)
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.stroke()

        // Glow effect on waveform
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.15)'
        ctx.lineWidth = 6
        ctx.beginPath()
        for (let x = 0; x < w; x++) {
          const idx = Math.floor((x / w) * waveform.length)
          const y = midY / 2 + ((waveform[idx] - 128) / 128) * (midY / 2 - 4)
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.stroke()

        // ── Spectrum (bottom half) ──
        const barCount = Math.min(128, frequencies.length)
        const barW = w / barCount

        for (let i = 0; i < barCount; i++) {
          const idx = Math.floor((i / barCount) * frequencies.length)
          const val = frequencies[idx] / 255
          const barH = val * (midY - 8)
          const x = i * barW

          const r = val > 0.5 ? Math.floor((val - 0.5) * 2 * 255) : 0
          const g = val > 0.5 ? Math.floor(255 - (val - 0.5) * 2 * 100) : 200 + Math.floor(val * 55)
          const b = val > 0.5 ? Math.floor(255 - (val - 0.5) * 2 * 255) : 255

          // Gradient fill
          const grad = ctx.createLinearGradient(x, midY + 4, x, midY + 4 + barH)
          grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.9)`)
          grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.1)`)
          ctx.fillStyle = grad
          ctx.fillRect(x + 0.5, midY + 4, barW - 1, barH)
        }

        // Divider line
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.2)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(0, midY)
        ctx.lineTo(w, midY)
        ctx.stroke()
      }

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)

    return () => {
      running = false
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [isPlaying, frameData, expanded])

  if (!isPlaying) return null

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-[9998] pointer-events-none transition-all duration-300 ${expanded ? 'h-48' : 'h-10'}`}>
      {/* Hit area to expand */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="pointer-events-auto absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-t bg-hacker-surface2/80 border border-hacker-border/30 text-[8px] font-mono text-hacker-text-dim/40 hover:text-hacker-green transition-colors z-10"
      >
        {expanded ? '▼ Collapse' : '▲ Visualizer'}
      </button>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={typeof window !== 'undefined' ? window.innerWidth : 800}
        height={expanded ? 192 : 40}
        className="w-full h-full bg-hacker-bg/70 backdrop-blur-sm border-t border-hacker-border/30"
      />

      {/* Frequency labels for expanded mode */}
      {expanded && (
        <div className="absolute bottom-1 left-4 right-4 flex justify-between text-[7px] font-mono text-hacker-text-dim/20 pointer-events-none">
          <span>20 Hz</span>
          <span>100 Hz</span>
          <span>500 Hz</span>
          <span>2 kHz</span>
          <span>8 kHz</span>
          <span>16 kHz</span>
        </div>
      )}
    </div>
  )
}

// ─── Floating Mini Visualizer (for when bar is hidden) ────
export function AudioMiniVisualizer() {
  const { isPlaying, frameData } = useAudioEngine()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!isPlaying || !frameData || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = 80
    const h = 24
    let running = true

    const draw = () => {
      if (!running) return
      ctx.clearRect(0, 0, w, h)

      const { frequencies } = frameData
      const barCount = 20
      const barW = w / barCount

      for (let i = 0; i < barCount; i++) {
        const idx = Math.floor((i / barCount) * frequencies.length)
        const val = frequencies[idx] / 255
        const barH = val * h
        ctx.fillStyle = `rgba(0, 255, 65, ${0.3 + val * 0.7})`
        ctx.fillRect(i * barW + 0.5, h - barH, barW - 1, barH)
      }

      requestAnimationFrame(draw)
    }

    const id = requestAnimationFrame(draw)
    return () => { running = false; cancelAnimationFrame(id) }
  }, [isPlaying, frameData])

  if (!isPlaying) return null

  return (
    <canvas
      ref={canvasRef}
      width={80}
      height={24}
      className="w-20 h-6 rounded opacity-60"
    />
  )
}
