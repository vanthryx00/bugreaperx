import { useRef, useEffect, useState } from 'react'

const features = [
  {
    icon: '◎',
    title: 'Hunter Recon',
    shortDesc: 'Multi-engine reconnaissance',
    description: 'Multi-module reconnaissance engine covering subdomain discovery via subfinder/amass, cloud enumeration through cloud_enum, cache analysis with CDNStrip, API mapping via GraphQL discovery, WAF detection using wafw00f, and OOB testing through Burp Collaborator.',
    color: 'text-hacker-green',
    gradient: 'from-hacker-green/20 to-transparent',
    stats: ['71 recon modules', '12 cloud tools', '8 WAF detectors'],
  },
  {
    icon: '⚔',
    title: 'Arsenal Core',
    shortDesc: '275 pre-configured weapons',
    description: '275 pre-configured weapons across 15 categories with smart hunt mode. Includes vulnerability scanners (nuclei, sqlmap), fuzzers (ffuf, dirsearch), auth testers, API tools, mobile analysis, AD enumeration, OSINT gathering, and more. One-click deployment with command templates.',
    color: 'text-hacker-purple',
    gradient: 'from-hacker-purple/20 to-transparent',
    stats: ['79 vulnerability tools', '30 Burp integrations', '8 403 bypass techniques'],
  },
  {
    icon: '●',
    title: 'AI-Powered MCP Console',
    shortDesc: 'Local LLM integration',
    description: 'Model Context Protocol (MCP) integration for local LLM execution via Ollama. Run AI agents that execute weapons, analyze scan results, generate exploit PoCs, interpret vulnerability data, and provide real-time recommendations — all offline, all private.',
    color: 'text-hacker-cyan',
    gradient: 'from-hacker-cyan/20 to-transparent',
    stats: ['Local execution', 'Zero data leakage', 'Custom model support'],
  },
  {
    icon: '◈',
    title: 'Bug Bounty Pipeline',
    shortDesc: 'End-to-end submission tracking',
    description: 'Complete submission lifecycle management. Track drafts, submissions, acceptances, and payouts across HackerOne, Bugcrowd, Intigriti, and self-managed programs. Built-in CVSS 4.0 calculator, earnings ledger, wallet, and severity breakdown with real-time stats.',
    color: 'text-hacker-amber',
    gradient: 'from-hacker-amber/20 to-transparent',
    stats: ['12+ platform integrations', 'CVSS 4.0 scoring', 'Auto-save drafts'],
  },
  {
    icon: '◉',
    title: 'Web Repeater',
    shortDesc: 'Live HTTP request crafting',
    description: 'Professional HTTP request crafting workstation with raw and structured modes. Edit headers, manipulate bodies, tamper with parameters, and view real-time responses. Request history, response comparison, and one-click replay for rapid iteration.',
    color: 'text-hacker-red',
    gradient: 'from-hacker-red/20 to-transparent',
    stats: ['Raw & structured modes', 'Request history', 'Response comparison'],
  },
  {
    icon: '◻',
    title: 'AutoSaves & Recording',
    shortDesc: 'Never lose a finding again',
    description: 'Comprehensive autosave system with session recording and replay. Auto-saves reports, findings, tool output, screenshots, and environment state. Crash recovery ensures zero data loss. Every action is logged to the immutable audit trail.',
    color: 'text-hacker-green',
    gradient: 'from-hacker-green/20 to-transparent',
    stats: ['Auto-save every 30s', 'Session replay', 'Crash recovery'],
  },
  {
    icon: '⚗',
    title: 'Virtual Workshop',
    shortDesc: 'Isolated workbench per target',
    description: 'Workbench-per-target architecture with stations for recon, scanning, exploitation, and reporting. Isolate environments, run custom playbooks, and collaborate on findings. Full audit trail with timestamps and tool provenance for every action.',
    color: 'text-hacker-purple',
    gradient: 'from-hacker-purple/20 to-transparent',
    stats: ['Per-target isolation', 'Custom playbooks', 'Full audit trail'],
  },
  {
    icon: '○',
    title: 'Secret Discovery Engine',
    shortDesc: 'Automated credential leak detection',
    description: 'Integrated trufflehog, gitleaks, nuclei-expo, js-secret-grep, mantra, and custom regex patterns for credential leak detection. Scans repositories, JavaScript bundles, cloud storage, and paste sites for exposed API keys, tokens, and secrets.',
    color: 'text-hacker-cyan',
    gradient: 'from-hacker-cyan/20 to-transparent',
    stats: ['6 detection engines', 'Custom regex patterns', 'Real-time monitoring'],
  },
]

function FeatureCard({ feature, index, isActive, onClick }: {
  feature: typeof features[0]
  index: number
  isActive: boolean
  onClick: () => void
}) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 80)
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
      onClick={onClick}
      className={`cyber-card p-5 cursor-pointer transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${isActive ? 'border-hacker-green/40 bg-hacker-surface/60' : ''}`}
    >
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isActive ? 'opacity-30' : ''}`} />

      <div className="relative z-10">
        <span className={`text-xl ${feature.color} block mb-3`}>
          {feature.icon}
        </span>
        <h3 className="text-base font-bold text-hacker-text-bright mb-1 font-mono">
          {feature.title}
        </h3>
        <p className="text-xs text-hacker-text-dim/60 font-mono mb-2">
          {feature.shortDesc}
        </p>
        <p className="text-xs text-hacker-text-dim leading-relaxed line-clamp-2">
          {feature.description}
        </p>

        {/* Stats tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {feature.stats.map((stat) => (
            <span
              key={stat}
              className={`px-2 py-0.5 rounded text-[9px] font-mono border ${
                isActive
                  ? 'bg-hacker-green/10 border-hacker-green/20 text-hacker-green'
                  : 'bg-hacker-surface2/30 border-hacker-border/20 text-hacker-text-dim/50'
              }`}
            >
              {stat}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function FeatureDetail({ feature }: { feature: typeof features[0] }) {
  return (
    <div className="cyber-card p-6 lg:p-8 min-h-[300px]">
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.gradient} opacity-20`} />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <span className={`text-3xl ${feature.color}`}>{feature.icon}</span>
          <div>
            <h3 className="text-xl font-bold text-hacker-text-bright font-mono">{feature.title}</h3>
            <p className="text-sm text-hacker-text-dim font-mono">{feature.shortDesc}</p>
          </div>
        </div>

        <p className="text-sm text-hacker-text-dim leading-relaxed mb-6">
          {feature.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {feature.stats.map((stat, i) => (
            <div key={i} className="p-3 rounded-lg bg-hacker-surface2/30 border border-hacker-border/20">
              <div className={`text-xs font-mono ${feature.color} font-bold`}>{stat.split(' ')[0]}</div>
              <div className="text-[10px] text-hacker-text-dim/60 mt-0.5">{stat.slice(stat.indexOf(' ') + 1)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Features() {
  const [activeFeature, setActiveFeature] = useState(0)

  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-hacker-green/10 border border-hacker-green/20 text-xs font-mono text-hacker-green mb-4 animate-pulse-slow">
            Everything You Need
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-hacker-text-bright mb-4">
            One Platform.{' '}
            <span className="text-gradient">Total Control.</span>
          </h2>
          <p className="text-sm text-hacker-text-dim max-w-2xl mx-auto">
            From recon to report, BugReaper X streamlines every phase of the bug bounty lifecycle.
            No subscriptions. No cloud dependencies. Just raw power.
          </p>
        </div>

        {/* Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Feature Cards (clickable) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                feature={feature}
                index={index}
                isActive={activeFeature === index}
                onClick={() => setActiveFeature(index)}
              />
            ))}
          </div>

          {/* Detail Panel */}
          <div className="lg:sticky lg:top-24 self-start">
            <FeatureDetail feature={features[activeFeature]} />
          </div>
        </div>
      </div>
    </section>
  )
}
