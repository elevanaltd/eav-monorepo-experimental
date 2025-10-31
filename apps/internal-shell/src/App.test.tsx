import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'
import { BrowserRouter } from 'react-router-dom'

// Wrapper component that provides Router context
const AppWithRouter = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

describe('App', () => {
  it('should render the main shell layout with navigation', () => {
    render(<AppWithRouter />)

    // Check that main navigation is present
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('should render app tabs for scripts, scenes, vo, and cam-op', () => {
    render(<AppWithRouter />)

    // Check for tab/menu navigation
    expect(screen.getByText(/scripts/i)).toBeInTheDocument()
    expect(screen.getByText(/scenes/i)).toBeInTheDocument()
    expect(screen.getByText(/voice over/i)).toBeInTheDocument()
    expect(screen.getByText(/camera op/i)).toBeInTheDocument()
  })

  it('should render the root content area', () => {
    render(<AppWithRouter />)

    expect(screen.getByTestId('shell-content')).toBeInTheDocument()
  })

  it('should display welcome content on initial load', () => {
    render(<AppWithRouter />)

    expect(screen.getByText(/welcome to eav production workflow/i)).toBeInTheDocument()
  })
})
