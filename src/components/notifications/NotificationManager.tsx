import { useState } from 'react'
import { cn } from '../../lib/utils'
import type { NotificationChannel } from '../../types'

const DEMO_CHANNELS: NotificationChannel[] = [
  { id: 'n1', name: 'Security Alerts', type: 'discord', webhookUrl: 'https://discord.com/api/webhooks/...', active: true, events: ['critical_finding', 'scope_change', 'tool_failure'], lastSent: '2026-05-28T14:23:00Z' },
  { id: 'n2', name: 'Pipeline Updates', type: 'slack', webhookUrl: 'https://hooks.slack.com/services/...', active: true, events: ['submission_accepted', 'bounty_paid'], lastSent: '2026-05-27T09:12:00Z' },
  { id: 'n3', name: 'Sprint Reminders', type: 'telegram', webhookUrl: 'https://api.telegram.org/bot...', active: false, events: ['sprint_complete', 'sprint_timeout'], lastSent: null },
]

const EVENT_OPTIONS = [
  { id: 'critical_finding', label: 'Critical Finding' },
  { id: 'scope_change', label: 'Scope Change' },
  { id: 'tool_failure', label: 'Tool Failure' },
  { id: 'submission_accepted', label: 'Submission Accepted' },
  { id: 'bounty_paid', label: 'Bounty Paid' },
  { id: 'sprint_complete', label: 'Sprint Complete' },
  { id: 'sprint_timeout', label: 'Sprint Timeout' },
  { id: 'session_end', label: 'Session End' },
]

const typeIcons: Record<string, string> = {
  discord: '◆', slack: '◈', telegram: '◉', email: '⊡', webhook: '◎',
}

const typeColors: Record<string, string> = {
  discord: 'text-hacker-purple', slack: 'text-hacker-green',
  telegram: 'text-hacker-cyan', email: 'text-hacker-amber', webhook: 'text-hacker-text-dim',
}

export function NotificationManager() {
  const [channels, setChannels] = useState(DEMO_CHANNELS)
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState<NotificationChannel['type']>('webhook')
  const [newUrl, setNewUrl] = useState('')
  const [editingEvents, setEditingEvents] = useState<string | null>(null)

  const addChannel = () => {
    if (!newName.trim() || !newUrl.trim()) return
    const ch: NotificationChannel = {
      id: `n${Date.now()}`,
      name: newName.trim(),
      type: newType,
      webhookUrl: newUrl.trim(),
      active: true,
      events: [],
      lastSent: null,
    }
    setChannels([...channels, ch])
    setNewName('')
    setNewUrl('')
    setShowNew(false)
  }

  const toggleActive = (id: string) => {
    setChannels(channels.map(c => c.id === id ? { ...c, active: !c.active } : c))
  }

  const removeChannel = (id: string) => {
    setChannels(channels.filter(c => c.id !== id))
  }

  const toggleEvent = (channelId: string, event: string) => {
    setChannels(channels.map(c => c.id === channelId
      ? { ...c, events: c.events.includes(event) ? c.events.filter(e => e !== event) : [...c.events, event] }
      : c
    ))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-hacker-cyan font-mono">◎ NOTIFICATION CHANNELS</h3>
        <button onClick={() => setShowNew(!showNew)} className="hacker-btn-primary text-[10px] px-2 py-0.5">
          + Add Channel
        </button>
      </div>

      {showNew && (
        <div className="p-3 rounded bg-hacker-bg border border-hacker-border space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <input className="hacker-input text-xs" placeholder="Channel name..." value={newName} onChange={e => setNewName(e.target.value)} />
            <select className="hacker-input text-xs" value={newType} onChange={e => setNewType(e.target.value as NotificationChannel['type'])}>
              <option value="discord">Discord</option>
              <option value="slack">Slack</option>
              <option value="telegram">Telegram</option>
              <option value="webhook">Webhook</option>
            </select>
            <input className="hacker-input text-xs font-mono" placeholder="Webhook URL..." value={newUrl} onChange={e => setNewUrl(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <button onClick={addChannel} disabled={!newName.trim() || !newUrl.trim()} className="hacker-btn-primary text-[10px] disabled:opacity-30">Create</button>
            <button onClick={() => { setShowNew(false); setNewName(''); setNewUrl('') }} className="hacker-btn-ghost text-[10px]">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {channels.length === 0 ? (
          <div className="text-center py-4 text-[10px] font-mono text-hacker-text-dim/50">No notification channels configured</div>
        ) : channels.map(ch => (
          <div key={ch.id} className="p-3 rounded bg-hacker-bg/50 border border-hacker-border hover:border-hacker-green/20 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={cn('text-xs', typeColors[ch.type])}>{typeIcons[ch.type]}</span>
                <span className="text-xs font-mono text-hacker-text">{ch.name}</span>
                <span className={cn('text-[8px] font-mono px-1 py-0.5 rounded uppercase', typeColors[ch.type] + ' bg-opacity-10')}>{ch.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleActive(ch.id)}
                  className={cn('text-[9px] font-mono px-1.5 py-0.5 rounded', ch.active ? 'bg-hacker-green/10 text-hacker-green' : 'bg-hacker-surface2 text-hacker-text-dim')}>
                  {ch.active ? '● active' : '○ paused'}
                </button>
                <button onClick={() => setEditingEvents(editingEvents === ch.id ? null : ch.id)}
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-hacker-surface2 text-hacker-text-dim hover:text-hacker-text">
                  events ({ch.events.length})
                </button>
                <button onClick={() => removeChannel(ch.id)} className="text-[9px] px-1 py-0.5 text-hacker-red/50 hover:text-hacker-red">✕</button>
              </div>
            </div>

            {editingEvents === ch.id && (
              <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-hacker-border">
                {EVENT_OPTIONS.map(ev => (
                  <button key={ev.id} onClick={() => toggleEvent(ch.id, ev.id)}
                    className={cn('text-[8px] font-mono px-1.5 py-0.5 rounded border transition-colors',
                      ch.events.includes(ev.id)
                        ? 'bg-hacker-green/10 text-hacker-green border-hacker-green/30'
                        : 'bg-hacker-surface2 text-hacker-text-dim border-hacker-border hover:text-hacker-text'
                    )}>
                    {ev.label}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 mt-2 text-[8px] font-mono text-hacker-text-dim/50">
              <span className="truncate max-w-[300px]">{ch.webhookUrl}</span>
              {ch.lastSent && <span>· last: {new Date(ch.lastSent).toLocaleString()}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
