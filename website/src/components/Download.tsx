export function Download() {
  return (
    <section id="download" className="py-24 relative">
      {/* Background glows */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full bg-hacker-green/5 blur-[120px]" />
        <div className="w-[400px] h-[400px] rounded-full bg-hacker-amber/5 blur-[100px] translate-x-48 translate-y-24" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hacker-green/10 border border-hacker-green/20 text-xs font-mono text-hacker-green mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-hacker-green animate-pulse" />
            Sovereign & Free — Always
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-hacker-text-bright mb-4">
            Download{' '}
            <span className="text-gradient">BugReaper X</span>
          </h2>
          <p className="text-sm text-hacker-text-dim max-w-2xl mx-auto">
            One portable EXE. Zero dependencies. Full autonomy.
            <br />
            No subscriptions, no cloud, no tracking. Just your terminal and the hunt.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {/* Free / Standalone */}
          <div className="cyber-card p-8 hover:border-hacker-green/40 group">
            <div className="relative z-10">
              <h3 className="text-sm font-bold font-mono text-hacker-text-bright mb-2 tracking-wider">STANDALONE</h3>
              <p className="text-4xl font-black text-hacker-green mb-1 font-mono">$0</p>
              <p className="text-xs text-hacker-text-dim/50 mb-6">Forever. No catch. No credit card.</p>
              <ul className="space-y-3 mb-8">
                {[
                  'Full Arsenal (275 weapons)',
                  'Hunter Recon Engine',
                  'Bug Bounty Pipeline',
                  'Web Repeater',
                  'Session Recording',
                  'Virtual Workshop',
                  'Local AI via Ollama',
                  'Markdown Reports',
                  'Autosave System',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-hacker-text-dim">
                    <span className="text-hacker-green shrink-0">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href="/download/BugReaperX-v4.0-win-x64.exe"
                className="group/btn relative block w-full text-center px-6 py-3 bg-hacker-green/10 border border-hacker-green/30 rounded-lg text-sm font-semibold text-hacker-green hover:bg-hacker-green/20 hover:shadow-[0_0_20px_rgba(0,255,65,0.15)] transition-all duration-200 overflow-hidden"
              >
                <span className="relative z-10">Download v4.0 →</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-hacker-green/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
              </a>
            </div>
          </div>

          {/* GitHub Sponsor - Featured */}
          <div className="cyber-card p-8 border-2 border-hacker-green/30 relative overflow-hidden group hover:border-hacker-green/60">
            <div className="absolute inset-0 bg-gradient-to-b from-hacker-green/5 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-lg bg-hacker-green/20 text-hacker-green text-[10px] font-mono tracking-wider">
              POPULAR
            </div>

            {/* Animated ring */}
            <div className="absolute -top-8 -right-8 w-24 h-24">
              <div className="absolute inset-0 rounded-full border border-hacker-green/20 animate-ping" />
              <div className="absolute inset-4 rounded-full border border-hacker-green/10" />
            </div>

            <div className="relative z-10">
              <h3 className="text-sm font-bold font-mono text-hacker-text-bright mb-2 tracking-wider">SPONSOR</h3>
              <p className="text-4xl font-black text-hacker-amber mb-1 font-mono">$10</p>
              <p className="text-xs text-hacker-text-dim/50 mb-6">Per month · Supports development</p>
              <ul className="space-y-3 mb-8">
                {[
                  'All Standalone features',
                  'Priority updates',
                  'Discord community access',
                  'Feature voting',
                  'Early access builds',
                  'Direct support channel',
                  'Your name in credits',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-hacker-text-dim">
                    <span className="text-hacker-amber shrink-0">✦</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://github.com/sponsors/bugreaper"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-6 py-3 bg-hacker-amber/10 border border-hacker-amber/30 rounded-lg text-sm font-semibold text-hacker-amber hover:bg-hacker-amber/20 hover:shadow-[0_0_20px_rgba(255,176,0,0.15)] transition-all duration-200"
              >
                Become a Sponsor →
              </a>
            </div>
          </div>

          {/* Enterprise */}
          <div className="cyber-card p-8 hover:border-hacker-cyan/40">
            <div className="relative z-10">
              <h3 className="text-sm font-bold font-mono text-hacker-text-bright mb-2 tracking-wider">ENTERPRISE</h3>
              <p className="text-4xl font-black text-hacker-cyan mb-1 font-mono">$499</p>
              <p className="text-xs text-hacker-text-dim/50 mb-6">Per seat · Annual license</p>
              <ul className="space-y-3 mb-8">
                {[
                  'All Sponsor features',
                  'Custom branding',
                  'Team collaboration',
                  'SSO / AD integration',
                  'Audit logging',
                  'Custom weapon development',
                  'Priority SLA',
                  'On-prem deployment',
                  'Training & onboarding',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-hacker-text-dim">
                    <span className="text-hacker-cyan shrink-0">◆</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href="mailto:sales@bugreaper-x.ca"
                className="block w-full text-center px-6 py-3 bg-hacker-cyan/10 border border-hacker-cyan/30 rounded-lg text-sm font-semibold text-hacker-cyan hover:bg-hacker-cyan/20 hover:shadow-[0_0_20px_rgba(0,212,255,0.15)] transition-all duration-200"
              >
                Contact Sales →
              </a>
            </div>
          </div>
        </div>

        {/* System Requirements */}
        <div className="text-center">
          <p className="text-[10px] font-mono text-hacker-text-dim/40 mb-3 uppercase tracking-[0.2em]">System Requirements</p>
          <div className="flex flex-wrap justify-center gap-3 text-xs font-mono text-hacker-text-dim">
            {[
              { label: 'Windows 10+', sub: 'x64' },
              { label: '4GB RAM', sub: 'minimum' },
              { label: '500MB Disk', sub: 'SSD recommended' },
              { label: 'No Admin', sub: 'user-level' },
            ].map((req) => (
              <div key={req.label} className="px-4 py-2 rounded-lg bg-hacker-surface2/30 border border-hacker-border/20 hover:border-hacker-green/20 transition-colors">
                <div className="text-hacker-text">{req.label}</div>
                <div className="text-[9px] text-hacker-text-dim/40">{req.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
