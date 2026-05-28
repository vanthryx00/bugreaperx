export interface NavItem {
  id: string
  label: string
  icon: string
  path: string
  badge?: string | number
}

export interface SystemStatus {
  id: string
  label: string
  status: 'active' | 'inactive' | 'warning' | 'error'
  details?: string
}

export interface ToolState {
  name: string
  installed: boolean
  description: string
}

export interface ArsenalWeapon {
  id: string
  name: string
  description: string
  category: string
  command: string
  targetCount?: number
}

export interface PipelineItem {
  id: string
  title: string
  platform: 'hackerone' | 'bugcrowd' | 'intigriti' | 'self-managed'
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  status: 'draft' | 'submitted' | 'accepted' | 'rejected' | 'paid'
  bounty?: number
  createdAt: string
}

export interface SessionLog {
  id: string
  target: string
  startTime: string
  endTime?: string
  duration?: number
  entries: LogEntry[]
}

export interface LogEntry {
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'success'
  message: string
  source: string
}
