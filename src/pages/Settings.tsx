export function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-hacker-text-bright font-mono tracking-wide">▸ SETTINGS</h1>
        <p className="text-sm text-hacker-text-dim mt-1 font-mono">Configuration · Tools · Preferences</p>
      </div>

      <div className="space-y-3">
        {[
          { section: 'General', items: ['Theme', 'Font Size', 'Auto-save Interval', 'Language'] },
          { section: 'Tools', items: ['Tool Paths', 'API Keys', 'Wordlist Directories', 'Proxy Settings'] },
          { section: 'AI Integration', items: ['Ollama Endpoint', 'Model Selection', 'Context Window', 'System Prompt'] },
          { section: 'Platforms', items: ['HackerOne API', 'Bugcrowd API', 'Intigriti API', 'Custom Targets'] },
          { section: 'Notifications', items: ['Webhook URL', 'Email Alerts', 'Slack Integration', 'Telegram Bot'] },
          { section: 'Storage', items: ['Autosave Directory', 'Screenshot Path', 'Report Templates'] },
        ].map((group) => (
          <div key={group.section} className="hacker-card p-4">
            <h3 className="text-xs font-semibold text-hacker-green font-mono mb-3">{group.section}</h3>
            <div className="space-y-2">
              {group.items.map((item) => (
                <div key={item} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-hacker-surface2 transition-colors">
                  <span className="text-xs font-mono text-hacker-text">{item}</span>
                  <span className="text-[10px] font-mono text-hacker-text-dim/50">→ configure</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
