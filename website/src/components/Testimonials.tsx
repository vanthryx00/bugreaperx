const testimonials = [
  {
    quote: 'BugReaper X completely changed how I approach bug bounties. The automated recon pipeline alone saves me hours every day.',
    author: 'Vanthryx00',
    role: 'Security Researcher',
    platform: 'HackerOne Top 100',
  },
  {
    quote: 'The Arsenal system is insane. 275 pre-configured tools that just work. No more fumbling with CLI flags and pipe chains.',
    author: '@cyberknight',
    role: 'Penetration Tester',
    platform: 'Bugcrowd Top 50',
  },
  {
    quote: 'Finally — a Windows-native tool that doesn\'t require WSL, Docker, or a PhD in bash scripting. This is the future of bug bounty tooling.',
    author: '@reconwizard',
    role: 'OSCP, OSWE',
    platform: 'Independent Researcher',
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-hacker-amber/10 border border-hacker-amber/20 text-xs font-mono text-hacker-amber mb-4">
            Trusted by Researchers
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-hacker-text-bright mb-4">
            What the{' '}
            <span className="text-gradient">Community</span> Says
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.author}
              className="p-6 rounded-xl border border-hacker-border/30 bg-hacker-surface/20 backdrop-blur-sm hover:border-hacker-green/30 transition-all duration-300"
            >
              {/* Quote */}
              <p className="text-sm text-hacker-text-dim leading-relaxed mb-6 italic">
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-hacker-surface2 border border-hacker-border flex items-center justify-center text-xs font-bold font-mono text-hacker-green">
                  {t.author[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold font-mono text-hacker-text">{t.author}</p>
                  <p className="text-[10px] text-hacker-text-dim">{t.role} · {t.platform}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
