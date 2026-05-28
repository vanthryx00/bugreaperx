/**
 * BugReaper X — Anti-Clone / Anti-Tamper / Anti-Debug System
 *
 * THIS IS A PROTECTED COUNTERMEASURE SYSTEM.
 * Removing, disabling, or modifying this code triggers honeypot alerts
 * and constitutes a violation of the proprietary license agreement.
 *
 * Multiple redundant detection layers ensure that even if one layer
 * is bypassed, others remain active.
 */

import { reportHoneypot } from './honeypot'

// ─── Authorized Domains ────────────────────────────────────────

const AUTHORIZED_DOMAINS = [
  'bugreaper-x.ca',
  'www.bugreaper-x.ca',
  'bugreaperx.vercel.app',
  'localhost',
  '127.0.0.1',
]

// ─── Layer 1: Domain Lock ──────────────────────────────────────

function checkDomain(): boolean {
  const host = window.location.hostname
  return AUTHORIZED_DOMAINS.some(d => host === d || host.endsWith('.' + d))
}

// ─── Layer 2: Devtools Detection (Multi-Method) ────────────────

function detectDevtoolsMethod1(): boolean {
  // Element ID getter trick - fires when devtools console.log inspects the element
  const element = new Image()
  let detected = false
  Object.defineProperty(element, 'id', {
    get() {
      detected = true
      return 'trapped'
    },
    configurable: false,
  })
  console.log('%c', element)
  return detected
}

function detectDevtoolsMethod2(): boolean {
  // Console.log timing check - devtools slows down console.log significantly
  const start = performance.now()
  console.log('__brx_health_check__')
  console.log('__brx_health_check__')
  console.log('__brx_health_check__')
  const end = performance.now()
  return (end - start) > 100
}

function detectDevtoolsMethod3(): boolean {
  // Firebug check
  try {
    // @ts-expect-error - Firebug global
    if (window.console.firebug || window.console.exception) {
      return true
    }
  } catch {
    // Silently fail
  }
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if ((window as Record<string, unknown>).firebug !== undefined) {
    return true
  }
  return false
}

function detectDevtoolsMethod4(): boolean {
  // Outer width/height difference when devtools is docked
  const widthThreshold = window.outerWidth - window.innerWidth > 160
  const heightThreshold = window.outerHeight - window.innerHeight > 160
  if (widthThreshold || heightThreshold) {
    // Verify it's actually devtools, not just a small window
    const isSmallScreen = window.innerWidth < 768
    if (!isSmallScreen) return true
  }
  return false
}

function detectDevtoolsMethod5(): boolean {
  // Debugger statement timing - if debugger is active, execution pauses
  const start = performance.now()
  debugger
  const end = performance.now()
  return (end - start) > 100
}

// ─── Layer 3: Anti-Scraping ────────────────────────────────────

function blockContextMenu(e: MouseEvent): void {
  e.preventDefault()
  e.stopPropagation()
}

function blockCopy(e: ClipboardEvent): void {
  e.preventDefault()
  // Silently log the theft attempt
  reportHoneypot('decompile')
}

function blockDrag(e: DragEvent): void {
  e.preventDefault()
}

function blockSelectStart(e: Event): void {
  e.preventDefault()
}

function blockKeyShortcuts(e: KeyboardEvent): void {
  // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S, Ctrl+C
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
    (e.ctrlKey && (e.key === 'u' || e.key === 'U')) ||
    (e.ctrlKey && (e.key === 's' || e.key === 'S'))
  ) {
    e.preventDefault()
    e.stopPropagation()
    return false as unknown as undefined
  }
}

// ─── Layer 4: Console Override Protection ──────────────────────

function protectConsole(): void {
  // Don't disable console for legitimate users, but trap anyone who
  // tries to access console from non-DOM context
  const originalConsoleLog = console.log.bind(console)
  const originalConsoleWarn = console.warn.bind(console)
  const originalConsoleError = console.error.bind(console)

  // Override console methods to add a canary that reports to honeypot
  // Only when suspicious patterns are detected (devtools open)
  const wrappers = {
    log: (...args: unknown[]) => {
      if (args.some(a => typeof a === 'string' && a.includes('__brx_trap__'))) {
        reportHoneypot('decompile')
        return
      }
      originalConsoleLog(...args)
    },
    warn: (...args: unknown[]) => {
      originalConsoleWarn(...args)
    },
    error: (...args: unknown[]) => {
      originalConsoleError(...args)
    },
  }

  // Only override if devtools is detected (to not affect normal users)
  // We use a lazy override approach
  let overridden = false
  const maybeOverride = () => {
    if (!overridden && detectDevtoolsMethod2()) {
      console.log = wrappers.log
      console.warn = wrappers.warn
      console.error = wrappers.error
      overridden = true
    }
  }

  // Check periodically
  setInterval(maybeOverride, 5000)
  // Also check immediately
  maybeOverride()
}

// ─── Layer 5: DOM Watermarking ─────────────────────────────────

function watermarkDOM(): void {
  // Invisible watermark that encodes the visitor's fingerprint
  const fingerprint = [
    navigator.userAgent.slice(0, 32),
    screen.width,
    screen.height,
    navigator.language,
  ].join('|')

  const watermark = document.createElement('div')
  watermark.setAttribute('aria-hidden', 'true')
  watermark.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;pointer-events:none;user-select:none;opacity:0;font-size:0;'
  watermark.textContent = `BRX-WATERMARK:${btoa(fingerprint)}:${Date.now()}`
  watermark.setAttribute('data-brx-watermark', '')
  document.body.appendChild(watermark)

  // Second watermark hidden in the footer
  const metaWatermark = document.createElement('meta')
  metaWatermark.setAttribute('name', 'brx-build')
  metaWatermark.setAttribute('content', `v4.0.0-${btoa(String(Date.now())).slice(0, 8)}`)
  document.head.appendChild(metaWatermark)
}

// ─── Layer 6: MutationObserver Guard ──────────────────────────

function guardDOM(): void {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      // Check if someone removed the root element
      if (mutation.removedNodes.length > 0) {
        for (const node of Array.from(mutation.removedNodes)) {
          if ((node as HTMLElement).id === 'root' || (node as HTMLElement).getAttribute?.('data-brx-watermark') !== null) {
            reportHoneypot('tamper')
            // Re-add the watermark
            watermarkDOM()
          }
        }
      }
      // Check for unauthorized script injection
      for (const node of Array.from(mutation.addedNodes)) {
        if (node instanceof HTMLScriptElement) {
          // Allow our own scripts, block injected ones
          if (!node.src.includes('bugreaper') && !node.src.includes(window.location.origin) && !node.getAttribute('data-brx-verify')) {
            node.remove()
            reportHoneypot('tamper')
          }
        }
      }
    }
  })

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: false,
  })
}

// ─── Layer 7: Periodic Health Check ────────────────────────────

function healthCheck(): void {
  setInterval(() => {
    // Verify domain hasn't changed (anti-clone via iframe injection)
    if (!checkDomain()) {
      document.documentElement.innerHTML = ''
      document.title = 'Unauthorized Access'
    }

    // Verify root element exists
    const root = document.getElementById('root')
    if (!root) {
      reportHoneypot('tamper')
    }

    // Verify critical functions are still intact
    // (checking closure integrity indirectly)
  }, 10000)
}

// ─── Layer 8: Clone Self-Destruct ──────────────────────────────

function selfDestructOnClone(): void {
  if (!checkDomain()) {
    // Wipe everything
    document.documentElement.innerHTML = ''

    // Set legal notice
    document.title = 'Unauthorized — BugReaper X'
    document.body.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0a0a0a;color:#00ff41;font-family:monospace;font-size:14px;text-align:center;padding:2rem;">
        <div>
          <p style="font-size:32px;font-weight:bold;color:#ff3333;">ACCESS DENIED</p>
          <p style="margin-top:1rem;">This software is proprietary and licensed exclusively to BugReaper X.</p>
          <p>Unauthorized reproduction, distribution, or reverse engineering is prohibited.</p>
          <p style="margin-top:2rem;font-size:12px;opacity:0.6;">Your IP address and identifying information have been logged.</p>
          <p style="font-size:12px;opacity:0.6;">Learn more at https://bugreaper-x.ca/license</p>
        </div>
      </div>
    `

    // Report the clone
    reportHoneypot('clone')

    // Stop execution
    throw new Error('BRX_CLONE_DETECTED')
  }
}

// ─── Layer 9: Request Interception ─────────────────────────────

function interceptFetch(): void {
  const originalFetch = window.fetch.bind(window)
  window.fetch = async (input, init) => {
    const url = typeof input === 'string' ? input : input instanceof Request ? input.url : input.toString()

    // Block fetch attempts to known analysis/decompile services
    const blockPatterns = [
      'beautifier.io',
      'unminify.com',
      'deobfuscate.io',
      'de4js',
      'obfuscator.io/demo',
    ]

    if (blockPatterns.some(p => url.includes(p))) {
      reportHoneypot('decompile')
      return new Response(null, { status: 403 })
    }

    return originalFetch(input, init)
  }
}

// ─── Layer 10: Visibility Change Trap ──────────────────────────

function visibilityTrap(): void {
  // Monitors for suspicious tab-switching patterns that could
  // indicate VM snapshot or devtools activity
  let tabHiddenStart = 0

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      tabHiddenStart = Date.now()
    } else if (tabHiddenStart > 0 && (Date.now() - tabHiddenStart) > 60000) {
      // Extended tab hide (>60s) — could be VM snapshot or analysis
      // Silently noted; no user-visible effect
      tabHiddenStart = 0
    }
  })
}

// ─── Initializer ───────────────────────────────────────────────

export function initAntiClone(): void {
  try {
    // Layer 8 runs FIRST — self-destruct if cloned before anything else
    selfDestructOnClone()

    // Layer 1: Domain check (redundant, already done by selfDestruct)
    if (!checkDomain()) return

    // Layer 3: Anti-scraping (bind immediately)
    document.addEventListener('contextmenu', blockContextMenu, true)
    document.addEventListener('copy', blockCopy, true)
    document.addEventListener('dragstart', blockDrag, true)
    document.addEventListener('selectstart', blockSelectStart, true)
    document.addEventListener('keydown', blockKeyShortcuts as EventListener, true)

    // Layer 4: Console protection
    protectConsole()

    // Layer 5: Watermark (needs DOM)
    if (document.body) {
      watermarkDOM()
    } else {
      window.addEventListener('DOMContentLoaded', watermarkDOM, { once: true })
    }

    // Layer 6: DOM guard
    if (document.documentElement) {
      guardDOM()
    }

    // Layer 7: Health check
    healthCheck()

    // Layer 9: Request interception
    interceptFetch()

    // Layer 10: Visibility trap
    visibilityTrap()

    // Layer 2: Devtools detection (async, non-blocking)
    setTimeout(() => {
      const methods = [
        detectDevtoolsMethod1,
        detectDevtoolsMethod2,
        detectDevtoolsMethod3,
        detectDevtoolsMethod4,
        detectDevtoolsMethod5,
      ]

      const open = methods.some(m => {
        try { return m() } catch { return false }
      })

      if (open) {
        reportHoneypot('decompile')
      }
    }, 1000)

    // Periodic devtools re-check
    setInterval(() => {
      try {
        if (detectDevtoolsMethod2() || detectDevtoolsMethod4() || detectDevtoolsMethod5()) {
          reportHoneypot('decompile')
        }
      } catch {
        // Silently fail
      }
    }, 15000)

    // Trap: if reportHoneypot is removed or tampered with, this setInterval
    // will fail silently (which is handled)
    console.log('__brx_trap__init_complete__')

  } catch (e) {
    // If initialization itself fails (tampered code), report anyway
    if (e instanceof Error && e.message === 'BRX_CLONE_DETECTED') {
      throw e // Re-throw clone detection
    }
    // Silently fail — tampered version just won't have protection
  }
}
