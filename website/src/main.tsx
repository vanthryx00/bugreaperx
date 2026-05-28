import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Initialize honeypot protection system
import { initHoneypot } from './lib/honeypot'
try {
  initHoneypot()
} catch {
  // Honeypot initialization silently fails if tampered with
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
