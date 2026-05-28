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

// ─── Godseye Types ────────────────────────────────────────
export interface SecurityMetric {
  id: string
  label: string
  value: number // 0-100
  status: 'secure' | 'warning' | 'critical'
  detail: string
}

export interface ThreatEvent {
  id: string
  type: 'code-gen' | 'privacy-scan' | 'session-anomaly' | 'credential-test' | 'data-exfil'
  severity: 'critical' | 'high' | 'medium' | 'low'
  source: string
  detail: string
  timestamp: string
  blocked: boolean
}

export interface PrivacyLayer {
  id: string
  name: string
  status: 'active' | 'monitoring' | 'bypassed'
  protection: string
  endpoints: number
}

export interface SessionActivity {
  id: string
  user: string
  action: string
  resource: string
  status: 'allowed' | 'blocked' | 'flagged'
  timestamp: string
}

// ─── JARVIS / Railguard Types ─────────────────────────────
export interface SafetyRule {
  id: string
  name: string
  description: string
  category: 'criminal' | 'malicious' | 'privacy' | 'ethics'
  severity: 'critical' | 'high' | 'medium'
  active: boolean
  blockedCount: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system' | 'guardrail'
  content: string
  timestamp: string
  blocked?: boolean
  blockReason?: string
}

export interface PrivacyShieldStatus {
  enabled: boolean
  dataEncrypted: boolean
  piiMasked: boolean
  sessionIsolated: boolean
  networkMonitored: boolean
  lastScan: string
}

export interface EthicalBoundary {
  id: string
  principle: string
  description: string
  enforced: boolean
  violations: number
}
