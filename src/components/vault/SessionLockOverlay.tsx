import { useState, useEffect } from 'react'

export function SessionLockOverlay() {
  const [showOverlay, setShowOverlay] = useState(false)
  const [inactivityTimer, setInactivityTimer] = useState(0)
  const TIMEOUT_SECONDS = 60 // 1 min of inactivity triggers lock

  useEffect(() => {
    const unlockTime = localStorage.getItem('vault_session_unlocked')
    if (!unlockTime) return

    const checkInactivity = () => {
      const elapsed = (Date.now() - parseInt(unlockTime)) / 1000
      setInactivityTimer(Math.max(0, TIMEOUT_SECONDS - elapsed))
      if (elapsed > TIMEOUT_SECONDS) {
        setShowOverlay(true)
      }
    }

    checkInactivity()
    const interval = setInterval(checkInactivity, 1000)
    return () => clearInterval(interval)
  }, [])

  // Reset timer on activity
  useEffect(() => {
    const resetTimer = () => {
      localStorage.setItem('vault_session_unlocked', Date.now().toString())
      setShowOverlay(false)
    }

    window.addEventListener('mousemove', resetTimer)
    window.addEventListener('keydown', resetTimer)
    window.addEventListener('click', resetTimer)

    return () => {
      window.removeEventListener('mousemove', resetTimer)
      window.removeEventListener('keydown', resetTimer)
      window.removeEventListener('click', resetTimer)
    }
  }, [])

  if (!showOverlay) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-hacker-bg/95 backdrop-blur-sm flex items-center justify-center">
      <div className="hacker-card p-8 max-w-sm text-center">
        <span className="text-4xl block mb-4">🔒</span>
        <h2 className="text-sm font-bold font-mono text-hacker-text-bright mb-2">Session Locked</h2>
        <p className="text-[9px] font-mono text-hacker-text-dim/60 mb-4">
          Your vault session has been locked due to inactivity. Move your mouse or press any key to resume.
        </p>
        <div className="w-full h-1 bg-hacker-surface2 rounded overflow-hidden">
          <div
            className="h-full rounded bg-hacker-cyan animate-pulse"
            style={{ width: '100%' }}
          />
        </div>
        <p className="text-[8px] font-mono text-hacker-text-dim/40 mt-2">
          Move mouse or press any key to unlock
        </p>
      </div>
    </div>
  )
}
