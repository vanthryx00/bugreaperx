import { useRef, useEffect, useState } from 'react'

const features = [
  {
    icon: '◎',
    title: 'Hunter Recon',
    description: 'Multi-module reconnaissance engine covering subdomain discovery, cloud enumeration, cache analysis, API mapping, WAF detection, and OOB testing.',
    color: 'text-hacker-green',
    gradient: 'from-hacker-green/20 to-transparent',
  },
  {
    icon: '⚔',
    title: 'Arsenal Core',
    description: '275 pre-configured weapons across 15 categories with smart hunt mode, command templates, and one-click deployment.',
    color: 'text-hacker-purple',
    gradient: 'from-hacker-purple/20 to-transparent',
  },
  {
    icon: '●',
    title: 'AI-Powered MCP Console',
    description: 'Model Context Protocol integration for local LLM execution. Run AI agents that execute tools, analyze results, and generate exploit PoCs.',
    color: 'text-hacker-cyan',
    gradient: 'from-hacker-cyan/20 to-transparent',
  },
  {
    icon: '◈',
    title: 'Bug Bounty Pipeline',
    description: 'End-to-end submission tracking. Manage drafts, submissions, acceptances, and payouts across HackerOne, Bugcrowd, Intigriti, and self-managed programs.',
    color: 'text-hacker-amber',
    gradient: 'from-hacker-amber/20 to-transparent',
  },
  {
    icon: '◉',
    title: 'Web Repeater',
    description: 'Live HTTP request crafting tool with raw request editor and real-time response viewer. Test payloads, tamper with headers, iterate fast.',
    color: 'text-hacker-red',
    gradient: 'from-hacker-red/20 to-transparent',
  },
  {
    icon: '◻',
    title: 'AutoSaves & Recording',
    description: 'Comprehensive autosave system. Session recording with replay, auto-saved reports, findings, tool output, screenshots, and crash recovery.',
    color: 'text-hacker-green',
    gradient: 'from-hacker-green/20 to-transparent',
  },
  {
    icon: '⚗',
    title: 'Virtual Workshop',
    description: 'Workbench-per-target architecture with stations, playbooks, and full audit trail. Isolate environments and collaborate on findings.',
    color: 'text-hacker-purple',
    gradient: 'from-hacker-purple/20 to-transparent',
  },
  {
    icon: '○',
    title: 'Secret Discovery Engine',
    description: 'Integrated trufflehog, gitleaks, nuclei-expo, js-secret-grep, mantra, and custom regex patterns for credential leak detection.',
    color: 'text-hacker-cyan',
    gradient: 'from-hacker-cyan/20 to-transparent',
  },
]

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 100)
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
      className={`group relative p-6 rounded-xl border border-hacker-border/50 bg-hacker-surface/30 backdrop-blur-sm transition-all duration-500 hover:border-hacker-green/40 hover:bg-hacker-surface/60 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative z-10">
        <span className={`text-2xl ${feature.color} block mb-4 group-hover:scale-110 transition-transform duration-300`}>
          {feature.icon}
        </span>
        <h3 className="text-lg font-bold text-hacker-text-bright mb-2 font-mono">
          {feature.title}
        </h3>
        <p className="text-sm text-hacker-text-dim leading-relaxed">
          {feature.description}
        </p>
      </div>
    </div>
  )
}

export function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-hacker-green/10 border border-hacker-green/20 text-xs font-mono text-hacker-green mb-4">
            Everything You Need
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-hacker-text-bright mb-4">
            One Platform.{' '}
            <span className="text-gradient">Total Control.</span>
          </h2>
          <p className="text-base text-hacker-text-dim max-w-2xl mx-auto">
            From recon to report, BugReaper X streamlines every phase of the bug bounty lifecycle.
            No subscriptions. No cloud dependencies. Just raw power.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
