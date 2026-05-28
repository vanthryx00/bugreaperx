import { StrictMode, useState, useEffect, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LoadingScreen } from './components/LoadingScreen'
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
}

// ─── Layer 0.5: Honeypot System ────────────────────────────────
import { initHoneypot } from './lib/honeypot'
try {
  initHoneypot()
} catch {
  // Honeypot initialization silently fails if tampered with
}

// ─── Dynamic Import: App (loaded after protection layers) ─────
const App = lazy(() => import('./App'))

// ─── Root Component ──────────────────────────────────────────
function Root() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Small delay to ensure protection layers initialize
    const timer = setTimeout(() => setReady(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (!ready) {
    return <LoadingScreen message="Initializing sovereign infrastructure..." minDisplayMs={1200} />
  }

  return (
    <ErrorBoundary>
      <StrictMode>
        <App />
      </StrictMode>
    </ErrorBoundary>
  )
}

// ─── Application Root ─────────────────────────────────────────
createRoot(document.getElementById('root')!).render(<Root />)
