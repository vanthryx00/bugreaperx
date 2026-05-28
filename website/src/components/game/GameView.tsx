import { useEffect } from 'react'
import { useGameStore } from '../../lib/game/store'
import { GameCanvas } from './GameCanvas'
import { GameHUD } from './GameHUD'
import { HeroCreation } from './HeroCreation'
import { WalletPanel } from './WalletPanel'
import { ShopPanel } from './ShopPanel'
import { CombatPanel } from './CombatPanel'
import { GameAudioIntegration } from '../GameAudioIntegration'

export function GameView() {
  return (
    <>
      <GameAudioIntegration />
      <GameViewInner />
    </>
  )
}

function GameViewInner() {
  const screen = useGameStore(s => s.screen)
  const setScreen = useGameStore(s => s.setScreen)
  const initGame = useGameStore(s => s.initGame)
  const spawnWave = useGameStore(s => s.spawnWave)
  const monsters = useGameStore(s => s.monsters)

  useEffect(() => {
    initGame()
  }, [])

  // Menu screen
  if (screen === 'menu') {
    return (
      <div className="min-h-screen bg-hacker-bg flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          {/* Logo */}
          <div className="mb-8">
            <div className="text-6xl mb-4">🎮</div>
            <h1 className="text-4xl md:text-6xl font-black text-hacker-text-bright mb-2">
              <span className="text-gradient">BugReaper X</span>
            </h1>
            <p className="text-lg font-mono text-hacker-cyan mb-2">
              Vulnerability Hunter
            </p>
            <p className="text-sm font-mono text-hacker-text-dim/50">
              Transform bug bounty hunting into an immersive 3D RPG
            </p>
          </div>

          {/* Tagline */}
          <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
            {[
              { label: 'Hunt', desc: 'Find vulnerabilities' },
              { label: 'Fight', desc: 'Defeat monsters' },
              { label: 'Earn', desc: 'Collect BRX tokens' },
            ].map(item => (
              <div key={item.label} className="bg-hacker-bg/50 border border-hacker-border/20 rounded-lg p-3">
                <div className="text-sm font-bold text-hacker-green">{item.label}</div>
                <div className="text-[9px] font-mono text-hacker-text-dim/40">{item.desc}</div>
              </div>
            ))}
          </div>

          {/* Start Button */}
          <button
            onClick={() => setScreen('hero_creation')}
            className="group relative px-10 py-4 bg-hacker-green text-hacker-bg font-bold rounded-lg text-lg hover:bg-hacker-green-dim transition-all overflow-hidden"
          >
            <span className="relative z-10">ENTER THE GRID →</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>

          <p className="mt-4 text-[10px] font-mono text-hacker-text-dim/30">
            Browser-based 3D · React Three Fiber · Wallet integration
          </p>
        </div>
      </div>
    )
  }

  // Hero Creation
  if (screen === 'hero_creation') {
    return <HeroCreation />
  }

  // Hub / Combat / Shop / Wallet — main game view with persistent canvas
  return (
    <div className="relative w-full h-screen overflow-hidden bg-hacker-bg">
      {/* 3D Canvas Background (always rendered to preserve state) */}
      <GameCanvas />

      {/* HUD Overlay */}
      <GameHUD />

      {/* Combat Panel */}
      {screen === 'combat' && <CombatPanel />}

      {/* Wallet Panel */}
      {screen === 'wallet' && <WalletPanel />}

      {/* Shop Panel */}
      {screen === 'shop' && <ShopPanel />}

      {/* Bottom info bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-hacker-bg/60 backdrop-blur-sm border-t border-hacker-border/20 px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-4 text-[9px] font-mono text-hacker-text-dim/30">
          <span className="text-hacker-green/50">BUGREAPER X</span>
          <span>v4.0.0</span>
          <span>Zone: Web Layer</span>
          <span>Monsters: {monsters.filter(m => m.alive).length}/5</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={spawnWave}
            className="text-[9px] px-2 py-0.5 rounded bg-hacker-bg border border-hacker-border/20 text-hacker-text-dim/40 hover:text-hacker-green hover:border-hacker-green/30 transition-all font-mono"
          >
            Spawn Wave
          </button>
          <button
            onClick={() => setScreen('menu')}
            className="text-[9px] px-2 py-0.5 rounded bg-hacker-bg border border-hacker-border/20 text-hacker-text-dim/40 hover:text-hacker-red hover:border-hacker-red/30 transition-all font-mono"
          >
            Menu
          </button>
        </div>
      </div>
    </div>
  )
}
