import { useEffect, useState, useRef } from 'react'

const phrases = [
  'Hunt Smarter.',
  'Reap Faster.',
  'Dominate the Wild.',
]

const terminalCommands = [
  { cmd: 'bugreaper init --arsenal=full', output: '[✓] Initializing BugReaper X v4.0.0...' },
  { cmd: '', output: '[✓] Loading 275 weapons across 15 categories...' },
  { cmd: '', output: '[✓] Hunt Engine: Online' },
  { cmd: '', output: '[✓] Pipeline Tracker: Synchronized' },
  { cmd: '', output: '[✓] MCP Console: Connected (Ollama)' },
  { cmd: '', output: '[✓] Web Repeater: Standing by' },
  { cmd: 'bugreaper hunt --target=example.com --fast', output: '' },
  { cmd: '', output: '' },
  { cmd: '', output: '╔══════════════════════════════════════════╗' },
  { cmd: '', output: '║  TARGET: example.com                      ║' },
  { cmd: '', output: '║  STATUS: Scanning (42 hosts discovered)   ║' },
  { cmd: '', output: '║  PORTS:  22, 80, 443, 8080, 8443         ║' },
  { cmd: '', output: '║  TECH:   nginx 1.24, PHP 8.2, Node 20   ║' },
  { cmd: '', output: '╚══════════════════════════════════════════╝' },
  { cmd: '', output: '' },
  { cmd: 'bugreaper arsenal --scan --category=vuln', output: '' },
  { cmd: '', output: '[→] Running nuclei -t cves -t exposures -t misconfig...' },
  { cmd: '', output: '[!] Critical: CVE-2025-1234 — RCE in nginx 1.24' },
  { cmd: '', output: '[!] High:     CVE-2025-5678 — SQLi in login.php' },
  { cmd: '', output: '[!] Medium:   CVE-2025-9012 — XSS in search' },
  { cmd: '', output: '[✓] Scan complete. 3 findings. Report saved.' },
  { cmd: '', output: '' },
  { cmd: 'bugreaper pipeline submit --critical --hackerone', output: '' },
  { cmd: '', output: '[✓] Submission drafted. CVSS: 9.8 (Critical)' },
  { cmd: '', output: '[✓] Report queued for review.' },
  { cmd: '', output: '' },
  { cmd: 'bugreaper status', output: '' },
  { cmd: '', output: '┌──────────────────────────────────────────┐' },
  { cmd: '', output: '│  SYSTEM: All modules operational         │' },
  { cmd: '', output: '│  SESSIONS: 3 active                      │' },
  { cmd: '', output: '│  FINDINGS: 47 total                     │' },
  { cmd: '', output: '│  EARNINGS: $12,450.00 MTD               │' },
  { cmd: '', output: '│  UPTIME:  99.97%                         │' },
  { cmd: '', output: '└──────────────────────────────────────────┘' },
  { cmd: '', output: '' },
  { cmd: '', output: 'bugreaper@sovereign:~$ ', cursor: true },
]

export function Hero() {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [terminalLine, setTerminalLine] = useState(0)
  const [terminalVisible, setTerminalVisible] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Typewriter effect for tagline
  useEffect(() => {
    const currentPhrase = phrases[phraseIndex]
    let timeout: ReturnType<typeof setTimeout>

    if (!isDeleting && charIndex < currentPhrase.length) {
      timeout = setTimeout(() => {
        setDisplayText(currentPhrase.slice(0, charIndex + 1))
        setCharIndex(charIndex + 1)
      }, 80)
    } else if (!isDeleting && charIndex === currentPhrase.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000)
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplayText(currentPhrase.slice(0, charIndex - 1))
        setCharIndex(charIndex - 1)
      }, 40)
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false)
      setPhraseIndex((prev) => (prev + 1) % phrases.length)
    }

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, phraseIndex])

  // Terminal animation sequence
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTerminalVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (terminalRef.current) observer.observe(terminalRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!terminalVisible) return

    const timer = setTimeout(() => {
      if (terminalLine < terminalCommands.length - 1) {
        setTerminalLine(terminalLine + 1)
      }
    }, 60 + Math.random() * 120)

    return () => clearTimeout(timer)
  }, [terminalLine, terminalVisible])

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[800px] rounded-full bg-hacker-green/5 blur-[150px]" />
        <div className="w-[500px] h-[500px] rounded-full bg-hacker-cyan/5 blur-[120px] -translate-x-48 translate-y-24" />
        <div className="w-[400px] h-[400px] rounded-full bg-hacker-purple/5 blur-[100px] translate-x-64 -translate-y-32" />
      </div>

      {/* Data stream columns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 text-[8px] font-mono text-hacker-green/20 whitespace-nowrap"
            style={{
              left: `${i * 5}%`,
              animation: `dataStream ${3 + Math.random() * 4}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            {Array.from({ length: 30 }).map((_, j) => (
              <div key={j}>
                {String.fromCharCode(0x30A0 + Math.random() * 96)}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="relative w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hacker-green/10 border border-hacker-green/20 text-xs font-mono text-hacker-green mb-6 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-hacker-green animate-pulse" />
              <span className="animate-glitch-slow">v4.0 STANDALONE</span>
              <span className="text-hacker-text-dim/50">—</span>
              Now Available for Windows
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-hacker-text-bright leading-tight mb-4">
              <span className="block">The Sovereign</span>
              <span className="block">
                <span className="shimmer-text">Bug Bounty</span>
              </span>
              <span className="block text-gradient mt-2">
                Automation Suite
              </span>
            </h1>

            {/* Typewriter */}
            <div className="h-10 md:h-12 mb-6">
              <p className="text-lg md:text-xl lg:text-2xl font-mono text-hacker-text-dim">
                <span className="text-hacker-green">$ </span>
                {displayText}
                <span className="inline-block w-0.5 h-5 md:h-6 bg-hacker-green ml-0.5 animate-terminal-blink align-middle" />
              </p>
            </div>

            {/* Description */}
            <p className="text-sm md:text-base text-hacker-text-dim max-w-xl leading-relaxed mb-8 animate-fade-in">
              One portable Windows executable. Zero dependencies. Full autonomy.
              <br />
              275 weapons. AI-powered MCP Console. Pipeline tracking. Session recording.
              <br />
              <span className="text-hacker-green/70">Recon, exploit, report — all in one sovereign platform.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start gap-4 animate-slide-up">
              <a
                href="#download"
                className="group relative px-8 py-3.5 bg-hacker-green text-hacker-bg font-bold rounded-lg text-base hover:bg-hacker-green-dim transition-all duration-200 overflow-hidden"
              >
                <span className="relative z-10">Download Free →</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="block text-[10px] font-mono text-hacker-bg/60 mt-0.5 relative z-10">Windows Portable EXE — 68 MB</span>
              </a>
              <a
                href="#features"
                className="px-8 py-3.5 bg-transparent border border-hacker-border text-hacker-text rounded-lg text-base font-medium hover:border-hacker-green/50 hover:text-hacker-green transition-all duration-200 group"
              >
                <span className="group-hover:animate-glitch-fast inline-block">Explore Features</span>
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex items-center gap-6 text-xs font-mono text-hacker-text-dim/40">
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-hacker-green" />
                63 passing tests
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-hacker-cyan" />
                Zero dependencies
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-hacker-purple" />
                Open source
              </span>
            </div>
          </div>

          {/* Right: Interactive Terminal */}
          <div ref={terminalRef} className="relative">
            {/* Glow behind terminal */}
            <div className="absolute -inset-8 bg-gradient-to-br from-hacker-green/10 via-hacker-cyan/5 to-hacker-purple/10 rounded-2xl blur-2xl opacity-50" />

            <div className="terminal-window relative shadow-[0_0_60px_rgba(0,255,65,0.08)]">
              {/* Terminal Header */}
              <div className="terminal-header">
                <div className="terminal-dot terminal-dot-red" />
                <div className="terminal-dot terminal-dot-yellow" />
                <div className="terminal-dot terminal-dot-green" />
                <span className="text-[10px] text-hacker-text-dim/50 ml-2 font-mono">bugreaper@sovereign:~/session</span>
              </div>

              {/* Terminal Body */}
              <div className="terminal-body font-mono text-xs md:text-sm leading-relaxed min-h-[360px] max-h-[420px] overflow-y-auto">
                <div className="text-hacker-green/60 mb-3">
                  BugReaper X v4.0.0 — Sovereign Bug Bounty Automation Suite
                </div>
                <div className="text-hacker-text-dim/40 mb-4">
                  Type 'help' for available commands. All modules operational.
                </div>

                {terminalCommands.slice(0, terminalLine + 1).map((line, i) => (
                  <div key={i} className="mb-0.5">
                    {line.cmd && (
                      <div>
                        <span className="text-hacker-green">$ </span>
                        <span className="text-hacker-text-bright">{line.cmd}</span>
                      </div>
                    )}
                    {line.output && (
                      <div className={`pl-4 ${
                        line.output.startsWith('[!]') ? 'text-hacker-red' :
                        line.output.startsWith('[✓]') ? 'text-hacker-green' :
                        line.output.startsWith('[→]') ? 'text-hacker-cyan' :
                        line.output.includes('╔') || line.output.includes('║') || line.output.includes('╚') ? 'text-hacker-amber' :
                        line.output.startsWith('│') ? 'text-hacker-amber/90' :
                        'text-hacker-text-dim'
                      }`}>
                        <span className="typing-cursor">{line.output}</span>
                      </div>
                    )}
                    {line.cursor && (
                      <div>
                        <span className="text-hacker-green">$ </span>
                        <span className="inline-block w-2 h-4 bg-hacker-green animate-terminal-blink align-middle" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
          <span className="text-[10px] font-mono text-hacker-text-dim/40">scroll → explore</span>
          <div className="w-5 h-8 rounded-full border border-hacker-border/30 flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-hacker-green/50 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
