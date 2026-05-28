export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-hacker-border/30 py-12 relative">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded bg-hacker-green/20 flex items-center justify-center text-sm text-hacker-green font-bold font-display">
                R
              </div>
              <div>
                <span className="text-sm font-bold text-hacker-text-bright tracking-wide">BugReaper</span>
                <span className="text-[10px] text-hacker-green font-mono ml-1">X</span>
              </div>
            </div>
            <p className="text-sm text-hacker-text-dim max-w-md leading-relaxed">
              The sovereign Windows standalone bug bounty automation suite. Built by hunters, for hunters.
              No subscriptions. No cloud. No compromises.
            </p>
            <div className="flex items-center gap-2 mt-4 text-xs font-mono text-hacker-text-dim/40">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-hacker-green animate-pulse" />
                All Systems Nominal
              </span>
              <span className="text-hacker-border">|</span>
              <span>v4.0.0</span>
              <span className="text-hacker-border">|</span>
              <span>Proprietary</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-[10px] font-mono text-hacker-green uppercase tracking-[0.2em] mb-4">Product</h4>
            <ul className="space-y-2">
              {[
                { label: 'Features', href: '#features' },
                { label: 'Arsenal', href: '#arsenal' },
                { label: 'Changelog', href: '/changelog' },
                { label: 'Roadmap', href: '/roadmap' },
                { label: 'FAQ', href: '/faq' },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-hacker-text-dim hover:text-hacker-green transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-[10px] font-mono text-hacker-green uppercase tracking-[0.2em] mb-4">Community</h4>
            <ul className="space-y-2">
              {[
                { label: 'Discord', href: 'https://discord.gg/bugreaper' },
                { label: 'GitHub', href: 'https://github.com/vanthryx00/bugreaperx' },
                { label: 'Twitter / X', href: 'https://x.com/vanthryx00' },
                { label: 'YouTube', href: 'https://youtube.com/@bugreaper' },
                { label: 'Blog', href: '/blog' },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-hacker-text-dim hover:text-hacker-green transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[10px] font-mono text-hacker-amber uppercase tracking-[0.2em] mb-4">Legal</h4>
            <ul className="space-y-2">
              {[
                { label: 'License', href: '/LICENSE' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'DMCA Notice', href: '/dmca' },
                { label: 'EULA', href: '/eula' },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-hacker-text-dim hover:text-hacker-amber transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-hacker-border/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-hacker-text-dim/40 font-mono">
            © {year} BugReaper X (vanthryx00).{' '}
            <span className="text-hacker-amber/60">All rights reserved.</span>{' '}
            Unauthorized reproduction, distribution, or reverse engineering prohibited.
            This software contains honeypot countermeasures and integrity verification systems.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-hacker-text-dim/20">
              Built with blood, sweat, and && in the terminal.
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
