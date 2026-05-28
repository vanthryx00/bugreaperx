import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { BottomPanel } from './BottomPanel'

interface AppLayoutProps {
  activePath: string
  onNavigate: (path: string) => void
  children: React.ReactNode
}

export function AppLayout({ activePath, onNavigate, children }: AppLayoutProps) {
  const [panelVisible, setPanelVisible] = useState(true)

  return (
    <div className="h-screen w-screen flex flex-col bg-hacker-bg text-hacker-text overflow-hidden">
      {/* Scanline CRT effect overlay */}
      <div className="scanline-overlay" />

      {/* Drag region for title bar */}
      <style>{`
        .drag-handle { -webkit-app-region: drag; }
        .drag-handle button, .drag-handle a { -webkit-app-region: no-drag; }
      `}</style>

      {/* Top Bar */}
      <TopBar />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar activePath={activePath} onNavigate={onNavigate} />

        {/* Content with grid background */}
        <main className="flex-1 overflow-y-auto p-6 bg-hacker-bg relative">
          {/* Grid background layer */}
          <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
          {/* Gradient overlay */}
          <div className="absolute inset-0 hacker-gradient pointer-events-none" />
          {/* Content */}
          <div className="relative z-10">{children}</div>
        </main>
      </div>

      {/* Bottom Panel */}
      <BottomPanel visible={panelVisible} onToggle={() => setPanelVisible(!panelVisible)} />
    </div>
  )
}
