import { useRef, useEffect, useState } from 'react'
import { useAudioEngine } from './AudioEngine'

const VERSE_LINES = [
  { text: '', type: 'spacer' as const },
  { text: 'VERSE 2: THE ARSENAL', type: 'header' as const },
  { text: '', type: 'spacer' as const },
  { text: 'Boot up the terminal, proxy through Burp Suite Pro', type: 'verse' as const },
  { text: 'Intruder payloads loaded, watch the bandwidth flow', type: 'verse' as const },
  { text: 'Spinning up the cloud, FFUF is moving fast', type: 'verse' as const },
  { text: 'Parallel processing, making every second last', type: 'verse' as const },
  { text: '', type: 'spacer' as const },
  { text: 'Catch the HTTP desync, smuggle in the byte', type: 'verse' as const },
  { text: 'Cache poisoning the CDN, fading out of sight', type: 'verse' as const },
  { text: 'Nuclei templates firing, sweeping through the mesh', type: 'verse' as const },
  { text: 'DOM-based XSS, tearing through the flesh', type: 'verse' as const },
  { text: '', type: 'spacer' as const },
  { text: 'Out-of-band XXE, catching pingbacks in the dark', type: 'verse' as const },
  { text: 'Ghidra on the binary, dismantling the spark', type: 'verse' as const },
  { text: 'Forging JWTs, privilege escalate the claim', type: 'verse' as const },
  { text: 'Prototype pollution, breaking down the frame', type: 'verse' as const },
  { text: '', type: 'spacer' as const },
  { text: "SQLi blind, inferring data bit by bit", type: 'verse' as const },
  { text: 'Amass and Subfinder, mapping every single hit', type: 'verse' as const },
  { text: 'Wireshark the packets, decrypting TLS', type: 'verse' as const },
  { text: 'Bug Reaper X, calculating the finesse!', type: 'verse' as const, highlight: true },
  { text: '', type: 'spacer' as const },
  { text: '— CHORUS —', type: 'chorus-header' as const },
  { text: '', type: 'spacer' as const },
  { text: 'APT MOVEMENT, WATCH THE KILL CHAIN GROW!', type: 'chorus' as const },
  { text: 'OMNIMIND ACTIVE, I RUN THE WHOLE SHOW!', type: 'chorus' as const },
  { text: 'ROOT SHELL SECURED, ELITE REAPER X!', type: 'chorus' as const },
  { text: "CASHIN' OUT THE BOUNTY, YEAH WE ONTO THE NEXT!", type: 'chorus' as const },
  { text: '', type: 'spacer' as const },
]

export function VerseSection() {
  const [revealedCount, setRevealedCount] = useState(0)
  const [autoScroll, setAutoScroll] = useState(true)
  const [userScrolled, setUserScrolled] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { setMode, isPlaying } = useAudioEngine()

  // Reveal lines one by one
  useEffect(() => {
    if (revealedCount >= VERSE_LINES.length) return
    const delay = VERSE_LINES[revealedCount]?.type === 'spacer'
      ? 300
      : VERSE_LINES[revealedCount]?.type === 'header' || VERSE_LINES[revealedCount]?.type === 'chorus-header'
        ? 800
        : 120 + Math.random() * 200
    const timer = setTimeout(() => {
      setRevealedCount(prev => prev + 1)
    }, delay)
    return () => clearTimeout(timer)
  }, [revealedCount])

  // Auto scroll
  useEffect(() => {
    if (!autoScroll || !containerRef.current) return
    const el = containerRef.current
    el.scrollTop = el.scrollHeight
  }, [revealedCount, autoScroll])

  // Detect manual scroll
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onScroll = () => {
      const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40
      setAutoScroll(isAtBottom)
      if (!isAtBottom) setUserScrolled(true)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  // Auto-start beta audio when verse begins
  useEffect(() => {
    if (revealedCount > 3 && !isPlaying) {
      setMode('beta')
    }
  }, [revealedCount > 3])

  return (
    <section id="verse" className="py-24 relative overflow-hidden">
      {/* Background — data stream cyberpunk */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-[700px] h-[700px] rounded-full bg-hacker-cyan/5 blur-[150px] -top-48 -right-48" />
        <div className="w-[500px] h-[500px] rounded-full bg-hacker-purple/5 blur-[120px] -bottom-48 -left-48" />
        {/* Matrix rain columns */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 text-[6px] font-mono text-hacker-green whitespace-nowrap"
              style={{
                left: `${i * 3.33}%`,
                animation: `matrixRain ${6 + Math.random() * 8}s linear infinite`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            >
              {Array.from({ length: 40 }).map((_, j) => (
                <div key={j}>{String.fromCharCode(0x30A0 + Math.random() * 96)}</div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hacker-cyan/10 border border-hacker-cyan/20 text-xs font-mono text-hacker-cyan mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-hacker-cyan animate-pulse" />
            The Elite Reaper's Anthem
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-hacker-text-bright mb-4">
            Verse{' '}
            <span className="text-gradient">II</span>
            <span className="text-hacker-text-dim/30 mx-2">·</span>
            <span className="shimmer-text">The Arsenal</span>
          </h2>
          <p className="text-sm text-hacker-text-dim max-w-2xl mx-auto">
            Lyrical breakdown of the elite bug bounty methodology. Each bar references a real technique, tool, or exploit chain.
          </p>
        </div>

        {/* Terminal-like Verse Display */}
        <div className="relative">
          {/* Glow behind */}
          <div className="absolute -inset-6 bg-gradient-to-br from-hacker-cyan/5 via-hacker-purple/5 to-hacker-green/5 rounded-2xl blur-3xl opacity-60" />

          <div className="terminal-window relative shadow-[0_0_80px_rgba(0,212,255,0.06)]">
            {/* Header */}
            <div className="terminal-header">
              <div className="terminal-dot terminal-dot-red" />
              <div className="terminal-dot terminal-dot-yellow" />
              <div className="terminal-dot terminal-dot-green" />
              <span className="text-[10px] text-hacker-text-dim/50 ml-2 font-mono">bugreaper@reaper:~ /verse-2</span>
              <span className="ml-auto flex items-center gap-1.5">
                <span className={`w-1 h-1 rounded-full ${revealedCount < VERSE_LINES.length ? 'bg-hacker-green animate-pulse' : 'bg-hacker-text-dim/30'}`} />
                <span className="text-[8px] font-mono text-hacker-text-dim/30">
                  {Math.round((revealedCount / VERSE_LINES.length) * 100)}%
                </span>
              </span>
            </div>

            {/* Body */}
            <div
              ref={containerRef}
              className="terminal-body font-mono text-xs md:text-sm leading-relaxed min-h-[400px] max-h-[500px] overflow-y-auto"
              onClick={() => { setAutoScroll(true); setUserScrolled(false) }}
            >
              <div className="text-hacker-green/60 mb-2">cat ~/verse-2_arsenal.txt</div>
              <div className="text-hacker-text-dim/40 mb-4 text-[10px]">
                Loading lyrical payload... initializing rhythmic exploit chain.
              </div>

              {VERSE_LINES.slice(0, revealedCount).map((line, i) => {
                if (line.type === 'spacer') return <div key={i} className="h-2" />
                if (line.type === 'header') {
                  return (
                    <div key={i} className="text-hacker-cyan font-bold tracking-wider mb-2 animate-glitch-slow">
                      $ {line.text}
                    </div>
                  )
                }
                if (line.type === 'chorus-header') {
                  return (
                    <div key={i} className="flex items-center gap-3 my-2">
                      <div className="flex-1 h-px bg-gradient-to-r from-hacker-amber/50 to-transparent" />
                      <span className="text-[10px] font-mono text-hacker-amber/70 tracking-[0.3em] uppercase">{line.text}</span>
                      <div className="flex-1 h-px bg-gradient-to-l from-hacker-amber/50 to-transparent" />
                    </div>
                  )
                }
                if (line.type === 'chorus') {
                  return (
                    <div
                      key={i}
                      className="text-hacker-amber font-bold text-sm md:text-base py-1 glitch-text"
                      data-text={line.text}
                      style={{
                        textShadow: '0 0 10px rgba(255,176,0,0.3), 0 0 20px rgba(255,176,0,0.1)',
                      }}
                    >
                      <span className="text-hacker-green/30">&gt; </span>
                      {line.text}
                    </div>
                  )
                }
                // verse
                return (
                  <div
                    key={i}
                    className={`py-0.5 ${line.highlight ? 'text-hacker-green font-semibold' : 'text-hacker-text-dim'}`}
                  >
                    <span className="text-hacker-text-dim/40">{String(i).padStart(2, '0')}: </span>
                    {line.text}
                  </div>
                )
              })}

              {/* Blinking cursor at end */}
              {revealedCount < VERSE_LINES.length && (
                <div className="mt-2 flex items-center gap-1">
                  <span className="text-hacker-green">$</span>
                  <span className="inline-block w-2 h-4 bg-hacker-green animate-terminal-blink" />
                </div>
              )}

              {revealedCount >= VERSE_LINES.length && (
                <div className="mt-4 pt-4 border-t border-hacker-border/20">
                  <div className="text-hacker-green/60 text-[10px]">
                    ✓ Verse loaded. 24 bars. 0 errors.
                  </div>
                  <div className="text-hacker-text-dim/40 text-[9px] mt-1">
                    Each bar references real exploit techniques. Hover the <span className="text-hacker-cyan">Methodology</span> section below for the technical breakdown.
                  </div>
                </div>
              )}

              {/* Scroll hint */}
              {userScrolled && (
                <div className="sticky bottom-0 text-center py-2">
                  <button
                    onClick={() => { setAutoScroll(true); setUserScrolled(false) }}
                    className="text-[9px] font-mono text-hacker-text-dim/40 hover:text-hacker-green transition-colors animate-pulse"
                  >
                    ↓ Scroll to bottom for auto-play
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Audio indicator */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-hacker-surface2/30 border border-hacker-border/20">
            <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-hacker-green animate-pulse' : 'bg-hacker-text-dim/30'}`} />
            <span className="text-[10px] font-mono text-hacker-text-dim/50">
              {isPlaying ? '🎧 Hacker Focus Audio Active — Beta waves (18 Hz)' : 'Hacker Focus Audio will auto-start when verse plays'}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
