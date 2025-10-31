import { describe, it, expect } from 'vitest'

describe('scripts-web package exports', () => {
  it('should export App component', async () => {
    const module = await import('./index')
    expect(module.App).toBeDefined()
    expect(typeof module.App).toBe('function')
  })
})
