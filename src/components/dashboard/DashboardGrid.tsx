import { StatusCard } from './StatusCard'
import type { SystemStatus } from '../../types'

const systemStatuses: SystemStatus[] = [
  { id: 'hunter', label: 'Hunter', status: 'active', details: '12 active targets in scope' },
  { id: 'arsenal-core', label: 'Arsenal Core', status: 'active', details: '275 weapons · 15 categories' },
  { id: 'sentry', label: 'Sentry', status: 'active', details: 'Watching 8 programs for scope changes' },
  { id: 'ollama', label: 'Ollama AI', status: 'inactive', details: 'Install Ollama to enable AI features' },
  { id: 'cloudflare', label: 'Cloudflare', status: 'warning', details: 'Rate limit at 72%' },
  { id: 'electron', label: 'Electron Runtime', status: 'active', details: 'v30.x · Windows x64' },
]

export function DashboardGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {systemStatuses.map((item) => (
        <StatusCard key={item.id} item={item} />
      ))}
    </div>
  )
}
