import { useRef, useEffect, useState } from 'react'

const categories = [
  { name: 'Reconnaissance', count: 71, color: 'from-cyan-500/20 to-transparent', tools: 'subfinder, amass, httpx, gau, katana' },
  { name: 'Vulnerability', count: 79, color: 'from-red-500/20 to-transparent', tools: 'nuclei, sqlmap, dalfox, ffuf' },
  { name: 'Cloud', count: 10, color: 'from-blue-500/20 to-transparent', tools: 'cloud_enum, s3scanner, gcp-storage' },
  { name: 'Auth Security', count: 16, color: 'from-amber-500/20 to-transparent', tools: 'OAuth, SAML, JWT, 2FA bypass' },
  { name: 'API Testing', count: 15, color: 'from-purple-500/20 to-transparent', tools: 'discovery, fuzzing, GraphQL' },
  { name: 'WAF Detection', count: 6, color: 'from-orange-500/20 to-transparent', tools: 'wafw00f, CF detection, bypass' },
  { name: '403 Bypass', count: 8, color: 'from-pink-500/20 to-transparent', tools: 'headers, methods, path tricks' },
  { name: 'Sub Takeover', count: 4, color: 'from-green-500/20 to-transparent', tools: 'subjack, subzy, nuclei-takeover' },
  { name: 'HTTP Smuggling', count: 5, color: 'from-yellow-500/20 to-transparent', tools: 'CL.TE, TE.CL, TE.TE' },
  { name: 'OOB Testing', count: 5, color: 'from-indigo-500/20 to-transparent', tools: 'collaborator, blind SQLi, SSRF' },
  { name: 'Mobile', count: 16, color: 'from-cyan-700/20 to-transparent', tools: 'apktool, jadx, objection, frida' },
  { name: 'AD Security', count: 20, color: 'from-red-700/20 to-transparent', tools: 'BloodHound, crackmapexec, kerbrute' },
  { name: 'OSINT', count: 12, color: 'from-green-700/20 to-transparent', tools: 'theHarvester, sherlock, holehe' },
  { name: 'C2 & Evasion', count: 5, color: 'from-purple-700/20 to-transparent', tools: 'mythic, havoc, shellcode' },
  { name: 'Physical Security', count: 3, color: 'from-amber-700/20 to-transparent', tools: 'lockpick, rfid, proxmark3' },
]

function WeaponCard({ cat, index }: { cat: typeof categories[0]; index: number }) {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 50)
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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`cyber-card p-4 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${hovered ? 'scale-[1.02] z-10' : ''}`}
    >
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${cat.color} opacity-0 ${hovered ? 'opacity-40' : ''} transition-opacity duration-300`} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-2">
          <p className="text-xs font-mono text-hacker-text-dim group-hover:text-hacker-text transition-colors">
            {cat.name}
          </p>
          <span className={`text-lg font-bold font-mono transition-all duration-300 ${hovered ? 'text-hacker-green scale-110' : 'text-hacker-green/70'}`}>
            {cat.count}
          </span>
        </div>

        {/* Animated progress bar */}
        <div className="h-1 rounded-full bg-hacker-surface3 overflow-hidden mb-2">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${cat.color.replace('/20', '/50')} transition-all duration-700`}
            style={{ width: hovered ? '100%' : `${(cat.count / 79) * 100}%` }}
          />
        </div>

        {/* Tools reveal on hover */}
        <div className={`overflow-hidden transition-all duration-300 ${hovered ? 'max-h-8 opacity-100' : 'max-h-0 opacity-0'}`}>
          <p className="text-[9px] font-mono text-hacker-text-dim/50 truncate">{cat.tools}</p>
        </div>
      </div>
    </div>
  )
}

export function ArsenalShowcase() {
  const totalWeapons = categories.reduce((sum, cat) => sum + cat.count, 0)

  return (
    <section id="arsenal" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-hacker-purple/5 blur-[150px] -top-48 -right-48" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hacker-purple/10 border border-hacker-purple/20 text-xs font-mono text-hacker-purple mb-4">
            <span className="text-hacker-green">{totalWeapons} Weapons</span>
            <span className="text-hacker-text-dim/30">·</span>
            {categories.length} Categories
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-hacker-text-bright mb-4">
            The{' '}
            <span className="text-gradient">Arsenal</span>
          </h2>
          <p className="text-sm text-hacker-text-dim max-w-2xl mx-auto">
            Every tool you need, pre-configured and ready to deploy. From subdomain enumeration to OOB testing — hover over any category to see the weapon list.
          </p>
        </div>

        {/* Weapon Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {categories.map((cat, index) => (
            <WeaponCard key={cat.name} cat={cat} index={index} />
          ))}
        </div>

        {/* Total count */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-hacker-surface2/50 border border-hacker-border/30">
            <span className="text-2xl font-black font-mono text-gradient">{totalWeapons}</span>
            <span className="text-xs font-mono text-hacker-text-dim">Total Weapons · 15 Categories</span>
          </div>
        </div>

        {/* Integrated Toolchain */}
        <div className="mt-16 text-center">
          <p className="text-[10px] font-mono text-hacker-text-dim/40 mb-4 uppercase tracking-[0.2em]">Integrated Toolchain</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['subfinder', 'httpx', 'nuclei', 'ffuf', 'gau', 'waybackurls', 'trufflehog', 'gitleaks', 'katana', 'naabu', 'sqlmap', 'dalfox', 'amass', 'gowitness', 'bloodhound'].map((tool) => (
              <span
                key={tool}
                className="group relative px-3 py-1.5 rounded-md bg-hacker-surface2/50 border border-hacker-border/20 text-xs font-mono text-hacker-text-dim hover:text-hacker-green hover:border-hacker-green/30 transition-all duration-200 hover:scale-105"
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
