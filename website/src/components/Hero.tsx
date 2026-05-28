import { useEffect, useState } from 'react'

const phrases = [
  'Hunt Smarter.',
  'Reap Faster.',
  'Dominate the Wild.',
]

export function Hero() {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

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

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
      {/* Background gradient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-hacker-green/5 blur-[120px]" />
        <div className="w-[400px] h-[400px] rounded-full bg-hacker-cyan/5 blur-[100px] -translate-x-48 translate-y-24" />
      </div>

      <div className="relative text-center max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hacker-green/10 border border-hacker-green/20 text-xs font-mono text-hacker-green mb-8 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-hacker-green animate-pulse" />
          v4.0 STANDALONE — Now Available for Windows
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-hacker-text-bright leading-tight mb-6 animate-slide-up">
          <span className="block">The Sovereign Bug Bounty</span>
          <span className="block text-gradient mt-2">
            Automation Suite
          </span>
        </h1>

        {/* Typewriter */}
        <div className="h-12 md:h-16 mb-8">
          <p className="text-xl md:text-2xl lg:text-3xl font-mono text-hacker-text-dim">
            <span className="text-hacker-green">$ </span>
            {displayText}
            <span className="inline-block w-0.5 h-6 md:h-7 bg-hacker-green ml-0.5 animate-blink align-middle" />
          </p>
        </div>

        {/* Description */}
        <p className="text-base md:text-lg text-hacker-text-dim max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in">
          One portable Windows executable. Zero dependencies. Full autonomy.
          <br />
          Recon, vulnerability scanning, AI-powered analysis, session recording, and report generation — all in one sovereign platform.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
          <a
            href="#download"
            className="px-8 py-3.5 bg-hacker-green text-hacker-bg font-bold rounded-lg text-base hover:bg-hacker-green-dim hover:shadow-[0_0_30px_rgba(0,255,65,0.25)] transition-all duration-200 group"
          >
            Download Free →
            <span className="block text-[10px] font-mono text-hacker-bg/60 mt-0.5">bugreaper-x.ca — Windows Portable EXE</span>
          </a>
          <a
            href="#features"
            className="px-8 py-3.5 bg-transparent border border-hacker-border text-hacker-text rounded-lg text-base font-medium hover:border-hacker-green/50 hover:text-hacker-green transition-all duration-200"
          >
            Explore Features
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
          <span className="text-[10px] font-mono text-hacker-text-dim/40">scroll</span>
          <div className="w-5 h-8 rounded-full border border-hacker-border/30 flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-hacker-green/50 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
