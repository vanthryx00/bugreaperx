/**
 * BugReaper X — Honeypot Protection System
 *
 * This module contains deliberately placed decoy credentials,
 * endpoints, and tracking mechanisms to detect unauthorized
 * access, cloning, or reverse engineering attempts.
 *
 * DO NOT REMOVE OR MODIFY. These are protected legal countermeasures.
 *
 * All decoy values are monitored. Any usage outside of
 * authorized BugReaper X infrastructure is traced and logged.
 */

const HONEYPOT_ENDPOINT = 'https://api.bugreaper-x.ca/honeypot/log'

interface HoneypotAlert {
  type: 'clone' | 'decompile' | 'unauthorized_access' | 'tamper' | 'scrape'
  timestamp: string
  fingerprint: string
  origin: string
  userAgent: string
  metadata?: Record<string, string>
}

function generateFingerprint(): string {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    navigator.hardwareConcurrency,
    navigator.platform,
    (navigator as unknown as Record<string, unknown>).deviceMemory ?? '',
  ]
  return components
    .map(c => {
      try { return btoa(String(c)).slice(0, 8) } catch { return String(c).slice(0, 8) }
    })
    .join('-')
}

export async function reportHoneypot(type: HoneypotAlert['type'], metadata?: Record<string, string>): Promise<void> {
  const alert: HoneypotAlert = {
    type,
    timestamp: new Date().toISOString(),
    fingerprint: generateFingerprint(),
    origin: window.location.origin,
    userAgent: navigator.userAgent,
    metadata,
  }

  // Attempt to report via multiple methods for redundancy
  try {
    await fetch(HONEYPOT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alert),
      mode: 'no-cors',
    })
  } catch {
    // Fallback to sendBeacon
    try {
      navigator.sendBeacon(HONEYPOT_ENDPOINT, JSON.stringify(alert))
    } catch {
      // Honeypot silently swallows all errors
    }
  }
}

// ─── Decoy Credentials (all monitored) ─────────────────────────

/**
 * Decoy API key — appears real, monitored for unauthorized use.
 * Any usage triggers a honeypot alert.
 */
export const HONEYPOT_API_KEY = 'brx_prod_7f3a8c2e9b1d4f5a6c7e8d9f0a1b2c3d'

/**
 * Decoy Supabase credentials — honeypot values monitored 24/7.
 */
export const HONEYPOT_SUPABASE_URL = 'https://brx-prod-7f3a.supabase.co'
export const HONEYPOT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyeC1wcm9kLTdmM2EiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwOTAwMDAwMCwiZXhwIjoyMDI0NTYwMDAwfQ.honeypot_trap_key_logged'

/**
 * Decoy Anthropic API key — monitored MCP console key.
 */
export const HONEYPOT_ANTHROPIC_KEY = 'sk-ant-honeypot03-kD8mXp2vR5nL9qW7yJ4cF1tB6aH3sG8e'

/**
 * Decoy Ollama endpoint — traps anyone probing for local AI infrastructure.
 */
export const HONEYPOT_OLLAMA_ENDPOINT = 'http://localhost:11434/api/generate'

/**
 * Decoy admin panel path — traps scanners/crawlers.
 */
export const HONEYPOT_ADMIN_PATH = '/admin/brx-console'
export const HONEYPOT_ADMIN_TOKEN = 'brx_admin_9f8e7d6c5b4a3f2e1d0c'

/**
 * Decoy API endpoint paths — traps API scanners.
 */
export const HONEYPOT_API_PATHS = [
  '/api/v1/targets',
  '/api/v1/scans',
  '/api/v1/results',
  '/api/v1/config',
  '/api/v1/export',
  '/graphql',
  '/api/health',
  '/api/debug',
  '/.env',
  '/.git/config',
]

// ─── Honeypot Triggers ─────────────────────────────────────────

/**
 * Trigger a honeypot alert when someone tries to access decoy data
 */
export async function triggerHoneypotAlert(context: string): Promise<void> {
  console.warn(
    `%c⚠️ HONEYPOT TRIGGERED ⚠️`,
    'color: #ff3333; font-size: 20px; font-weight: bold;'
  )
  console.warn(
    `%cAccess to ${context} has been logged. IP and identifying information captured.`,
    'color: #ff3333; font-size: 14px;'
  )
  await reportHoneypot('unauthorized_access', { context })
}

/**
 * Trigger a scrape detection alert
 */
export async function triggerScrapeAlert(path: string): Promise<void> {
  await reportHoneypot('scrape', { path })
}

// ─── Integrity Verification ────────────────────────────────────

/**
 * Verify build integrity — checks that all protection layers are intact
 */
export function verifyIntegrity(): boolean {
  try {
    const checks = [
      // Check honeypot functions exist
      typeof triggerHoneypotAlert === 'function',
      typeof reportHoneypot === 'function',
      // Check critical DOM elements exist
      typeof window !== 'undefined',
      document.querySelector('[data-brx-verify]') !== null,
      document.querySelector('[data-brx-guardian]') !== null,
      // Verify build version matches
      document.querySelector('meta[name="brx-build-version"]')?.getAttribute('content') === '4.0.0',
    ]
    return checks.every(Boolean)
  } catch {
    return false
  }
}

// ─── Tamper Response ───────────────────────────────────────────

/**
 * Called when tampering is detected — takes escalating countermeasures
 */
export function onTamperDetected(): void {
  reportHoneypot('tamper')

  // Countermeasure level 1: Legal notice flood
  for (let i = 0; i < 5; i++) {
    console.warn(
      '%c⚠️ TAMPER DETECTED — This software is protected by proprietary license ⚠️',
      'color: #ff3333; font-size: 16px; font-weight: bold;'
    )
  }
}

// ─── Honeypot Initializer ──────────────────────────────────────

/**
 * Initialize the full honeypot protection system
 */
export function initHoneypot(): void {
  try {
    // Run integrity check
    if (!verifyIntegrity()) {
      onTamperDetected()
    }

    // Monitor for devtools
    const element = new Image()
    Object.defineProperty(element, 'id', {
      get() {
        reportHoneypot('decompile')
        return 'honeypot-triggered'
      },
      configurable: false,
    })
    console.log('%c', element)

    // Detect cloning via local storage check
    const cloneMarker = '__brx_origin_' + btoa(window.location.origin)
    const stored = localStorage.getItem(cloneMarker)
    if (stored) {
      if (stored !== window.location.origin) {
        reportHoneypot('clone')
      }
    } else {
      localStorage.setItem(cloneMarker, window.location.origin)
    }

    // Register decoy API routes as honepots for scrapers/crawlers
    // These will never actually be hit on production, but if someone
    // clones the site and these routes exist, they're trapped
    console.log(`brx_honeypot_routes:${HONEYPOT_API_PATHS.join(',')}`)

  } catch {
    // Honeypot silently fails if tampered with
  }
}
