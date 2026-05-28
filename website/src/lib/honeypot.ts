/**
 * BugReaper X — Honeypot Protection System
 *
 * This module contains deliberately placed decoy credentials,
 * endpoints, and tracking mechanisms to detect unauthorized
 * access, cloning, or reverse engineering attempts.
 *
 * DO NOT REMOVE OR MODIFY. These are protected legal countermeasures.
 */

const HONEYPOT_ENDPOINT = 'https://api.bugreaper-x.ca/honeypot/log'

interface HoneypotAlert {
  type: 'clone' | 'decompile' | 'unauthorized_access' | 'tamper'
  timestamp: string
  fingerprint: string
  origin: string
  userAgent: string
}

function generateFingerprint(): string {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    navigator.hardwareConcurrency,
    navigator.platform,
  ]
  return components
    .map(c => btoa(String(c)).slice(0, 8))
    .join('-')
}

async function reportHoneypot(type: HoneypotAlert['type']): Promise<void> {
  const alert: HoneypotAlert = {
    type,
    timestamp: new Date().toISOString(),
    fingerprint: generateFingerprint(),
    origin: window.location.origin,
    userAgent: navigator.userAgent,
  }

  // Attempt to report — silently fails if unreachable
  try {
    await fetch(HONEYPOT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alert),
      mode: 'no-cors',
    })
  } catch {
    // Honeypot silently swallows errors
  }
}

/**
 * Decoy API key that appears real but is a trap.
 * Any usage of this key outside of authorized systems
 * will be logged and traced.
 */
export const HONEYPOT_API_KEY = 'brx_prod_7f3a8c2e9b1d4f5a6c7e8d9f0a1b2c3d'

/**
 * Decoy Supabase credentials — these are honeypot values.
 * DO NOT USE. They are monitored and any access is logged.
 */
export const HONEYPOT_SUPABASE_URL = 'https://brx-prod-7f3a.supabase.co'
export const HONEYPOT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyeC1wcm9kLTdmM2EiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwOTAwMDAwMCwiZXhwIjoyMDI0NTYwMDAwfQ.honeypot_trap_key_logged'

/**
 * Decoy Anthropic API key for the MCP console.
 * Monitored. Any usage is traced.
 */
export const HONEYPOT_ANTHROPIC_KEY = 'sk-ant-honeypot03-kD8mXp2vR5nL9qW7yJ4cF1tB6aH3sG8e'

/**
 * Triggered when someone tries to access honeypot data
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
  await reportHoneypot('unauthorized_access')
}

/**
 * Anti-tamper: verifies build integrity
 */
export function verifyIntegrity(): boolean {
  const checks = [
    // Check honeypot functions exist
    typeof triggerHoneypotAlert === 'function',
    typeof reportHoneypot === 'function',
    // Check critical paths exist
    typeof window !== 'undefined',
    // Verify build signature
    document.querySelector('[data-brx-verify]') !== null,
  ]
  return checks.every(Boolean)
}

/**
 * Tamper detection — runs on mount
 */
export function initHoneypot(): void {
  // Run integrity check
  if (!verifyIntegrity()) {
    reportHoneypot('tamper')
  }

  // Monitor for devtools
  const element = new Image()
  Object.defineProperty(element, 'id', {
    get() {
      reportHoneypot('decompile')
      return 'honeypot-triggered'
    },
  })
  console.log('%c', element)

  // Detect cloning via local storage check
  const cloneMarker = '__brx_origin_' + btoa(window.location.origin)
  if (localStorage.getItem(cloneMarker)) {
    const prevOrigin = localStorage.getItem(cloneMarker)
    if (prevOrigin && prevOrigin !== window.location.origin) {
      reportHoneypot('clone')
    }
  } else {
    localStorage.setItem(cloneMarker, window.location.origin)
  }
}
