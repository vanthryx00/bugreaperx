import { useState, useEffect } from 'react'

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#arsenal', label: 'Arsenal' },
  { href: '#testimonials', label: 'Community' },
  { href: '#download', label: 'Download' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
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
            <div className="w-8 h-8 rounded bg-hacker-green/20 flex items-center justify-center text-sm text-hacker-green font-bold group-hover:bg-hacker-green/30 transition-colors">
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
                className="text-sm text-hacker-text-dim hover:text-hacker-green transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#download"
              className="px-4 py-2 bg-hacker-green/10 border border-hacker-green/30 rounded-lg text-sm font-semibold text-hacker-green hover:bg-hacker-green/20 hover:shadow-[0_0_15px_rgba(0,255,65,0.15)] transition-all duration-200"
            >
              Get Started →
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
