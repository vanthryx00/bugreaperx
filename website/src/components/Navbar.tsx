import { useState, useEffect } from 'react'

interface NavbarProps {
  onPlayGame?: () => void
}

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#arsenal', label: 'Arsenal' },
  { href: '#verse', label: 'Verse' },
  { href: '#methodology', label: 'Playbook' },
  { href: '#testimonials', label: 'Community' },
  { href: '#download', label: 'Download' },
]

export function Navbar({ onPlayGame }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)

      // Determine active section
      const sections = navLinks.map(l => l.href.slice(1))
      for (const section of sections.reverse()) {
        const el = document.getElementById(section)
        if (el && el.getBoundingClientRect().top <= 200) {
          setActiveSection(section)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-hacker-bg/90 backdrop-blur-xl border-b border-hacker-border/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded bg-hacker-green/20 flex items-center justify-center text-sm text-hacker-green font-bold font-display group-hover:bg-hacker-green/30 group-hover:shadow-[0_0_15px_rgba(0,255,65,0.2)] transition-all">
              R
            </div>
            <div>
              <span className="text-sm font-bold text-hacker-text-bright tracking-wide">BugReaper</span>
              <span className="text-[10px] text-hacker-green font-mono ml-1">X</span>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`relative text-sm transition-colors font-medium ${
                  activeSection === link.href.slice(1)
                    ? 'text-hacker-green'
                    : 'text-hacker-text-dim hover:text-hacker-green'
                }`}
              >
                {link.label}
                {activeSection === link.href.slice(1) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-hacker-green rounded-full" />
                )}
              </a>
            ))}
            {onPlayGame && (
              <button
                onClick={onPlayGame}
                className="group relative px-4 py-2 bg-hacker-amber/10 border border-hacker-amber/30 rounded-lg text-sm font-semibold text-hacker-amber hover:bg-hacker-amber/20 hover:shadow-[0_0_15px_rgba(250,176,5,0.15)] transition-all duration-200 overflow-hidden"
              >
                <span className="relative z-10">Play Game 🎮</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-hacker-amber/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
            )}
            <a
              href="#download"
              className="group relative px-4 py-2 bg-hacker-green/10 border border-hacker-green/30 rounded-lg text-sm font-semibold text-hacker-green hover:bg-hacker-green/20 hover:shadow-[0_0_15px_rgba(0,255,65,0.15)] transition-all duration-200 overflow-hidden"
            >
              <span className="relative z-10">Get Started →</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-hacker-green/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
