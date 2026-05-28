const categories = [
  { name: 'Info Gathering', count: 28, color: 'from-cyan-500/20 to-transparent' },
  { name: 'Subdomain Enum', count: 15, color: 'from-green-500/20 to-transparent' },
  { name: 'Content Discovery', count: 22, color: 'from-cyan-500/20 to-transparent' },
  { name: 'Vulnerability Scan', count: 35, color: 'from-red-500/20 to-transparent' },
  { name: 'Cloud Enumeration', count: 20, color: 'from-cyan-500/20 to-transparent' },
  { name: 'API Testing', count: 25, color: 'from-amber-500/20 to-transparent' },
  { name: 'WAF Detection', count: 14, color: 'from-purple-500/20 to-transparent' },
  { name: 'Sub Takeover', count: 10, color: 'from-green-500/20 to-transparent' },
  { name: 'OOB Testing', count: 16, color: 'from-red-500/20 to-transparent' },
  { name: 'Port Scanning', count: 22, color: 'from-cyan-500/20 to-transparent' },
]

export function ArsenalShowcase() {
  return (
    <section id="arsenal" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-hacker-purple/10 border border-hacker-purple/20 text-xs font-mono text-hacker-purple mb-4">
            275 Weapons · 15 Categories
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-hacker-text-bright mb-4">
            The{' '}
            <span className="text-gradient">Arsenal</span>
          </h2>
          <p className="text-base text-hacker-text-dim max-w-2xl mx-auto">
            Every tool you need, pre-configured and ready to deploy. From subdomain enumeration to OOB testing — one click launches your entire toolchain.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="group relative p-4 rounded-lg border border-hacker-border/30 bg-hacker-surface/20 hover:bg-hacker-surface/40 hover:border-hacker-green/30 transition-all duration-300 cursor-default"
            >
              <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative z-10">
                <p className="text-xs font-mono text-hacker-text-dim group-hover:text-hacker-text transition-colors">
                  {cat.name}
                </p>
                <p className="text-2xl font-bold font-mono text-hacker-green mt-1">
                  {cat.count}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tech stack / tool logos */}
        <div className="mt-16 text-center">
          <p className="text-xs font-mono text-hacker-text-dim/50 mb-4 uppercase tracking-widest">Integrated Toolchain</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['subfinder', 'httpx', 'nuclei', 'ffuf', 'gau', 'waybackurls', 'trufflehog', 'gitleaks', 'katana', 'naabu'].map((tool) => (
              <span
                key={tool}
                className="px-3 py-1.5 rounded-md bg-hacker-surface2/50 border border-hacker-border/20 text-xs font-mono text-hacker-text-dim hover:text-hacker-green hover:border-hacker-green/30 transition-all duration-200"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
