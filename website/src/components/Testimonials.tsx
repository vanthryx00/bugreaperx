import { useRef, useEffect, useState } from 'react'

const testimonials = [
  {
    quote: 'BugReaper X completely changed how I approach bug bounties. The automated recon pipeline alone saves me hours every day. The Arsenal system is insane — 275 pre-configured tools that just work.',
    author: 'Vanthryx00',
    role: 'Security Researcher',
    platform: 'HackerOne Top 100',
    rating: 5,
  },
  {
    quote: 'Finally — a Windows-native tool that doesn\'t require WSL, Docker, or a PhD in bash scripting. The MCP Console with Ollama integration is a game changer for rapid PoC development.',
    author: '@cyberknight',
    role: 'Penetration Tester',
    platform: 'OSCP, OSWE, CRTP',
    rating: 5,
  },
  {
    quote: 'The Pipeline tracker alone is worth it. CVSS 4.0 scoring, earnings ledger, multi-platform submission tracking — I\'ve gone from scattered spreadsheets to a unified workflow. This is the future.',
    author: '@reconwizard',
    role: 'Independent Researcher',
    platform: '$150k+ earnings',
    rating: 5,
  },
]

function TestimonialCard({ t, index }: { t: typeof testimonials[0]; index: number }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 150)
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [index])

  return (
    <div
      ref={ref}
      className={`cyber-card p-6 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="relative z-10">
        {/* Rating */}
        <div className="flex items-center gap-0.5 mb-4">
          {Array.from({ length: t.rating }).map((_, i) => (
            <span key={i} className="text-hacker-amber text-sm">★</span>
          ))}
        </div>

        {/* Quote */}
        <p className="text-sm text-hacker-text-dim leading-relaxed mb-6 italic">
          "{t.quote}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-hacker-surface2 border border-hacker-green/30 flex items-center justify-center text-xs font-bold font-mono text-hacker-green">
              {t.author[0].toUpperCase()}
            </div>
            <div className="absolute -inset-1 rounded-full border border-hacker-green/20 animate-ping opacity-30" />
          </div>
          <div>
            <p className="text-sm font-semibold font-mono text-hacker-text">{t.author}</p>
            <p className="text-[10px] text-hacker-text-dim">{t.role} · {t.platform}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full bg-hacker-amber/5 blur-[120px] bottom-0 left-1/2 -translate-x-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-hacker-amber/10 border border-hacker-amber/20 text-xs font-mono text-hacker-amber mb-4 animate-pulse-slow">
            Trusted by Researchers
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-hacker-text-bright mb-4">
            What the{' '}
            <span className="text-gradient">Community</span> Says
          </h2>
          <p className="text-sm text-hacker-text-dim max-w-2xl mx-auto">
            Built by hunters, for hunters. Here's what the community thinks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <TestimonialCard key={t.author} t={t} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
