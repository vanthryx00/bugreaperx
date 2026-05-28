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

// ─── Neurohack Types ───────────────────────────────────────
export interface NeurohackPhase {
  id: number
  type: 'MAP' | 'CONSUME' | 'BUILD' | 'TEST' | 'CONNECT' | 'APPLY' | 'SKIM' | 'EXPLAIN' | 'FILL_GAPS' | 'TEACH' | 'FIND_EXPERT' | 'CLONE_MINIMAL' | 'BREAK_IT' | 'REBUILD_YOURS' | 'SET_IMPOSSIBLE_GOAL' | 'BRUTAL_SIMPLIFY' | 'SKILL_MAP' | 'JUST_IN_TIME_LEARN' | 'ITERATE'
  name: string
  description: string
  duration_min: number
  action: string
  output: string
  completed: boolean
  output_notes?: string
}

export interface NeurohackProtocol {
  id: string
  name: string
  description: string
  duration_hours: number
  phases: NeurohackPhase[]
  icon: string
  color: string
}

export interface NeurohackSprint {
  id: string
  protocol_id: string
  topic: string
  started_at: string
  deadline_hours: number
  current_phase: number
  phases: NeurohackPhase[]
  momentum_score: number
  completed: boolean
  completed_at?: string
}

export interface FrictionItem {
  id: string
  label: string
  checked: boolean
  icon: string
}

// ─── Adventure Mode Types ──────────────────────────────────
export interface AdventureProfile {
  xp: number
  level: number
  streak: number
  longestStreak: number
  lastSprintDate: string | null
  totalSprintsCompleted: number
  totalPhasesCompleted: number
  badges: Badge[]
  unlockedProtocols: string[]
  xpToNextLevel: number
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: string | null
  condition: (profile: AdventureProfile) => boolean
}

export interface LevelTier {
  level: number
  title: string
  icon: string
  color: string
  xpRequired: number
}

// ─── Privacy Vault Types ───────────────────────────────────
export interface VaultEntry {
  id: string
  title: string
  category: 'credential' | 'note' | 'api-key' | 'recovery' | 'payment'
  encryptedData: string // AES-GCM encrypted JSON
  iv: string // Base64 IV
  createdAt: string
  updatedAt: string
  favorite: boolean
}

export interface VaultSession {
  locked: boolean
  unlockedAt: string | null
  lastActivity: string
  timeoutMinutes: number
  totpEnabled: boolean
  totpVerified: boolean
  masterPasswordSet: boolean
}

export interface TOTPConfig {
  secret: string
  verified: boolean
  backupCodes: string[]
}

// ─── Collab Lab Types ──────────────────────────────────────
export interface CollabSession {
  id: string
  name: string
  peerId: string
  peers: CollabPeer[]
  language: string
  code: string
  createdAt: string
  active: boolean
}

export interface CollabPeer {
  id: string
  name: string
  color: string
  cursor: CollabCursor | null
  connected: boolean
  joinedAt: string
}

export interface CollabCursor {
  line: number
  column: number
  selectionStart?: { line: number; column: number }
  selectionEnd?: { line: number; column: number }
}

export interface CollabMessage {
  id: string
  peerId: string
  peerName: string
  type: 'code-change' | 'cursor-move' | 'chat' | 'peer-join' | 'peer-leave'
  content: string
  timestamp: string
  cursor?: CollabCursor
}
