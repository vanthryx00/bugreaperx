import { NavItem } from '../types'

export const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'activity', path: '/' },
  { id: 'hunt', label: 'Hunt', icon: 'crosshair', path: '/hunt', badge: 'RECON' },
  { id: 'arsenal', label: 'Arsenal', icon: 'swords', path: '/arsenal', badge: 275 },
  { id: 'pipeline', label: 'Pipeline', icon: 'git-pull-request', path: '/pipeline' },
  { id: 'workshop', label: 'Workshop', icon: 'flask', path: '/workshop' },
  { id: 'repeater', label: 'Repeater', icon: 'radio', path: '/repeater' },
  { id: 'mcp', label: 'MCP Console', icon: 'bot', path: '/mcp' },
  { id: 'godseye', label: 'Godseye', icon: 'eye', path: '/godseye', badge: 'SECURE' },
  { id: 'jarvis', label: 'JARVIS', icon: 'bot', path: '/jarvis', badge: 'AI' },
  { id: 'secrets', label: 'Secrets', icon: 'eye', path: '/secrets' },
  { id: 'reports', label: 'Reports', icon: 'file-text', path: '/reports' },
  { id: 'settings', label: 'Settings', icon: 'settings', path: '/settings' },
]

export const systemStatusItems = [
  { id: 'hunter', label: 'Hunter', status: 'active' as const },
  { id: 'arsenal-core', label: 'Arsenal Core', status: 'active' as const },
  { id: 'godseye', label: 'Godseye', status: 'active' as const },
  { id: 'jarvis', label: 'JARVIS', status: 'active' as const },
  { id: 'sentry', label: 'Sentry', status: 'active' as const },
  { id: 'ollama', label: 'Ollama', status: 'inactive' as const },
  { id: 'cloudflare', label: 'Cloudflare', status: 'warning' as const },
]
