// @ts-nocheck - Dynamic workspace imports resolve at runtime via Vite
import { Suspense, lazy, useEffect } from 'react'
import { useLocation, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import './App.css'

const queryClient = new QueryClient()

// Lazy-load sub-apps from workspace packages
// Dynamic imports resolve at runtime via Vite's path resolution
const ScenesApp = lazy(() => import('eav-scenes-web').then(m => ({ default: m.App })))
const ScriptsApp = lazy(() => import('eav-scripts-web').then(m => ({ default: m.App })))

interface AppTab {
  id: string
  label: string
  path: string
  status: 'ready' | 'coming-soon'
}

const TABS: AppTab[] = [
  { id: 'scripts', label: 'Scripts', path: '/scripts', status: 'ready' },
  { id: 'scenes', label: 'Scenes', path: '/scenes', status: 'ready' },
  { id: 'vo', label: 'Voice Over', path: '/vo', status: 'coming-soon' },
  { id: 'cam-op', label: 'Camera Op', path: '/cam-op', status: 'coming-soon' },
]

interface AppConfig {
  id: string
  ready: boolean
  description: string
}

const APPS: Record<string, AppConfig> = {
  scripts: { id: 'scripts', ready: true, description: 'Collaborative script editing with component tracking' },
  scenes: { id: 'scenes', ready: true, description: 'Scene planning and shot list management' },
  vo: { id: 'vo', ready: false, description: 'Voice over generation and management' },
  'cam-op': { id: 'cam-op', ready: false, description: 'Camera operator workflow and coordination' },
}

function WelcomeScreen() {
  return (
    <div className="shell-welcome">
      <h2>Welcome to EAV Production Workflow</h2>
      <p>Select an app from the tabs above to get started</p>
      <div className="apps-grid">
        {TABS.map(tab => {
          const appInfo = APPS[tab.id]
          return (
            <div key={tab.id} className="app-card">
              <h3>{tab.label}</h3>
              <p>{appInfo.description}</p>
              <span className={`status status-${appInfo.ready ? 'ready' : 'coming-soon'}`}>
                {appInfo.ready ? '✓ Ready' : 'Coming Soon'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ComingSoonScreen({ appId }: { appId: string }) {
  const app = APPS[appId]
  return (
    <div className="shell-placeholder">
      <h2>{app.id.toUpperCase()} App</h2>
      <p>{app.description}</p>
      <p style={{ marginTop: '2rem', color: '#666' }}>Coming soon</p>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="shell-loading">
      <p>Loading app...</p>
    </div>
  )
}

function App() {
  const location = useLocation()

  const getCurrentTab = () => {
    const appId = location.pathname.split('/')[1]
    return TABS.find(t => t.id === appId)
  }

  const currentTab = getCurrentTab()

  return (
    <QueryClientProvider client={queryClient}>
      <div className="shell-container">
        <header className="shell-header">
          <h1>EAV Production Workflow</h1>
          <nav className="shell-nav" role="navigation">
            <ul className="shell-tabs">
              {TABS.map(tab => (
                <li key={tab.id}>
                  <a
                    href={tab.path}
                    className={`shell-tab-link ${currentTab?.id === tab.id ? 'active' : ''}`}
                    onClick={e => {
                      if (tab.status === 'coming-soon') {
                        e.preventDefault()
                      }
                    }}
                  >
                    {tab.label}
                    {tab.status === 'coming-soon' && <span className="soon-badge">Soon</span>}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <main className="shell-content" data-testid="shell-content">
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<WelcomeScreen />} />
              <Route path="/scenes/*" element={<ScenesApp />} />
              <Route path="/scripts/*" element={<ScriptsApp />} />
              <Route path="/vo" element={<ComingSoonScreen appId="vo" />} />
              <Route path="/cam-op" element={<ComingSoonScreen appId="cam-op" />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </QueryClientProvider>
  )
}

export default App
