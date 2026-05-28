import { useState } from 'react'
import { cn } from '../lib/utils'
import { NotificationManager } from '../components/notifications/NotificationManager'

const SETTINGS_GROUPS = [
  {
    section: 'General',
    icon: '⚙',
    items: [
      { name: 'Theme', value: 'Hacker Dark (Default)', type: 'select', options: ['Hacker Dark', 'Matrix Green', 'Night Blue'] },
      { name: 'Font Size', value: '12px', type: 'select', options: ['10px', '11px', '12px', '13px', '14px'] },
      { name: 'Auto-save Interval', value: '30s', type: 'select', options: ['10s', '30s', '60s', '300s'] },
      { name: 'Language', value: 'English', type: 'select', options: ['English'] },
    ],
  },
  {
    section: 'Tools',
    icon: '🔧',
    items: [
      { name: 'Tool Paths', value: 'C:\\tools\\', type: 'path' },
      { name: 'Wordlist Directories', value: 'C:\\wordlists\\', type: 'path' },
      { name: 'Proxy Settings', value: 'http://127.0.0.1:8080', type: 'input' },
      { name: 'Rate Limit', value: '150 req/s', type: 'select', options: ['50 req/s', '100 req/s', '150 req/s', '300 req/s'] },
    ],
  },
  {
    section: 'AI Integration',
    icon: '🤖',
    items: [
      { name: 'Ollama Endpoint', value: 'http://localhost:11434', type: 'input' },
      { name: 'Model Selection', value: 'codestral', type: 'select', options: ['codestral', 'deepseek-coder', 'llama3', 'mixtral'] },
      { name: 'Context Window', value: '4096', type: 'select', options: ['2048', '4096', '8192', '16384'] },
      { name: 'System Prompt', value: 'You are a bug bounty expert...', type: 'textarea' },
    ],
  },
  {
    section: 'Platforms',
    icon: '🔗',
    items: [
      { name: 'HackerOne API', value: '••••••••••••••••', type: 'password' },
      { name: 'Bugcrowd API', value: '••••••••••••••••', type: 'password' },
      { name: 'Intigriti API', value: '••••••••••••••••', type: 'password' },
      { name: 'Custom Targets', value: '3 configured', type: 'link' },
    ],
  },
  {
    section: 'Storage',
    icon: '💾',
    items: [
      { name: 'Autosave Directory', value: '~/Downloads/BugReaperX/autosave/', type: 'path' },
      { name: 'Screenshot Path', value: '~/Downloads/BugReaperX/screenshots/', type: 'path' },
      { name: 'Report Templates', value: '5 templates', type: 'link' },
      { name: 'Export All Automations', value: 'Download ZIP', type: 'button' },
    ],
  },
]

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications'>('general')

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-hacker-text-bright font-mono tracking-wide">▸ SETTINGS</h1>
        <p className="text-sm text-hacker-text-dim mt-1 font-mono">Configuration · Tools · Notifications · Preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1">
        <button onClick={() => setActiveTab('general')}
          className={cn('text-[10px] font-mono px-3 py-1.5 rounded transition-colors',
            activeTab === 'general' ? 'bg-hacker-green/10 text-hacker-green' : 'text-hacker-text-dim hover:text-hacker-text')}>
          General
        </button>
        <button onClick={() => setActiveTab('notifications')}
          className={cn('text-[10px] font-mono px-3 py-1.5 rounded transition-colors',
            activeTab === 'notifications' ? 'bg-hacker-green/10 text-hacker-green' : 'text-hacker-text-dim hover:text-hacker-text')}>
          Notifications
        </button>
      </div>

      {activeTab === 'general' ? (
        <div className="space-y-3">
          {SETTINGS_GROUPS.map((group) => (
            <div key={group.section} className="hacker-card p-4">
              <h3 className="text-xs font-semibold text-hacker-green font-mono mb-3 flex items-center gap-2">
                <span>{group.icon}</span>
                <span>{group.section}</span>
              </h3>
              <div className="space-y-2">
                {group.items.map((item) => (
                  <div key={item.name} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-hacker-surface2 transition-colors group">
                    <span className="text-xs font-mono text-hacker-text">{item.name}</span>
                    <div className="flex items-center gap-2">
                      {item.type === 'select' && (
                        <select className="hacker-input text-[10px] py-1 pr-6 w-auto max-w-[200px]" defaultValue={item.value}>
                          {item.options?.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      )}
                      {item.type === 'input' && (
                        <input className="hacker-input text-[10px] py-1 w-[200px]" defaultValue={item.value} />
                      )}
                      {item.type === 'path' && (
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-mono text-hacker-text-dim/70 truncate max-w-[200px]">{item.value}</span>
                          <button className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-hacker-surface2 text-hacker-text-dim hover:text-hacker-text opacity-0 group-hover:opacity-100 transition-opacity">Browse</button>
                        </div>
                      )}
                      {item.type === 'password' && (
                        <span className="text-[10px] font-mono text-hacker-text-dim/70">{item.value}</span>
                      )}
                      {item.type === 'textarea' && (
                        <span className="text-[10px] font-mono text-hacker-text-dim/70 truncate max-w-[200px]">{item.value}</span>
                      )}
                      {item.type === 'link' && (
                        <button className="text-[10px] font-mono text-hacker-green/70 hover:text-hacker-green">{item.value}</button>
                      )}
                      {item.type === 'button' && (
                        <button className="hacker-btn-primary text-[10px]">{item.value}</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="hacker-card p-4">
          <NotificationManager />
        </div>
      )}
    </div>
  )
}
