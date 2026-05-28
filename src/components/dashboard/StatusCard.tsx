import { SystemStatus } from '../../types'
import { cn } from '../../lib/utils'

interface StatusCardProps {
  item: SystemStatus
}

const statusConfig = {
  active: { dot: 'status-dot-active', label: 'Active', text: 'text-hacker-green' },
  inactive: { dot: 'status-dot-inactive', label: 'Inactive', text: 'text-hacker-text-dim' },
  warning: { dot: 'status-dot-warning', label: 'Warning', text: 'text-hacker-amber' },
  error: { dot: 'status-dot-error', label: 'Error', text: 'text-hacker-red' },
}

const iconMap: Record<string, string> = {
  hunter: '◎',
  'arsenal-core': '⚔',
  sentry: '◉',
  ollama: '●',
  cloudflare: '◈',
}

export function StatusCard({ item }: StatusCardProps) {
  const config = statusConfig[item.status]

  return (
    <div className="hacker-card p-4 hover:border-hacker-green/30 transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{iconMap[item.id] || '○'}</span>
          <span className="text-sm font-medium text-hacker-text">{item.label}</span>
        </div>
        <span className={cn('text-[10px] font-mono px-2 py-0.5 rounded', config.text, 'bg-current/10')}>
          {config.label}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className={config.dot} />
        <div className="flex-1 h-1 bg-hacker-surface2 rounded-full overflow-hidden">
          <div className={cn(
            'h-full rounded-full transition-all duration-1000',
            item.status === 'active' ? 'bg-hacker-green w-3/4' :
            item.status === 'warning' ? 'bg-hacker-amber w-1/2' : 'w-0'
          )} />
        </div>
      </div>
      {item.details && (
        <p className="text-[10px] text-hacker-text-dim mt-2 font-mono">{item.details}</p>
      )}
    </div>
  )
}
