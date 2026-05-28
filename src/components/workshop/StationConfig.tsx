import { cn } from '../../lib/utils'
import type { WorkbenchStation } from '../../types'

const categoryColors: Record<string, string> = {
  recon: 'text-hacker-green border-hacker-green/30 bg-hacker-green/5',
  vuln: 'text-hacker-red border-hacker-red/30 bg-hacker-red/5',
  secrets: 'text-hacker-cyan border-hacker-cyan/30 bg-hacker-cyan/5',
  takeover: 'text-hacker-purple border-hacker-purple/30 bg-hacker-purple/5',
}

interface StationConfigProps {
  stations: WorkbenchStation[]
  onUpdate: (stations: WorkbenchStation[]) => void
}

const AVAILABLE_TOOLS = [
  { id: 'subfinder', name: 'subfinder', category: 'recon' as const, description: 'Subdomain discovery' },
  { id: 'httpx', name: 'httpx', category: 'recon' as const, description: 'HTTP probing' },
  { id: 'nuclei', name: 'nuclei', category: 'vuln' as const, description: 'Vulnerability scanning' },
  { id: 'gau', name: 'gau', category: 'recon' as const, description: 'URL discovery' },
  { id: 'dalfox', name: 'dalfox', category: 'vuln' as const, description: 'XSS scanning' },
  { id: 'ffuf', name: 'ffuf', category: 'vuln' as const, description: 'Directory fuzzing' },
  { id: 'naabu', name: 'naabu', category: 'recon' as const, description: 'Port scanning' },
  { id: 'trufflehog', name: 'trufflehog', category: 'secrets' as const, description: 'Secret scanning' },
  { id: 'subzy', name: 'subzy', category: 'takeover' as const, description: 'Takeover check' },
  { id: 'dnsx', name: 'dnsx', category: 'recon' as const, description: 'DNS lookup' },
]

export function StationConfig({ stations, onUpdate }: StationConfigProps) {
  const addStation = (toolId: string) => {
    const tool = AVAILABLE_TOOLS.find(t => t.id === toolId)
    if (!tool) return
    const newStation: WorkbenchStation = {
      id: `st${Date.now()}`,
      name: tool.name,
      tool: tool.id,
      category: tool.category,
      order: stations.length,
      config: {},
    }
    onUpdate([...stations, newStation])
  }

  const removeStation = (id: string) => {
    onUpdate(stations.filter(s => s.id !== id).map((s, i) => ({ ...s, order: i })))
  }

  const moveStation = (id: string, dir: 'up' | 'down') => {
    const idx = stations.findIndex(s => s.id === id)
    if (idx === -1) return
    const newIdx = dir === 'up' ? idx - 1 : idx + 1
    if (newIdx < 0 || newIdx >= stations.length) return
    const copy = [...stations]
    const temp = { ...copy[idx], order: newIdx }
    copy[idx] = { ...copy[newIdx], order: idx }
    copy[newIdx] = temp
    onUpdate(copy)
  }

  const usedTools = stations.map(s => s.tool)
  const availableTools = AVAILABLE_TOOLS.filter(t => !usedTools.includes(t.id))

  return (
    <div className="space-y-2">
      {stations.map((st, i) => (
        <div key={st.id} className={cn(
          'flex items-center gap-2 px-2 py-1.5 rounded border text-xs font-mono group',
          categoryColors[st.category] || 'text-hacker-text-dim border-hacker-border bg-hacker-bg'
        )}>
          <span className="text-[9px] text-hacker-text-dim/50 w-4 text-right">{i + 1}</span>
          <span className="text-hacker-text flex-1 truncate">{st.name}</span>
          <span className="text-[9px] opacity-60 truncate hidden sm:inline">{st.category}</span>
          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => moveStation(st.id, 'up')} disabled={i === 0} className="text-[10px] px-1 hover:text-hacker-green disabled:opacity-30">↑</button>
            <button onClick={() => moveStation(st.id, 'down')} disabled={i === stations.length - 1} className="text-[10px] px-1 hover:text-hacker-green disabled:opacity-30">↓</button>
            <button onClick={() => removeStation(st.id)} className="text-[10px] px-1 hover:text-hacker-red">✕</button>
          </div>
        </div>
      ))}
      {stations.length === 0 && (
        <div className="text-center py-3 text-[10px] font-mono text-hacker-text-dim/50">
          No stations configured. Add tools below.
        </div>
      )}
    </div>
  )
}
