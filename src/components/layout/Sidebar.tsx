import { navItems } from '../../data/navigation'
import { cn } from '../../lib/utils'

interface SidebarProps {
  activePath: string
  onNavigate: (path: string) => void
}

const iconMap: Record<string, string> = {
  activity: '◉',
  crosshair: '◎',
  swords: '⚔',
  'git-pull-request': '◈',
  flask: '⚗',
  radio: '◉',
  bot: '●',
  eye: '◎',
  'file-text': '◻',
  settings: '⚙',
  zap: '⚡',
}

export function Sidebar({ activePath, onNavigate }: SidebarProps) {
  return (
    <aside className="w-56 bg-hacker-surface border-r border-hacker-border flex flex-col flex-shrink-0 h-full">
      {/* App Header */}
      <div className="px-4 py-3 border-b border-hacker-border flex items-center gap-2.5 drag-handle">
        <div className="w-5 h-5 rounded bg-hacker-green/20 flex items-center justify-center text-xs text-hacker-green font-bold">R</div>
        <div>
          <h1 className="text-sm font-semibold text-hacker-text-bright tracking-wide">BugReaper</h1>
          <p className="text-[10px] text-hacker-text-dim font-mono">v4.0 · STANDALONE</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.path === activePath
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.path)}
              className={cn(
                'w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-all duration-150 text-left',
                isActive
                  ? 'bg-hacker-green/10 text-hacker-green border-l-2 border-hacker-green'
                  : 'text-hacker-text-dim hover:text-hacker-text hover:bg-hacker-surface2 border-l-2 border-transparent'
              )}
            >
              <span className="text-base w-4 text-center">{iconMap[item.icon] || '○'}</span>
              <span className="flex-1 font-medium">{item.label}</span>
              {item.badge !== undefined && (
                <span className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded font-mono',
                  typeof item.badge === 'string'
                    ? 'bg-hacker-amber/10 text-hacker-amber'
                    : 'bg-hacker-purple/10 text-hacker-purple'
                )}>
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom Status */}
      <div className="px-4 py-2 border-t border-hacker-border">
        <div className="flex items-center gap-2 text-[10px] text-hacker-text-dim font-mono">
          <span className="status-dot-active" />
          <span>System Ready</span>
        </div>
      </div>
    </aside>
  )
}
