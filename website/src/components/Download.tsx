export function Download() {
  return (
    <section id="download" className="py-24 relative">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full bg-hacker-green/5 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-hacker-green/10 border border-hacker-green/20 text-xs font-mono text-hacker-green mb-4">
            Sovereign & Free
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-hacker-text-bright mb-4">
            Download{' '}
            <span className="text-gradient">BugReaper X</span>
          </h2>
          <p className="text-base text-hacker-text-dim max-w-2xl mx-auto">
            One portable EXE. Zero dependencies. Full autonomy. No subscriptions, no cloud, no tracking.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {/* Free */}
          <div className="p-8 rounded-xl border border-hacker-border/50 bg-hacker-surface/20 backdrop-blur-sm hover:border-hacker-green/30 transition-all duration-300">
            <h3 className="text-lg font-bold font-mono text-hacker-text-bright mb-2">STANDALONE</h3>
            <p className="text-3xl font-black text-hacker-green mb-4 font-mono">$0</p>
            <p className="text-xs text-hacker-text-dim mb-6">Forever. No catch.</p>
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
                  <span className="text-hacker-green">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href="/download/BugReaperX-v4.0-win-x64.exe"
              className="block w-full text-center px-6 py-3 bg-hacker-green/10 border border-hacker-green/30 rounded-lg text-sm font-semibold text-hacker-green hover:bg-hacker-green/20 hover:shadow-[0_0_20px_rgba(0,255,65,0.15)] transition-all duration-200"
            >
              Download v4.0 →
            </a>
          </div>

          {/* GitHub Sponsor */}
          <div className="p-8 rounded-xl border-2 border-hacker-green/30 bg-hacker-surface/30 backdrop-blur-sm relative overflow-hidden group hover:border-hacker-green/60 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-b from-hacker-green/5 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-lg bg-hacker-green/20 text-hacker-green text-[10px] font-mono">
              POPULAR
            </div>
            <h3 className="text-lg font-bold font-mono text-hacker-text-bright mb-2">SPONSOR</h3>
            <p className="text-3xl font-black text-hacker-amber mb-4 font-mono">$10</p>
            <p className="text-xs text-hacker-text-dim mb-6">Per month · Supports development</p>
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
                  <span className="text-hacker-amber">✦</span>
                  {feature}
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

          {/* Enterprise */}
          <div className="p-8 rounded-xl border border-hacker-border/50 bg-hacker-surface/20 backdrop-blur-sm hover:border-hacker-cyan/30 transition-all duration-300">
            <h3 className="text-lg font-bold font-mono text-hacker-text-bright mb-2">ENTERPRISE</h3>
            <p className="text-3xl font-black text-hacker-cyan mb-4 font-mono">$499</p>
            <p className="text-xs text-hacker-text-dim mb-6">Per seat · Annual license</p>
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
                  <span className="text-hacker-cyan">◆</span>
                  {feature}
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

        {/* System Requirements */}
        <div className="text-center">
          <p className="text-xs font-mono text-hacker-text-dim/50 mb-3 uppercase tracking-widest">System Requirements</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-mono text-hacker-text-dim">
            <span className="px-3 py-1 rounded bg-hacker-surface2/30 border border-hacker-border/20">Windows 10+ (x64)</span>
            <span className="px-3 py-1 rounded bg-hacker-surface2/30 border border-hacker-border/20">4GB RAM</span>
            <span className="px-3 py-1 rounded bg-hacker-surface2/30 border border-hacker-border/20">500MB Disk</span>
            <span className="px-3 py-1 rounded bg-hacker-surface2/30 border border-hacker-border/20">No Admin Required</span>
          </div>
        </div>
      </div>
    </section>
  )
}
