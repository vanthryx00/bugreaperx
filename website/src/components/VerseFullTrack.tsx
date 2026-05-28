import { useRef, useEffect, useState } from 'react'
import { useAudioEngine } from './AudioEngine'

// ─── VERSE 1: THE ORIGIN STORY ──────────────────────────────
const VERSE_1 = [
  { text: '', type: 'spacer' as const },
  { text: 'VERSE 1: THE ORIGIN', type: 'header' as const },
  { text: '', type: 'spacer' as const },
  { text: 'Terminal flicker, midnight oil burning bright', type: 'verse' as const },
  { text: 'Packet trace in the dark, searching for the light', type: 'verse' as const },
  { text: 'First XSS pop, browser lit up like a star', type: 'verse' as const },
  { text: 'Knew right then and there, I was raising the bar', type: 'verse' as const },
  { text: '', type: 'spacer' as const },
  { text: 'SQLi on a login form, dumped the hash table', type: 'verse' as const },
  { text: 'Privilege escalation, breaking every label', type: 'verse' as const },
  { text: 'Burp Suite proxy, intercepting every call', type: 'verse' as const },
  { text: 'Mapping endpoints, I was climbing up the wall', type: 'verse' as const },
  { text: '', type: 'spacer' as const },
  { text: 'Curriculum vitae? Nah, just CVEs and bounties', type: 'verse' as const },
  { text: 'Self-taught through the trenches, counting all my counties', type: 'verse' as const },
  { text: 'From script kiddie to sovereign, the metamorphosis', type: 'verse' as const },
  { text: 'Bug Reaper born in the cold cyber abyss', type: 'verse' as const, highlight: true },
  { text: '', type: 'spacer' as const },
]

// ─── VERSE 2: THE ARSENAL (existing content) ────────────────
const VERSE_2 = [
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
]

// ─── CHORUS ─────────────────────────────────────────────────
const CHORUS = [
  { text: '', type: 'spacer' as const },
  { text: '— CHORUS —', type: 'chorus-header' as const },
  { text: '', type: 'spacer' as const },
  { text: 'APT MOVEMENT, WATCH THE KILL CHAIN GROW!', type: 'chorus' as const },
  { text: 'OMNIMIND ACTIVE, I RUN THE WHOLE SHOW!', type: 'chorus' as const },
  { text: 'ROOT SHELL SECURED, ELITE REAPER X!', type: 'chorus' as const },
  { text: "CASHIN' OUT THE BOUNTY, YEAH WE ONTO THE NEXT!", type: 'chorus' as const },
  { text: '', type: 'spacer' as const },
]

// ─── VERSE 3: THE VICTORY LAP ───────────────────────────────
const VERSE_3 = [
  { text: '', type: 'spacer' as const },
  { text: 'VERSE 3: THE VICTORY LAP', type: 'header' as const },
  { text: '', type: 'spacer' as const },
  { text: 'Critical finding verified, CVSS 9.8 on deck', type: 'verse' as const },
  { text: 'Chain the RCE with SSRF, bending every neck', type: 'verse' as const },
  { text: 'Race condition in the API, timing my attack', type: 'verse' as const },
  { text: 'File read on the server, never looking back', type: 'verse' as const },
  { text: '', type: 'spacer' as const },
  { text: 'Report crafted clean, repro steps crystal clear', type: 'verse' as const },
  { text: 'Triage team scrambling, bounty hits my frontier', type: 'verse' as const },
  { text: '$50K wired straight, no negotiation needed', type: 'verse' as const },
  { text: 'Leaderboard climbing, every bounty I exceeded', type: 'verse' as const },
  { text: '', type: 'spacer' as const },
  { text: 'Automation pipeline humming, 24/7 grind', type: 'verse' as const },
  { text: 'While they sleep, I\'m finding bugs of every kind', type: 'verse' as const },
  { text: 'Zero to hero, from recon to the payout', type: 'verse' as const },
  { text: 'Bug Reaper X, there\'s no doubt about the takeout!', type: 'verse' as const, highlight: true },
  { text: '', type: 'spacer' as const },
]

// ─── Track Structure ────────────────────────────────────────
// Verse 1 → Chorus → Verse 2 → Chorus → Verse 3 → Chorus
const FULL_TRACK = [
  ...VERSE_1,
  ...CHORUS,
  ...VERSE_2,
  ...CHORUS,
  ...VERSE_3,
  ...CHORUS,
  { text: '', type: 'spacer' as const },
  { text: '— OUTRO —', type: 'chorus-header' as const },
  { text: '', type: 'spacer' as const },
  { text: 'Bug Reaper X, signing off... session logged.', type: 'verse' as const, highlight: true },
  { text: 'The hunt never ends. It just moves to the next target.', type: 'verse' as const },
  { text: '', type: 'spacer' as const },
]

// ─── Track Section Markers ──────────────────────────────────
const SECTION_MARKERS = [
  { label: 'Verse 1', verseIndex: 0, color: 'text-hacker-green' },
  { label: 'Chorus', verseIndex: 1, color: 'text-hacker-amber' },
  { label: 'Verse 2', verseIndex: 2, color: 'text-hacker-cyan' },
  { label: 'Chorus', verseIndex: 3, color: 'text-hacker-amber' },
  { label: 'Verse 3', verseIndex: 4, color: 'text-hacker-purple' },
  { label: 'Chorus', verseIndex: 5, color: 'text-hacker-amber' },
  { label: 'Outro', verseIndex: 6, color: 'text-hacker-text-dim' },
]

// ─── Component ──────────────────────────────────────────────
export function VerseFullTrack() {
  const [revealedCount, setRevealedCount] = useState(0)
  const [autoScroll, setAutoScroll] = useState(true)
  const [userScrolled, setUserScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const { setMode, isPlaying } = useAudioEngine()

  // Reveal lines one by one
  useEffect(() => {
    if (revealedCount >= FULL_TRACK.length) return

    const currentLine = FULL_TRACK[revealedCount]
    const delay = currentLine?.type === 'spacer'
      ? 200
      : currentLine?.type === 'header' || currentLine?.type === 'chorus-header'
        ? 600
        : currentLine?.type === 'chorus'
          ? 180 + Math.random() * 150
          : 100 + Math.random() * 180

    const timer = setTimeout(() => {
      setRevealedCount(prev => prev + 1)
    }, delay)
    return () => clearTimeout(timer)
  }, [revealedCount])

  // Track active section
  useEffect(() => {
    // Sections: Verse1(0..VERSE_1), Chorus1, Verse2, Chorus2, Verse3, Chorus3, Outro
    const sectionBoundaries = [VERSE_1.length, VERSE_1.length + CHORUS.length, VERSE_1.length + CHORUS.length + VERSE_2.length, VERSE_1.length + CHORUS.length + VERSE_2.length + CHORUS.length, VERSE_1.length + CHORUS.length + VERSE_2.length + CHORUS.length + VERSE_3.length, VERSE_1.length + CHORUS.length + VERSE_2.length + CHORUS.length + VERSE_3.length + CHORUS.length]
    for (let i = 0; i < sectionBoundaries.length; i++) {
      if (revealedCount <= sectionBoundaries[i]) {
        setActiveSection(i)
        break
      }
    }
  }, [revealedCount])

  // Auto scroll
  useEffect(() => {
    if (!autoScroll || !containerRef.current) return
    containerRef.current.scrollTop = containerRef.current.scrollHeight
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

  // Auto-start beta audio when first verse begins
  useEffect(() => {
    if (revealedCount === 3 && !isPlaying) {
      setMode('beta')
    }
  }, [revealedCount, isPlaying, setMode])

  // Calculate total lines for progress
  const totalLines = FULL_TRACK.length
  const progress = Math.min(100, Math.round((revealedCount / totalLines) * 100))

  return (
    <section id="verse" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-[700px] h-[700px] rounded-full bg-hacker-cyan/5 blur-[150px] -top-48 -right-48" />
        <div className="w-[500px] h-[500px] rounded-full bg-hacker-purple/5 blur-[120px] -bottom-48 -left-48" />
        {/* Matrix rain */}
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
            Full{' '}
            <span className="text-gradient">Track</span>
            <span className="text-hacker-text-dim/30 mx-2">·</span>
            <span className="shimmer-text">3 Verses</span>
          </h2>
          <p className="text-sm text-hacker-text-dim max-w-2xl mx-auto">
            The complete Bug Reaper X anthem. From origin, through the arsenal, to the victory lap.
            Each bar references real exploit techniques, tools, and bug bounty culture.
          </p>
        </div>

        {/* Section Progress Indicator */}
        <div className="flex items-center justify-center gap-1.5 mb-6">
          {SECTION_MARKERS.map((s, i) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded transition-all duration-300 ${
                activeSection === i
                  ? `${s.color} bg-hacker-surface2/50 border border-hacker-border/30`
                  : 'text-hacker-text-dim/20'
              }`}>
                {s.label}
              </span>
              {i < SECTION_MARKERS.length - 1 && (
                <span className="text-hacker-text-dim/10 text-[8px]">▸</span>
              )}
            </div>
          ))}
        </div>

        {/* Terminal Display */}
        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-to-br from-hacker-cyan/5 via-hacker-purple/5 to-hacker-green/5 rounded-2xl blur-3xl opacity-60" />

          <div className="terminal-window relative shadow-[0_0_80px_rgba(0,212,255,0.06)]">
            {/* Header */}
            <div className="terminal-header">
              <div className="terminal-dot terminal-dot-red" />
              <div className="terminal-dot terminal-dot-yellow" />
              <div className="terminal-dot terminal-dot-green" />
              <span className="text-[10px] text-hacker-text-dim/50 ml-2 font-mono">bugreaper@reaper:~ /full-track</span>
              <span className="ml-auto flex items-center gap-1.5">
                <span className={`w-1 h-1 rounded-full ${revealedCount < totalLines ? 'bg-hacker-green animate-pulse' : 'bg-hacker-text-dim/30'}`} />
                <span className="text-[8px] font-mono text-hacker-text-dim/30">{progress}%</span>
              </span>
            </div>

            {/* Body */}
            <div
              ref={containerRef}
              className="terminal-body font-mono text-xs md:text-sm leading-relaxed min-h-[400px] max-h-[500px] overflow-y-auto"
              onClick={() => { setAutoScroll(true); setUserScrolled(false) }}
            >
              <div className="text-hacker-green/60 mb-2">cat ~/full-track_v1-3.txt</div>
              <div className="text-hacker-text-dim/40 mb-4 text-[10px]">
                Loading lyrical payload... 3 verses. 1 message. Maximum impact.
              </div>

              {/* Active section label */}
              {revealedCount > 0 && revealedCount < totalLines && (
                <div className="text-[9px] text-hacker-text-dim/30 mb-3 flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    activeSection % 2 === 1 ? 'bg-hacker-amber' : 'bg-hacker-green'
                  }`} />
                  <span>Now playing: {SECTION_MARKERS[activeSection]?.label || '...'}</span>
                </div>
              )}

              {FULL_TRACK.slice(0, revealedCount).map((line, i) => {
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
                      style={{ textShadow: '0 0 10px rgba(255,176,0,0.3), 0 0 20px rgba(255,176,0,0.1)' }}
                    >
                      <span className="text-hacker-green/30">&gt; </span>
                      {line.text}
                    </div>
                  )
                }
                return (
                  <div
                    key={i}
                    className={`py-0.5 transition-colors duration-300 ${
                      line.highlight
                        ? 'text-hacker-green font-semibold'
                        : 'text-hacker-text-dim'
                    }`}
                  >
                    <span className="text-hacker-text-dim/40">{String(i).padStart(3, '0')}: </span>
                    {line.text}
                  </div>
                )
              })}

              {/* Blinking cursor */}
              {revealedCount < totalLines && (
                <div className="mt-2 flex items-center gap-1">
                  <span className="text-hacker-green">$</span>
                  <span className="inline-block w-2 h-4 bg-hacker-green animate-terminal-blink" />
                </div>
              )}

              {revealedCount >= totalLines && (
                <div className="mt-4 pt-4 border-t border-hacker-border/20">
                  <div className="text-hacker-green/60 text-[10px]">
                    ✓ Full track loaded. {FULL_TRACK.length - 7} bars. 3 verses. 3 choruses. 0 errors.
                  </div>
                  <div className="text-hacker-text-dim/40 text-[9px] mt-1">
                    The complete Bug Reaper X anthem. Origin → Arsenal → Victory.
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
              {isPlaying
                ? '🎧 Hacker Focus Audio Active — Binaural beats synced'
                : 'Hacker Focus Audio will auto-start when verse plays'}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
