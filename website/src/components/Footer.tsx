export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-hacker-border/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded bg-hacker-green/20 flex items-center justify-center text-sm text-hacker-green font-bold">
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
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-mono text-hacker-green uppercase tracking-widest mb-4">Product</h4>
            <ul className="space-y-2">
              {['Features', 'Arsenal', 'Changelog', 'Roadmap', 'FAQ'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-hacker-text-dim hover:text-hacker-green transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-xs font-mono text-hacker-green uppercase tracking-widest mb-4">Community</h4>
            <ul className="space-y-2">
              {[
                { label: 'Discord', href: 'https://discord.gg/bugreaper' },
                { label: 'GitHub', href: 'https://github.com/bugreaper/bugreaper-x' },
                { label: 'Twitter / X', href: 'https://x.com/bugreaper' },
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
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-hacker-border/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-hacker-text-dim/50 font-mono">
            © {year} BugReaper X. All rights reserved. Built with blood, sweat, and && in the terminal.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-hacker-text-dim/30">v4.0.0</span>
            <span className="text-[10px] font-mono text-hacker-text-dim/30">MIT License</span>
            <span className="flex items-center gap-1 text-[10px] font-mono text-hacker-green/50">
              <span className="w-1.5 h-1.5 rounded-full bg-hacker-green animate-pulse" />
              All Systems Nominal
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
