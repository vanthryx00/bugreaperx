import { useEffect, useState } from 'react'

interface LoadingScreenProps {
  message?: string
  minDisplayMs?: number
  onLoaded?: () => void
}

const LOADING_MESSAGES = [
  'Initializing sovereign infrastructure...',
  'Loading 275 weapons across 15 categories...',
  'Calibrating MCP console...',
  'Arming anti-clone countermeasures...',
  'Establishing secure session...',
  'Reticulating splines...',
  'Warming up AI engine...',
]

export function LoadingScreen({ message, minDisplayMs = 800, onLoaded }: LoadingScreenProps) {
  const [msgIndex, setMsgIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Cycle through messages
    const msgInterval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length)
    }, 400)

    // Progress bar
    const progInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progInterval)
          clearInterval(msgInterval)
          setTimeout(() => {
            setFadeOut(true)
            setTimeout(() => onLoaded?.(), 500)
          }, 300)
          return 100
        }
        return Math.min(p + 2 + Math.random() * 5, 100)
      })
    }, minDisplayMs / 30)

    return () => {
      clearInterval(msgInterval)
      clearInterval(progInterval)
    }
  }, [minDisplayMs, onLoaded])

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Animated logo */}
      <div className="relative mb-8">
        <div className="text-4xl font-black font-mono text-[#00ff41] tracking-widest animate-pulse-slow">
          BRX
        </div>
        <div className="absolute -inset-4 bg-[#00ff41]/5 blur-xl rounded-full animate-pulse" />
      </div>

      {/* Loading bar */}
      <div className="w-64 max-w-[80vw]">
        <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00ff41] rounded-full transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Message */}
      <p className="mt-4 text-xs font-mono text-[#666]">
        {message || LOADING_MESSAGES[msgIndex]}
      </p>

      {/* Version */}
      <p className="mt-8 text-[10px] font-mono text-[#333]">
        BugReaper X v4.0.0
      </p>
    </div>
  )
}
