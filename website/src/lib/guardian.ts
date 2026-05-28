/**
 * BugReaper X — Bootstrap Guardian Script
 *
 * This script is inlined directly into index.html and executes
 * BEFORE any other JavaScript loads. It provides the first line
 * of defense against cloning and debugging.
 *
 * This code is intentionally NOT obfuscated (it runs inline),
 * but its content is verified at build time for integrity.
 */

// @ts-nocheck

(function () {
  'use strict'

  // ─── Authorized domains ──────────────────────────────
  var AUTHORIZED_DOMAINS = [
    'bugreaper-x.ca',
    'www.bugreaper-x.ca',
    'bugreaperx.vercel.app',
    'localhost',
    '127.0.0.1',
  ]

  var host = window.location.hostname
  var isAuthorized = false

  for (var i = 0; i < AUTHORIZED_DOMAINS.length; i++) {
    if (host === AUTHORIZED_DOMAINS[i] || host.endsWith('.' + AUTHORIZED_DOMAINS[i])) {
      isAuthorized = true
      break
    }
  }

  // ─── CLONE DETECTED: Self-destruct ────────────────────
  if (!isAuthorized) {
    document.documentElement.innerHTML = ''
    document.title = 'Unauthorized Access — BugReaper X'

    var style = document.createElement('style')
    style.textContent =
      'body{' +
      'display:flex;align-items:center;justify-content:center;' +
      'height:100vh;margin:0;background:#0a0a0a;' +
      'font-family:monospace;font-size:14px;' +
      '-webkit-user-select:none;user-select:none;' +
      '}'

    var div = document.createElement('div')
    div.style.cssText =
      'text-align:center;padding:2rem;max-width:600px;'

    div.innerHTML =
      '<p style="font-size:32px;font-weight:bold;color:#ff3333;">ACCESS DENIED</p>' +
      '<p style="margin-top:1rem;color:#ccc;">' +
      'This software is proprietary and licensed exclusively to BugReaper X.</p>' +
      '<p style="color:#999;">' +
      'Unauthorized reproduction, distribution, or reverse engineering is prohibited.</p>' +
      '<p style="margin-top:2rem;font-size:12px;color:#666;">' +
      'Your IP address and identifying information have been logged.</p>' +
      '<p style="font-size:12px;color:#555;">' +
      'Learn more at <a href="https://bugreaper-x.ca/license" style="color:#00ff41;">bugreaper-x.ca/license</a></p>' +
      '<p style="margin-top:3rem;font-size:10px;color:#444;">' +
      '© BugReaper X. All rights reserved.</p>'

    document.head.appendChild(style)
    document.body.appendChild(div)

    // Attempt to report the clone via beacon
    try {
      navigator.sendBeacon(
        'https://api.bugreaper-x.ca/honeypot/log',
        JSON.stringify({
          type: 'clone',
          origin: window.location.origin,
          host: host,
          time: new Date().toISOString(),
        })
      )
    } catch (e) {}

    // Stop all further JS execution
    throw new Error('BRX_CLONE_DETECTED')
  }

  // ─── Devtools prevention (immediate) ──────────────────
  // Block F12 before anything else loads
  document.addEventListener('keydown', function (e) {
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
      (e.ctrlKey && (e.key === 'u' || e.key === 'U'))
    ) {
      e.preventDefault()
      e.stopPropagation()
      return false
    }
  }, true)

  // ─── Debugger loop (immediate) ────────────────────────
  // If devtools is open, this will freeze the debugger
  setInterval(function () {
    (function () {
      return false
    })['constructor']('debugger')()
  }, 100)

  // ─── Mark body as guarded ─────────────────────────────
  document.documentElement.setAttribute('data-brx-guardian', 'active')
})()
