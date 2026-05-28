export function SecretsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-hacker-text-bright font-mono tracking-wide">▸ SECRETS</h1>
        <p className="text-sm text-hacker-text-dim mt-1 font-mono">Secret discovery · credential leak detection</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: 'TruffleHog', desc: 'Git secret scanning', status: 'ready' },
          { name: 'Gitleaks', desc: 'Repo secret audit', status: 'ready' },
          { name: 'Nuclei-Expo', desc: 'Exposure templates', status: 'ready' },
          { name: 'JS Secret Grep', desc: 'JavaScript secrets', status: 'ready' },
          { name: 'Mantra', desc: 'Secret regex hunt', status: 'ready' },
          { name: 'Custom Regex', desc: 'Define patterns', status: 'config' },
        ].map((tool) => (
          <div key={tool.name} className="hacker-card p-4 hover:border-hacker-green/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-hacker-text">{tool.name}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                tool.status === 'ready' ? 'bg-hacker-green/10 text-hacker-green' : 'bg-hacker-amber/10 text-hacker-amber'
              }`}>
                {tool.status}
              </span>
            </div>
            <p className="text-[10px] text-hacker-text-dim font-mono">{tool.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
