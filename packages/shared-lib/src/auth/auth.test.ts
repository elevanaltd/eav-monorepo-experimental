/**
 * Auth Module Tests
 * Phase 2 Day 3: Authentication utilities
 *
 * Constitutional Principle: TDD::MANDATORY + MINIMAL_INTERVENTION_PRINCIPLE
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/index.js'

// Create a properly typed mock Supabase client
const createMockClient = (): SupabaseClient<Database> => {
  return {
    auth: {
      getSession: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      signUp: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  } as any
}

describe('Auth Module', () => {
  let mockClient: SupabaseClient<Database>

  beforeEach(() => {
    mockClient = createMockClient()
  })

  describe('getSession', () => {
    it('should return null when not authenticated', async () => {
      vi.mocked(mockClient.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      })

      const { getSession } = await import('./index.js')
      const session = await getSession(mockClient)

      expect(session).toBeNull()
    })

    it('should return session when authenticated', async () => {
      const mockSession = {
        access_token: 'test-token',
        refresh_token: 'test-refresh',
        user: {
          id: 'user-123',
          email: 'test@example.com',
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: '',
        },
      }

      vi.mocked(mockClient.auth.getSession).mockResolvedValue({
        data: { session: mockSession as any },
        error: null,
      })

      const { getSession } = await import('./index.js')
      const session = await getSession(mockClient)

      expect(session).toBeDefined()
      expect(session?.access_token).toBe('test-token')
    })
  })

  describe('signIn', () => {
    it('should call client.auth.signInWithPassword with credentials', async () => {
      vi.mocked(mockClient.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      })

      const { signIn } = await import('./index.js')
      await signIn(mockClient, 'test@example.com', 'password123')

      expect(mockClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })

    it('should return error when sign in fails', async () => {
      const mockError = { message: 'Invalid credentials', name: 'AuthError', status: 401 }
      vi.mocked(mockClient.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError as any,
      })

      const { signIn } = await import('./index.js')
      const result = await signIn(mockClient, 'test@example.com', 'wrong-password')

      expect(result.error).toBeDefined()
      expect(result.error?.message).toBe('Invalid credentials')
    })
  })

  describe('signOut', () => {
    it('should call client.auth.signOut', async () => {
      vi.mocked(mockClient.auth.signOut).mockResolvedValue({
        error: null,
      })

      const { signOut } = await import('./index.js')
      await signOut(mockClient)

      expect(mockClient.auth.signOut).toHaveBeenCalled()
    })
  })

  describe('signUp', () => {
    it('should call client.auth.signUp with email, password, and metadata', async () => {
      vi.mocked(mockClient.auth.signUp).mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      })

      const { signUp } = await import('./index.js')
      await signUp(mockClient, 'new@example.com', 'password123', { display_name: 'Test User' })

      expect(mockClient.auth.signUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123',
        options: {
          data: { display_name: 'Test User' },
        },
      })
    })
  })

  describe('onAuthStateChange', () => {
    it('should subscribe to auth state changes', async () => {
      const mockCallback = vi.fn()
      const mockUnsubscribe = vi.fn()

      vi.mocked(mockClient.auth.onAuthStateChange).mockReturnValue({
        data: {
          subscription: { id: 'sub-123', callback: mockCallback, unsubscribe: mockUnsubscribe },
        },
      } as any)

      const { onAuthStateChange } = await import('./index.js')
      const unsubscribe = onAuthStateChange(mockClient, mockCallback)

      expect(mockClient.auth.onAuthStateChange).toHaveBeenCalledWith(mockCallback)
      expect(typeof unsubscribe).toBe('function')
    })
  })
})
