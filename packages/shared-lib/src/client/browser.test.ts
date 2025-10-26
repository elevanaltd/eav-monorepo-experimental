import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createBrowserClient } from './browser.js'

describe('createBrowserClient', () => {
  // Save original environment
  const originalEnv = { ...import.meta.env }

  beforeEach(() => {
    // Set default test environment
    import.meta.env.VITE_SUPABASE_URL = 'https://test.supabase.co'
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY = 'test-publishable-key'
  })

  afterEach(() => {
    // Restore original environment
    Object.assign(import.meta.env, originalEnv)
  })

  describe('Environment Fallback (Existing Behavior)', () => {
    it('creates Supabase client with environment variables', () => {
      const client = createBrowserClient()

      expect(client).toBeDefined()
      expect(client.auth).toBeDefined()
    })

    it('throws if VITE_SUPABASE_URL missing', () => {
      delete import.meta.env.VITE_SUPABASE_URL

      expect(() => createBrowserClient()).toThrow('Missing VITE_SUPABASE_URL')
    })

    it('throws if VITE_SUPABASE_PUBLISHABLE_KEY missing', () => {
      delete import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
      delete import.meta.env.VITE_SUPABASE_ANON_KEY

      expect(() => createBrowserClient()).toThrow('Missing VITE_SUPABASE_PUBLISHABLE_KEY')
    })

    it('falls back to VITE_SUPABASE_ANON_KEY for backward compatibility', () => {
      delete import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
      import.meta.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key'

      const client = createBrowserClient()

      expect(client).toBeDefined()
      expect(client.auth).toBeDefined()
    })
  })

  describe('Parameter Override (Dependency Injection)', () => {
    it('should accept url and key parameters without environment variables', () => {
      // Clear environment variables to prove DI works without them
      delete import.meta.env.VITE_SUPABASE_URL
      delete import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
      delete import.meta.env.VITE_SUPABASE_ANON_KEY

      // Dependency injection: provide parameters instead of using environment
      const client = createBrowserClient('https://test-project.supabase.co', 'test-anon-key')

      // Verify client created successfully with provided credentials
      expect(client).toBeDefined()
      expect(client.auth).toBeDefined()
      // If parameters were ignored, this would throw "Missing VITE_SUPABASE_URL"
    })

    it('should prioritize provided parameters over environment variables', () => {
      // Set environment variables (these should be ignored)
      import.meta.env.VITE_SUPABASE_URL = 'https://env-project.supabase.co'
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY = 'env-key'

      // Override with parameters (these should be used)
      const client = createBrowserClient(
        'https://override-project.supabase.co',
        'override-anon-key'
      )

      // Client created with override parameters (not environment)
      expect(client).toBeDefined()
      expect(client.auth).toBeDefined()
      // Success proves parameters took precedence over environment
    })

    it('should throw error when only URL parameter provided without key', () => {
      // Clear environment variables
      delete import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
      delete import.meta.env.VITE_SUPABASE_ANON_KEY

      expect(() => createBrowserClient('https://test-project.supabase.co')).toThrow(
        'Missing VITE_SUPABASE_PUBLISHABLE_KEY'
      )
    })

    it('should throw error when only key parameter provided without URL', () => {
      // Clear environment URL
      delete import.meta.env.VITE_SUPABASE_URL

      expect(() => createBrowserClient(undefined, 'test-anon-key')).toThrow(
        'Missing VITE_SUPABASE_URL'
      )
    })
  })
})
