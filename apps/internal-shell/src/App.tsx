// @ts-nocheck - Dynamic workspace imports resolve at runtime via Vite
import { Suspense, lazy, useEffect } from 'react'
import { useLocation, Routes, Route, Navigate, Link } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import './App.css'

const queryClient = new QueryClient()

// Lazy-load EMBEDDED sub-apps (no BrowserRouter) to avoid nested router errors
const ScenesApp = lazy(() =>
  import('eav-scenes-web')
    .then(m => {
      console.log('✅ scenes-web loaded:', m)
      return { default: m.EmbeddedScenes }
    })
    .catch(err => {
      console.error('❌ Failed to load scenes-web:', err)
      throw err
    })
)

const ScriptsApp = lazy(() =>
  import('eav-scripts-web')
    .then(m => {
      console.log('✅ scripts-web loaded:', m)
      return { default: m.EmbeddedScripts }
    })
    .catch(err => {
      console.error('❌ Failed to load scripts-web:', err)
      throw err
    })
)

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
  console.log('🔄 Loading screen displayed')
  return (
    <div className="shell-loading">
      <p>Loading app...</p>
    </div>
  )
}

function ErrorScreen({ error }: { error: Error }) {
  console.error('💥 Error screen:', error)
  return (
    <div className="shell-error" style={{ padding: '2rem', color: 'red' }}>
      <h2>Failed to load app</h2>
      <p>{error.message}</p>
      <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
        {error.stack}
      </pre>
    </div>
  )
}

function App() {
  const location = useLocation()

  useEffect(() => {
    console.log('🧭 Location changed:', location.pathname)
  }, [location])

  const getCurrentTab = () => {
    const appId = location.pathname.split('/')[1]
    const tab = TABS.find(t => t.id === appId)
    console.log('📍 Current path:', location.pathname, '| Tab:', tab?.id || 'none')
    return tab
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
                  <Link
                    to={tab.path}
                    className={`shell-tab-link ${currentTab?.id === tab.id ? 'active' : ''}`}
                    onClick={e => {
                      if (tab.status === 'coming-soon') {
                        e.preventDefault()
                      }
                    }}
                  >
                    {tab.label}
                    {tab.status === 'coming-soon' && <span className="soon-badge">Soon</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <main className="shell-content" data-testid="shell-content">
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    {console.log('🏠 Rendering WelcomeScreen')}
                    <WelcomeScreen />
                  </>
                }
              />
              <Route
                path="/scenes/*"
                element={
                  <>
                    {console.log('🎬 Rendering ScenesApp')}
                    <ScenesApp />
                  </>
                }
              />
              <Route
                path="/scripts/*"
                element={
                  <>
                    {console.log('📝 Rendering ScriptsApp')}
                    <ScriptsApp />
                  </>
                }
              />
              <Route
                path="/vo"
                element={
                  <>
                    {console.log('🎙️ Rendering VO Coming Soon')}
                    <ComingSoonScreen appId="vo" />
                  </>
                }
              />
              <Route
                path="/cam-op"
                element={
                  <>
                    {console.log('📹 Rendering Cam-Op Coming Soon')}
                    <ComingSoonScreen appId="cam-op" />
                  </>
                }
              />
              <Route
                path="*"
                element={
                  <>
                    {console.log('🔄 Catch-all route - redirecting to /')}
                    <Navigate to="/" replace />
                  </>
                }
              />
            </Routes>
          </Suspense>
        </main>
      </div>
    </QueryClientProvider>
  )
}

export default App
