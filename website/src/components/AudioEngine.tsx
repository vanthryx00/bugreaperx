import { createContext, useContext, useRef, useState, useCallback, useEffect, type ReactNode } from 'react'

// ─── Types ──────────────────────────────────────────────────
export type BrainwaveMode = 'off' | 'beta' | 'alpha' | 'theta' | 'gamma'

export interface AudioFrameData {
  frequencies: Uint8Array<ArrayBuffer>
  waveform: Uint8Array<ArrayBuffer>
  beat: number
  timestamp: number
}

interface AudioEngineState {
  mode: BrainwaveMode
  isPlaying: boolean
  volume: number
  frameData: AudioFrameData | null
  setMode: (mode: BrainwaveMode) => void
  togglePlay: () => void
  setVolume: (vol: number) => void
}

const AudioContext = createContext<AudioEngineState>({
  mode: 'off',
  isPlaying: false,
  volume: 0.35,
  frameData: null,
  setMode: () => {},
  togglePlay: () => {},
  setVolume: () => {},
})

export const useAudioEngine = () => useContext(AudioContext)

// ─── Frequency Config ───────────────────────────────────────
const FREQ_CONFIG: Record<Exclude<BrainwaveMode, 'off'>, { label: string; beat: number; base: number; desc: string }> = {
  beta:  { label: 'BETA',  beat: 18, base: 190, desc: 'Deep Focus · 18 Hz' },
  alpha: { label: 'ALPHA', beat: 10, base: 200, desc: 'Creative Flow · 10 Hz' },
  theta: { label: 'THETA', beat: 6,  base: 180, desc: 'Deep Flow · 6 Hz' },
  gamma: { label: 'GAMMA', beat: 40, base: 210, desc: 'Peak Performance · 40 Hz' },
}

// ─── Binaural Pulse Engine ──────────────────────────────────
class BinauralEngine {
  ctx: AudioContext | null = null
  leftOsc: OscillatorNode | null = null
  rightOsc: OscillatorNode | null = null
  droneOsc: OscillatorNode | null = null
  subDroneOsc: OscillatorNode | null = null
  analyserNode: AnalyserNode | null = null
  noiseSource: AudioBufferSourceNode | null = null
  noiseGain: GainNode | null = null
  masterGain: GainNode | null = null
  droneGain: GainNode | null = null
  binauralGain: GainNode | null = null
  reverbNode: ConvolverNode | null = null
  delayNode: DelayNode | null = null
  delayGain: GainNode | null = null
  filterNode: BiquadFilterNode | null = null
  lfo: OscillatorNode | null = null
  lfoGain: GainNode | null = null
  currentMode: Exclude<BrainwaveMode, 'off'> = 'beta'
  noiseBuffer: AudioBuffer | null = null
  isRunning = false
  
  // Pre-allocated buffers for visualizer
  frequencyBuffer: Uint8Array<ArrayBuffer> = new Uint8Array(0) as unknown as Uint8Array<ArrayBuffer>
  waveformBuffer: Uint8Array<ArrayBuffer> = new Uint8Array(0) as unknown as Uint8Array<ArrayBuffer>

  async init() {
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)() as AudioContext
    const ctx = this.ctx
    this.masterGain = ctx.createGain()
    this.masterGain.gain.value = 0.35

    // ── Reverb (synthetic impulse response) ──
    this.reverbNode = ctx.createConvolver()
    try {
      const sr = ctx.sampleRate
      const len = sr * 2.5
      const buffer = ctx.createBuffer(2, len, sr)
      for (let ch = 0; ch < 2; ch++) {
        const data = buffer.getChannelData(ch)
        for (let i = 0; i < len; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sr * 0.3))
        }
      }
      this.reverbNode.buffer = buffer
    } catch {
      this.reverbNode = null
    }

    // ── Delay ──
    this.delayNode = ctx.createDelay(1.0)
    this.delayNode.delayTime.value = 0.25
    this.delayGain = ctx.createGain()
    this.delayGain.gain.value = 0.15

    // ── Filter ──
    this.filterNode = ctx.createBiquadFilter()
    this.filterNode.type = 'lowpass'
    this.filterNode.frequency.value = 800
    this.filterNode.Q.value = 2

    // ── Drone ──
    this.droneGain = ctx.createGain()
    this.droneGain.gain.value = 0.12

    this.droneOsc = ctx.createOscillator()
    this.droneOsc.type = 'sawtooth'
    this.droneOsc.frequency.value = 55 // A1

    this.subDroneOsc = ctx.createOscillator()
    this.subDroneOsc.type = 'sine'
    this.subDroneOsc.frequency.value = 27.5 // A0

    // ── Binaural Tones ──
    this.binauralGain = ctx.createGain()
    this.binauralGain.gain.value = 0.08

    // ── LFO for drone pulse ──
    this.lfo = ctx.createOscillator()
    this.lfo.type = 'sine'
    this.lfo.frequency.value = 0.15
    this.lfoGain = ctx.createGain()
    this.lfoGain.gain.value = 0.04

    // ── Pink Noise ──
    this.noiseGain = ctx.createGain()
    this.noiseGain.gain.value = 0.015
    this.noiseBuffer = this._generatePinkNoise(ctx, 4)

    // ── Routing Chain ──
    // Drone -> filter -> master
    this.droneOsc.connect(this.filterNode)
    this.subDroneOsc.connect(this.filterNode)
    this.filterNode.connect(this.droneGain)

    // LFO modulates drone gain
    this.lfo.connect(this.lfoGain)
    this.lfoGain.connect(this.droneGain.gain)

    // Drone -> reverb -> master
    this.droneGain.connect(this.masterGain)
    if (this.reverbNode) {
      this.droneGain.connect(this.reverbNode)
      this.reverbNode.connect(this.masterGain)
    }

    // Delay send
    this.droneGain.connect(this.delayNode)
    this.delayNode.connect(this.delayGain)
    this.delayGain.connect(this.masterGain)

    // Noise -> master
    this.noiseGain.connect(this.masterGain)

    // ── Analyser for visualizer ──
    this.analyserNode = ctx.createAnalyser()
    this.analyserNode.fftSize = 256
    this.analyserNode.smoothingTimeConstant = 0.8
    this.frequencyBuffer = new Uint8Array(this.analyserNode.frequencyBinCount) as unknown as Uint8Array<ArrayBuffer>
    this.waveformBuffer = new Uint8Array(this.analyserNode.frequencyBinCount) as unknown as Uint8Array<ArrayBuffer>

    // Tap master output through analyser
    this.masterGain.connect(this.analyserNode)
    this.masterGain.connect(ctx.destination)

    this.isRunning = true
  }

  _generatePinkNoise(ctx: AudioContext, durationSec: number): AudioBuffer {
    const sr = ctx.sampleRate
    const len = sr * durationSec
    const buffer = ctx.createBuffer(1, len, sr)
    const data = buffer.getChannelData(0)
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.96900 * b2 + white * 0.1538520
      b3 = 0.86650 * b3 + white * 0.3104856
      b4 = 0.55000 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.0168980
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
      b6 = white * 0.115926
    }
    return buffer
  }

  _startNoiseLoop() {
    if (!this.ctx || !this.noiseGain || !this.noiseBuffer) return
    const source = this.ctx.createBufferSource()
    source.buffer = this.noiseBuffer
    source.loop = true
    source.connect(this.noiseGain)
    source.start()
    this.noiseSource = source
  }

  setMode(mode: Exclude<BrainwaveMode, 'off'>) {
    const ctx = this.ctx
    if (!ctx || !this.isRunning) return
    this.currentMode = mode
    const config = FREQ_CONFIG[mode]

    // Clean up old binaural oscillators
    try { this.leftOsc?.stop(); this.leftOsc?.disconnect() } catch { /* ok */ }
    try { this.rightOsc?.stop(); this.rightOsc?.disconnect() } catch { /* ok */ }

    // Create new binaural pair
    const merger = ctx.createChannelMerger(2)

    this.leftOsc = ctx.createOscillator()
    this.leftOsc.type = 'sine'
    this.leftOsc.frequency.value = config.base

    this.rightOsc = ctx.createOscillator()
    this.rightOsc.type = 'sine'
    this.rightOsc.frequency.value = config.base + config.beat

    // Route left channel
    const leftGain = ctx.createGain()
    leftGain.gain.value = 0.35
    this.leftOsc.connect(leftGain)
    leftGain.connect(merger, 0, 0)

    // Route right channel
    const rightGain = ctx.createGain()
    rightGain.gain.value = 0.35
    this.rightOsc.connect(rightGain)
    rightGain.connect(merger, 0, 1)

    const binauralGain = this.binauralGain!
    merger.connect(binauralGain)
    binauralGain.connect(this.masterGain!)

    this.leftOsc.start()
    this.rightOsc.start()

    // Subtle pulsing LFO for the binaural gain
    if (this.lfo && this.lfoGain) {
      this.lfo.frequency.value = config.beat * 0.05
    }
  }

  start(mode: Exclude<BrainwaveMode, 'off'> = 'beta') {
    if (!this.ctx || !this.isRunning) return
    this.droneOsc?.start()
    this.subDroneOsc?.start()
    this.lfo?.start()
    this._startNoiseLoop()
    this.setMode(mode)
  }

  stop() {
    this.isRunning = false
    try { this.leftOsc?.stop(); this.leftOsc?.disconnect() } catch { /* ok */ }
    try { this.rightOsc?.stop(); this.rightOsc?.disconnect() } catch { /* ok */ }
    try { this.droneOsc?.stop(); this.droneOsc?.disconnect() } catch { /* ok */ }
    try { this.subDroneOsc?.stop(); this.subDroneOsc?.disconnect() } catch { /* ok */ }
    try { this.lfo?.stop(); this.lfo?.disconnect() } catch { /* ok */ }
    try { this.noiseSource?.stop(); this.noiseSource?.disconnect() } catch { /* ok */ }
    this.ctx?.close().catch(() => { /* ok */ })
    this.ctx = null
  }

  getFrameData(): AudioFrameData {
    const analyser = this.analyserNode
    if (analyser) {
      analyser.getByteFrequencyData(this.frequencyBuffer)
      analyser.getByteTimeDomainData(this.waveformBuffer)
    }
    return {
      frequencies: this.frequencyBuffer,
      waveform: this.waveformBuffer,
      beat: FREQ_CONFIG[this.currentMode]?.beat ?? 0,
      timestamp: performance.now(),
    }
  }

  setVolume(vol: number) {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, vol))
    }
  }
}

// ─── React Provider ─────────────────────────────────────────
export function AudioEngineProvider({ children }: { children: ReactNode }) {
  const engineRef = useRef<BinauralEngine | null>(null)
  const [mode, setModeState] = useState<BrainwaveMode>('off')
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolumeState] = useState(0.35)
  const [frameData, setFrameData] = useState<AudioFrameData | null>(null)
  const frameIdRef = useRef<number>(0)
  const isInitializingRef = useRef(false)

  // Initialize audio context on first user interaction
  const ensureInit = useCallback(async () => {
    if (engineRef.current?.isRunning || isInitializingRef.current) return
    isInitializingRef.current = true
    try {
      const engine = new BinauralEngine()
      await engine.init()
      engineRef.current = engine
    } finally {
      isInitializingRef.current = false
    }
  }, [])

  const setMode = useCallback((newMode: BrainwaveMode) => {
    if (newMode === 'off') {
      engineRef.current?.stop()
      engineRef.current = null
      setModeState('off')
      setIsPlaying(false)
      return
    }

    // If engine isn't running, init and start
    if (!engineRef.current?.isRunning) {
      ensureInit().then(() => {
        const engine = engineRef.current
        if (engine) {
          engine.start(newMode)
          setModeState(newMode)
          setIsPlaying(true)
        }
      })
      return
    }

    // Engine is running — just switch mode
    engineRef.current.setMode(newMode)
    setModeState(newMode)
    setIsPlaying(true)
  }, [ensureInit])

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      engineRef.current?.stop()
      engineRef.current = null
      setModeState('off')
      setIsPlaying(false)
      return
    }
    // Prevent race if already initializing
    if (isInitializingRef.current) return
    isInitializingRef.current = true
    // Default to beta on play
    const engine = new BinauralEngine()
    engine.init().then(() => {
      engineRef.current = engine
      engine.start('beta')
      setModeState('beta')
      setIsPlaying(true)
    }).finally(() => {
      isInitializingRef.current = false
    })
  }, [isPlaying])

  const setVolume = useCallback((vol: number) => {
    engineRef.current?.setVolume(vol)
    setVolumeState(vol)
  }, [])

  // Frame loop for visualizer data
  const frameLoop = useCallback(() => {
    const engine = engineRef.current
    if (engine?.isRunning) {
      setFrameData(engine.getFrameData())
      frameIdRef.current = requestAnimationFrame(frameLoop)
    }
  }, [])

  // Start/stop frame loop based on isPlaying
  useEffect(() => {
    if (isPlaying && engineRef.current?.isRunning) {
      frameIdRef.current = requestAnimationFrame(frameLoop)
    }
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current)
        frameIdRef.current = 0
      }
    }
  }, [isPlaying, frameLoop])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current)
      engineRef.current?.stop()
    }
  }, [])

  return (
    <AudioContext.Provider value={{ mode, isPlaying, volume, frameData, setMode, togglePlay, setVolume }}>
      {children}
    </AudioContext.Provider>
  )
}

// ─── Frequency Info Export ──────────────────────────────────
export const BRAINWAVE_MODES = FREQ_CONFIG
