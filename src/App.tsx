import { useState, useEffect, useRef, useCallback } from 'react'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardPage } from './pages/Dashboard'
import { HuntPage } from './pages/Hunt'
import { ArsenalPage } from './pages/Arsenal'
import { PipelinePage } from './pages/Pipeline'
import { WorkshopPage } from './pages/Workshop'
import { RepeaterPage } from './pages/Repeater'
import { McpConsolePage } from './pages/McpConsole'
import { GodseyePage } from './pages/Godseye'
import { JarvisPage } from './pages/Jarvis'
import { NeurohackPage } from './pages/Neurohack'
import { AdventurePage } from './pages/Adventure'
import { VaultPage } from './pages/Vault'
import { CollabPage } from './pages/Collab'
import { SecretsPage } from './pages/Secrets'
import { ReportsPage } from './pages/Reports'
import { SettingsPage } from './pages/Settings'

function getPathFromHash(): string {
  return window.location.hash.slice(1) || '/'
}

export default function App() {
  const [activePath, setActivePath] = useState(getPathFromHash)
  const [transitioning, setTransitioning] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const navigatingRef = useRef(false)

  const navigateTo = useCallback((path: string) => {
    if (path === activePath || navigatingRef.current) return
    window.location.hash = path
  }, [activePath])

  useEffect(() => {
    const onHashChange = () => {
      const newPath = getPathFromHash()
      if (newPath === activePath) return

      navigatingRef.current = true
      setTransitioning(true)
      
      const fadeOut = setTimeout(() => {
        setActivePath(newPath)
        const fadeIn = setTimeout(() => {
          setTransitioning(false)
          navigatingRef.current = false
        }, 50)
        return () => clearTimeout(fadeIn)
      }, 120)
      
      return () => clearTimeout(fadeOut)
    }

    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [activePath])

  const renderPage = () => {
    switch (activePath) {
      case '/': return <DashboardPage />
      case '/hunt': return <HuntPage />
      case '/arsenal': return <ArsenalPage />
      case '/pipeline': return <PipelinePage />
      case '/workshop': return <WorkshopPage />
      case '/repeater': return <RepeaterPage />
      case '/mcp': return <McpConsolePage />
      case '/godseye': return <GodseyePage />
      case '/jarvis': return <JarvisPage />
      case '/neurohack': return <NeurohackPage />
      case '/adventure': return <AdventurePage />
      case '/vault': return <VaultPage />
      case '/collab': return <CollabPage />
      case '/secrets': return <SecretsPage />
      case '/reports': return <ReportsPage />
      case '/settings': return <SettingsPage />
      default: return <DashboardPage />
    }
  }

  return (
    <AppLayout activePath={activePath} onNavigate={navigateTo}>
      <div
        ref={contentRef}
        className={`transition-all duration-150 ${transitioning ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'}`}
      >
        {renderPage()}
      </div>
    </AppLayout>
  )
}
