import { useState, lazy, Suspense } from 'react'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Features } from './components/Features'
import { ArsenalShowcase } from './components/ArsenalShowcase'
import { Stats } from './components/Stats'
import { Download } from './components/Download'
import { Testimonials } from './components/Testimonials'
import { Footer } from './components/Footer'
import { ParticleBackground } from './components/ParticleBackground'

// GameView is lazy-loaded because it contains Three.js (~8 MB) and custom shaders
const GameView = lazy(() => import('./components/game/GameView').then((m) => ({ default: m.GameView })))

// Placeholder shown while the 3D game environment loads
function GameLoadingPlaceholder() {
  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="relative mx-auto mb-6 w-12 h-12">
          <div className="absolute inset-0 border-2 border-[#1a1a1a] rounded-full" />
          <div className="absolute inset-0 border-2 border-[#00ff41] rounded-full border-t-transparent animate-spin" />
        </div>
        <p className="text-xs font-mono text-[#666] animate-pulse">
          Loading 3D game environment...
        </p>
        <p className="text-[10px] font-mono text-[#444] mt-2">
          Preparing photorealistic graphics engine
        </p>
      </div>
    </div>
  )
}

export default function App() {
  const [gameMode, setGameMode] = useState(false)

  if (gameMode) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<GameLoadingPlaceholder />}>
          <GameView />
        </Suspense>
      </ErrorBoundary>
    )
  }

  return (
    <div className="relative min-h-screen bg-hacker-bg text-hacker-text overflow-hidden">
      <ParticleBackground />
      <div className="scanline" />
      <div className="relative z-10">
        <Navbar onPlayGame={() => setGameMode(true)} />
        <Hero />
        <Stats />
        <Features />
        <ArsenalShowcase />
        <Testimonials />
        <Download />
        <Footer />
      </div>
    </div>
  )
}
