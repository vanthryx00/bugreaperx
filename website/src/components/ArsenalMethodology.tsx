import { useState, useRef, useEffect } from 'react'

// ─── Phase Data ─────────────────────────────────────────────
const PHASES = [
  {
    id: 'recon',
    title: 'Phase 1',
    name: 'Absolute Reconnaissance & Attack Surface Mapping',
    tagline: 'You cannot attack what you do not know exists.',
    icon: '◎',
    color: 'text-hacker-green',
    borderColor: 'border-hacker-green/30',
    gradient: 'from-hacker-green/10',
    bgGlow: 'bg-hacker-green/5',
    tools: ['Amass', 'Subfinder', 'httpx', 'Masscan', 'RustScan', 'Shodan', 'Censys', 'Chaos', 'Wappalyzer'],
    sections: [
      {
        title: 'Parallel Processing Architecture',
        content: 'The Reaper utilizes distributed VPS clusters across multiple geographic regions. Tools like Amass, Subfinder, and ProjectDiscovery\'s Chaos are deployed across these clusters simultaneously. This distributed architecture requires meticulous resource allocation to ensure that API keys for services like Shodan, Censys, and GitHub are rotated efficiently without hitting rate limits — maintaining a continuous flow of intelligence gathering.',
      },
      {
        title: 'Contextual Asset Discovery',
        content: 'Once raw subdomains and IP addresses are collected, the system probes for active web servers using httpx. This does more than check for a 200 OK — it grabs server headers, SSL/TLS certificates, and exact technology stacks via integrated Wappalyzer logic. The system does not treat a staging server the same way it treats a production marketing blog. By precisely identifying the context of the asset, the Reaper knows exactly which exploit pathways to prioritize.',
      },
      {
        title: 'Scalable Knowledge Integration',
        content: 'Port scanning is elevated beyond simple Nmap sweeps. Masscan and RustScan feed open port data into a central nervous system — an Elasticsearch or custom PostgreSQL database. Every piece of data, from an open Redis instance on an obscure port to a specific version of Nginx, is fed into a scalable knowledge base. If a zero-day drops for a specific version of Confluence, the Reaper does not need to scan again — they simply query their existing knowledge base and instantly retrieve a list of vulnerable targets.',
      },
    ],
  },
  {
    id: 'vuln',
    title: 'Phase 2',
    name: 'Vulnerability Identification & Algorithmic Fuzzing',
    tagline: 'Generic wordlists are for script kiddies. The elite build custom dictionaries from the target\'s own DNA.',
    icon: '⚔',
    color: 'text-hacker-purple',
    borderColor: 'border-hacker-purple/30',
    gradient: 'from-hacker-purple/10',
    bgGlow: 'bg-hacker-purple/5',
    tools: ['FFUF', 'Feroxbuster', 'Nuclei', 'Burp Suite Pro', 'Gau', 'Waybackurls', 'Katana'],
    sections: [
      {
        title: 'Contextual Wordlist Generation',
        content: 'The elite tier does not use generic wordlists. They build dynamically generated dictionaries based on the target\'s own context. By scraping the target\'s public GitHub repositories, marketing materials, and JavaScript files, the Reaper builds a wordlist specific to that company\'s internal nomenclature. This means directory fuzzing discovers internal admin panels, staging environments, and debug endpoints that generic wordlists would never hit.',
      },
      {
        title: 'Algorithmic Rate Optimization',
        content: 'Fuzzers are tuned to dynamically adjust request rates based on the server\'s response time, ensuring they do not crash the target while maintaining maximum throughput. If a server starts dropping packets — evidenced by increased response times or 429/503 status codes — the algorithm automatically throttles back. This continuous algorithmic optimization ensures sustained, stealthy reconnaissance.',
      },
      {
        title: 'Predictive Vulnerability Scanning',
        content: 'While standard hunters use default Nuclei templates, the elite Reaper writes custom YAML templates tailored to the specific business logic of their targets. By analyzing how a developer implemented an authentication flow on one subdomain, the Reaper anticipates that the same flawed logic was likely copy-pasted to newly deployed microservices. They write a custom Nuclei template to hunt specifically for that anticipated flaw across the entire known attack surface.',
      },
    ],
  },
  {
    id: 'exploit',
    title: 'Phase 3',
    name: 'Advanced Exploitation Techniques',
    tagline: 'Architectural takedowns, not simple XSS pop-ups.',
    icon: '◈',
    color: 'text-hacker-red',
    borderColor: 'border-hacker-red/30',
    gradient: 'from-hacker-red/10',
    bgGlow: 'bg-hacker-red/5',
    tools: ['Burp Collaborator', 'Interactsh', 'HTTP Request Smuggler', 'Ghidra', 'JWT_Tool', 'SQLMap'],
    sections: [
      {
        title: 'SSRF & Out-Of-Band Exploitation',
        content: 'When an application takes a user-supplied URL and fetches it, the Reaper attempts to force the server to request internal resources (like http://169.254.169.254 for AWS metadata). If the application does not return the response directly (Blind SSRF), OOB techniques are deployed. Custom DNS and HTTP listeners (Burp Collaborator or Interactsh) are set up. Payloads are injected to force the target server to perform a DNS lookup to the listener. If the listener receives a ping, the vulnerability is confirmed — no response needed in the application output.',
      },
      {
        title: 'HTTP Request Smuggling & Desync Attacks',
        content: 'Modern web architecture relies on reverse proxies, load balancers, and backend servers. If these different components parse HTTP requests slightly differently — one prioritizes Content-Length while the other prioritizes Transfer-Encoding — the Reaper can "smuggle" a hidden request inside a legitimate one. This can lead to cache poisoning (serving malicious content to other users), WAF bypasses, or session hijacking. Identifying these flaws requires absolute mastery of the HTTP protocol and specialized Burp extensions like HTTP Request Smuggler.',
      },
      {
        title: 'Prototype Pollution & Client-Side Attacks',
        content: 'As applications shift heavy logic to the client-side (React, Angular, Vue), the Reaper reverse-engineers massive JavaScript bundles to find sinks (functions that execute code) and sources (user-controllable input). Prototype pollution injects properties into base object prototypes in JavaScript, which are then inherited by the rest of the application — leading to complete logic bypasses or RCE within the browser context.',
      },
      {
        title: 'Error Minimization & WAF Evasion',
        content: 'Sending thousands of aggressive payloads sets off alarms. The Reaper meticulously crafts payloads to be as stealthy as possible — utilizing obscure encodings, Unicode normalization tricks, and logic flaws that do not trigger standard signature-based WAF rules. Every byte is intentional. Every request is measured.',
      },
    ],
  },
  {
    id: 'automation',
    title: 'Phase 4',
    name: 'Automation, Machine Learning & Infrastructure',
    tagline: 'The elite do not operate from a single laptop. They manage a fleet.',
    icon: '●',
    color: 'text-hacker-cyan',
    borderColor: 'border-hacker-cyan/30',
    gradient: 'from-hacker-cyan/10',
    bgGlow: 'bg-hacker-cyan/5',
    tools: ['Headless Chrome', 'Python ML', 'Docker', 'Terraform', 'Cloudflare API', 'Custom Scripts'],
    sections: [
      {
        title: 'Adaptive WAF Bypass',
        content: 'To bypass sophisticated Web Application Firewalls like Cloudflare or Akamai, the Reaper implements adaptive learning loops. Headless browsers and machine learning scripts analyze WAF blocking pages. When a payload is blocked, the system automatically mutates the payload, tests it again, analyzes the new response, and iterates. This rapid adaptive learning loop continues until it finds the exact combination of encoding and syntax that bypasses the filter — mapping the WAF\'s rule set in real-time.',
      },
      {
        title: 'Self-Healing Infrastructure',
        content: 'The infrastructure is self-monitoring. Scripts track the health of VPS nodes, the operational status of databases, and the success rates of scanning modules. If a node\'s IP gets burned (blacklisted by the target), the system automatically destroys the node and spins up a new one with a fresh IP address in a different geographical region. The hunt never stops.',
      },
      {
        title: 'Sustained Performance Monitoring',
        content: 'All of this requires sustained performance monitoring. Custom dashboards track real-time metrics: requests per second, findings per hour, WAF block rate, IP health scores, and API credit consumption. Alerts fire when any metric deviates from baseline, allowing the Reaper to focus on exploitation while the infrastructure runs itself.',
      },
    ],
  },
  {
    id: 'reporting',
    title: 'Phase 5',
    name: 'Reporting & Triage',
    tagline: 'Finding the bug is irrelevant if you cannot communicate it effectively.',
    icon: '◉',
    color: 'text-hacker-amber',
    borderColor: 'border-hacker-amber/30',
    gradient: 'from-hacker-amber/10',
    bgGlow: 'bg-hacker-amber/5',
    tools: ['Docker', 'Python PoC', 'Markdown', 'CVSS 4.0', 'HackerOne API', 'Bugcrowd API'],
    sections: [
      {
        title: 'Reproducible Proof of Concept',
        content: 'The Reaper generates reports with automated templates that include reproducible Docker containers or concise Python scripts as Proof of Concepts. The narrative is clear — stripping away unnecessary technical jargon to focus on the absolute business impact. A triage team should be able to spin up the Docker container and see the vulnerability in under 60 seconds.',
      },
      {
        title: 'Streamlined Communication Protocols',
        content: 'Reports follow a strict template: vulnerability type, affected endpoint, impact assessment, CVSS 4.0 score (with vector string), reproducible steps, remediation recommendation, and supporting evidence (screenshots, request/response pairs, logs). This streamlined approach guarantees that the triage team can instantly verify the flaw, resulting in faster resolution times and immediate bounty payouts.',
      },
      {
        title: 'Multi-Platform Submission',
        content: 'The Pipeline system tracks submissions across HackerOne, Bugcrowd, Intigriti, and self-managed programs simultaneously. CVSS 4.0 scoring is built-in with an interactive vector calculator. The earnings ledger tracks every payout, and the severity breakdown provides real-time stats on bounty performance across platforms.',
      },
    ],
  },
]

// ─── Phase Card Component ───────────────────────────────────
function PhaseCard({ phase, index, isExpanded, onToggle }: {
  phase: typeof PHASES[0]
  index: number
  isExpanded: boolean
  onToggle: () => void
}) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 120)
          observer.disconnect()
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
      className={`transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div
        className={`cyber-card overflow-hidden transition-all duration-300 ${
          isExpanded ? `border-l-2 ${phase.borderColor}` : ''
        }`}
      >
        {/* Clickable Header */}
        <button
          onClick={onToggle}
          className="relative w-full text-left p-5 md:p-6 cursor-pointer group"
        >
          {/* Background glow on hover */}
          <div className={`absolute inset-0 ${phase.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

          <div className="relative z-10 flex items-start gap-4">
            {/* Icon */}
            <div className={`w-10 h-10 rounded-lg bg-hacker-surface2/50 border ${phase.borderColor.replace('border', 'border/30')} flex items-center justify-center shrink-0 ${phase.color} text-lg`}>
              {phase.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-mono ${phase.color} tracking-wider`}>{phase.title}</span>
                <span className="text-hacker-text-dim/20">·</span>
                <span className="text-[9px] font-mono text-hacker-text-dim/40">{phase.tools.length} tools</span>
              </div>
              <h3 className="text-base md:text-lg font-bold text-hacker-text-bright font-mono">{phase.name}</h3>
              <p className="text-xs text-hacker-text-dim/60 mt-1 italic">{phase.tagline}</p>
            </div>

            {/* Expand indicator */}
            <div className={`shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              <svg className={`w-5 h-5 ${phase.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </button>

        {/* Expanded Content */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-5 pb-6 md:px-6 relative">
            <div className={`h-px ${phase.gradient.replace('from-', 'bg-gradient-to-r from-')} to-transparent mb-6`} />

            {/* Tool tags */}
            <div className="mb-6">
              <p className="text-[9px] font-mono text-hacker-text-dim/40 uppercase tracking-wider mb-2">Key Tools</p>
              <div className="flex flex-wrap gap-1.5">
                {phase.tools.map((tool) => (
                  <span
                    key={tool}
                    className={`px-2 py-0.5 rounded text-[9px] font-mono border ${phase.borderColor.replace('border', 'border/20')} ${phase.color}/60 hover:${phase.color} transition-colors`}
                    style={{ color: 'inherit' }}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-4">
              {phase.sections.map((section, si) => (
                <div key={si} className="pl-4 border-l-2 border-hacker-border/30">
                  <h4 className={`text-xs font-bold font-mono ${phase.color} mb-1.5`}>
                    {section.title}
                  </h4>
                  <p className="text-xs text-hacker-text-dim leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────
export function ArsenalMethodology() {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null)

  const togglePhase = (id: string) => {
    setExpandedPhase(prev => prev === id ? null : id)
  }

  return (
    <section id="methodology" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-[800px] h-[800px] rounded-full bg-hacker-purple/5 blur-[150px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="grid-bg opacity-20 absolute inset-0" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hacker-amber/10 border border-hacker-amber/20 text-xs font-mono text-hacker-amber mb-4">
            <span className="text-hacker-green">The Elite Reaper's Arsenal</span>
            <span className="text-hacker-text-dim/30">·</span>
            Full Methodology Breakdown
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-hacker-text-bright mb-4">
            Operational{' '}
            <span className="text-gradient">Playbook</span>
          </h2>
          <p className="text-sm text-hacker-text-dim max-w-3xl mx-auto">
            The transition from a casual researcher to an apex predator requires unbroken, granular focus on every layer
            of the OSI model and the web application stack. This is the exact methodology deployed by the elite.
            Click each phase to expand the full technical breakdown.
          </p>
        </div>

        {/* Phases */}
        <div className="space-y-4">
          {PHASES.map((phase, index) => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              index={index}
              isExpanded={expandedPhase === phase.id}
              onToggle={() => togglePhase(phase.id)}
            />
          ))}
        </div>

        {/* Summary */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-hacker-surface2/50 border border-hacker-border/30">
            <span className="text-xl">🎯</span>
            <span className="text-xs font-mono text-hacker-text-dim">
              5 Phases · {PHASES.reduce((sum, p) => sum + p.sections.length, 0)} Techniques · {PHASES.reduce((sum, p) => sum + p.tools.length, 0)} Tools Referenced
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
