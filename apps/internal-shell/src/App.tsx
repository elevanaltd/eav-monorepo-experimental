import { useLocation } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import './App.css'

const queryClient = new QueryClient()

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
  port: number
  ready: boolean
  description: string
}

const APPS: Record<string, AppConfig> = {
  scripts: { id: 'scripts', port: 5174, ready: true, description: 'Collaborative script editing with component tracking' },
  scenes: { id: 'scenes', port: 5175, ready: true, description: 'Scene planning and shot list management' },
  vo: { id: 'vo', port: 5176, ready: false, description: 'Voice over generation and management' },
  'cam-op': { id: 'cam-op', port: 5177, ready: false, description: 'Camera operator workflow and coordination' },
}

function App() {
  const location = useLocation()

  const renderContent = () => {
    const appId = location.pathname.split('/')[1]
    const app = APPS[appId]

    if (!app) {
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

    if (!app.ready) {
      return (
        <div className="shell-placeholder">
          <h2>{app.id.toUpperCase()} App</h2>
          <p>{app.description}</p>
          <p style={{ marginTop: '2rem', color: '#666' }}>Coming soon</p>
        </div>
      )
    }

    // In production, this would load the actual app via iframe or module federation
    // For now, show a message about how to load it
    return (
      <div className="shell-app-loader">
        <h2>{app.id.toUpperCase()} App</h2>
        <div className="loader-info">
          <p>App running at: <code>http://localhost:{app.port}</code></p>
          <p className="note">
            In production deployment, this shell will load the {app.id} app via:
          </p>
          <ul>
            <li><strong>Option 1:</strong> Module federation (recommended for shared state)</li>
            <li><strong>Option 2:</strong> iFrame embedding (for full app isolation)</li>
            <li><strong>Option 3:</strong> Separate deployment with deep linking</li>
          </ul>
        </div>
      </div>
    )
  }

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
          {renderContent()}
        </main>
      </div>
    </QueryClientProvider>
  )
}

export default App
