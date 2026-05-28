import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// ─── Layer 0: Anti-Clone Bootstrap ─────────────────────────────
// This runs FIRST, before React initializes, to ensure protection
import { initAntiClone } from './lib/anticlone'
try {
  initAntiClone()
} catch (e) {
  // If clone detected, don't render anything
  if (e instanceof Error && e.message === 'BRX_CLONE_DETECTED') {
    throw e
  }
  // Silently continue — protection layer already handled
}

// ─── Layer 0.5: Honeypot System ────────────────────────────────
import { initHoneypot } from './lib/honeypot'
try {
  initHoneypot()
} catch {
  // Honeypot initialization silently fails if tampered with
}

// ─── React Application ─────────────────────────────────────────
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
